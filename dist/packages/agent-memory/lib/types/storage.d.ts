/**
 * Markdown memory stores under the harness home.
 *
 * Layout mirrors the authoring root's ownership pattern: the root is the
 * package's own segment under the harness home (`<dshHome>/agent-memory`),
 * resolved through `dshHomePath` so `$DSH_HOME` overrides and cross-platform
 * homes both land correctly. Global memory lives in `global/`, one agent's
 * memory in `<agentId>/` — all agents share the global file, each agent owns
 * its own directory.
 *
 * File shape: `# <title>` header lines are free text (the user edits them),
 * and every memory entry is one `- [YYYY-MM-DD HH:mm] content` line. The
 * timestamp is the entry's primary metadata: a re-saved entry refreshes its
 * stamp, a re-remembered identical fact refreshes instead of duplicating.
 * Reads and writes are synchronous on purpose: prompt assembly calls the
 * section thunk with no await point, and the files are tiny.
 * @module @deepseek-ai/dsh-agent-memory/storage
 */
/** Harness-home segment this package owns (sibling of `.agent-presets`). */
export declare const MEMORY_DIR = "agent-memory";
/** Directory name for the shared global memory store. */
export declare const GLOBAL_DIR = "global";
/** File name of one memory document. */
export declare const MEMORY_FILE = "memory.md";
/** One parsed memory entry: its stamp and its content. */
export interface MemoryEntry {
    /** Local `YYYY-MM-DD HH:mm` stamp written when the fact was remembered. */
    readonly stamp: string;
    /** The remembered fact, single line by convention but unrestricted in practice. */
    readonly content: string;
}
/** Result of one append: what the store now holds. */
export interface MemoryAppendResult {
    /** Whether a payload was appended as a new entry. */
    readonly appended: boolean;
    /** Whether an existing entry was refreshed (same fact, new stamp). */
    readonly refreshed: boolean;
    /** The entry content the write landed as (deduped form). */
    readonly content: string;
}
/** Whole-document read of one memory store. */
export interface MemoryDoc {
    /** Raw file text (header lines + entries), empty when the file is absent. */
    readonly text: string;
    /** Parsed entries in document order. */
    readonly entries: readonly MemoryEntry[];
}
/** Format the current local time as an entry stamp. */
export declare function stampNow(date?: Date): string;
/** Absolute root of every memory store (`<dshHome>/agent-memory`). */
export declare function memoryRoot(): string;
/** Absolute directory of one memory store (global when no agent is named). */
export declare function memoryDir(agentId?: string): string;
/** Absolute path of a memory document. */
export declare function memoryPath(agentId?: string): string;
/** Parse memory entries out of a document body. */
export declare function parseEntries(text: string): MemoryEntry[];
/**
 * Read one memory store.
 * @param agentId - the agent id, or `undefined` for the global store.
 * @returns the parsed document (empty on a missing file).
 */
export declare function readMemory(agentId?: string): MemoryDoc;
/** Raw full text of one memory store (for the editor save flow). */
export declare function readMemoryText(agentId?: string): string;
/**
 * Replace one memory store wholesale (the user's editor save).
 * @param text - the complete next document text.
 * @param agentId - the agent id, or `undefined` for the global store.
 */
export declare function writeMemory(text: string, agentId?: string): void;
/**
 * Remove one agent's whole memory store directory (the agent-delete purge).
 * @param agentId - the agent whose store goes away; the global store is guarded.
 */
export declare function purgeMemory(agentId: string): void;
/**
 * Canonical comparison key for dedupe: content case-folded with every
 * whitespace run collapsed, so "记得 DSH 路径" and "记得DSH路径" are one fact.
 * @param content - the raw entry content.
 * @returns the normalized comparison key.
 */
export declare function dedupeKey(content: string): string;
/**
 * Append one remembered fact, deduping against the store: a fact whose
 * normalized key already exists refreshes that entry's stamp instead of
 * duplicating; anything else is appended as a new timestamped line. Non-entry
 * lines (headers, blanks) survive untouched.
 * @param content - the fact to remember (single-line prose).
 * @param agentId - the agent id, or `undefined` for the global store.
 * @param at - stamp source, injectable for tests.
 * @returns what the write did.
 */
export declare function appendMemory(content: string, agentId?: string, at?: Date): MemoryAppendResult;
//# sourceMappingURL=storage.d.ts.map