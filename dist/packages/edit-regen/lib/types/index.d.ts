/**
 * Standalone edit-regen session verbs. This host package backs the
 * edit-and-regenerate surface when the bundle is installed WITHOUT the agent
 * management suite: it carries the same three verbs the suite's authoring
 * namespace exposes there (authorized file-attachment reads, the rewrite
 * fork-boundary lookup, and durable session-shell cleanup), under its own
 * `editRegen` wire namespace. The client prefers the authoring namespace when
 * the suite is present and falls back to this one here.
 *
 * The boundary lookup uses the previous turn's own `turn/end` as the cut —
 * the same fixed semantics as the authoring copy (cutting at
 * "next turn/start minus one" would sweep inter-turn `agent/inbox/spliced`
 * events into the seed and replay them as injected user messages).
 *
 * @module @deepseek-ai/dsh-edit-regen
 */
import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { DiscardSessionRequest, ReadFileAttachmentRequest, ReadFileAttachmentValue, RewriteBoundaryRequest, RewriteBoundaryValue } from './types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Standalone edit-regen session verbs (used when the suite is absent). */
        editRegen: EditRegen;
    }
}
/** Host-side verbs over session files and session shells. */
export default class EditRegen extends TypertRemoteService {
    /** @param ctx - Host context carrying sessions, attachments, and the optional cleanup stores. */
    constructor(ctx: Context);
    /**
     * Read one file attachment's exact stored bytes, authorizing against the
     * session's own event log.
     * @param request - Session and attachment identities used for authorization.
     * @returns the stored display name and base64 bytes.
     */
    readFileAttachment(request: ReadFileAttachmentRequest): Promise<ReadFileAttachmentValue>;
    /**
     * Locate the fork boundary for a rewrite anchored on one durable
     * `user/message` (see the class doc for the cut semantics).
     * @param request - session and the anchored message seq.
     * @returns the inclusive fork boundary, or null for the blank path.
     */
    rewriteBoundary(request: RewriteBoundaryRequest): Promise<RewriteBoundaryValue>;
    /**
     * Delete one chat durably: the session's log artifacts, its projection
     * cache row, and its workspace accounting. A running agent is refused; an
     * opened-but-idle agent is unpublished through the registry's internal
     * detach; on a runtime whose persistence lacks deletion the verb refuses
     * with a stable code and the client degrades gracefully.
     * @param request - Session to remove from storage.
     */
    discardSession(request: DiscardSessionRequest): Promise<void>;
    /**
     * The named session's events: the live agent's snapshot when attached, else
     * one cold query observation (no repair, resume, or publication).
     */
    private sessionEvents;
}
//# sourceMappingURL=index.d.ts.map