/**
 * The persona row an authored agent composes under.
 *
 * An agent's identity is two template fields: a prefix carrying the reply
 * language directive and the author's persona text verbatim, and the working
 * directory line as the suffix, whose `{{cwd}}` placeholder the runtime
 * resolves at mount. Every other row of the base composition carries over
 * untouched, so an authored agent is exactly as capable as the mode it was
 * created from.
 *
 * @module @deepseek-ai/dsh-agent-preset-authoring/persona
 */
import { type CompositionRow } from './storage.ts';
/** The identity fields the persona row folds in. */
export interface PersonaInput {
    /** The language the agent should use when talking to the user. */
    readonly language: string;
    /** The author's own persona instructions. */
    readonly persona: string;
}
/**
 * Render the persona prefix: the language directive when one was given,
 * followed by the author's persona text. Both lines are optional; an agent
 * with neither still carries the working-directory suffix.
 * @param input - the identity fields.
 * @returns the prefix template text.
 */
export declare function renderPersonaPrefix(input: PersonaInput): string;
/**
 * Rewrite a composition's persona row to carry one agent's identity. The row
 * is replaced structurally — never re-serialized from foreign rows — and a
 * composition without a persona row gets one prepended, so an authored agent
 * always presents as its author wrote it.
 * @param plugins - the base composition rows.
 * @param input - the identity fields.
 * @returns the composition rows with the persona row replaced.
 */
export declare function applyPersona(plugins: readonly CompositionRow[], input: PersonaInput): CompositionRow[];
//# sourceMappingURL=persona.d.ts.map