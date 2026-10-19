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
import type { EntryOptions, JsExpr } from '@deepseek-ai/cordis-plugin-loader';
/** Directory name of the authoring root under the harness home. */
export declare const USER_PRESET_DIR = ".agent-presets";
/** Reserved legacy subdirectory holding one directory per combined preset. */
export declare const LEGACY_MODES_DIR = "modes";
/** Composition file name inside one preset directory. */
export declare const COMPOSITION_FILE = "agent.cordis.yml";
/** Display-metadata file name inside one preset directory. */
export declare const METADATA_FILE = "preset.yml";
/** The single file holding every combined composition of one agent. */
export declare const COMPOSITIONS_FILE = "compositions.yml";
/**
 * Ids a preset directory may use. The id becomes a path segment, so this is a
 * containment boundary rather than a style rule: `..`, a separator, or an
 * absolute-looking name would place the composition outside the root.
 */
export declare const PRESET_ID: RegExp;
/**
 * The mode-id suffix a combined-preset id may carry: the shipped modes
 * (standard, PTC, minimal, creator) plus the reserved `env-` namespace of
 * per-agent environment compositions. Kept here so the host splitter and
 * every client-side filter read one spelling.
 */
export declare const COMBINED_MODE_SUFFIX = "(?:standard|ptc|minimal|cordis|env-[a-z0-9-]+)";
/** One combined preset's identity, split from its flattened id. */
export interface CombinedParts {
    /** The owning agent's preset id (its directory name). */
    readonly agentId: string;
    /** The mode id the combined preset composes. */
    readonly modeId: string;
}
/**
 * Split a flattened combined-preset id (`<agentId>-<modeId>`) into its parts,
 * when it is one.
 * @param id - a preset id.
 * @returns the agent and mode parts, or undefined for a bare preset id.
 */
export declare function combinedPartsOf(id: string): CombinedParts | undefined;
/** One composition row as the loader declares it. */
export type CompositionRow = Omit<EntryOptions, 'id' | 'disabled'> & {
    id?: string;
    disabled?: EntryOptions['disabled'] | JsExpr;
};
/** Display metadata and form-captured identity a preset publishes. */
export interface PresetMetadata {
    /** Human-facing name; falls back to the preset id when absent. */
    readonly name?: string;
    /** One sentence on what the agent is for. */
    readonly description?: string;
    /** The language the agent replies in, as the authoring form captured it. */
    readonly language?: string;
    /** The persona text the authoring form captured, before template folding. */
    readonly persona?: string;
}
/** One authored preset, read into memory. */
export interface AuthoredPreset {
    /** Flattened roster id: the agent id, or `<agentId>-<modeId>` combined. */
    readonly id: string;
    /** The owning agent's id; equals {@link id} for a bare agent. */
    readonly agentId: string;
    /** The mode id a combined preset carries, absent on a bare agent. */
    readonly modeId?: string;
    /** Absolute path of the owning agent's directory. */
    readonly dir: string;
    /** Display metadata read from `preset.yml`, possibly empty. */
    readonly metadata: PresetMetadata;
    /** The composition rows, legacy persona rows migrated to the current schema. */
    readonly plugins: readonly CompositionRow[];
}
/** One combined composition as `compositions.yml` stores it. */
export interface CompositionEntry {
    /** Display name of the combined preset, when one was captured. */
    readonly name?: string;
    /** One sentence on the composition, when one was captured. */
    readonly description?: string;
    /** The composition rows in the loader's own dialect. */
    readonly plugins: readonly CompositionRow[];
}
/**
 * Render composition rows back into the loader's own YAML dialect, so a
 * written composition reads exactly like one the deployment shipped.
 */
export declare function renderComposition(plugins: readonly CompositionRow[]): string;
/** The `persona` row id inside a composition, per the dsh-persona contract. */
export declare const PERSONA_ROW_ID = "persona";
/**
 * Read one agent directory's identity files into memory.
 * @param dir - the agent directory holding `agent.cordis.yml` and `preset.yml`.
 * @param id - the agent's roster id (its directory name).
 * @returns the parsed agent, or undefined when no composition occupies it.
 */
export declare function readAgent(dir: string, id: string): Promise<AuthoredPreset | undefined>;
/**
 * Read every combined composition of one agent from its `compositions.yml`.
 * @param dir - the agent directory.
 * @param agentId - the agent's roster id.
 * @returns the combined presets in file order; a missing file is empty.
 */
export declare function readCompositions(dir: string, agentId: string): Promise<AuthoredPreset[]>;
/**
 * Rewrite the agent's whole compositions file.
 * @param dir - the agent directory.
 * @param entries - every composition the agent keeps, keyed by mode id.
 */
export declare function writeCompositions(dir: string, entries: ReadonlyMap<string, CompositionEntry>): Promise<void>;
/**
 * Write one agent's identity files: display metadata and the composition
 * with its persona row rewritten.
 * @param dir - the agent directory; created when absent.
 * @param plugins - the composition rows to write.
 * @param metadata - the display metadata to publish.
 */
export declare function writeAgent(dir: string, plugins: readonly CompositionRow[], metadata: PresetMetadata): Promise<void>;
/** Delete one agent directory whole, compositions included. */
export declare function deleteAgent(dir: string): Promise<void>;
/**
 * Rewrite one combined composition inside the agent's single file, leaving
 * every other mode untouched.
 * @param dir - the agent directory.
 * @param agentId - the agent's roster id (for diagnostics).
 * @param modeId - the mode the entry belongs to.
 * @param entry - the composition to store.
 */
export declare function writeComposition(dir: string, agentId: string, modeId: string, entry: CompositionEntry): Promise<void>;
/**
 * Drop one combined composition from the agent's single file.
 * @param dir - the agent directory.
 * @param agentId - the agent's roster id (for diagnostics).
 * @param modeId - the mode whose entry is removed.
 */
export declare function deleteComposition(dir: string, agentId: string, modeId: string): Promise<void>;
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
export declare function scanRoot(root: string): Promise<AuthoredPreset[]>;
/** Project one combined preset back to its compositions-file entry. */
export declare function compositionOf(preset: AuthoredPreset): CompositionEntry;
//# sourceMappingURL=storage.d.ts.map