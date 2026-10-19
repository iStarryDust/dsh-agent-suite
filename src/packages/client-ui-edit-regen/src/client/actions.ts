/**
 * The rewrite orchestration behind the inline editor: one call forks the
 * session at the edited message's turn boundary, re-admits the surviving
 * attachments against the CHILD session (fresh receipts for files through
 * the edit-regen remote read plus the official upload channel), carries the
 * model selection over, sends the edited prompt, and only then switches the
 * view. A rejected prompt discards the forked shell, so a failed edit leaves
 * nothing behind and the source conversation never moved.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import type { SessionId } from '@deepseek-ai/dsh-session'
import type { ImageAttachmentRef, FileAttachmentRef, ImageMediaType } from '@deepseek-ai/dsh-attachment'
import type { PromptContentPart } from '@deepseek-ai/dsh-api-session-controller/types'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the ui-workspace service merge (deps.uiWorkspace).
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
declare module '@deepseek-ai/dsh-api-session-controller/client' {
  interface SessionReferenceSourceMap {
    /** The edit-and-regenerate rewrite flow's owned child reference. */
    editRegen: unknown
  }
}

import type { WorkspaceId } from '@deepseek-ai/dsh-api-workspace-controller/client'

/** The edit-regen session verbs, as the suite's authoring namespace exposes
 * them: the boundary lookup for the fork point, and the durable delete the
 * rejected-prompt cleanup calls. */
type EditVerbs = {
  readFileAttachment(request: { sessionId: string; attachmentId: string }): Promise<RemoteResult<{ name: string; data: string }>>
  rewriteBoundary(request: { sessionId: string; seq: number }): Promise<RemoteResult<{ atSeq: number | null }>>
  deleteSession(request: { sessionId: string }): Promise<RemoteResult<void>>
}

/** The official file-upload remote face this flow re-stages files through. */
type FileUploadsRemote = {
  upload(sessionId: SessionId, request: { data: string; name?: string }, signal?: AbortSignal): Promise<RemoteResult<{ receiptId: PromptContentPart extends { type: 'file'; receiptId: infer R } ? R : never; file: { attachmentId: string; name: string; bytes: number } }>>
}

/** One browser-picked draft file awaiting upload (image or generic file). */
export interface DraftFile {
  readonly file: File
}

/** Injected face of the keyed user-message renderer. */
export interface EditActionsInjected {
  /** Rewrite the session from one durable user message onward. */
  rewriteFrom: (
    sessionId: string,
    seq: number,
    text: string,
    keptImages: readonly ImageAttachmentRef[],
    keptFiles: readonly FileAttachmentRef[],
    draftImages: readonly DraftFile[],
    draftFiles: readonly DraftFile[],
  ) => Promise<void>
}

/** Largest draft file accepted for upload, in bytes. */
const MAX_DRAFT_BYTES = 128 * 1024 * 1024

const IMAGE_MEDIA_TYPES: readonly string[] = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

/** Services resolved ONCE at apply time. A reinstall can retire the plugin
 * fiber's staged injections between setup and the user's first confirm, and a
 * closure that reads `ctx.sessions` at call time then dies with
 * "without inject" — capturing the references during apply makes the flow
 * immune to that lifecycle. The compound remote soft-access also rides the
 * captured context (`ctx.get('remote.agentPresetAuthoring')`), whose mount is
 * owned by the agent-suite host package and survives reinstalls. */
export interface EditServices {
  readonly ctx: ClientContext
  readonly sessions: ClientContext['sessions']
  readonly workspaces: ClientContext['workspaces']
  readonly uiWorkspace: ClientContext['uiWorkspace']
  /** The live remote service: namespaces mounted later appear on this object. */
  readonly remote: ClientContext['remote']
}

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
export function createEditActions(
  deps: EditServices,
  whenRemoteReady: Promise<void>,
): EditActionsInjected {
  const editRegen = (): EditVerbs | undefined =>
    deps.ctx.get('remote.agentPresetAuthoring') as EditVerbs | undefined
  const fileUploads = (): FileUploadsRemote | undefined =>
    deps.ctx.get('remote.fileUploads') as FileUploadsRemote | undefined

  const bytesToBase64 = (bytes: Uint8Array): string => {
    let binary = ''
    const chunk = 0x8000
    for (let offset = 0; offset < bytes.length; offset += chunk) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk))
    }
    return btoa(binary)
  }

  const fileBytes = async (file: File): Promise<Uint8Array> =>
    new Uint8Array(await file.arrayBuffer())

  const uploadDraftFile = async (childId: SessionId, file: File): Promise<PromptContentPart> => {
    if (file.size > MAX_DRAFT_BYTES) throw new Error(`"${file.name}" exceeds the upload size limit`)
    const upload = fileUploads()
    if (upload === undefined) throw new Error('file attachments cannot be resent: the upload channel is unavailable')
    const staged = await upload.upload(childId, {
      data: bytesToBase64(await fileBytes(file)),
      ...(file.name === '' ? {} : { name: file.name }),
    })
    if (!staged.ok) throw new Error(staged.error.message)
    return { type: 'file', receiptId: staged.value.receiptId }
  }

  /** The workspace holding one session, for the blank-session reuse path. */
  const workspaceOf = (sessionId: SessionId): WorkspaceId | undefined => {
    const items = deps.workspaces.list.getSnapshot().items
    return items.find(item => (item.sessionIds as readonly string[]).includes(sessionId as string))?.workspaceId
  }

  /** Carry the source session's durable model selection into the child. */
  const modelCarryOver = async (sessionId: SessionId, childId: SessionId): Promise<void> => {
    try {
      const face = deps.sessions.binding(sessionId)?.session
      const projection = face?.projections.faceOf('modelSelection').getSnapshot() as
        | { next?: { provider: string; model: string; reasoningEffort?: string } | null; lastUsed?: { provider: string; model: string; reasoningEffort?: string } | null }
        | undefined
      const selection = projection?.next ?? projection?.lastUsed
      if (selection === undefined || selection === null) return
      const sessionRemote = deps.ctx.get('remote.session') as
        | { selectModel(request: { sessionId: SessionId; provider: string; model: string; reasoningEffort?: string }): Promise<RemoteResult<void>> }
        | undefined
      if (sessionRemote === undefined) return
      const selected = await sessionRemote.selectModel({
        sessionId: childId,
        provider: selection.provider,
        model: selection.model,
        ...(selection.reasoningEffort === undefined ? {} : { reasoningEffort: selection.reasoningEffort }),
      })
      if (!selected.ok) throw new Error(selected.error.message)
    } catch (reason) {
      console.warn('edit-regen: model carry-over failed:', reason)
    }
  }

  /** Bind a reused-or-created blank session to the source session's preset. */
  const carryPresetOver = async (sessionId: SessionId, childId: SessionId): Promise<void> => {
    // The binding rides the agentPreset projection, not the list row.
    const values = deps.sessions.list.getSnapshot().projectionsBySession[sessionId]?.values
    const preset = typeof values?.agentPreset === 'string' ? values.agentPreset : undefined
    if (preset === undefined) return
    try {
      await whenRemoteReady
      const presets = deps.ctx.get('remote.agentPresets') as
        | { select(id: string, presetId: string): Promise<unknown> }
        | undefined
      await presets?.select(childId as string, preset)
    } catch (reason) {
      console.warn('edit-regen: preset carry-over failed:', reason)
    }
  }

  /** Best-effort shell cleanup after a rejected prompt on the forked child. */
  const discardShell = async (childId: SessionId): Promise<void> => {
    try {
      await whenRemoteReady
      const remote = editRegen()
      if (remote === undefined) {
        console.warn('edit-regen: the empty child session is kept (no editRegen remote)')
        return
      }
      const discarded = await remote.deleteSession({ sessionId: childId as string })
      if (!discarded.ok) console.warn('edit-regen: shell cleanup refused:', discarded.error.message)
    } catch (reason) {
      console.warn('edit-regen: shell cleanup failed:', reason)
    }
  }

  const rewriteFrom = async (
    sessionId: string,
    seq: number,
    text: string,
    keptImages: readonly ImageAttachmentRef[],
    keptFiles: readonly FileAttachmentRef[],
    draftImages: readonly DraftFile[],
    draftFiles: readonly DraftFile[],
  ): Promise<void> => {
    await whenRemoteReady
    const face = deps.sessions.binding(sessionId as SessionId)?.session
    if (face === undefined) throw new Error(`session "${sessionId}" is not locally addressable`)
    const snapshot = face.getSnapshot()
    if (snapshot.running) throw new Error('the agent is running')

    // Re-admit surviving images as fresh prompt uploads: kept images ride the
    // session-authorized read, drafts re-encode their browser files, and the
    // child stores its own durable copies through the ordinary prompt path.
    const keptImageParts = await Promise.all(keptImages.map(async (ref): Promise<PromptContentPart> => {
      const result = await face.readAttachment(ref.attachmentId)
      if (!result.ok) throw new Error(result.error.message)
      return {
        type: 'image',
        mediaType: result.value.attachment.mediaType,
        data: bytesToBase64(result.value.data),
      }
    }))
    const draftImageParts = await Promise.all(draftImages.map(async (draft): Promise<PromptContentPart> => {
      if (draft.file.size > MAX_DRAFT_BYTES) throw new Error(`"${draft.file.name}" exceeds the upload size limit`)
      const mediaType = IMAGE_MEDIA_TYPES.includes(draft.file.type)
        ? draft.file.type as ImageMediaType
        : 'image/png' as ImageMediaType
      return {
        type: 'image',
        mediaType,
        data: bytesToBase64(await fileBytes(draft.file)),
        ...(draft.file.name === '' ? {} : { name: draft.file.name }),
      }
    }))

    // The child first: files stage per session, so receipts must be minted
    // against it. The cut point comes from the host's boundary lookup (its
    // event log is the authority); nothing before the message means the
    // workspace's blank session is reused or created.
    const remote = editRegen()
    if (remote === undefined) throw new Error('the editRegen remote is unavailable')
    const boundary = await remote.rewriteBoundary({ sessionId, seq })
    if (!boundary.ok) throw new Error(boundary.error.message)
    let childId: SessionId
    let forked: boolean
    if (boundary.value.atSeq === null) {
      const create: { workspaceId?: WorkspaceId } = {}
      const workspaceId = workspaceOf(sessionId as SessionId)
      if (workspaceId !== undefined) create.workspaceId = workspaceId
      childId = await deps.sessions.create(create)
      forked = false
      await carryPresetOver(sessionId as SessionId, childId)
    } else {
      childId = await deps.sessions.fork({ sessionId: sessionId as SessionId, atSeq: boundary.value.atSeq, increaseTitle: true })
      forked = true
    }

    // Kept files re-stage from storage through the edit-regen read (fresh
    // receipts on the child); drafts upload straight from the browser.
    const fileParts: PromptContentPart[] = []
    if (keptFiles.length > 0) {
      const upload = fileUploads()
      if (upload === undefined) throw new Error('file attachments cannot be resent: the upload channel is unavailable')
      for (const ref of keptFiles) {
        const read = await remote.readFileAttachment({ sessionId, attachmentId: String(ref.attachmentId) })
        if (!read.ok) throw new Error(read.error.message)
        const staged = await upload.upload(childId, { data: read.value.data, name: read.value.name })
        if (!staged.ok) throw new Error(staged.error.message)
        fileParts.push({ type: 'file', receiptId: staged.value.receiptId })
      }
    }
    for (const draft of draftFiles) {
      fileParts.push(await uploadDraftFile(childId, draft.file))
    }

    await modelCarryOver(sessionId as SessionId, childId)

    // A fork catalogs the child without retaining it: own a reference to
    // address it, release once the view has moved (the main view re-retains).
    const reference = deps.sessions.retain(childId, { source: 'editRegen' })
    try {
      const child = reference.binding.session
      const parts: PromptContentPart[] = [{ type: 'text', text }, ...keptImageParts, ...draftImageParts, ...fileParts]
      let prompt: RemoteResult<{ accepted: true }>
      try {
        prompt = await child.prompt(parts, 'queue')
      } catch (reason) {
        // A transport-level failure is the same outcome as a rejection: the
        // forked shell dies, and the error keeps the editor open on the source.
        if (forked) await discardShell(childId)
        throw reason
      }
      if (!prompt.ok) {
        // The fork path owns the child it just created (a first-turn connect may
        // have reused an existing blank session instead), so only that shell is
        // discarded — the rejected edit leaves nothing behind and the source
        // conversation never moved.
        if (forked) await discardShell(childId)
        throw new Error(prompt.error.message)
      }
      deps.uiWorkspace.openSession(childId)
    } finally {
      reference.release()
    }
  }

  return { rewriteFrom }
}
