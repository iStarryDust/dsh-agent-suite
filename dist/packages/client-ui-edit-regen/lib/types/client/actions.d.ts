/**
 * The rewrite orchestration behind the inline editor: one call forks the
 * session at the edited message's turn boundary, re-admits the surviving
 * attachments against the CHILD session (fresh receipts for files through
 * the edit-regen remote read plus the official upload channel), carries the
 * model selection over, sends the edited prompt, and only then switches the
 * view. A rejected prompt discards the forked shell, so a failed edit leaves
 * nothing behind and the source conversation never moved.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { ImageAttachmentRef, FileAttachmentRef } from '@deepseek-ai/dsh-attachment';
declare module '@deepseek-ai/dsh-api-session-controller/client' {
    interface SessionReferenceSourceMap {
        /** The edit-and-regenerate rewrite flow's owned child reference. */
        editRegen: unknown;
    }
}
/** One browser-picked draft file awaiting upload (image or generic file). */
export interface DraftFile {
    readonly file: File;
}
/** Injected face of the keyed user-message renderer. */
export interface EditActionsInjected {
    /** Rewrite the session from one durable user message onward. */
    rewriteFrom: (sessionId: string, seq: number, text: string, keptImages: readonly ImageAttachmentRef[], keptFiles: readonly FileAttachmentRef[], draftImages: readonly DraftFile[], draftFiles: readonly DraftFile[]) => Promise<void>;
}
/** Services resolved ONCE at apply time. A reinstall can retire the plugin
 * fiber's staged injections between setup and the user's first confirm, and a
 * closure that reads `ctx.sessions` at call time then dies with
 * "without inject" — capturing the references during apply makes the flow
 * immune to that lifecycle. The compound remote soft-access also rides the
 * captured context (`ctx.get('remote.agentPresetAuthoring')`), whose mount is
 * owned by the agent-suite host package and survives reinstalls. */
export interface EditServices {
    readonly ctx: ClientContext;
    readonly sessions: ClientContext['sessions'];
    readonly workspaces: ClientContext['workspaces'];
    readonly uiWorkspace: ClientContext['uiWorkspace'];
    /** The live remote service: namespaces mounted later appear on this object. */
    readonly remote: ClientContext['remote'];
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
export declare function createEditActions(deps: EditServices, whenRemoteReady: Promise<void>): EditActionsInjected;
//# sourceMappingURL=actions.d.ts.map