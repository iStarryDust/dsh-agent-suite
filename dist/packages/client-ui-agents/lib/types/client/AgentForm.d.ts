/**
 * The create / profile form for one agent.
 *
 * Both modes share the identity fields (name, description, language,
 * persona); the edit mode prefills from the agent's stored profile and puts
 * the delete action left of the confirm button.
 */
import type { AgentsKey } from './locales.ts';
import type { AgentFormInput } from './stores.ts';
/** Which surface the form serves. */
export type AgentFormMode = 'create' | 'edit';
/** Form props, composed by the browser. */
export interface AgentFormProps {
    /** create and edit share the identity fields; edit adds the delete action. */
    mode: AgentFormMode;
    /** Prefill (edit only; null means still loading). */
    initial: AgentFormInput | null;
    /** A wire call is in flight — buttons disabled. */
    busy: boolean;
    /** A rejected wire call's message, shown above the actions. */
    error: string | null;
    /** Locale seat. */
    t: (key: AgentsKey) => string;
    /** Confirm. */
    onSubmit: (input: AgentFormInput) => void;
    /** Leave the form. */
    onCancel: () => void;
    /** Delete the agent being edited (edit mode only). */
    onDelete: (() => void) | undefined;
}
/** Render the create / profile form. */
export declare function AgentForm({ mode, initial, busy, error, t, onSubmit, onCancel, onDelete, }: AgentFormProps): import("react").JSX.Element;
//# sourceMappingURL=AgentForm.d.ts.map