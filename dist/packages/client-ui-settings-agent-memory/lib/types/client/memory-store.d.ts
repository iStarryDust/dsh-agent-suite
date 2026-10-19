/**
 * Agent-memory settings page store: the four memory switches over the
 * `agent-memory` settings namespace (through the shared configuration form,
 * so writes ride the same revision fencing as every other settings surface)
 * and the global memory document over the `agentMemory` Remote namespace.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
/** The four memory switches; the shape mirrors the host plugin's Config. */
export interface MemorySwitches {
    /** Inject the global memory store into the system prompt. */
    globalEnabled: boolean;
    /** Inject the calling agent's memory store into the system prompt. */
    agentEnabled: boolean;
    /** Let the model write facts to the agent store on its own judgment. */
    autoMemory: boolean;
    /** Ask the human before the memory_add tool writes. */
    askMemory: boolean;
}
/** One accepted switch section; malformed durable values read as all-off. */
export declare function decodeMemorySwitches(section: unknown): MemorySwitches;
/** Global-memory editor transient state. */
export interface MemoryEditorState {
    /** The global document draft in the editor. */
    globalText: string;
    /** Save lifecycle of the global editor. */
    saveState: 'idle' | 'saving' | 'saved' | 'failed';
    /** Load or save failure text, when the document could not be served. */
    error: string | null;
}
/** Page snapshot rendered by the section. */
export interface MemorySectionState {
    /** Switch transport state; `unavailable` renders the controls disabled. */
    status: 'loading' | 'ready' | 'unavailable';
    /** The four switches as the Host holds them. */
    switches: MemorySwitches;
    /** The global-memory editor. */
    editor: MemoryEditorState;
}
/** One settings-page controller (one per browser page). */
export declare class MemorySettingsController {
    private readonly form;
    private readonly resolveMemory;
    /** Snapshot the section renderer subscribes to. */
    readonly store: SnapshotStore<MemorySectionState>;
    private readonly unsubscribe;
    /**
     * @param form - the shared configuration form for the `agent-memory`
     * namespace (switch state and ordered writes).
     * @param resolveMemory - resolves the `agentMemory` Remote namespace at
     * CALL time: the namespace mounts asynchronously after this plugin's own
     * apply, so an apply-time capture would freeze a pre-mount undefined.
     */
    constructor(form: ConfigForm<MemorySwitches>, resolveMemory: () => Pick<ClientContext['remote']['agentMemory'], 'readGlobal' | 'writeGlobal'> | undefined);
    /** Release the form subscription. */
    dispose(): void;
    /** Toggle one switch through the shared configuration form. */
    toggle(field: keyof MemorySwitches, next: boolean): Promise<void>;
    /** Update the global-memory editor draft (client-side only until save). */
    setDraft(text: string): void;
    /** Save the global document through the Remote namespace. */
    saveGlobal(): Promise<void>;
    /** Load the global document into the editor. */
    loadGlobal(): Promise<void>;
    private failEditor;
    private deriveSwitches;
}
//# sourceMappingURL=memory-store.d.ts.map