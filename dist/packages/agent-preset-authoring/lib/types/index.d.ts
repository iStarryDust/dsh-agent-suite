/**
 * Directory-backed agent identity authoring over the declarative preset
 * registry.
 *
 * Agents are identity only — name, language, persona, description — with no
 * capabilities attached at creation. Capabilities come at chat time: starting
 * a chat composes a combined preset (`<agentId>-<modeId>`) that copies the
 * chosen mode's composition and folds the agent's persona row in. Combined
 * presets are deterministic (created once, reused), so the same agent-mode
 * pair always resolves to the same session composition. One agent is one
 * directory — its combined compositions live as entries of a single
 * `compositions.yml` inside it — and session ownership is published as the
 * `agentOwner` projection, an exact key every chat-history surface filters
 * by.
 *
 * The service owns the harness home's `.agent-presets` directory as its
 * storage and the registry as its activation surface: every preset found on
 * disk is registered as an ordinary declaration at start, and every mutation
 * rewrites the directory before swapping the registration, so the roster and
 * the files never drift apart. Live sessions keep the revision they mounted;
 * the registry's retirement path owns that lifetime.
 *
 * @module @deepseek-ai/dsh-agent-preset-authoring
 */
import { Service, type Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { AuthoredPresetDocument, AuthoredPresetRoster, ComposeEnvironmentRequest, ComposeEnvironmentValue, CreateAuthoredPresetRequest, EnvironmentGroupRow, ReadFileAttachmentRequest, ReadFileAttachmentValue, RemoveAuthoredPresetRequest, RewriteBoundaryRequest, RewriteBoundaryValue, SuggestEnvironmentRequest, SuggestEnvironmentValue, UpdateAuthoredPresetRequest } from './types.ts';
export type { AuthoredPresetDocument, AuthoredPresetRoster, AuthoredPresetRow, AuthoredIdentity, ComposeEnvironmentRequest, ComposeEnvironmentValue, CreateAuthoredPresetRequest, EnvironmentGroupRow, RemoveAuthoredPresetRequest, SuggestEnvironmentRequest, SuggestEnvironmentValue, UpdateAuthoredPresetRequest, } from './types.ts';
export { combinedPartsOf, COMBINED_MODE_SUFFIX, PRESET_ID, USER_PRESET_DIR, } from './storage.ts';
export type { AuthoredPreset, CompositionEntry, CompositionRow, PresetMetadata } from './storage.ts';
export { defaultEnvironmentGroups, ENVIRONMENT_GROUPS, suggestCapabilityGroups } from './environment.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Authoring service for identity presets under the harness home. */
        agentPresetAuthoring: AgentPresetAuthoring;
    }
}
/** Plugin config. */
export interface Config {
    /**
     * Authoring root override for deployments that keep user data elsewhere; a
     * relative path resolves against the process working directory.
     */
    root?: string;
}
/** Runtime schema. */
export declare const Config: z<Config>;
/** Authoring service: the `.agent-presets` directory and its registry bridge. */
export default class AgentPresetAuthoring extends TypertRemoteService {
    /** The preset registry and the projection registry this service builds on. */
    static inject: string[];
    static Config: z<Config>;
    /** Absolute path of the authoring root. */
    readonly root: string;
    /** Live registrations, keyed by flattened preset id. */
    private readonly registrations;
    constructor(ctx: Context, config?: Config);
    /**
     * Fold the `agentOwner` key for cold sessions whose persisted projection
     * row predates the key: open each as a read-only observer, fold its whole
     * log once, and let the cache's fail-soft write-back persist the row. A
     * one-time cost per session after an upgrade; failures are logged and
     * skipped, never fatal.
     */
    private backfillAgentOwner;
    /**
     * Load the authoring root and register every preset found on disk, then
     * backfill the ownership projection for cold sessions.
     * @yields the disposer that withdraws every registration.
     */
    [Service.init](): AsyncGenerator<() => Promise<void>, void, unknown>;
    /**
     * Write back a default preset withdrawn at the previous teardown, once
     * the same id has re-registered here. An uninstall never reaches this,
     * so after an uninstall the withdrawn reset stands and session creation
     * resolves the deployment's own default again.
     */
    private restoreWithheldDefault;
    /**
     * Withdraw every registration this service owns, newest last. When the
     * persisted default preset is one of the withdrawn ids it is reset to
     * the deployment fallback and remembered: every later session creation
     * would otherwise fail with "Unknown agent preset" once this plugin is
     * gone (uninstall or disable), because the host resolves the default
     * before any roster exists to refuse it gracefully. A plain reload
     * re-registers the same ids on the next init and restores the value.
     */
    private withdrawAll;
    /** Register one authored preset as a registry declaration. */
    private register;
    /** Swap one registration: withdraw the old revision before the new one. */
    private swap;
    /** The authored preset a roster id addresses. */
    private authored;
    /**
     * The composition rows a creation starts from: an authored preset's own
     * files when the base is one, otherwise the registry's declaration.
     */
    private baseComposition;
    /** Require a non-empty trimmed value for the identity fields that carry one. */
    private static requireText;
    /** Read the authored roster, with activation diagnostics from the registry. */
    roster(): Promise<AuthoredPresetRoster>;
    /** Read one authored preset's identity, prefilled from its files. */
    document(agentPreset: string): Promise<AuthoredPresetDocument>;
    /**
     * Create a preset by copying a base composition and folding an identity
     * into it. The caller supplies no composition text — only ids the host
     * resolves and identity fields — so authoring grants no capability the
     * base preset did not already carry. A combined target lands as one entry
     * of its agent's `compositions.yml`; a bare target becomes a roster agent.
     */
    create(request: CreateAuthoredPresetRequest): Promise<AuthoredPresetDocument>;
    /**
     * Rewrite one authored preset's identity: display metadata and the persona
     * row. Every other composition row carries over untouched, so a profile
     * edit cannot change an agent's capabilities — only who it presents as.
     * An agent edit propagates to every composition it owns in the same write:
     * one identity, one folder, every mode following it.
     */
    update(request: UpdateAuthoredPresetRequest): Promise<AuthoredPresetDocument>;
    /**
     * Delete one authored preset. A combined preset removes its entry from the
     * agent's compositions file; a bare agent removes its folder whole and
     * sweeps the agent's whole local footprint host-side (its chat sessions
     * and memory store) — the host projection cache is authoritative there,
     * while the client catalog marks cold sessions as non-blank and can miss
     * them. A preset a live session mounted is not refused — the registry's
     * retirement path keeps that session on the revision it started with.
     */
    remove(request: RemoveAuthoredPresetRequest): Promise<void>;
    /**
     * Sweep one deleted agent's remaining local footprint: every session whose
     * cached `agentOwner` names the agent goes through the same durable
     * deletion as the chat-row remote (idle agents detached first, running
     * ones skipped with a log), and the agent's memory store directory goes
     * with it. Best-effort and logged; runs after the preset deletion, so a
     * session can never keep pointing at a preset that no longer exists.
     * @param agentId - the deleted agent's id.
     */
    private purgeAgentFootprint;
    /** The Define-mode capability palette, as a client renders it. */
    environmentGroups(): {
        readonly groups: readonly EnvironmentGroupRow[];
    };
    /**
     * Compose one agent's on-demand environment: a strict subset of the
     * `standard` composition keeping the enabled groups' rows, with the
     * agent's identity folded in, persisted as one entry of the agent's
     * `compositions.yml`, and registered as an ordinary declaration. The
     * combined id is returned so the caller can bind a blank session to it
     * directly.
     */
    composeEnvironment(request: ComposeEnvironmentRequest): Promise<ComposeEnvironmentValue>;
    /**
     * Infer a capability selection from a task description. Pure keyword
     * matching over the palette: a fast local baseline the client pre-checks,
     * always including the conversation defaults.
     */
    suggestEnvironment(request: SuggestEnvironmentRequest): SuggestEnvironmentValue;
    /**
     * Delete one chat durably: the session's log artifacts, its projection
     * cache row, and its workspace accounting. A running agent is refused — the
     * caller stops the conversation first. An opened-but-idle agent is
     * unpublished through the registry's internal detach before deletion (the
     * official runtime keeps no disposal verb for it); on a runtime whose
     * internals differ, that case degrades to the "still open" refusal.
     */
    deleteSession(sessionId: string): Promise<void>;
    /**
     * Read one file attachment's exact stored bytes, authorizing against the
     * session's own event log: only a file referenced by `sessionId` is
     * readable, the same rule the official image read enforces. Backs the
     * edit-and-regenerate surface's resend of kept file attachments.
     * @param request - Session and attachment identities used for authorization.
     * @returns the stored display name and base64 bytes.
     */
    readFileAttachment(request: ReadFileAttachmentRequest): Promise<ReadFileAttachmentValue>;
    /**
     * Locate the fork boundary for a rewrite anchored on one durable
     * `user/message`: the `turn/end` of the message's PREVIOUS turn — the
     * previous turn's own closing event, so the seed stops exactly on a turn
     * boundary. Cutting at "next turn/start minus one" would instead land in
     * the inter-turn gap and can sweep inter-turn `agent/inbox/spliced` events
     * into the seed, which the child then replays as injected user messages.
     * A message whose turn has not ended (open) cuts before its `turn/start`;
     * a message with no preceding turn at all keeps whatever precedes it via
     * `seq - 1` (a preset binding, the session opener), and a message with no
     * preceding event answers null — the caller reuses or creates a blank
     * session.
     * @param request - session and the anchored message seq.
     * @returns the inclusive fork boundary, or null for the blank path.
     */
    rewriteBoundary(request: RewriteBoundaryRequest): Promise<RewriteBoundaryValue>;
    /**
     * The named session's events: the live agent's snapshot when attached, else
     * one cold query observation (no repair, resume, or publication — the same
     * read the official session controller's inspection uses).
     */
    private sessionEvents;
}
//# sourceMappingURL=index.d.ts.map