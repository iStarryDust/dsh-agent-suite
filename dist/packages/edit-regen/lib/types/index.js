var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
import { RemoteError, Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { SessionId } from '@deepseek-ai/dsh-session';
import { AttachmentError } from '@deepseek-ai/dsh-attachment';
/** Largest file this verb reads back, in bytes (base64 inflates by 4/3). */
const MAX_READ_BYTES = 128 * 1024 * 1024;
let EditRegen = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _readFileAttachment_decorators;
    let _rewriteBoundary_decorators;
    let _discardSession_decorators;
    return class EditRegen extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _readFileAttachment_decorators = [Remote('readFileAttachment')];
            _rewriteBoundary_decorators = [Remote('rewriteBoundary')];
            _discardSession_decorators = [Remote('discardSession')];
            __esDecorate(this, null, _readFileAttachment_decorators, { kind: "method", name: "readFileAttachment", static: false, private: false, access: { has: obj => "readFileAttachment" in obj, get: obj => obj.readFileAttachment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _rewriteBoundary_decorators, { kind: "method", name: "rewriteBoundary", static: false, private: false, access: { has: obj => "rewriteBoundary" in obj, get: obj => obj.rewriteBoundary }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _discardSession_decorators, { kind: "method", name: "discardSession", static: false, private: false, access: { has: obj => "discardSession" in obj, get: obj => obj.discardSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /** @param ctx - Host context carrying sessions, attachments, and the optional cleanup stores. */
        constructor(ctx) {
            super(ctx, 'editRegen');
            __runInitializers(this, _instanceExtraInitializers);
        }
        /**
         * Read one file attachment's exact stored bytes, authorizing against the
         * session's own event log.
         * @param request - Session and attachment identities used for authorization.
         * @returns the stored display name and base64 bytes.
         */
        async readFileAttachment(request) {
            const events = await this.sessionEvents(request.sessionId);
            const ref = referencedFile(events, request.attachmentId);
            if (ref === undefined) {
                throw new RemoteError('session/attachment-invalid', 'File is not referenced by this session.', { reason: 'ATTACHMENT_NOT_REFERENCED' });
            }
            if (ref.bytes > MAX_READ_BYTES) {
                throw new RemoteError('session/attachment-invalid', `File exceeds the read-back size limit (${String(MAX_READ_BYTES)} bytes).`, { reason: 'ATTACHMENT_TOO_LARGE' });
            }
            try {
                const chunks = [];
                let total = 0;
                for await (const chunk of this.ctx.attachments.readFileStream(ref)) {
                    chunks.push(chunk);
                    total += chunk.byteLength;
                }
                const bytes = new Uint8Array(total);
                let offset = 0;
                for (const chunk of chunks) {
                    bytes.set(chunk, offset);
                    offset += chunk.byteLength;
                }
                return { name: ref.name, data: Buffer.from(bytes).toString('base64') };
            }
            catch (error) {
                if (error instanceof AttachmentError) {
                    throw new RemoteError('session/attachment-invalid', error.message, { reason: error.code });
                }
                throw new RemoteError('gateway/internal', 'Unable to read file attachment.', {});
            }
        }
        /**
         * Locate the fork boundary for a rewrite anchored on one durable
         * `user/message` (see the class doc for the cut semantics).
         * @param request - session and the anchored message seq.
         * @returns the inclusive fork boundary, or null for the blank path.
         */
        async rewriteBoundary(request) {
            const events = await this.sessionEvents(request.sessionId);
            let lastTurnEnd;
            let openTurnStart;
            for (const event of events) {
                if (event.seq >= request.seq)
                    break;
                if (event.type === 'turn/start') {
                    openTurnStart = event.seq;
                }
                else if (event.type === 'turn/end' && openTurnStart !== undefined) {
                    lastTurnEnd = event.seq;
                    openTurnStart = undefined;
                }
            }
            const atSeq = lastTurnEnd !== undefined
                ? lastTurnEnd
                : openTurnStart !== undefined
                    ? (openTurnStart - 1 >= 1 ? openTurnStart - 1 : null)
                    : (request.seq - 1 >= 1 ? request.seq - 1 : null);
            return { atSeq };
        }
        /**
         * Delete one chat durably: the session's log artifacts, its projection
         * cache row, and its workspace accounting. A running agent is refused; an
         * opened-but-idle agent is unpublished through the registry's internal
         * detach; on a runtime whose persistence lacks deletion the verb refuses
         * with a stable code and the client degrades gracefully.
         * @param request - Session to remove from storage.
         */
        async discardSession(request) {
            const sessionId = request.sessionId;
            const agents = this.ctx.get('agents');
            const agent = agents?.get(sessionId);
            if (agent?.status === 'running') {
                throw new RemoteError('edit-regen/session-busy', `session "${sessionId}" is running; stop its conversation before deleting`, { sessionId, reason: 'running' });
            }
            if (agents?.get(sessionId) !== undefined && !detachIdleAgent(this.ctx, sessionId)) {
                throw new RemoteError('edit-regen/session-busy', `session "${sessionId}" is still open; close its conversation before deleting`, { sessionId, reason: 'open' });
            }
            const persistence = this.ctx.get('sessionPersistence');
            if (persistence?.remove === undefined) {
                throw new RemoteError('edit-regen/remove-unavailable', `this deployment's session storage does not support deletion`, { sessionId, reason: 'storage without deletion support' });
            }
            const removed = await persistence.remove(sessionId);
            if (!removed) {
                throw new RemoteError('edit-regen/session-not-found', `session "${sessionId}" not found`, { sessionId });
            }
            await this.ctx.get('sessionProjectionCache')?.forget?.(sessionId);
            await this.ctx.get('workspaceRegistry')?.forgetSession?.(sessionId);
            this.ctx.emit('api-session/removed', SessionId(sessionId));
        }
        /**
         * The named session's events: the live agent's snapshot when attached, else
         * one cold query observation (no repair, resume, or publication).
         */
        async sessionEvents(sessionId) {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const id = SessionId(sessionId);
                const attached = this.ctx.sessions?.get(id);
                if (attached !== undefined) {
                    // oxlint-disable-next-line typescript/no-deprecated -- Existing Session history read; migration deferred.
                    return attached.snapshotEvents();
                }
                const query = this.ctx.get('sessionQuery');
                if (query === undefined) {
                    throw new RemoteError('gateway/internal', `session "${sessionId}" cannot be inspected: no session query service`, { sessionId });
                }
                const observation = __addDisposableResource(env_1, await query.observeSession(id, { projectionMode: 'none' }), false);
                return [...observation.events];
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                __disposeResources(env_1);
            }
        }
    };
})();
/** Host-side verbs over session files and session shells. */
export default EditRegen;
/**
 * Unpublish one idle agent through the registry's internal detach path (see
 * the agent suite's identical helper; the internals shape is pinned by the
 * bundle's engines range).
 * @param ctx - host context carrying the agents service.
 * @param sessionId - the agent/session id to unpublish.
 * @returns whether the registry entry was detached.
 */
function detachIdleAgent(ctx, sessionId) {
    const registry = ctx.get('agents');
    const entry = registry?.store?.get(sessionId);
    if (entry === undefined || typeof registry?.detachEntered !== 'function')
        return false;
    try {
        registry.detachEntered(entry);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Scan a session's events for a first-party `file` content block whose
 * attachment id matches (mirrors the official image scan).
 * @param events - the authorizing session's events.
 * @param attachmentId - requested file attachment id.
 * @returns the stored reference, or undefined when unreferenced.
 */
function referencedFile(events, attachmentId) {
    for (const event of events) {
        const found = fileInEvent(event, ref => String(ref.attachmentId) === attachmentId);
        if (found !== undefined)
            return found;
    }
    return undefined;
}
function fileInEvent(event, match) {
    const data = event.data;
    const type = event.type;
    switch (type) {
        case 'user/message':
        case 'tool/ptc-dispatch':
            return fileBlockIn(data.content, match);
        case 'system/message':
        case 'developer/message':
        case 'tool/result':
        case 'team/message/queued':
            return fileBlockIn(data.message?.content, match);
        case 'agent/inbox/spliced': {
            const messages = data.inserted;
            if (!Array.isArray(messages))
                return undefined;
            for (const message of messages) {
                if (typeof message !== 'object' || message === null || Array.isArray(message))
                    continue;
                const found = fileBlockIn(message.content, match);
                if (found !== undefined)
                    return found;
            }
            return undefined;
        }
        default:
            return undefined;
    }
}
function fileBlockIn(content, match) {
    if (!Array.isArray(content))
        return undefined;
    for (const value of content) {
        if (typeof value !== 'object' || value === null || Array.isArray(value))
            continue;
        const block = value;
        if (block.type === 'file' && typeof block.attachment === 'object' && block.attachment !== null) {
            const ref = block.attachment;
            if (match(ref))
                return ref;
        }
    }
    return undefined;
}
//# sourceMappingURL=index.js.map