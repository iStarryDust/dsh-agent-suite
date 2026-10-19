/** Largest draft file accepted for upload, in bytes. */
const MAX_DRAFT_BYTES = 128 * 1024 * 1024;
const IMAGE_MEDIA_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
/**
 * Build the rewrite actions over services resolved at apply time.
 * @param deps - the apply-time service references. Remote namespaces are
 * NOT read off `deps.remote`: property access on the remote service is
 * fiber-inject checked and throws "without inject" from detached event
 * continuations, so every namespace soft-resolves through `deps.ctx.get`
 * at call time.
 * @param whenRemoteReady - settlement of the authoring namespace mount.
 * @returns the injected face handed to the shadowed user-message renderer.
 */
export function createEditActions(deps, whenRemoteReady) {
    const editRegen = () => deps.ctx.get('remote.agentPresetAuthoring');
    const fileUploads = () => deps.ctx.get('remote.fileUploads');
    const bytesToBase64 = (bytes) => {
        let binary = '';
        const chunk = 0x8000;
        for (let offset = 0; offset < bytes.length; offset += chunk) {
            binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk));
        }
        return btoa(binary);
    };
    const fileBytes = async (file) => new Uint8Array(await file.arrayBuffer());
    const uploadDraftFile = async (childId, file) => {
        if (file.size > MAX_DRAFT_BYTES)
            throw new Error(`"${file.name}" exceeds the upload size limit`);
        const upload = fileUploads();
        if (upload === undefined)
            throw new Error('file attachments cannot be resent: the upload channel is unavailable');
        const staged = await upload.upload(childId, {
            data: bytesToBase64(await fileBytes(file)),
            ...(file.name === '' ? {} : { name: file.name }),
        });
        if (!staged.ok)
            throw new Error(staged.error.message);
        return { type: 'file', receiptId: staged.value.receiptId };
    };
    /** The workspace holding one session, for the blank-session reuse path. */
    const workspaceOf = (sessionId) => {
        const items = deps.workspaces.list.getSnapshot().items;
        return items.find(item => item.sessionIds.includes(sessionId))?.workspaceId;
    };
    /** Carry the source session's durable model selection into the child. */
    const modelCarryOver = async (sessionId, childId) => {
        try {
            const face = deps.sessions.binding(sessionId)?.session;
            const projection = face?.projections.faceOf('modelSelection').getSnapshot();
            const selection = projection?.next ?? projection?.lastUsed;
            if (selection === undefined || selection === null)
                return;
            const sessionRemote = deps.ctx.get('remote.session');
            if (sessionRemote === undefined)
                return;
            const selected = await sessionRemote.selectModel({
                sessionId: childId,
                provider: selection.provider,
                model: selection.model,
                ...(selection.reasoningEffort === undefined ? {} : { reasoningEffort: selection.reasoningEffort }),
            });
            if (!selected.ok)
                throw new Error(selected.error.message);
        }
        catch (reason) {
            console.warn('edit-regen: model carry-over failed:', reason);
        }
    };
    /** Bind a reused-or-created blank session to the source session's preset. */
    const carryPresetOver = async (sessionId, childId) => {
        // The binding rides the agentPreset projection, not the list row.
        const values = deps.sessions.list.getSnapshot().projectionsBySession[sessionId]?.values;
        const preset = typeof values?.agentPreset === 'string' ? values.agentPreset : undefined;
        if (preset === undefined)
            return;
        try {
            await whenRemoteReady;
            const presets = deps.ctx.get('remote.agentPresets');
            await presets?.select(childId, preset);
        }
        catch (reason) {
            console.warn('edit-regen: preset carry-over failed:', reason);
        }
    };
    /** Best-effort shell cleanup after a rejected prompt on the forked child. */
    const discardShell = async (childId) => {
        try {
            await whenRemoteReady;
            const remote = editRegen();
            if (remote === undefined) {
                console.warn('edit-regen: the empty child session is kept (no editRegen remote)');
                return;
            }
            const discarded = await remote.deleteSession({ sessionId: childId });
            if (!discarded.ok)
                console.warn('edit-regen: shell cleanup refused:', discarded.error.message);
        }
        catch (reason) {
            console.warn('edit-regen: shell cleanup failed:', reason);
        }
    };
    const rewriteFrom = async (sessionId, seq, text, keptImages, keptFiles, draftImages, draftFiles) => {
        await whenRemoteReady;
        const face = deps.sessions.binding(sessionId)?.session;
        if (face === undefined)
            throw new Error(`session "${sessionId}" is not locally addressable`);
        const snapshot = face.getSnapshot();
        if (snapshot.running)
            throw new Error('the agent is running');
        // Re-admit surviving images as fresh prompt uploads: kept images ride the
        // session-authorized read, drafts re-encode their browser files, and the
        // child stores its own durable copies through the ordinary prompt path.
        const keptImageParts = await Promise.all(keptImages.map(async (ref) => {
            const result = await face.readAttachment(ref.attachmentId);
            if (!result.ok)
                throw new Error(result.error.message);
            return {
                type: 'image',
                mediaType: result.value.attachment.mediaType,
                data: bytesToBase64(result.value.data),
            };
        }));
        const draftImageParts = await Promise.all(draftImages.map(async (draft) => {
            if (draft.file.size > MAX_DRAFT_BYTES)
                throw new Error(`"${draft.file.name}" exceeds the upload size limit`);
            const mediaType = IMAGE_MEDIA_TYPES.includes(draft.file.type)
                ? draft.file.type
                : 'image/png';
            return {
                type: 'image',
                mediaType,
                data: bytesToBase64(await fileBytes(draft.file)),
                ...(draft.file.name === '' ? {} : { name: draft.file.name }),
            };
        }));
        // The child first: files stage per session, so receipts must be minted
        // against it. The cut point comes from the host's boundary lookup (its
        // event log is the authority); nothing before the message means the
        // workspace's blank session is reused or created.
        const remote = editRegen();
        if (remote === undefined)
            throw new Error('the editRegen remote is unavailable');
        const boundary = await remote.rewriteBoundary({ sessionId, seq });
        if (!boundary.ok)
            throw new Error(boundary.error.message);
        let childId;
        let forked;
        if (boundary.value.atSeq === null) {
            const create = {};
            const workspaceId = workspaceOf(sessionId);
            if (workspaceId !== undefined)
                create.workspaceId = workspaceId;
            childId = await deps.sessions.create(create);
            forked = false;
            await carryPresetOver(sessionId, childId);
        }
        else {
            childId = await deps.sessions.fork({ sessionId: sessionId, atSeq: boundary.value.atSeq, increaseTitle: true });
            forked = true;
        }
        // Kept files re-stage from storage through the edit-regen read (fresh
        // receipts on the child); drafts upload straight from the browser.
        const fileParts = [];
        if (keptFiles.length > 0) {
            const upload = fileUploads();
            if (upload === undefined)
                throw new Error('file attachments cannot be resent: the upload channel is unavailable');
            for (const ref of keptFiles) {
                const read = await remote.readFileAttachment({ sessionId, attachmentId: String(ref.attachmentId) });
                if (!read.ok)
                    throw new Error(read.error.message);
                const staged = await upload.upload(childId, { data: read.value.data, name: read.value.name });
                if (!staged.ok)
                    throw new Error(staged.error.message);
                fileParts.push({ type: 'file', receiptId: staged.value.receiptId });
            }
        }
        for (const draft of draftFiles) {
            fileParts.push(await uploadDraftFile(childId, draft.file));
        }
        await modelCarryOver(sessionId, childId);
        // A fork catalogs the child without retaining it: own a reference to
        // address it, release once the view has moved (the main view re-retains).
        const reference = deps.sessions.retain(childId, { source: 'editRegen' });
        try {
            const child = reference.binding.session;
            const parts = [{ type: 'text', text }, ...keptImageParts, ...draftImageParts, ...fileParts];
            let prompt;
            try {
                prompt = await child.prompt(parts, 'queue');
            }
            catch (reason) {
                // A transport-level failure is the same outcome as a rejection: the
                // forked shell dies, and the error keeps the editor open on the source.
                if (forked)
                    await discardShell(childId);
                throw reason;
            }
            if (!prompt.ok) {
                // The fork path owns the child it just created (a first-turn connect may
                // have reused an existing blank session instead), so only that shell is
                // discarded — the rejected edit leaves nothing behind and the source
                // conversation never moved.
                if (forked)
                    await discardShell(childId);
                throw new Error(prompt.error.message);
            }
            deps.uiWorkspace.openSession(childId);
        }
        finally {
            reference.release();
        }
    };
    return { rewriteFrom };
}
//# sourceMappingURL=actions.js.map