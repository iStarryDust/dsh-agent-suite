/**
 * The session-side projection this package owns: `agentOwner`, the authored
 * agent a session's chat belongs to.
 *
 * Sessions compose onto a combined preset id (`<agentId>-<modeId>`), but
 * ownership is an agent-level fact. Deriving it host-side — once, at the
 * moment the selection event folds, with the same split the authoring root
 * reads — gives every client an exact key to filter chat history by, instead
 * of each surface re-deriving it from id prefixes.
 *
 * @module @deepseek-ai/dsh-agent-preset-authoring/session
 */
import { z } from 'zod';
declare module '@deepseek-ai/dsh-session-projection/types' {
    interface SessionProjectionStateMap {
        /** The owning user-agent id of the session's chat, or null. */
        agentOwner: string | null;
    }
    interface SessionProjectionMap {
        /** The owning user-agent id of the session's chat, or null. */
        agentOwner: string | null;
    }
}
/** The `agentOwner` projection: session chat ownership as one exact key. */
export declare const agentOwnerProjectionDefinition: {
    key: "agentOwner";
    stateSchema: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    init: (header: import("@deepseek-ai/dsh-session").SessionHeader) => string | null;
    apply: (state: string | null, event: import("@deepseek-ai/dsh-session").SessionEvent) => string | null;
    wire: {
        viewSchema: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        view: (state: string | null) => string | null;
    };
    stateVersion: number;
};
//# sourceMappingURL=session.d.ts.map