/**
 * Global and per-agent long-term memory for the DeepSeek Harness.
 *
 * Two memory tiers, both plain markdown stores under `<dshHome>/agent-memory`
 * (sibling of `.agent-presets`, resolved through `dshHomePath` so `$DSH_HOME`
 * and cross-platform homes land correctly):
 *
 * - **global**: `global/memory.md`, shared by every agent;
 * - **agent**: `<agentId>/memory.md`, one store per agent (the agent id is the
 *   authored preset id, deduced from a combined `<agentId>-<modeId>` preset).
 *
 * Four user switches — the plugin's own configuration section, editable on
 * the standard settings surfaces — control behavior:
 * - `globalEnabled` / `agentEnabled`: whether the corresponding store is
 *   injected into the system prompt (`memory:global` / `memory:agent`
 *   sections, text thunks re-read the files on every assembly so editor saves
 *   take effect without a restart);
 * - `autoMemory`: the model may call the `memory_add` tool and facts are
 *   written straight to the agent store (deduped, timestamped);
 * - `askMemory`: the same tool call first asks the human through the approval
 *   seam (fail-closed when no approval service is composed or a `never`
 *   session policy rejects), and only an `allowed-once` decision writes.
 *
 * The tool is registered only while `autoMemory || askMemory` holds; the
 * switches are volatile (committed without a remount), so the plugin re-syncs
 * the registration on every settings commit. Global memory is human-authored
 * through the editor; the tool always writes the calling agent's store.
 *
 * @module @deepseek-ai/dsh-agent-memory
 */
import type { Context } from '@deepseek-ai/cordis';
import type { Volatile } from '@deepseek-ai/cosmokit';
import z from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { RememberValue } from './types.ts';
import { type MemoryAppendResult } from './storage.ts';
export * from './storage.ts';
export type { MemoryAddValue, RememberValue } from './types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Long-term memory service: the stores, switches, sections, and tool. */
        agentMemory: AgentMemory;
    }
}
/** System-prompt section names this plugin owns. */
export declare const GLOBAL_MEMORY_SECTION = "memory:global";
export declare const AGENT_MEMORY_SECTION = "memory:agent";
/** Plugin configuration: the four memory switches, all defaulting to off.
 * Each switch is a live-editable {@link Volatile} value: the settings surface
 * writes it, the loader commits it without a remount, and the plugin re-syncs
 * the tool registration on the commit event while the prompt sections re-read
 * the value on every assembly. */
export interface Config {
    /** Inject the global memory store into the system prompt. */
    globalEnabled: Volatile<boolean>;
    /** Inject the calling agent's memory store into the system prompt. */
    agentEnabled: Volatile<boolean>;
    /** Let the model write facts to the agent store on its own judgment. */
    autoMemory: Volatile<boolean>;
    /** Ask the human before writing (implies autoMemory in UI availability). */
    askMemory: Volatile<boolean>;
}
/** Runtime schema. The first type parameter is the wire/patch shape (volatile
 * fields optional); the second is the resolved shape the plugin reads. */
export declare const Config: z<{
    globalEnabled?: boolean;
    agentEnabled?: boolean;
    autoMemory?: boolean;
    askMemory?: boolean;
}, Config>;
/**
 * Deduce the owning user-agent id from a preset id: a combined
 * `<agentId>-<modeId>` id resolves to `<agentId>`, anything else is itself.
 * The shipped mode spellings (including the creator mode) and the `env-`
 * namespace match the authoring root's combined-id split, so both sides never
 * drift apart.
 * @param presetId - the preset id bound to the session or agent.
 * @returns the agent id whose memory directory applies.
 */
export declare function agentIdOf(presetId: string): string;
/** Memory service: the harness-home stores, the switches, the prompt sections, and the model-facing `memory_add` tool. */
export default class AgentMemory extends TypertRemoteService {
    readonly config: Config;
    static inject: string[];
    static Config: z<{
        globalEnabled?: boolean;
        agentEnabled?: boolean;
        autoMemory?: boolean;
        askMemory?: boolean;
    }, Config>;
    /** Disposer of the `memory_add` tool registration, present while visible. */
    private toolDisposer;
    constructor(ctx: Context, config: Config);
    /** Register or drop the `memory_add` tool to match the current switches. */
    private syncTool;
    /** Register the model-facing memory tool; returns its disposer. */
    private registerTool;
    /**
     * The user-agent id behind one live agent. `agent.id` is the SessionId, not
     * a preset id: the owning user agent is the preset the agent joined
     * (`composedPreset` -> `<agentId>-<modeId>`), split back to `<agentId>`.
     * @param agent - a live agent (or the slim `{ id, ctx }` shape).
     * @returns the user-agent id whose memory store applies.
     */
    resolveAgentId(agent: {
        id: string;
        ctx: Context;
    }): string;
    /** Global store text (editor read). */
    readGlobal(): string;
    /** Global store save (editor write). */
    writeGlobal(text: string): void;
    /** One agent store text (editor read). */
    readAgent(agentId: string): string;
    /** One agent store save (editor write). */
    writeAgent(agentId: string, text: string): void;
    /** Remove one agent's whole memory store directory (the agent-delete purge). */
    purgeAgent(agentId: string): void;
    /** Append one fact to an agent store (deduped, timestamped). */
    appendAgent(agentId: string, content: string): MemoryAppendResult;
    /**
     * Analyze selected conversation text with the agent's own model and write
     * the resulting memory entries to the agent's store. This is the UI-driven
     * path (the memory button): the human selects messages in an open chat, and
     * the model condenses them into stable facts. The session must be live (its
     * agent supplies the model config) and must belong to an authored agent — a
     * plain chat has no agent store to write to. The write always targets the
     * calling agent's store — never global — mirroring the tool's policy.
     * @param sessionId - the live session whose agent performs the analysis.
     * @param text - the selected conversation text to condense.
     * @returns whether anything landed, plus the entries and any outcome detail.
     */
    remember(sessionId: string, text: string): Promise<RememberValue>;
}
/**
 * Strip invisible/whitespace characters a model may emit around real prose
 * without being caught by `String.trim`: control characters, non-breaking and
 * zero-width space variants, BOM, and the full-width space. This keeps a line
 * that is "visually blank but bytewise non-empty" from being written as a
 * memory entry that renders as a block of blank.
 */
export declare function stripInvisible(value: string): string;
/** Whether one candidate line is a vacuous "no content" placeholder. */
export declare function isVacuousEntry(line: string): boolean;
//# sourceMappingURL=index.d.ts.map