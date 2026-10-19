/**
 * Agent-memory settings page store: the four memory switches over the
 * `agent-memory` settings namespace (through the shared configuration form,
 * so writes ride the same revision fencing as every other settings surface)
 * and the global memory document over the `agentMemory` Remote namespace.
 */
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store';
/** One accepted switch section; malformed durable values read as all-off. */
export function decodeMemorySwitches(section) {
    const source = typeof section === 'object' && section !== null && !Array.isArray(section)
        ? section
        : {};
    return {
        globalEnabled: source.globalEnabled === true,
        agentEnabled: source.agentEnabled === true,
        autoMemory: source.autoMemory === true,
        askMemory: source.askMemory === true,
    };
}
/** One settings-page controller (one per browser page). */
export class MemorySettingsController {
    form;
    resolveMemory;
    /** Snapshot the section renderer subscribes to. */
    store = createSnapshotStore({
        status: 'loading',
        switches: decodeMemorySwitches(undefined),
        editor: { globalText: '', saveState: 'idle', error: null },
    });
    unsubscribe;
    /**
     * @param form - the shared configuration form for the `agent-memory`
     * namespace (switch state and ordered writes).
     * @param resolveMemory - resolves the `agentMemory` Remote namespace at
     * CALL time: the namespace mounts asynchronously after this plugin's own
     * apply, so an apply-time capture would freeze a pre-mount undefined.
     */
    constructor(form, resolveMemory) {
        this.form = form;
        this.resolveMemory = resolveMemory;
        this.unsubscribe = form.subscribe(() => { this.deriveSwitches(); });
        this.deriveSwitches();
    }
    /** Release the form subscription. */
    dispose() {
        this.unsubscribe();
    }
    /** Toggle one switch through the shared configuration form. */
    async toggle(field, next) {
        await this.form.set(field, next);
    }
    /** Update the global-memory editor draft (client-side only until save). */
    setDraft(text) {
        const snapshot = this.store.getSnapshot();
        this.store.set({ ...snapshot, editor: { ...snapshot.editor, globalText: text, saveState: 'idle' } });
    }
    /** Save the global document through the Remote namespace. */
    async saveGlobal() {
        const namespace = this.resolveMemory();
        if (namespace === undefined) {
            this.failEditor('agentMemory namespace is not mounted');
            return;
        }
        const { globalText } = this.store.getSnapshot().editor;
        this.store.set({ ...this.store.getSnapshot(), editor: { ...this.store.getSnapshot().editor, saveState: 'saving', error: null } });
        try {
            const written = await namespace.writeGlobal(globalText);
            if (!written.ok)
                throw new Error(written.error.message);
            this.store.set({ ...this.store.getSnapshot(), editor: { ...this.store.getSnapshot().editor, saveState: 'saved' } });
        }
        catch (error) {
            this.failEditor(error instanceof Error ? error.message : String(error));
        }
    }
    /** Load the global document into the editor. */
    async loadGlobal() {
        const namespace = this.resolveMemory();
        if (namespace === undefined) {
            this.failEditor('agentMemory namespace is not mounted');
            return;
        }
        try {
            const read = await namespace.readGlobal();
            if (!read.ok)
                throw new Error(read.error.message);
            this.store.set({ ...this.store.getSnapshot(), editor: { ...this.store.getSnapshot().editor, globalText: read.value, saveState: 'idle', error: null } });
        }
        catch (error) {
            this.failEditor(error instanceof Error ? error.message : String(error));
        }
    }
    failEditor(message) {
        this.store.set({ ...this.store.getSnapshot(), editor: { ...this.store.getSnapshot().editor, saveState: 'failed', error: message } });
    }
    deriveSwitches() {
        const snapshot = this.form.getSnapshot();
        this.store.set({
            ...this.store.getSnapshot(),
            status: snapshot.status === 'ready' ? 'ready' : snapshot.status === 'loading' ? 'loading' : 'unavailable',
            switches: snapshot.value === undefined ? decodeMemorySwitches(undefined) : decodeMemorySwitches(snapshot.value),
        });
    }
}
//# sourceMappingURL=memory-store.js.map