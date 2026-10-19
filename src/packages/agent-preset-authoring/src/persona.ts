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
 * @module @istarry/dsh-agent-preset-authoring/persona
 */

import { PERSONA_ROW_ID, type CompositionRow } from './storage.ts'

/** The persona plugin's package name. */
const PERSONA_PLUGIN_NAME = '@deepseek-ai/dsh-persona'

/**
 * The working-directory suffix template.
 *
 * 0.2.1 起 persona 模板不再注册 `{{cwd}}` 变量（会报 unknown prompt variable），
 * 工作目录已由宿主的 `working-directory` 消息源注入，所以这里不再内插变量。
 */
const WORKING_DIRECTORY_SUFFIX = 'Your working directory is the session working directory.'

/** The identity fields the persona row folds in. */
export interface PersonaInput {
  /** The language the agent should use when talking to the user. */
  readonly language: string
  /** The author's own persona instructions. */
  readonly persona: string
}

/**
 * Render the persona prefix: the language directive when one was given,
 * followed by the author's persona text. Both lines are optional; an agent
 * with neither still carries the working-directory suffix.
 * @param input - the identity fields.
 * @returns the prefix template text.
 */
export function renderPersonaPrefix(input: PersonaInput): string {
  const language = input.language.trim()
  const persona = input.persona.trim()
  const lines = [
    ...language === '' ? [] : [`Reply in ${language} throughout.`],
    ...persona === '' ? [] : [persona],
  ]
  return lines.join('\n\n')
}

/**
 * Rewrite a composition's persona row to carry one agent's identity. The row
 * is replaced structurally — never re-serialized from foreign rows — and a
 * composition without a persona row gets one prepended, so an authored agent
 * always presents as its author wrote it.
 * @param plugins - the base composition rows.
 * @param input - the identity fields.
 * @returns the composition rows with the persona row replaced.
 */
export function applyPersona(plugins: readonly CompositionRow[], input: PersonaInput): CompositionRow[] {
  const row: CompositionRow = {
    id: PERSONA_ROW_ID,
    name: PERSONA_PLUGIN_NAME,
    config: {
      prefix: renderPersonaPrefix(input),
      suffix: WORKING_DIRECTORY_SUFFIX,
    },
  }
  const index = plugins.findIndex(candidate => candidate.id === PERSONA_ROW_ID)
  if (index < 0) return [row, ...plugins]
  return plugins.map((candidate, position) => position === index ? row : candidate)
}
