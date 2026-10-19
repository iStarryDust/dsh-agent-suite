/**
 * The per-message memory entry, browser half: the memory button seated in the
 * assistant-actions strip beside the official feedback pair. It opens the
 * session's message-selection dialog; the checked messages go to the host
 * remember path, which condenses them into the agent's own long-term memory
 * store. Nothing is written until the human checks messages and submits.
 * @module @deepseek-ai/dsh-client-ui-agents/client/MemoryEntry
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { RememberValue } from '@deepseek-ai/dsh-agent-memory/types';
/** Injected business face of the memory entry. */
export interface MemoryActionsInjected {
    /**
     * Analyze the checked conversation text into the owning session's agent
     * memory; resolves the host outcome (saved, entries, or a failure detail).
     */
    remember: (text: string) => Promise<RememberValue>;
}
/** Full props of the assistant-actions memory entry. */
export type MemoryActionsProps = PropsRuntime<'conversation.chat.assistant-actions'> & InjectFace<MemoryActionsInjected> & PropsLocale<'agents'>;
/**
 * The strip button and its transient saved note. The dialog is local state:
 * only one instance exists per message row, and nothing outside it needs the
 * selection.
 * @param props - the injected remember verb and the runtime session kit.
 * @returns the memory icon button with any transient inline copy.
 */
export declare function MemoryActions({ useChat, remember, t }: MemoryActionsProps): import("react").JSX.Element;
/** Props of the message-selection dialog: the chat hook, the verb, and the copy. */
export interface MemoryDialogProps {
    /** Selector hook over the session's chat snapshot. */
    useChat: MemoryActionsProps['useChat'];
    /** The injected remember verb (bound to this session's agent). */
    remember: (text: string) => Promise<RememberValue>;
    /** Close the dialog; `saved` promotes the strip's transient note. */
    onClose: (saved: boolean) => void;
    /** The agents-namespace copy. */
    t: MemoryActionsProps['t'];
}
/**
 * The memory-selection dialog: the official modal shell over the current
 * session's selectable messages (a condensed preview per row). The human
 * checks the ones worth keeping, and the checked text goes to the injected
 * remember verb.
 */
export declare function MemoryDialog({ useChat, remember, onClose, t }: MemoryDialogProps): import("react").JSX.Element;
//# sourceMappingURL=MemoryEntry.d.ts.map