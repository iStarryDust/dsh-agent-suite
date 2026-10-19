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
 * @module @deepseek-ai/dsh-agent-preset-authoring/storage
 */
import { mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import { entryListSchema } from '@deepseek-ai/cordis-plugin-include';
import { writeFileAtomic } from '@deepseek-ai/dsh-atomic-write';
/** Directory name of the authoring root under the harness home. */
export const USER_PRESET_DIR = '.agent-presets';
/** Reserved legacy subdirectory holding one directory per combined preset. */
export const LEGACY_MODES_DIR = 'modes';
/** Composition file name inside one preset directory. */
export const COMPOSITION_FILE = 'agent.cordis.yml';
/** Display-metadata file name inside one preset directory. */
export const METADATA_FILE = 'preset.yml';
/** The single file holding every combined composition of one agent. */
export const COMPOSITIONS_FILE = 'compositions.yml';
/**
 * Ids a preset directory may use. The id becomes a path segment, so this is a
 * containment boundary rather than a style rule: `..`, a separator, or an
 * absolute-looking name would place the composition outside the root.
 */
export const PRESET_ID = /^[a-z0-9][a-z0-9-]*$/;
/**
 * The mode-id suffix a combined-preset id may carry: the shipped modes
 * (standard, PTC, minimal, creator) plus the reserved `env-` namespace of
 * per-agent environment compositions. Kept here so the host splitter and
 * every client-side filter read one spelling.
 */
export const COMBINED_MODE_SUFFIX = '(?:standard|ptc|minimal|cordis|env-[a-z0-9-]+)';
/**
 * Split a flattened combined-preset id (`<agentId>-<modeId>`) into its parts,
 * when it is one.
 * @param id - a preset id.
 * @returns the agent and mode parts, or undefined for a bare preset id.
 */
export function combinedPartsOf(id) {
    const match = new RegExp(`^(.+)-(${COMBINED_MODE_SUFFIX})$`).exec(id);
    const agentId = match?.[1];
    const modeId = match?.[2];
    if (agentId === undefined || modeId === undefined)
        return undefined;
    return { agentId, modeId };
}
/** A non-empty trimmed string, or undefined for anything else. */
function text(value) {
    if (typeof value !== 'string')
        return undefined;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
}
/** Parse a composition file's text into rows; malformed input throws. */
function parseComposition(raw) {
    const parsed = yamlLoad(raw, { schema: entryListSchema });
    if (!Array.isArray(parsed))
        throw new Error('the composition must be a top-level list of plugin rows');
    return parsed;
}
/**
 * Render composition rows back into the loader's own YAML dialect, so a
 * written composition reads exactly like one the deployment shipped.
 */
export function renderComposition(plugins) {
    return yamlDump(plugins, { schema: entryListSchema, noRefs: true, lineWidth: -1 });
}
/** The `persona` row id inside a composition, per the dsh-persona contract. */
export const PERSONA_ROW_ID = 'persona';
/**
 * Migrate a persona row authored against the pre-split `text` schema: the
 * whole text becomes the prefix, which is a template the runtime interpolates
 * exactly as the former single field did.
 */
function migratePersonaRow(row) {
    if (row.id !== PERSONA_ROW_ID)
        return row;
    const config = row.config;
    const legacyText = config?.text;
    if (config === undefined || typeof legacyText !== 'string' || typeof config.prefix === 'string')
        return row;
    const next = { ...config, prefix: legacyText };
    delete next.text;
    return { ...row, config: next };
}
/**
 * Read one agent directory's identity files into memory.
 * @param dir - the agent directory holding `agent.cordis.yml` and `preset.yml`.
 * @param id - the agent's roster id (its directory name).
 * @returns the parsed agent, or undefined when no composition occupies it.
 */
export async function readAgent(dir, id) {
    let raw;
    try {
        raw = await readFile(join(dir, COMPOSITION_FILE), 'utf8');
    }
    catch {
        return undefined;
    }
    let plugins;
    try {
        plugins = parseComposition(raw).map(migratePersonaRow);
    }
    catch (error) {
        throw new Error(`composition of "${id}" cannot be parsed: ${error.message}`);
    }
    return { id, agentId: id, dir, metadata: await readMetadata(dir), plugins };
}
/** Read an agent directory's display metadata; absence degrades to empty. */
async function readMetadata(dir) {
    try {
        const parsed = yamlLoad(await readFile(join(dir, METADATA_FILE), 'utf8'));
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            const record = parsed;
            const name = text(record.name);
            const description = text(record.description);
            const language = text(record.language);
            const persona = text(record.persona);
            return {
                ...name === undefined ? {} : { name },
                ...description === undefined ? {} : { description },
                ...language === undefined ? {} : { language },
                ...persona === undefined ? {} : { persona },
            };
        }
    }
    catch {
        // Absent or malformed display text degrades to no metadata: presentation
        // is not a capability, and a broken name must never fail the composition.
    }
    return {};
}
/** Normalize one parsed compositions-file value into its entry, or drop it. */
function compositionEntryOf(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value))
        return undefined;
    const record = value;
    const plugins = Array.isArray(record.plugins) ? record.plugins : undefined;
    if (plugins === undefined)
        return undefined;
    const name = text(record.name);
    const description = text(record.description);
    return {
        ...name === undefined ? {} : { name },
        ...description === undefined ? {} : { description },
        plugins: plugins.map(migratePersonaRow),
    };
}
/**
 * Read every combined composition of one agent from its `compositions.yml`.
 * @param dir - the agent directory.
 * @param agentId - the agent's roster id.
 * @returns the combined presets in file order; a missing file is empty.
 */
export async function readCompositions(dir, agentId) {
    let raw;
    try {
        raw = await readFile(join(dir, COMPOSITIONS_FILE), 'utf8');
    }
    catch {
        return [];
    }
    let parsed;
    try {
        parsed = yamlLoad(raw, { schema: entryListSchema });
    }
    catch (error) {
        throw new Error(`compositions of "${agentId}" cannot be parsed: ${error.message}`);
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed))
        return [];
    const presets = [];
    for (const [modeId, value] of Object.entries(parsed)) {
        if (!PRESET_ID.test(modeId))
            continue;
        const entry = compositionEntryOf(value);
        if (entry === undefined)
            continue;
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
        });
    }
    return presets;
}
/**
 * Rewrite the agent's whole compositions file.
 * @param dir - the agent directory.
 * @param entries - every composition the agent keeps, keyed by mode id.
 */
export async function writeCompositions(dir, entries) {
    const record = {};
    for (const [modeId, entry] of entries) {
        record[modeId] = {
            ...entry.name === undefined ? {} : { name: entry.name },
            ...entry.description === undefined ? {} : { description: entry.description },
            plugins: entry.plugins,
        };
    }
    const body = Object.keys(record).length === 0
        ? '# No chat-time compositions yet; one map entry per mode id.\n{}\n'
        : yamlDump(record, { schema: entryListSchema, noRefs: true, lineWidth: -1 });
    await mkdir(dir, { recursive: true });
    await writeFileAtomic(join(dir, COMPOSITIONS_FILE), body, { mode: 0o600, dirMode: 0o700 });
}
/**
 * Write one agent's identity files: display metadata and the composition
 * with its persona row rewritten.
 * @param dir - the agent directory; created when absent.
 * @param plugins - the composition rows to write.
 * @param metadata - the display metadata to publish.
 */
export async function writeAgent(dir, plugins, metadata) {
    await mkdir(dir, { recursive: true });
    await writeFileAtomic(join(dir, COMPOSITION_FILE), `${renderComposition(plugins)}\n`, {
        mode: 0o600, dirMode: 0o700,
    });
    await writeFileAtomic(join(dir, METADATA_FILE), renderMetadata(metadata), {
        mode: 0o600, dirMode: 0o700,
    });
}
/** Render the display-metadata file; an all-empty identity still names the preset. */
function renderMetadata(metadata) {
    const record = {};
    for (const [key, value] of Object.entries(metadata)) {
        const trimmed = value?.trim();
        if (trimmed !== undefined && trimmed !== '')
            record[key] = trimmed;
    }
    return yamlDump(record, { noRefs: true, lineWidth: -1 });
}
/** Delete one agent directory whole, compositions included. */
export async function deleteAgent(dir) {
    await rm(dir, { recursive: true, force: true });
}
/**
 * Rewrite one combined composition inside the agent's single file, leaving
 * every other mode untouched.
 * @param dir - the agent directory.
 * @param agentId - the agent's roster id (for diagnostics).
 * @param modeId - the mode the entry belongs to.
 * @param entry - the composition to store.
 */
export async function writeComposition(dir, agentId, modeId, entry) {
    const entries = await readCompositionEntries(dir, agentId);
    entries.set(modeId, entry);
    await writeCompositions(dir, entries);
}
/**
 * Drop one combined composition from the agent's single file.
 * @param dir - the agent directory.
 * @param agentId - the agent's roster id (for diagnostics).
 * @param modeId - the mode whose entry is removed.
 */
export async function deleteComposition(dir, agentId, modeId) {
    const entries = await readCompositionEntries(dir, agentId);
    if (!entries.delete(modeId))
        return;
    await writeCompositions(dir, entries);
}
/** The compositions file as an editable map; missing file reads empty. */
async function readCompositionEntries(dir, agentId) {
    const entries = new Map();
    for (const preset of await readCompositions(dir, agentId)) {
        entries.set(preset.modeId, compositionOf(preset));
    }
    return entries;
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
export async function scanRoot(root) {
    const found = [];
    let top;
    try {
        top = await readdir(root);
    }
    catch {
        return found;
    }
    for (const name of top.sort()) {
        if (!PRESET_ID.test(name))
            continue;
        const agentDir = join(root, name);
        if (!await isDirectory(agentDir))
            continue;
        const agent = await readAgent(agentDir, name);
        if (agent === undefined)
            continue;
        found.push(agent);
        const entries = new Map();
        for (const preset of await readCompositions(agentDir, name)) {
            entries.set(preset.modeId, compositionOf(preset));
        }
        const legacy = await migrateLegacyModes(agentDir, name);
        if (legacy.size > 0) {
            for (const [modeId, entry] of legacy)
                entries.set(modeId, entry);
            await writeCompositions(agentDir, entries);
            await rm(join(agentDir, LEGACY_MODES_DIR), { recursive: true, force: true });
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
            });
        }
    }
    return found;
}
/** Project one combined preset back to its compositions-file entry. */
export function compositionOf(preset) {
    return {
        ...preset.metadata.name === undefined ? {} : { name: preset.metadata.name },
        ...preset.metadata.description === undefined ? {} : { description: preset.metadata.description },
        plugins: preset.plugins,
    };
}
/**
 * Read the legacy per-mode directories of one agent, if any remain.
 * @param agentDir - the agent directory.
 * @param agentId - the agent's roster id.
 * @returns the legacy compositions keyed by mode id; empty when none exist.
 */
async function migrateLegacyModes(agentDir, agentId) {
    const modesDir = join(agentDir, LEGACY_MODES_DIR);
    let modes;
    try {
        modes = await readdir(modesDir);
    }
    catch {
        return new Map();
    }
    const entries = new Map();
    for (const mode of modes.sort()) {
        if (!PRESET_ID.test(mode))
            continue;
        const modeDir = join(modesDir, mode);
        if (!await isDirectory(modeDir))
            continue;
        const preset = await readLegacyPreset(modeDir, `${agentId}-${mode}`);
        if (preset !== undefined)
            entries.set(mode, compositionOf(preset));
    }
    return entries;
}
/**
 * Read one legacy preset directory into memory.
 * @param dir - the legacy mode directory.
 * @param id - the flattened roster id the directory publishes.
 * @returns the parsed preset, or undefined when no composition occupies it.
 */
async function readLegacyPreset(dir, id) {
    const parts = combinedPartsOf(id);
    const agentId = parts?.agentId ?? id;
    let raw;
    try {
        raw = await readFile(join(dir, COMPOSITION_FILE), 'utf8');
    }
    catch {
        return undefined;
    }
    let plugins;
    try {
        plugins = parseComposition(raw).map(migratePersonaRow);
    }
    catch (error) {
        throw new Error(`composition of "${id}" cannot be parsed: ${error.message}`);
    }
    const metadata = await readMetadata(dir);
    return {
        id, agentId, ...parts === undefined ? {} : { modeId: parts.modeId },
        dir, metadata, plugins,
    };
}
/** Whether a path exists and is a directory. */
async function isDirectory(path) {
    try {
        return (await stat(path)).isDirectory();
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=storage.js.map