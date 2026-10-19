/**
 * The directory layout authored agents persist to, and the readers and
 * writers that keep it honest.
 *
 * One agent is one directory under the harness home's `.agent-presets` root,
 * nothing else: the identity files at the top (`preset.yml` display metadata
 * plus the `agent.cordis.yml` composition) and one `compositions.yml` file
 * holding every chat-time mode composition this agent has ever run, keyed by
 * mode id. A combined composition's flattened roster id is
 * `<agentId>-<modeId>`, registered as an ordinary declaration, so the
 * registry addresses each mode while the file system keeps one agent one
 * folder.
 *
 * Layouts written before the single-file consolidation nested each mode at
 * `modes/<modeId>/`; the scan migrates them in place (merge, atomic write,
 * then remove the directory) so an upgrade needs no manual step.
 *
 * The composition file is exactly what the loader reads: a top-level YAML
 * list of plugin rows in the loader's own dialect (`!!js` conditions
 * included). Compositions authored before the persona row split its text
 * into `prefix` and `suffix` are migrated in memory at read time, so data
 * written by older deployments keeps composing without a disk rewrite.
 *
 * @module @istarry/dsh-agent-preset-authoring/storage
 */

import { mkdir, readdir, readFile, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { load as yamlLoad, dump as yamlDump } from 'js-yaml'
import { entryListSchema } from '@deepseek-ai/cordis-plugin-include'
import type { EntryOptions, JsExpr } from '@deepseek-ai/cordis-plugin-loader'
import { writeFileAtomic } from '@deepseek-ai/dsh-atomic-write'

/** Directory name of the authoring root under the harness home. */
export const USER_PRESET_DIR = '.agent-presets'

/** Reserved legacy subdirectory holding one directory per combined preset. */
export const LEGACY_MODES_DIR = 'modes'

/** Composition file name inside one preset directory. */
export const COMPOSITION_FILE = 'agent.cordis.yml'

/** Display-metadata file name inside one preset directory. */
export const METADATA_FILE = 'preset.yml'

/** The single file holding every combined composition of one agent. */
export const COMPOSITIONS_FILE = 'compositions.yml'

/**
 * Ids a preset directory may use. The id becomes a path segment, so this is a
 * containment boundary rather than a style rule: `..`, a separator, or an
 * absolute-looking name would place the composition outside the root.
 */
export const PRESET_ID = /^[a-z0-9][a-z0-9-]*$/

/**
 * The mode-id suffix a combined-preset id may carry: the shipped modes
 * (standard, PTC, minimal, creator) plus the reserved `env-` namespace of
 * per-agent environment compositions. Kept here so the host splitter and
 * every client-side filter read one spelling.
 */
export const COMBINED_MODE_SUFFIX = '(?:standard|ptc|minimal|cordis|env-[a-z0-9-]+)'

/** One combined preset's identity, split from its flattened id. */
export interface CombinedParts {
  /** The owning agent's preset id (its directory name). */
  readonly agentId: string
  /** The mode id the combined preset composes. */
  readonly modeId: string
}

/**
 * Split a flattened combined-preset id (`<agentId>-<modeId>`) into its parts,
 * when it is one.
 * @param id - a preset id.
 * @returns the agent and mode parts, or undefined for a bare preset id.
 */
export function combinedPartsOf(id: string): CombinedParts | undefined {
  const match = new RegExp(`^(.+)-(${COMBINED_MODE_SUFFIX})$`).exec(id)
  const agentId = match?.[1]
  const modeId = match?.[2]
  if (agentId === undefined || modeId === undefined) return undefined
  return { agentId, modeId }
}

/** One composition row as the loader declares it. */
export type CompositionRow = Omit<EntryOptions, 'id' | 'disabled'>
  & { id?: string; disabled?: EntryOptions['disabled'] | JsExpr }

/** Display metadata and form-captured identity a preset publishes. */
export interface PresetMetadata {
  /** Human-facing name; falls back to the preset id when absent. */
  readonly name?: string
  /** One sentence on what the agent is for. */
  readonly description?: string
  /** The language the agent replies in, as the authoring form captured it. */
  readonly language?: string
  /** The persona text the authoring form captured, before template folding. */
  readonly persona?: string
}

/** One authored preset, read into memory. */
export interface AuthoredPreset {
  /** Flattened roster id: the agent id, or `<agentId>-<modeId>` combined. */
  readonly id: string
  /** The owning agent's id; equals {@link id} for a bare agent. */
  readonly agentId: string
  /** The mode id a combined preset carries, absent on a bare agent. */
  readonly modeId?: string
  /** Absolute path of the owning agent's directory. */
  readonly dir: string
  /** Display metadata read from `preset.yml`, possibly empty. */
  readonly metadata: PresetMetadata
  /** The composition rows, legacy persona rows migrated to the current schema. */
  readonly plugins: readonly CompositionRow[]
}

/** One combined composition as `compositions.yml` stores it. */
export interface CompositionEntry {
  /** Display name of the combined preset, when one was captured. */
  readonly name?: string
  /** One sentence on the composition, when one was captured. */
  readonly description?: string
  /** The composition rows in the loader's own dialect. */
  readonly plugins: readonly CompositionRow[]
}

/** A non-empty trimmed string, or undefined for anything else. */
function text(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

/** Parse a composition file's text into rows; malformed input throws. */
function parseComposition(raw: string): CompositionRow[] {
  const parsed: unknown = yamlLoad(raw, { schema: entryListSchema })
  if (!Array.isArray(parsed)) throw new Error('the composition must be a top-level list of plugin rows')
  return parsed as CompositionRow[]
}

/**
 * Render composition rows back into the loader's own YAML dialect, so a
 * written composition reads exactly like one the deployment shipped.
 */
export function renderComposition(plugins: readonly CompositionRow[]): string {
  return yamlDump(plugins, { schema: entryListSchema, noRefs: true, lineWidth: -1 })
}

/** The `persona` row id inside a composition, per the dsh-persona contract. */
export const PERSONA_ROW_ID = 'persona'

/**
 * Migrate a persona row authored against the pre-split `text` schema: the
 * whole text becomes the prefix, which is a template the runtime interpolates
 * exactly as the former single field did.
 */
function migratePersonaRow(row: CompositionRow): CompositionRow {
  if (row.id !== PERSONA_ROW_ID) return row
  const config = row.config as Record<string, unknown> | undefined
  const legacyText = config?.text
  if (config === undefined || typeof legacyText !== 'string' || typeof config.prefix === 'string') return row
  const next: Record<string, unknown> = { ...config, prefix: legacyText }
  delete next.text
  return { ...row, config: next }
}

/**
 * Read one agent directory's identity files into memory.
 * @param dir - the agent directory holding `agent.cordis.yml` and `preset.yml`.
 * @param id - the agent's roster id (its directory name).
 * @returns the parsed agent, or undefined when no composition occupies it.
 */
export async function readAgent(dir: string, id: string): Promise<AuthoredPreset | undefined> {
  let raw: string
  try {
    raw = await readFile(join(dir, COMPOSITION_FILE), 'utf8')
  } catch {
    return undefined
  }
  let plugins: readonly CompositionRow[]
  try {
    plugins = parseComposition(raw).map(migratePersonaRow)
  } catch (error) {
    throw new Error(`composition of "${id}" cannot be parsed: ${(error as Error).message}`)
  }
  return { id, agentId: id, dir, metadata: await readMetadata(dir), plugins }
}

/** Read an agent directory's display metadata; absence degrades to empty. */
async function readMetadata(dir: string): Promise<PresetMetadata> {
  try {
    const parsed: unknown = yamlLoad(await readFile(join(dir, METADATA_FILE), 'utf8'))
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      const record = parsed as Record<string, unknown>
      const name = text(record.name)
      const description = text(record.description)
      const language = text(record.language)
      const persona = text(record.persona)
      return {
        ...name === undefined ? {} : { name },
        ...description === undefined ? {} : { description },
        ...language === undefined ? {} : { language },
        ...persona === undefined ? {} : { persona },
      }
    }
  } catch {
    // Absent or malformed display text degrades to no metadata: presentation
    // is not a capability, and a broken name must never fail the composition.
  }
  return {}
}

/** Normalize one parsed compositions-file value into its entry, or drop it. */
function compositionEntryOf(value: unknown): CompositionEntry | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
  const record = value as Record<string, unknown>
  const plugins = Array.isArray(record.plugins) ? record.plugins as CompositionRow[] : undefined
  if (plugins === undefined) return undefined
  const name = text(record.name)
  const description = text(record.description)
  return {
    ...name === undefined ? {} : { name },
    ...description === undefined ? {} : { description },
    plugins: plugins.map(migratePersonaRow),
  }
}

/**
 * Read every combined composition of one agent from its `compositions.yml`.
 * @param dir - the agent directory.
 * @param agentId - the agent's roster id.
 * @returns the combined presets in file order; a missing file is empty.
 */
export async function readCompositions(dir: string, agentId: string): Promise<AuthoredPreset[]> {
  let raw: string
  try {
    raw = await readFile(join(dir, COMPOSITIONS_FILE), 'utf8')
  } catch {
    return []
  }
  let parsed: unknown
  try {
    parsed = yamlLoad(raw, { schema: entryListSchema })
  } catch (error) {
    throw new Error(`compositions of "${agentId}" cannot be parsed: ${(error as Error).message}`)
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return []
  const presets: AuthoredPreset[] = []
  for (const [modeId, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (!PRESET_ID.test(modeId)) continue
    const entry = compositionEntryOf(value)
    if (entry === undefined) continue
    presets.push({
      id: `${agentId}-${modeId}`,
      agentId,
      modeId,
      dir,
      metadata: {
        ...entry.name === undefined ? {} : { name: entry.name },
        ...entry.description === undefined ? {} : { description: entry.description },
      },
      plugins: entry.plugins,
    })
  }
  return presets
}

/**
 * Rewrite the agent's whole compositions file.
 * @param dir - the agent directory.
 * @param entries - every composition the agent keeps, keyed by mode id.
 */
export async function writeCompositions(
  dir: string,
  entries: ReadonlyMap<string, CompositionEntry>,
): Promise<void> {
  const record: Record<string, unknown> = {}
  for (const [modeId, entry] of entries) {
    record[modeId] = {
      ...entry.name === undefined ? {} : { name: entry.name },
      ...entry.description === undefined ? {} : { description: entry.description },
      plugins: entry.plugins,
    }
  }
  const body = Object.keys(record).length === 0
    ? '# No chat-time compositions yet; one map entry per mode id.\n{}\n'
    : yamlDump(record, { schema: entryListSchema, noRefs: true, lineWidth: -1 })
  await mkdir(dir, { recursive: true })
  await writeFileAtomic(join(dir, COMPOSITIONS_FILE), body, { mode: 0o600, dirMode: 0o700 })
}

/**
 * Write one agent's identity files: display metadata and the composition
 * with its persona row rewritten.
 * @param dir - the agent directory; created when absent.
 * @param plugins - the composition rows to write.
 * @param metadata - the display metadata to publish.
 */
export async function writeAgent(
  dir: string,
  plugins: readonly CompositionRow[],
  metadata: PresetMetadata,
): Promise<void> {
  await mkdir(dir, { recursive: true })
  await writeFileAtomic(join(dir, COMPOSITION_FILE), `${renderComposition(plugins)}\n`, {
    mode: 0o600, dirMode: 0o700,
  })
  await writeFileAtomic(join(dir, METADATA_FILE), renderMetadata(metadata), {
    mode: 0o600, dirMode: 0o700,
  })
}

/** Render the display-metadata file; an all-empty identity still names the preset. */
function renderMetadata(metadata: PresetMetadata): string {
  const record: Record<string, string> = {}
  for (const [key, value] of Object.entries(metadata)) {
    const trimmed = value?.trim()
    if (trimmed !== undefined && trimmed !== '') record[key] = trimmed
  }
  return yamlDump(record, { noRefs: true, lineWidth: -1 })
}

/** Delete one agent directory whole, compositions included. */
export async function deleteAgent(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true })
}

/**
 * Rewrite one combined composition inside the agent's single file, leaving
 * every other mode untouched.
 * @param dir - the agent directory.
 * @param agentId - the agent's roster id (for diagnostics).
 * @param modeId - the mode the entry belongs to.
 * @param entry - the composition to store.
 */
export async function writeComposition(
  dir: string,
  agentId: string,
  modeId: string,
  entry: CompositionEntry,
): Promise<void> {
  const entries = await readCompositionEntries(dir, agentId)
  entries.set(modeId, entry)
  await writeCompositions(dir, entries)
}

/**
 * Drop one combined composition from the agent's single file.
 * @param dir - the agent directory.
 * @param agentId - the agent's roster id (for diagnostics).
 * @param modeId - the mode whose entry is removed.
 */
export async function deleteComposition(dir: string, agentId: string, modeId: string): Promise<void> {
  const entries = await readCompositionEntries(dir, agentId)
  if (!entries.delete(modeId)) return
  await writeCompositions(dir, entries)
}

/** The compositions file as an editable map; missing file reads empty. */
async function readCompositionEntries(
  dir: string,
  agentId: string,
): Promise<Map<string, CompositionEntry>> {
  const entries = new Map<string, CompositionEntry>()
  for (const preset of await readCompositions(dir, agentId)) {
    entries.set(preset.modeId as string, compositionOf(preset))
  }
  return entries
}

/**
 * Scan the authoring root: every agent directory at the top level, each
 * followed by the combined compositions its `compositions.yml` declares.
 * Legacy `modes/<modeId>/` directories are migrated into the single file on
 * first sight (merge, atomic write, then removal), so one agent keeps one
 * folder across upgrades.
 * @param root - absolute path of the `.agent-presets` directory.
 * @returns the presets found, each agent before its compositions, in
 * directory order; unreadable compositions throw so a broken file is reported
 * rather than silently dropped.
 */
export async function scanRoot(root: string): Promise<AuthoredPreset[]> {
  const found: AuthoredPreset[] = []
  let top: string[]
  try {
    top = await readdir(root)
  } catch {
    return found
  }
  for (const name of top.sort()) {
    if (!PRESET_ID.test(name)) continue
    const agentDir = join(root, name)
    if (!await isDirectory(agentDir)) continue
    const agent = await readAgent(agentDir, name)
    if (agent === undefined) continue
    found.push(agent)
    const entries = new Map<string, CompositionEntry>()
    for (const preset of await readCompositions(agentDir, name)) {
      entries.set(preset.modeId as string, compositionOf(preset))
    }
    const legacy = await migrateLegacyModes(agentDir, name)
    if (legacy.size > 0) {
      for (const [modeId, entry] of legacy) entries.set(modeId, entry)
      await writeCompositions(agentDir, entries)
      await rm(join(agentDir, LEGACY_MODES_DIR), { recursive: true, force: true })
    }
    for (const [modeId, entry] of entries) {
      found.push({
        id: `${name}-${modeId}`,
        agentId: name,
        modeId,
        dir: agentDir,
        metadata: {
          ...entry.name === undefined ? {} : { name: entry.name },
          ...entry.description === undefined ? {} : { description: entry.description },
        },
        plugins: entry.plugins,
      })
    }
  }
  return found
}

/** Project one combined preset back to its compositions-file entry. */
export function compositionOf(preset: AuthoredPreset): CompositionEntry {
  return {
    ...preset.metadata.name === undefined ? {} : { name: preset.metadata.name },
    ...preset.metadata.description === undefined ? {} : { description: preset.metadata.description },
    plugins: preset.plugins,
  }
}

/**
 * Read the legacy per-mode directories of one agent, if any remain.
 * @param agentDir - the agent directory.
 * @param agentId - the agent's roster id.
 * @returns the legacy compositions keyed by mode id; empty when none exist.
 */
async function migrateLegacyModes(agentDir: string, agentId: string): Promise<Map<string, CompositionEntry>> {
  const modesDir = join(agentDir, LEGACY_MODES_DIR)
  let modes: string[]
  try {
    modes = await readdir(modesDir)
  } catch {
    return new Map()
  }
  const entries = new Map<string, CompositionEntry>()
  for (const mode of modes.sort()) {
    if (!PRESET_ID.test(mode)) continue
    const modeDir = join(modesDir, mode)
    if (!await isDirectory(modeDir)) continue
    const preset = await readLegacyPreset(modeDir, `${agentId}-${mode}`)
    if (preset !== undefined) entries.set(mode, compositionOf(preset))
  }
  return entries
}

/**
 * Read one legacy preset directory into memory.
 * @param dir - the legacy mode directory.
 * @param id - the flattened roster id the directory publishes.
 * @returns the parsed preset, or undefined when no composition occupies it.
 */
async function readLegacyPreset(dir: string, id: string): Promise<AuthoredPreset | undefined> {
  const parts = combinedPartsOf(id)
  const agentId = parts?.agentId ?? id
  let raw: string
  try {
    raw = await readFile(join(dir, COMPOSITION_FILE), 'utf8')
  } catch {
    return undefined
  }
  let plugins: readonly CompositionRow[]
  try {
    plugins = parseComposition(raw).map(migratePersonaRow)
  } catch (error) {
    throw new Error(`composition of "${id}" cannot be parsed: ${(error as Error).message}`)
  }
  const metadata = await readMetadata(dir)
  return {
    id, agentId, ...parts === undefined ? {} : { modeId: parts.modeId },
    dir, metadata, plugins,
  }
}

/** Whether a path exists and is a directory. */
async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory()
  } catch {
    return false
  }
}
