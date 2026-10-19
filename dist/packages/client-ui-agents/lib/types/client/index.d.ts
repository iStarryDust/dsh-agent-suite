/**
 * Agent management plugin, browser half: the whole agent suite in one
 * package. It mounts its own Remote namespaces (identity authoring and
 * long-term memory) onto the shared `remote` service, registers the sidebar's
 * agent browser into the shell's browsing hole (shadowing the workspace
 * browser at a lower priority), shadows the official hero mode chip with one
 * scoped to the shipped modes and authored-agent ownership, seats the memory
 * button in the assistant actions strip that sends selected messages through
 * the memory plugin's remember path, gates the
 * conversation region (the bare brand hero outside an agent page), and
 * publishes the chat-time agent context the mode pick composes through.
 *
 * An agent is identity only — name, language, persona, description. One agent
 * is one folder under the authoring root; its chat-time compositions live as
 * entries of a single `compositions.yml` inside it, and a session's ownership
 * is the host-side `agentOwner` projection.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type AgentsKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The agent roster, forms, hero chip, and Define-mode copy. */
        agents: AgentsKey;
    }
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        /**
         * The chat-time agent context: which agent a pending chat-start belongs
         * to, and how a mode pick composes a combined preset for it.
         */
        uiAgents?: UiAgentsService;
    }
}
/** The service ui-agents publishes for the chat-time mode pick. */
export interface UiAgentsService {
    /** The agent a pending chat-start belongs to, absent otherwise. */
    pendingAgent: () => string | undefined;
    /**
     * Ensure the combined preset for the pending agent + mode exists and
     * return its id.
     * @param modeId - the mode the user picked.
     */
    composeForPendingAgent: (modeId: string) => Promise<string | undefined>;
    /**
     * Ensure the combined preset for one agent + mode exists and return its
     * id — the same path a pending chat start takes, so a later mode pick on a
     * blank agent-owned session re-composes for the SAME agent.
     * @param agentId - the agent whose chat the composition belongs to.
     * @param modeId - the mode the user picked.
     */
    composeForAgent: (agentId: string, modeId: string) => Promise<string | undefined>;
    /** Map a combined preset id back to its mode id, when it is one. */
    modeIdFor: (combinedId: string) => string | undefined;
    /** Clear the pending chat context once the session has bound its preset. */
    consumePendingAgent: () => void;
}
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Mount the agent suite's surfaces and services.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map