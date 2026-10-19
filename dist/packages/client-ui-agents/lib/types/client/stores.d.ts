/**
 * Agent-browser controller: the sidebar's agent roster, the current selection
 * and view (roster / agent page / create / edit / memory), the wire calls
 * behind them, and the conversation-region gate (the bare brand hero on every
 * non-agent view, the real conversation once inside an agent).
 *
 * An agent is identity only — name / language / persona — with no base mode
 * attached at creation. Capabilities come at chat time: starting a chat
 * composes a COMBINED preset (`<agentId>-<modeId>`, e.g. `agent-xxx-standard`)
 * that copies the chosen mode's composition and folds the agent's persona in.
 * Combined presets are deterministic (created once, reused), so the same
 * (agent, mode) pair always resolves to the same session composition. Session
 * ownership is read from the host-side `agentOwner` projection — an exact key
 * derived by the authoring service, so chat history never depends on id
 * spelling; a session whose projection predates the key falls back to the
 * combined-id prefix.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type ObservableSnapshot, type SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { HeroDefineState, HeroSeatState } from './hero.tsx';
/** The editable identity fields of one agent. */
export interface AgentFormInput {
    /** Display name. */
    name: string;
    /** Language the agent should reply in. */
    language: string;
    /** One-line description the author writes about the agent. */
    description: string;
    /** The user's own persona instructions. */
    persona: string;
}
/** One selectable agent / base-mode entry in the roster. */
export interface AgentViewEntry {
    /** Preset id (the agent's directory name). */
    id: string;
    /** Display name, falling back to the id. */
    name: string;
    /** One sentence on what the agent is for, when published. */
    description?: string;
}
/** One session row inside an agent's chat history. */
export interface AgentSessionEntry {
    /** Session id, for opening the conversation. */
    id: string;
    /** The session's stored title; a blank draft carries none and renders its derived label. */
    title: string;
    /** Whether the session is the currently open one. */
    current: boolean;
    /** Last-activity time, for newest-first ordering. */
    updatedAt: number;
    /** A draft with no messages yet (never prompted). */
    blank: boolean;
    /** The chat-time mode a bound combined preset carries, when one is bound. */
    modeId?: string;
}
/** The browser's view. */
export type AgentBrowserView = 'roster' | 'agent' | 'create' | 'edit' | 'memory';
/** Browser snapshot. */
export interface AgentBrowserState {
    status: 'idle' | 'loading' | 'ready' | 'error';
    error: string | null;
    /** The user's own agents (combined presets excluded). */
    agents: readonly AgentViewEntry[];
    /** Chat-time mode options: the shipped system presets minus the meta mode. */
    bases: readonly AgentViewEntry[];
    /** The selected agent id, empty until one is chosen. */
    selected: string;
    /** Which surface the browser is showing. */
    view: AgentBrowserView;
    /** Prefill for the edit form, loaded when a profile is opened. */
    profile: AgentFormInput | null;
    /** A wire call is in flight (buttons disabled). */
    busy: boolean;
    /** Whether the roster list is collapsed (title-only). */
    collapsed: boolean;
    /** The agent-memory editor draft (view 'memory'). */
    memoryText: string;
    /** Agent-memory editor transient state. */
    memoryState: 'idle' | 'saving' | 'saved' | 'failed';
}
/** A failure message from a wire call, or undefined on success. */
export type WireFailure = string | undefined;
/** The client face the controller reads session state through. */
export interface SessionReadFace {
    /** The sessions catalog snapshot. */
    readonly list: ObservableSnapshot<{
        byId: Record<string, {
            updatedAt: number;
            origin?: 'subagent';
            blank?: boolean;
        }>;
        projectionsBySession: Readonly<Record<string, {
            values: Readonly<Record<string, unknown>>;
        }>>;
    }>;
    /** Registry-global archive set: archived sessions hide from every agent's history. */
    readonly archived: ObservableSnapshot<readonly string[]>;
    /** Registry-global pinned set: pinned sessions lead their agent's history. */
    readonly pinned: ObservableSnapshot<readonly string[]>;
    /** Rename one session's durable title. */
    rename(sessionId: string, title: string): Promise<void>;
    /** Archive one session. */
    archive(sessionId: string): Promise<void>;
}
/** The workspace navigation face the controller drives chats through. */
export interface WorkspaceLaunchFace {
    /** Open one session in the main view. */
    openSession(sessionId: string): void;
    /**
     * Start a new session bound to a preset: stage the pick, start the session,
     * and apply the pick once the session is current and blank.
     */
    launchWithPreset(presetId: string): void;
}
/**
 * Owns the agent browser's state and its wire calls.
 */
export declare class AgentBrowserController {
    private readonly ctx;
    private readonly sessions;
    private readonly launch;
    /** Snapshot the renderer subscribes to. */
    readonly store: SnapshotStore<AgentBrowserState>;
    /** The agent a chat-start is about to open for (the hero's mode pick maps to it). */
    private pending;
    /** Disposer of the active conversation shadow, absent while not shadowing. */
    private shadowDisposer;
    /** The conversation shadow factory, bound once the slot declaration is up. */
    private shadowFactory;
    constructor(ctx: ClientContext, sessions: SessionReadFace, launch: WorkspaceLaunchFace);
    /**
     * Resolved once this suite's Remote namespaces finished mounting; assigned
     * by the plugin body before any load can run. Roster reads wait on it so a
     * cold boot never races the asynchronous `$mount`.
     */
    whenRemoteReady: Promise<void>;
    /**
     * Resolve one typed Remote namespace through the context's soft lookup.
     *
     * The namespace services live under dotted service names provided by fibers
     * outside this plugin's ancestor chain. Reading them MUST go through
     * `ctx.get('<namespace>')` directly: even after `ctx.get('remote')`, a
     * further `.namespace` property hop re-enters the context proxy, whose
     * inject snapshot this fiber does not satisfy — the soft service lookup is
     * the only path that bypasses it.
     */
    private namespace;
    /** The authored-identity Remote namespace (roster, compositions, deletion). */
    get agentPresetAuthoring(): ClientContext['remote']['agentPresetAuthoring'];
    /** The preset registry namespace (session binding). */
    get agentPresets(): ClientContext['remote']['agentPresets'];
    /** The memory namespace (per-agent stores). */
    get agentMemory(): ClientContext['remote']['agentMemory'];
    /** Tear down the conversation gate. */
    dispose(): void;
    /**
     * Subscribe to session-catalog changes; returns the disposer. The hero
     * seat tracks its session's live binding through this.
     */
    subscribeCatalog(listener: () => void): () => void;
    private set;
    /**
     * Bind the conversation-region gate: `factory` creates one shadow occupant
     * for the `main.conversation` slot and returns its disposer. Called once
     * the slot declaration is on the ledger; the gate then tracks the view.
     * @param factory - creates the shadow occupant for the conversation region.
     */
    bindConversationShadow(factory: () => () => void): void;
    /** Reconcile the conversation shadow with the current view. */
    private updateConversationShadow;
    /** The agent a pending chat-start belongs to, for the hero's mode pick. */
    pendingAgent(): string | undefined;
    /** Clear the pending chat context once the session has bound its preset. */
    consumePendingAgent(): void;
    /** Map a combined preset id back to its mode id, when it is one. */
    modeIdFor(combinedId: string): string | undefined;
    /**
     * The projection values one session carries, read straight off the catalog
     * snapshot (the hero chip's binding display and ownership derivation).
     * @param sessionId - the session to inspect.
     * @returns the projection values, or undefined when absent.
     */
    sessionProjectionsOf(sessionId: string): Readonly<Record<string, unknown>> | undefined;
    /**
     * Resolve once the roster has loaded, so the hero chip's first render sees
     * the shipped modes rather than an empty option list.
     */
    ready(): Promise<void>;
    /**
     * Load the roster: the user's agents plus the chat-time mode options.
     * @returns once the snapshot reflects the host.
     */
    load(): Promise<void>;
    /** Toggle the roster list's collapsed state. */
    toggleCollapsed(): void;
    /** Leave a form surface: edit returns to the agent page, create to the roster. */
    back(): void;
    /** Open one agent's page: chat history on the left, the agent's most recent chat (when one exists) on the right. */
    selectAgent(id: string): void;
    /**
     * The selected agent's chat history — the one shared ownership read (the
     * roster rows and the auto-opened latest chat both go through
     * {@link agentSessionsOf}).
     */
    agentSessions(): AgentSessionEntry[];
    /** Open one chat from the agent's history. */
    openSession(sessionId: string): void;
    /** Open the create form (only reachable from the roster page). */
    openCreate(): void;
    /**
     * Open one agent's profile panel, prefilled from the host. The view stays
     * on the agent page — profile editing is a main-area panel now, and moving
     * the view would flip the brand back to the roster look and swap the
     * sidebar's chat history away.
     * @param id - the agent to edit.
     */
    openProfile(id: string): Promise<void>;
    /**
     * Open one agent's memory panel, prefilled from the store. Like
     * {@link openProfile}, the view stays on the agent page.
     * @param id - the agent whose memory to edit.
     */
    openMemory(id: string): Promise<void>;
    /** Update the memory editor draft. */
    setMemoryText(text: string): void;
    /**
     * Save the memory editor draft to this agent's store.
     * @returns the failure message, or undefined on success.
     */
    saveMemory(): Promise<WireFailure>;
    /** Return from the memory editor to the agent page. */
    backFromMemory(): void;
    /**
     * Create an agent (identity only — no base mode) and open its page.
     * @param input - the form fields.
     * @returns the failure message, or undefined on success.
     */
    create(input: AgentFormInput): Promise<WireFailure>;
    /**
     * Save a profile edit, propagating the identity to the agent's combined
     * presets, and return to the agent page.
     * @param id - the agent to update.
     * @param input - the form fields.
     * @returns the failure message, or undefined on success.
     */
    saveEdit(id: string, input: AgentFormInput): Promise<WireFailure>;
    /**
     * Rebind every blank session whose bound preset no longer exists back to
     * the deployment default. A blank left pointing at a deleted combined
     * preset breaks the official session-creation flow (it composes the
     * stored preset before reusing the blank), so the heal runs before any
     * new chat launch.
     */
    private healDeadDrafts;
    /**
     * Delete an agent with its whole local footprint: its combined presets,
     * its chat sessions (each through the durable delete; a running session is
     * skipped and logged), and its long-term memory store — then return to the
     * roster.
     * @param id - the agent to remove.
     * @returns the failure message, or undefined on success.
     */
    remove(id: string): Promise<WireFailure>;
    /**
     * Start a new chat with one agent: compose the agent's default combined
     * preset FIRST so the launch binds the created session to it directly — the
     * hero's staging runs on roster load and misses a chat started right after a
     * create, which would otherwise leave the session on the deployment
     * default. The hero's mode pick can still swap the composition while the
     * session is blank. The agent is also recorded as the pending chat context.
     *
     * A composition failure is surfaced, never swallowed: starting the session
     * anyway would silently bind it to the deployment default and hide it from
     * this agent's chat history.
     * @param id - the agent to chat with.
     * @returns a failure message when the combined preset could not be
     * composed (the chat was NOT started), or undefined on success.
     */
    startChat(id: string): Promise<WireFailure>;
    /**
     * Ensure the combined preset for the pending agent + mode exists.
     * The hero chip stages and applies it; this only makes it available.
     * @param modeId - the mode the user picked.
     * @returns the combined preset id, or undefined when composition fails.
     */
    composeForPendingAgent(modeId: string): Promise<string | undefined>;
    /**
     * Ensure the combined preset for one agent + mode exists — the same path a
     * pending chat start takes, exposed so a later mode pick on a blank
     * agent-owned session re-composes for the SAME agent.
     * @param agentId - the agent whose chat the composition belongs to.
     * @param modeId - the mode the user picked.
     * @returns the combined preset id, or undefined when composition fails.
     */
    composeForAgent(agentId: string, modeId: string): Promise<string | undefined>;
    /**
     * Ensure the combined preset `<agentId>-<modeId>` exists: a deterministic
     * copy of the mode's composition with the agent's persona folded in.
     * @param agentId - the agent preset id.
     * @param modeId - the mode preset id (standard / ptc / minimal / cordis).
     * @returns the combined preset id, or undefined when it cannot be composed.
     */
    ensureCombined(agentId: string, modeId: string): Promise<string | undefined>;
    /** Rename one chat's durable title. */
    renameSession(sessionId: string, title: string): Promise<void>;
    /** Archive one chat. */
    archiveSession(sessionId: string): Promise<void>;
    /**
     * Delete one chat durably through the authoring service's own deletion
     * remote: the session log, its projection cache row, and its workspace
     * accounting go together. The removal event folds into every client's
     * catalog through the official session-controller relay.
     * @param sessionId - the session to delete.
     * @returns a user-facing failure key or message, or undefined on success.
     */
    removeSession(sessionId: string): Promise<string | undefined>;
}
/**
 * The hero mode chip's controller: the shipped modes as options, the current
 * session's binding, Define-mode palette state, and the pick/apply path.
 * Mode picks ride the browser controller's composition machinery, so every
 * pick behaves identically to a chat start.
 */
export declare class HeroSeatController {
    private readonly browser;
    /** Localize one shipped preset id (the official preset display dictionary). */
    private readonly modeText;
    /** Seat snapshot the renderer subscribes to. */
    readonly store: SnapshotStore<HeroSeatState>;
    /** Define-dialog snapshot the renderer subscribes to. */
    readonly define: SnapshotStore<HeroDefineState>;
    /** The session the seat mirrors; its binding is re-read on catalog changes. */
    private seatSessionId;
    /** Disposer of the catalog subscription, present while a session is mirrored. */
    private catalogUnsubscribe;
    constructor(browser: AgentBrowserController, 
    /** Localize one shipped preset id (the official preset display dictionary). */
    modeText: (id: string) => {
        name: string;
        description: string;
    });
    /** Release the catalog subscription. */
    dispose(): void;
    /**
     * Reflect the offered modes and the current session's binding. The binding
     * is re-read whenever the session catalog changes: a freshly started chat
     * binds its preset asynchronously (the launch selects the composition after
     * the blank session turns current), so the one-shot read at mount races
     * that bind and would leave the chip's label empty on the slow path.
     */
    load(sessionId: string | undefined): Promise<void>;
    /** Mirror one session; the catalog subscription keeps the binding live. */
    private trackSession;
    /** Re-derive the chip's current mode from the session's live binding. */
    private reflectBinding;
    /**
     * Stage and apply one mode pick on the named session. A session owned by
     * an authored agent re-composes THAT agent's combined preset for the mode;
     * a plain session binds the shipped mode id directly. An id that is ALREADY
     * combined (the Define dialog's composition) binds as-is — re-composing it
     * would nest the combined id into a second combined id.
     * @param sessionId - the session whose composition changes.
     * @param id - the picked mode id, or a composed combined id.
     * @returns a user-facing failure text, or undefined on success.
     */
    select(sessionId: string, id: string): Promise<string | undefined>;
    /**
     * The agent a Define composition builds for: the pending chat's agent, or
     * the one owning the current session's bound combined preset.
     * @param sessionId - the current session, when one is current.
     * @returns the agent id, or an empty string for a plain session.
     */
    defineTarget(sessionId: string | undefined): string;
    /** Load the capability palette once per controller lifetime. */
    loadDefine(): Promise<void>;
    /** Infer a capability selection from a task description. */
    suggestDefine(description: string): Promise<readonly string[]>;
    /** Compose one agent's environment and return its combined id, or ''. */
    composeDefine(agentPreset: string, groups: readonly string[]): Promise<string>;
    /** The preset registry namespace (session binding), via the browser's soft lookup. */
    private get agentPresets();
    /** The preset id bound to a session, read off its projection values. */
    private boundPresetOf;
    /** The authored agent owning a bound combined preset, when one is. */
    private ownerOfBoundPreset;
}
/** The sessions-snapshot slice {@link agentSessionsOf} reads. */
export interface SessionsOwnershipSnapshot {
    byId: Record<string, {
        updatedAt: number;
        origin?: 'subagent';
        blank?: boolean;
    }>;
    projectionsBySession: Readonly<Record<string, {
        values: Readonly<Record<string, unknown>>;
    }>>;
}
/**
 * One agent's own chats from a session-list snapshot: sessions whose recorded
 * ownership is the agent's (its combined presets included) — nothing else —
 * so every agent's history is exclusive to it. Ownership reads the host-side
 * `agentOwner` projection — one exact key — with the combined-id prefix as
 * the fallback for sessions whose projection row predates the key (a cold
 * session not yet re-folded). Archived sessions are excluded unless the
 * archive filter admits them; pinned sessions lead the list (the registry
 * global pin set), the rest read newest first by the session's last-activity
 * time. Subagent children are hidden, matching the workspace tree.
 * @param state - the sessions snapshot.
 * @param selected - the agent id.
 * @param archived - the registry-global archive set.
 * @param pinned - the registry-global pinned set.
 * @param archivedFilter - which side of the archive set the list shows.
 * @returns the agent's session rows, pinned first, then newest first.
 */
export declare function agentSessionsOf(state: SessionsOwnershipSnapshot, selected: string, archived: ReadonlySet<string>, pinned: ReadonlySet<string>, archivedFilter?: 'default' | 'show' | 'only'): AgentSessionEntry[];
/**
 * Every session id owned by one agent, with no list filters: blanks,
 * archived, and pinned rows alike — the agent-delete purge enumerates the
 * agent's whole local footprint. Ownership reads the same projection as
 * {@link agentSessionsOf}.
 * @param state - the sessions snapshot.
 * @param agentId - the agent id.
 * @returns the owned session ids, list order.
 */
export declare function ownedSessionIds(state: SessionsOwnershipSnapshot, agentId: string): string[];
//# sourceMappingURL=stores.d.ts.map