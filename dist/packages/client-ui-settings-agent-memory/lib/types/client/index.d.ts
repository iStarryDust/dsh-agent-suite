/**
 * Agent-memory settings page, browser half: registers the 助理记忆 section
 * once the settings shell's section slot is on the ledger. The four switches
 * ride the shared configuration form for the host plugin's `agent-memory`
 * namespace, and the global memory document rides the `agentMemory` Remote
 * namespace (soft-resolved: the page renders before or without the
 * namespace).
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type AgentMemoryKey } from './locales.ts';
export type { MemorySectionInjected, MemorySectionProps } from './MemorySection.tsx';
export { MemorySettingsController, decodeMemorySwitches } from './memory-store.ts';
export type { MemorySectionState, MemorySwitches } from './memory-store.ts';
export type { AgentMemoryKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The agent-memory settings page copy. */
        'settings.agentMemory': AgentMemoryKey;
    }
}
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Register the agent-memory section and its dictionaries.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map