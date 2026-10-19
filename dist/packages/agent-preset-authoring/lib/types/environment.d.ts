/**
 * The Define-mode capability palette: per-agent compositions assembled as a
 * strict subset of the `standard` preset.
 *
 * A capability group names the composition rows one user-facing ability is
 * made of (a tool, or an isolated plugin group). An environment keeps the
 * identity rows and the rows of every enabled group, and drops the rest, so
 * an environment can never grant a capability `standard` does not carry. The
 * group ids and row ids mirror `packages/bundle/web-app/presets/
 * standard.patch.yml`; the browser renders the palette from the same list.
 *
 * @module @deepseek-ai/dsh-agent-preset-authoring/environment
 */
import type { CompositionRow } from './storage.ts';
/** One capability group of the Define-mode palette. */
export interface EnvironmentGroup {
    /** Stable group id the client keys its dictionary and the wire on. */
    readonly id: string;
    /** Composition row ids the group keeps (top-level rows, groups included). */
    readonly ids: readonly string[];
    /** Whether the group is part of the default conversation baseline. */
    readonly defaultOn: boolean;
    /**
     * Groups flagged `plugin` render in the client's separate 插件能力
     * category: their day-to-day switches live in the owning plugins' own
     * settings pages, so the flag is a presentation hint, not a second gate.
     */
    readonly plugin?: boolean;
}
/**
 * The palette, in baseline-first then opt-in narrative order: the five
 * conversation-baseline groups ship enabled, the opt-in groups follow from
 * personal productivity (jobs, goals) through process control (plan) and
 * outside reach (web, compaction) to multi-agent work (subagents). Groups
 * flagged `plugin` render in the client's separate 插件能力 category.
 */
export declare const ENVIRONMENT_GROUPS: readonly EnvironmentGroup[];
/** Prefix of the per-agent environment mode ids. */
export declare const ENVIRONMENT_MODE_PREFIX = "env-";
/**
 * Filter one composition down to the rows of the enabled groups.
 * @param plugins - the base composition rows (`standard`).
 * @param enabledGroups - the capability group ids the environment keeps.
 * @returns the environment's composition rows, in base order.
 */
export declare function buildEnvironmentComposition(plugins: readonly CompositionRow[], enabledGroups: readonly string[]): CompositionRow[];
/**
 * The palette's default selection.
 * @returns the group ids that are on by default.
 */
export declare function defaultEnvironmentGroups(): string[];
/**
 * Keyword inference over a task description, with no model call: the
 * conversation defaults plus every group whose keyword set hits. The client
 * applies the result as a starting selection the user can edit.
 * @param description - the user's task description.
 * @returns the inferred group ids (defaults always included).
 */
export declare function suggestCapabilityGroups(description: string): string[];
/**
 * Generate one fresh environment mode id.
 * @returns `env-<base36 timestamp><random suffix>`, unique per call.
 */
export declare function newEnvironmentModeId(): string;
/**
 * Validate a caller-supplied environment mode id or accept a generated one.
 * @param modeId - the requested mode id, when given.
 * @returns the mode id to use.
 * @throws when the requested id is not a valid environment slug.
 */
export declare function resolveEnvironmentModeId(modeId: string | undefined): string;
//# sourceMappingURL=environment.d.ts.map