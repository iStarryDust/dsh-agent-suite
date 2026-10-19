import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { MemorySectionState, MemorySwitches } from './memory-store.ts';
/** Settings actions and their shared controller state. */
export interface MemorySectionInjected {
    hooks: {
        /** Page snapshot bound by the renderer as useMemorySection. */
        memorySection: SnapshotStore<MemorySectionState>;
    };
    /** Toggle one memory switch. */
    toggle: (field: keyof MemorySwitches, next: boolean) => Promise<void>;
    /** Update the global-memory editor draft. */
    setDraft: (text: string) => void;
    /** Save the global document. */
    saveGlobal: () => Promise<void>;
    /** Load the global document. */
    loadGlobal: () => Promise<void>;
}
/** Props assembled by the settings renderer. */
export type MemorySectionProps = PropsRuntime<'settings.section'> & PropsLocale<'settings.agentMemory'> & InjectFace<MemorySectionInjected>;
/**
 * Render the agent-memory settings section.
 * @param props - settings actions, snapshot hook, and localized copy.
 * @returns the section page.
 */
export declare function MemorySection({ useMemorySection, toggle, setDraft, saveGlobal, loadGlobal, t, }: MemorySectionProps): import("react").JSX.Element;
//# sourceMappingURL=MemorySection.d.ts.map