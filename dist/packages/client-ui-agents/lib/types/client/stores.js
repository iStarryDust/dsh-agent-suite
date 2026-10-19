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
import { createSnapshotStore, } from '@deepseek-ai/dsh-client-store';
const INITIAL = {
    status: 'idle', error: null, agents: [], bases: [], selected: '', view: 'roster',
    profile: null, busy: false, collapsed: false, memoryText: '', memoryState: 'idle',
};
/**
 * A combined preset id ends with the mode id: `<agentId>-<modeId>`. The mode
 * id is a shipped mode (`standard` / `ptc` / `minimal` / `cordis`) or a
 * per-agent `env-…` environment composition, so the environment combos never
 * read as regular roster agents. The spellings match the authoring service's
 * combined split.
 */
const COMBINED_PRESET_RE = /-(standard|ptc|minimal|cordis|env-[a-z0-9-]+)$/;
/** The mode id a combined preset id carries, when it is one. */
function modeIdOf(combinedId) {
    return COMBINED_PRESET_RE.exec(combinedId)?.[1];
}
/** Present one failure off a Remote result or thrown error. */
function failureOf(error) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
        return String(error.message);
    }
    return String(error);
}
/** Present one roster row as a view entry. */
function entryOf(preset) {
    return {
        id: preset.id,
        name: preset.name ?? preset.id,
        ...preset.description === undefined ? {} : { description: preset.description },
    };
}
/**
 * Owns the agent browser's state and its wire calls.
 */
export class AgentBrowserController {
    ctx;
    sessions;
    launch;
    /** Snapshot the renderer subscribes to. */
    store = createSnapshotStore(INITIAL);
    /** The agent a chat-start is about to open for (the hero's mode pick maps to it). */
    pending;
    /** Disposer of the active conversation shadow, absent while not shadowing. */
    shadowDisposer;
    /** The conversation shadow factory, bound once the slot declaration is up. */
    shadowFactory;
    constructor(ctx, sessions, launch) {
        this.ctx = ctx;
        this.sessions = sessions;
        this.launch = launch;
    }
    /**
     * Resolved once this suite's Remote namespaces finished mounting; assigned
     * by the plugin body before any load can run. Roster reads wait on it so a
     * cold boot never races the asynchronous `$mount`.
     */
    whenRemoteReady = Promise.resolve();
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
    namespace(name) {
        const namespace = this.ctx.get(`remote.${name}`);
        if (namespace === undefined) {
            throw new Error(`ui-agents: Remote namespace "${name}" is not mounted yet`);
        }
        return namespace;
    }
    /** The authored-identity Remote namespace (roster, compositions, deletion). */
    get agentPresetAuthoring() {
        return this.namespace('agentPresetAuthoring');
    }
    /** The preset registry namespace (session binding). */
    get agentPresets() {
        return this.namespace('agentPresets');
    }
    /** The memory namespace (per-agent stores). */
    get agentMemory() {
        return this.namespace('agentMemory');
    }
    /** Tear down the conversation gate. */
    dispose() {
        this.shadowDisposer?.();
        this.shadowDisposer = undefined;
        this.shadowFactory = undefined;
    }
    /**
     * Subscribe to session-catalog changes; returns the disposer. The hero
     * seat tracks its session's live binding through this.
     */
    subscribeCatalog(listener) {
        return this.sessions.list.subscribe(listener);
    }
    set(patch) {
        this.store.set({ ...this.store.getSnapshot(), ...patch });
        this.updateConversationShadow();
    }
    /**
     * Bind the conversation-region gate: `factory` creates one shadow occupant
     * for the `main.conversation` slot and returns its disposer. Called once
     * the slot declaration is on the ledger; the gate then tracks the view.
     * @param factory - creates the shadow occupant for the conversation region.
     */
    bindConversationShadow(factory) {
        this.shadowFactory = factory;
        this.updateConversationShadow();
    }
    /** Reconcile the conversation shadow with the current view. */
    updateConversationShadow() {
        const factory = this.shadowFactory;
        if (factory === undefined)
            return;
        const view = this.store.getSnapshot().view;
        // Every view except the agent page is browser chrome (roster, forms, the
        // memory editor): the main region reads as the bare brand hero there, and
        // the hero's working parts return only on the agent page, where a mode
        // pick and a first message start a chat.
        const want = view !== 'agent';
        if (want && this.shadowDisposer === undefined) {
            this.shadowDisposer = factory();
        }
        else if (!want && this.shadowDisposer !== undefined) {
            this.shadowDisposer();
            this.shadowDisposer = undefined;
        }
    }
    /** The agent a pending chat-start belongs to, for the hero's mode pick. */
    pendingAgent() {
        return this.pending;
    }
    /** Clear the pending chat context once the session has bound its preset. */
    consumePendingAgent() {
        this.pending = undefined;
    }
    /** Map a combined preset id back to its mode id, when it is one. */
    modeIdFor(combinedId) {
        // `split('-').pop()` breaks for the multi-segment `env-<slug>` mode id
        // (it would return `<slug>`), so the mode id is captured as one token.
        return modeIdOf(combinedId);
    }
    /**
     * The projection values one session carries, read straight off the catalog
     * snapshot (the hero chip's binding display and ownership derivation).
     * @param sessionId - the session to inspect.
     * @returns the projection values, or undefined when absent.
     */
    sessionProjectionsOf(sessionId) {
        return this.sessions.list.getSnapshot().projectionsBySession[sessionId]?.values;
    }
    /**
     * Resolve once the roster has loaded, so the hero chip's first render sees
     * the shipped modes rather than an empty option list.
     */
    async ready() {
        if (this.store.getSnapshot().status === 'idle')
            await this.load();
    }
    /**
     * Load the roster: the user's agents plus the chat-time mode options.
     * @returns once the snapshot reflects the host.
     */
    async load() {
        const before = this.store.getSnapshot();
        if (before.status === 'loading')
            return;
        this.set({ status: 'loading', error: null });
        try {
            // The suite's own namespaces mount asynchronously at apply time; a
            // cold-boot load may otherwise reach them before `$mount` lands.
            await this.whenRemoteReady;
            const [roster, system] = await Promise.all([
                this.agentPresetAuthoring.list(),
                this.agentPresets.list(),
            ]);
            if (!roster.ok) {
                this.set({ status: 'error', error: roster.error.message });
                return;
            }
            if (!system.ok) {
                this.set({ status: 'error', error: system.error.message });
                return;
            }
            const agents = roster.value.presets
                .filter(preset => preset.modeId === undefined && preset.broken === undefined)
                .map(entryOf);
            // The chat-time mode options are the SHIPPED presets only: every id the
            // authoring roster knows (agents and their combined compositions) is an
            // authored identity, so it never reads as a base mode.
            const authoredIds = new Set(roster.value.presets.map(preset => preset.id));
            const bases = system.value.presets
                .filter(preset => preset.broken === undefined && !authoredIds.has(preset.id))
                .map(entryOf);
            const snapshot = this.store.getSnapshot();
            const selectionGone = snapshot.selected !== '' && !agents.some(agent => agent.id === snapshot.selected);
            this.set({
                status: 'ready',
                error: null,
                agents,
                bases,
                selected: selectionGone ? '' : snapshot.selected,
                view: selectionGone && snapshot.view === 'agent' ? 'roster' : snapshot.view,
            });
        }
        catch (error) {
            this.set({ status: 'error', error: failureOf(error) });
        }
    }
    /** Toggle the roster list's collapsed state. */
    toggleCollapsed() {
        this.set({ collapsed: !this.store.getSnapshot().collapsed });
    }
    /** Leave a form surface: edit returns to the agent page, create to the roster. */
    back() {
        const view = this.store.getSnapshot().view;
        this.set({ view: view === 'edit' ? 'agent' : 'roster' });
    }
    /** Open one agent's page: chat history on the left, the agent's most recent chat (when one exists) on the right. */
    selectAgent(id) {
        this.set({ view: 'agent', selected: id, profile: null, error: null });
        const session = this.agentSessions()[0];
        if (session !== undefined)
            this.launch.openSession(session.id);
    }
    /**
     * The selected agent's chat history — the one shared ownership read (the
     * roster rows and the auto-opened latest chat both go through
     * {@link agentSessionsOf}).
     */
    agentSessions() {
        const selected = this.store.getSnapshot().selected;
        if (selected === '')
            return [];
        return agentSessionsOf(this.sessions.list.getSnapshot(), selected, new Set(this.sessions.archived.getSnapshot()), new Set(this.sessions.pinned.getSnapshot()));
    }
    /** Open one chat from the agent's history. */
    openSession(sessionId) {
        this.launch.openSession(sessionId);
    }
    /** Open the create form (only reachable from the roster page). */
    openCreate() {
        this.set({ view: 'create', profile: null, error: null });
    }
    /**
     * Open one agent's profile panel, prefilled from the host. The view stays
     * on the agent page — profile editing is a main-area panel now, and moving
     * the view would flip the brand back to the roster look and swap the
     * sidebar's chat history away.
     * @param id - the agent to edit.
     */
    async openProfile(id) {
        this.set({ selected: id, profile: null, error: null });
        const document = await this.agentPresetAuthoring.read(id);
        if (!document.ok) {
            this.set({ error: document.error.message });
            return;
        }
        this.set({ profile: {
                name: document.value.name,
                language: document.value.language,
                description: document.value.description,
                persona: document.value.persona,
            } });
    }
    /**
     * Open one agent's memory panel, prefilled from the store. Like
     * {@link openProfile}, the view stays on the agent page.
     * @param id - the agent whose memory to edit.
     */
    async openMemory(id) {
        this.set({ selected: id, memoryText: '', memoryState: 'idle', error: null });
        const text = await this.agentMemory.readAgent(id);
        if (!text.ok) {
            this.set({ error: text.error.message });
            return;
        }
        this.set({ memoryText: text.value, memoryState: 'idle' });
    }
    /** Update the memory editor draft. */
    setMemoryText(text) {
        this.set({ memoryText: text, memoryState: 'idle' });
    }
    /**
     * Save the memory editor draft to this agent's store.
     * @returns the failure message, or undefined on success.
     */
    async saveMemory() {
        const { selected, memoryText } = this.store.getSnapshot();
        if (selected === '')
            return 'no-selected-agent';
        this.set({ busy: true, memoryState: 'saving', error: null });
        const written = await this.agentMemory.writeAgent(selected, memoryText);
        if (!written.ok) {
            const message = written.error.message;
            this.set({ busy: false, memoryState: 'failed', error: message });
            return message;
        }
        this.set({ busy: false, memoryState: 'saved' });
        return undefined;
    }
    /** Return from the memory editor to the agent page. */
    backFromMemory() {
        this.set({ view: 'agent', memoryState: 'idle' });
    }
    /**
     * Create an agent (identity only — no base mode) and open its page.
     * @param input - the form fields.
     * @returns the failure message, or undefined on success.
     */
    async create(input) {
        const name = input.name.trim();
        if (name === '')
            return 'empty-name';
        const id = deriveId(name);
        this.set({ busy: true, error: null });
        // A draft left pointing at a deleted preset breaks the official session
        // creation this create is about to trigger; heal it first.
        await this.healDeadDrafts();
        const created = await this.agentPresetAuthoring.create({
            from: 'minimal',
            agentPreset: id,
            name, language: input.language, persona: input.persona, description: input.description,
        });
        if (!created.ok) {
            const message = created.error.message;
            this.set({ busy: false, error: message });
            return message;
        }
        await this.load();
        this.set({ busy: false, view: 'agent', selected: id });
        // The agent exists even when the first chat could not be composed; the
        // failure is reported on the agent page instead of rolling back the create.
        const chatFailure = await this.startChat(id);
        if (chatFailure !== undefined)
            return chatFailure;
        return undefined;
    }
    /**
     * Save a profile edit, propagating the identity to the agent's combined
     * presets, and return to the agent page.
     * @param id - the agent to update.
     * @param input - the form fields.
     * @returns the failure message, or undefined on success.
     */
    async saveEdit(id, input) {
        this.set({ busy: true, error: null });
        const updated = await this.agentPresetAuthoring.update({
            agentPreset: id,
            name: input.name, language: input.language, persona: input.persona, description: input.description,
        });
        if (!updated.ok) {
            const message = updated.error.message;
            this.set({ busy: false, error: message });
            return message;
        }
        // Propagate the identity to every existing combined preset.
        const roster = await this.agentPresetAuthoring.list();
        if (roster.ok) {
            for (const preset of roster.value.presets) {
                if (preset.agentId !== id)
                    continue;
                await this.agentPresetAuthoring.update({
                    agentPreset: preset.id,
                    name: input.name, language: input.language, persona: input.persona, description: input.description,
                });
            }
        }
        await this.load();
        this.set({ busy: false, view: 'agent', selected: id, error: null });
        return undefined;
    }
    /**
     * Rebind every blank session whose bound preset no longer exists back to
     * the deployment default. A blank left pointing at a deleted combined
     * preset breaks the official session-creation flow (it composes the
     * stored preset before reusing the blank), so the heal runs before any
     * new chat launch.
     */
    async healDeadDrafts() {
        const roster = await this.agentPresets.list();
        if (!roster.ok)
            return;
        const known = new Set(roster.value.presets.map(preset => preset.id));
        const state = this.sessions.list.getSnapshot();
        for (const [sessionId, summary] of Object.entries(state.byId)) {
            if (summary.blank !== true)
                continue;
            const values = state.projectionsBySession[sessionId]?.values;
            const preset = typeof values?.agentPreset === 'string' ? values.agentPreset : undefined;
            if (preset === undefined || known.has(preset))
                continue;
            try {
                await this.agentPresets.select(sessionId, 'standard');
            }
            catch (error) {
                console.warn(`heal: dead-preset draft "${sessionId}" was not rebound:`, error);
            }
        }
    }
    /**
     * Delete an agent with its whole local footprint: its combined presets,
     * its chat sessions (each through the durable delete; a running session is
     * skipped and logged), and its long-term memory store — then return to the
     * roster.
     * @param id - the agent to remove.
     * @returns the failure message, or undefined on success.
     */
    async remove(id) {
        this.set({ busy: true, error: null });
        const roster = await this.agentPresetAuthoring.list();
        // Unbind BEFORE deleting the presets: a session that refuses deletion
        // must not keep pointing at a preset about to vanish, or the official
        // flow breaks the next time it reuses that blank.
        const owned = ownedSessionIds(this.sessions.list.getSnapshot(), id);
        for (const sessionId of owned) {
            try {
                await this.agentPresets.select(sessionId, 'standard');
            }
            catch (error) {
                console.warn(`agent "${id}": chat "${sessionId}" was not unbound:`, error);
            }
        }
        if (roster.ok) {
            // Combined modes first: each deletes its own nested directory.
            for (const preset of roster.value.presets) {
                if (preset.agentId !== id || preset.id === id)
                    continue;
                const removed = await this.agentPresetAuthoring.delete({ agentPreset: preset.id });
                if (!removed.ok) {
                    const message = removed.error.message;
                    this.set({ busy: false, error: message });
                    return message;
                }
            }
        }
        const removed = await this.agentPresetAuthoring.delete({ agentPreset: id });
        if (!removed.ok) {
            const message = removed.error.message;
            this.set({ busy: false, error: message });
            return message;
        }
        for (const sessionId of owned) {
            try {
                const failure = await this.removeSession(sessionId);
                if (failure !== undefined)
                    console.warn(`agent "${id}": chat "${sessionId}" was not deleted: ${failure}`);
            }
            catch (error) {
                console.warn(`agent "${id}": chat "${sessionId}" was not deleted:`, error);
            }
        }
        try {
            const purged = await this.agentMemory.purgeAgent(id);
            if (!purged.ok)
                console.warn(`agent "${id}": memory purge refused:`, purged.error.message);
        }
        catch (error) {
            console.warn(`agent "${id}": memory purge failed:`, error);
        }
        await this.load();
        this.set({ busy: false, view: 'roster', selected: '', error: null });
        return undefined;
    }
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
    async startChat(id) {
        this.pending = id;
        await this.healDeadDrafts();
        const composed = await this.ensureCombined(id, 'standard');
        if (composed === undefined) {
            this.pending = undefined;
            this.set({ error: 'chat.startFailed', busy: false });
            return 'chat.startFailed';
        }
        this.launch.launchWithPreset(composed);
        return undefined;
    }
    /**
     * Ensure the combined preset for the pending agent + mode exists.
     * The hero chip stages and applies it; this only makes it available.
     * @param modeId - the mode the user picked.
     * @returns the combined preset id, or undefined when composition fails.
     */
    async composeForPendingAgent(modeId) {
        const agentId = this.pending;
        if (agentId === undefined)
            return undefined;
        return await this.ensureCombined(agentId, modeId);
    }
    /**
     * Ensure the combined preset for one agent + mode exists — the same path a
     * pending chat start takes, exposed so a later mode pick on a blank
     * agent-owned session re-composes for the SAME agent.
     * @param agentId - the agent whose chat the composition belongs to.
     * @param modeId - the mode the user picked.
     * @returns the combined preset id, or undefined when composition fails.
     */
    async composeForAgent(agentId, modeId) {
        return await this.ensureCombined(agentId, modeId);
    }
    /**
     * Ensure the combined preset `<agentId>-<modeId>` exists: a deterministic
     * copy of the mode's composition with the agent's persona folded in.
     * @param agentId - the agent preset id.
     * @param modeId - the mode preset id (standard / ptc / minimal / cordis).
     * @returns the combined preset id, or undefined when it cannot be composed.
     */
    async ensureCombined(agentId, modeId) {
        const comboId = `${agentId}-${modeId}`;
        const roster = await this.agentPresetAuthoring.list();
        if (roster.ok && roster.value.presets.some(preset => preset.id === comboId)) {
            return comboId;
        }
        const read = await this.agentPresetAuthoring.read(agentId);
        if (!read.ok)
            return undefined;
        const modeName = this.store.getSnapshot().bases.find(base => base.id === modeId)?.name ?? modeId;
        const created = await this.agentPresetAuthoring.create({
            from: modeId,
            agentPreset: comboId,
            name: `${read.value.name}（${modeName}）`,
            language: read.value.language,
            persona: read.value.persona,
            description: read.value.description,
        });
        return created.ok ? comboId : undefined;
    }
    /** Rename one chat's durable title. */
    async renameSession(sessionId, title) {
        await this.sessions.rename(sessionId, title);
    }
    /** Archive one chat. */
    async archiveSession(sessionId) {
        await this.sessions.archive(sessionId);
    }
    /**
     * Delete one chat durably through the authoring service's own deletion
     * remote: the session log, its projection cache row, and its workspace
     * accounting go together. The removal event folds into every client's
     * catalog through the official session-controller relay.
     * @param sessionId - the session to delete.
     * @returns a user-facing failure key or message, or undefined on success.
     */
    async removeSession(sessionId) {
        const removed = await this.agentPresetAuthoring.deleteSession(sessionId);
        if (removed.ok)
            return undefined;
        return removed.error.code === 'agent-preset-authoring/session-busy'
            ? 'chat.deleteBusy'
            : removed.error.message;
    }
}
/**
 * The hero mode chip's controller: the shipped modes as options, the current
 * session's binding, Define-mode palette state, and the pick/apply path.
 * Mode picks ride the browser controller's composition machinery, so every
 * pick behaves identically to a chat start.
 */
export class HeroSeatController {
    browser;
    modeText;
    /** Seat snapshot the renderer subscribes to. */
    store = createSnapshotStore({
        options: [], current: '', busy: false,
    });
    /** Define-dialog snapshot the renderer subscribes to. */
    define = createSnapshotStore({
        groups: [], loaded: false, error: null, busy: false,
    });
    /** The session the seat mirrors; its binding is re-read on catalog changes. */
    seatSessionId;
    /** Disposer of the catalog subscription, present while a session is mirrored. */
    catalogUnsubscribe;
    constructor(browser, 
    /** Localize one shipped preset id (the official preset display dictionary). */
    modeText) {
        this.browser = browser;
        this.modeText = modeText;
    }
    /** Release the catalog subscription. */
    dispose() {
        this.catalogUnsubscribe?.();
        this.catalogUnsubscribe = undefined;
        this.seatSessionId = undefined;
    }
    /**
     * Reflect the offered modes and the current session's binding. The binding
     * is re-read whenever the session catalog changes: a freshly started chat
     * binds its preset asynchronously (the launch selects the composition after
     * the blank session turns current), so the one-shot read at mount races
     * that bind and would leave the chip's label empty on the slow path.
     */
    async load(sessionId) {
        await this.browser.ready();
        this.trackSession(sessionId);
        this.store.set({
            ...this.store.getSnapshot(),
            options: this.browser.store.getSnapshot().bases.map(mode => ({
                id: mode.id,
                ...this.modeText(mode.id),
            })),
        });
        this.reflectBinding(sessionId);
    }
    /** Mirror one session; the catalog subscription keeps the binding live. */
    trackSession(sessionId) {
        this.seatSessionId = sessionId;
        if (this.catalogUnsubscribe === undefined && sessionId !== undefined) {
            this.catalogUnsubscribe = this.browser.subscribeCatalog(() => {
                this.reflectBinding(this.seatSessionId);
            });
        }
    }
    /** Re-derive the chip's current mode from the session's live binding. */
    reflectBinding(sessionId) {
        const bound = sessionId === undefined ? '' : this.boundPresetOf(sessionId);
        // A combined preset strips to its mode for display; a bare shipped mode
        // is itself an option id and stays as-is.
        const current = bound === '' ? '' : this.browser.modeIdFor(bound) ?? bound;
        if (this.store.getSnapshot().current === current)
            return;
        this.store.set({ ...this.store.getSnapshot(), current });
    }
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
    async select(sessionId, id) {
        const owner = this.browser.pendingAgent()
            ?? this.ownerOfBoundPreset(this.boundPresetOf(sessionId));
        this.store.set({ ...this.store.getSnapshot(), busy: true });
        try {
            let target = id;
            if (owner !== undefined && modeIdOf(id) === undefined) {
                const composed = this.browser.pendingAgent() !== undefined
                    ? await this.browser.composeForPendingAgent(id)
                    : await this.browser.composeForAgent(owner, id);
                this.browser.consumePendingAgent();
                // A refused composition is surfaced, never swallowed: binding the bare
                // mode id instead would move the chat out of its agent's history.
                if (composed === undefined)
                    return 'chat.startFailed';
                target = composed;
            }
            this.browser.consumePendingAgent();
            const result = await this.agentPresets.select(sessionId, target);
            if (!result.ok)
                return result.error.message;
            this.store.set({
                ...this.store.getSnapshot(),
                current: this.browser.modeIdFor(target) ?? target,
            });
            return undefined;
        }
        finally {
            this.store.set({ ...this.store.getSnapshot(), busy: false });
        }
    }
    /**
     * The agent a Define composition builds for: the pending chat's agent, or
     * the one owning the current session's bound combined preset.
     * @param sessionId - the current session, when one is current.
     * @returns the agent id, or an empty string for a plain session.
     */
    defineTarget(sessionId) {
        return this.browser.pendingAgent()
            ?? this.ownerOfBoundPreset(sessionId === undefined ? '' : this.boundPresetOf(sessionId))
            ?? '';
    }
    /** Load the capability palette once per controller lifetime. */
    async loadDefine() {
        const before = this.define.getSnapshot();
        if (before.loaded || before.busy)
            return;
        this.define.set({ ...before, busy: true, error: null });
        const groups = await this.browser.agentPresetAuthoring.environmentGroups();
        if (!groups.ok) {
            this.define.set({ ...this.define.getSnapshot(), busy: false, error: groups.error.message });
            return;
        }
        this.define.set({ groups: groups.value.groups, loaded: true, busy: false, error: null });
    }
    /** Infer a capability selection from a task description. */
    async suggestDefine(description) {
        const suggested = await this.browser.agentPresetAuthoring.suggestEnvironment({ description });
        return suggested.ok ? suggested.value.groups : [];
    }
    /** Compose one agent's environment and return its combined id, or ''. */
    async composeDefine(agentPreset, groups) {
        this.define.set({ ...this.define.getSnapshot(), busy: true, error: null });
        const composed = await this.browser.agentPresetAuthoring.composeEnvironment({
            agentPreset,
            groups,
        });
        this.define.set({ ...this.define.getSnapshot(), busy: false });
        if (!composed.ok) {
            this.define.set({ ...this.define.getSnapshot(), error: composed.error.message });
            return '';
        }
        this.browser.consumePendingAgent();
        return composed.value.agentPreset;
    }
    /** The preset registry namespace (session binding), via the browser's soft lookup. */
    get agentPresets() {
        return this.browser.agentPresets;
    }
    /** The preset id bound to a session, read off its projection values. */
    boundPresetOf(sessionId) {
        const values = this.browser.sessionProjectionsOf(sessionId);
        return typeof values?.agentPreset === 'string' ? values.agentPreset : '';
    }
    /** The authored agent owning a bound combined preset, when one is. */
    ownerOfBoundPreset(preset) {
        const modeId = this.browser.modeIdFor(preset);
        return modeId === undefined ? undefined : preset.slice(0, preset.length - modeId.length - 1);
    }
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
export function agentSessionsOf(state, selected, archived, pinned, archivedFilter = 'default') {
    const rows = [];
    for (const [id, summary] of Object.entries(state.byId)) {
        if (summary.origin === 'subagent')
            continue;
        const isArchived = archived.has(id);
        if (archivedFilter === 'default' ? isArchived : archivedFilter === 'only' ? !isArchived : false)
            continue;
        const values = state.projectionsBySession[id]?.values;
        const owner = typeof values?.agentOwner === 'string' ? values.agentOwner : undefined;
        const preset = typeof values?.agentPreset === 'string' ? values.agentPreset : undefined;
        const owned = owner === selected
            || (owner === undefined && (preset === selected || (preset?.startsWith(`${selected}-`) ?? false)));
        if (!owned)
            continue;
        const title = typeof values?.title === 'string' ? values.title : undefined;
        const modeId = typeof preset === 'string' ? modeIdOf(preset) : undefined;
        rows.push({
            id,
            title: title ?? id,
            current: false,
            updatedAt: summary.updatedAt,
            blank: summary.blank === true,
            ...modeId === undefined ? {} : { modeId },
        });
    }
    rows.sort((left, right) => {
        const pinOrder = Number(pinned.has(right.id)) - Number(pinned.has(left.id));
        return pinOrder !== 0 ? pinOrder : right.updatedAt - left.updatedAt;
    });
    return rows;
}
/**
 * Every session id owned by one agent, with no list filters: blanks,
 * archived, and pinned rows alike — the agent-delete purge enumerates the
 * agent's whole local footprint. Ownership reads the same projection as
 * {@link agentSessionsOf}.
 * @param state - the sessions snapshot.
 * @param agentId - the agent id.
 * @returns the owned session ids, list order.
 */
export function ownedSessionIds(state, agentId) {
    const ids = [];
    for (const [id, summary] of Object.entries(state.byId)) {
        if (summary.origin === 'subagent')
            continue;
        const values = state.projectionsBySession[id]?.values;
        const owner = typeof values?.agentOwner === 'string' ? values.agentOwner : undefined;
        const preset = typeof values?.agentPreset === 'string' ? values.agentPreset : undefined;
        const owned = owner === agentId
            || (owner === undefined && (preset === agentId || (preset?.startsWith(`${agentId}-`) ?? false)));
        if (owned)
            ids.push(id);
    }
    return ids;
}
/**
 * Derive a stable preset id from a display name: lowercased, spaces and
 * punctuation to dashes, non-id characters dropped, with a timestamp suffix so
 * recreating a same-named agent never collides with its predecessor.
 * @param name - the display name.
 * @returns an id matching PRESET_ID (`^[a-z0-9][a-z0-9-]*$`).
 */
function deriveId(name) {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const core = base.length > 0 ? base : 'agent';
    return `${core.slice(0, 32)}-${Date.now().toString(36)}`;
}
//# sourceMappingURL=stores.js.map