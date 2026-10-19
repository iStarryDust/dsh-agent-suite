/** Client-safe payloads owned by the agent-memory domain. */
/** Canonical memory_add tool output. */
export interface MemoryAddValue {
    /** Whether a write landed. */
    readonly saved: boolean;
    /** The agent store the write targeted. */
    readonly agentId?: string;
    /** Outcome detail: the approval decision, or why nothing was written. */
    readonly outcome?: string;
    /** The deduped fact that landed (or would have landed). */
    readonly content?: string;
}
/** Result of one UI-driven remember: what AI analysis produced and wrote. */
export interface RememberValue {
    /** Whether at least one entry landed. */
    readonly saved: boolean;
    /** The agent store the write targeted. */
    readonly agentId?: string;
    /** Outcome detail: why nothing was written, or how many landed. */
    readonly outcome?: string;
    /** The entries the analysis produced (before dedupe/stamp). */
    readonly entries?: readonly string[];
}
//# sourceMappingURL=types.d.ts.map