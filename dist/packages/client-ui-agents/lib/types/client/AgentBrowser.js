import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * The sidebar's agent browsing region, three surfaces:
 *
 * - roster — the default page: the primary create control over a collapsible
 *   "My Agents" list, with the bare brand hero on the right.
 * - agent — inside one agent: its name and actions (new chat / profile /
 *   memory) above its chat history (sessions composed onto that agent), with
 *   the real conversation on the right.
 * - create / edit — the identity forms.
 *
 * Registered into the shell's `sidebar.workspaces` hole at a lower priority
 * than the workspace browser, so the agent surface shadows it.
 */
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Button, FISH_LOGO_PATH, FISH_LOGO_VIEWBOX, FishLogo, Menu, Modal, Tooltip, relativeTime, IconArchiveCheckOutlineRegular, IconArchiveOffOutlineRegular, IconArchiveOutlineRegular, IconBranchOutlineRegular, IconChevronsUpDownOutlineRegular, IconClockOutlineRegular, IconCloseFillRegular, IconDatabaseOutlineRegular, IconEditOutlineRegular, IconChevronLeftOutlineRegular, IconEllipsisOutlineMedium, IconFlatListOutlineRegular, IconFolderCloseRegular, IconFolderOpenRegular, IconNewChatOutlineMedium, IconPinFillRegular, IconPinOutlineRegular, IconPlusOutlineRegular, IconProjectAddOutlineRegular, IconQueueOutlineRegular, IconSearchOutlineRegular, IconSlidersTwoOutlineRegular, IconTrashOutlineRegular, IconTriangleRightFillRegular, } from '@deepseek-ai/dsh-client-ui-primitives';
import { AgentForm } from "./AgentForm.js";
import { agentSessionsOf } from "./stores.js";
import { accountKeyOf, reconcileManualOrder, sessionDragOrder, } from "./view.js";
import formCss from './AgentForm.module.css';
import css from './AgentBrowser.module.css';
/** One list row's class pair, so the row can stay a single element. */
function rowClass(active) {
    return clsx(css.row, active && css.active);
}
/**
 * Accept the native drag at document level while a row drag is active: the
 * hovered row still owns the insertion marker, and releasing outside the list
 * must not render as a rejected drop before dragend commits that last marker.
 */
function useNativeDragAcceptance(active) {
    useEffect(() => {
        if (!active)
            return;
        const acceptDrag = (event) => {
            event.preventDefault();
            if (event.dataTransfer !== null)
                event.dataTransfer.dropEffect = 'move';
        };
        const acceptDrop = (event) => { event.preventDefault(); };
        document.addEventListener('dragover', acceptDrag);
        document.addEventListener('drop', acceptDrop);
        return () => {
            document.removeEventListener('dragover', acceptDrag);
            document.removeEventListener('drop', acceptDrop);
        };
    }, [active]);
}
/** Pointer-position half of a row (insert line above or below). */
function rowHalf(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
}
/** Localized compact row time ("刚刚"/"5分钟" in zh), the official row metric. */
function chatTimeLabel(updatedAt, now, t) {
    const { unit, n } = relativeTime(updatedAt, now);
    return unit === 'now' ? t('chat.time.now') : t(`chat.time.${unit}`, { n });
}
/**
 * Read the running harness version the host half publishes through the
 * index-injection global (see the host entry): the official badge inlines
 * the version at web-build time, which a client plugin cannot reach.
 * @returns the formatted version, or undefined when the host wrote none.
 */
function localBuildVersionOf() {
    try {
        const value = globalThis.__DSH_BRAND_VERSION__;
        return typeof value === 'string' && value !== '' ? value : undefined;
    }
    catch {
        return undefined;
    }
}
/**
 * The official brand whale, re-rendered from the shared primitives path.
 * @param props - square edge and an optional class hook.
 * @returns the whale svg element.
 */
function BrandWhale({ size, className }) {
    return (_jsx("svg", { className: className, width: size, height: size * FISH_LOGO_VIEWBOX.height / FISH_LOGO_VIEWBOX.width, viewBox: `0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`, fill: "none", "aria-hidden": "true", children: _jsx("path", { d: FISH_LOGO_PATH, fill: "currentColor" }) }));
}
/**
 * Position flags for one brand-mark mount. `data-rail` selects whale over
 * chevron inside the collapsed rail's toggle; `data-dsh-brand` arms the
 * stylesheet rule that hides the enclosing New Session tooltip while the
 * repurposed brand content is hovered — the toggle's own tooltip must
 * survive, so the flag is stripped on toggle mounts.
 * @param node - the mounted brand wrapper, or null on detach.
 */
function brandSiteRef(node) {
    if (node === null)
        return;
    const host = node.closest('button');
    const inToggle = host !== null && /toggle/i.test(host.className);
    node.dataset.rail = inToggle ? 'true' : 'false';
    if (inToggle)
        delete node.dataset.dshBrand;
    else
        node.dataset.dshBrand = '1';
}
/**
 * Whether a click inside a brand mount should be swallowed: on the
 * expanded brand yes (the wrapper button would otherwise start a session),
 * inside the collapsed rail's toggle never (the click must still expand).
 * @param event - the React mouse event on a brand mount.
 */
function swallowBrandClick(event) {
    const host = event.currentTarget.closest('button');
    if (host === null || !/toggle/i.test(host.className))
        event.stopPropagation();
}
/**
 * The `sidebar.brand.mark` occupant: on an agent's surface the whale gives
 * way to the small back control (whose click is stopped from reaching the
 * brand button underneath, which starts a session). The collapsed rail's
 * toggle reuses this same slot for its resting whale, and there the chevron
 * would read as a back control while the button expands — so the occupant
 * mounts both marks and the mount-site ref picks per site: inside the
 * toggle button the whale shows, in the expanded brand the chevron shows.
 * Everywhere off the agent surface it renders the official FishLogo — the
 * exact component the owner's fallback uses — behind the site ref and the
 * click swallow: the brand row is decorative now (the suite's own panel rows
 * own session creation), so the button's official New Session action never
 * fires, and the data-dsh-brand flag the ref arms suppresses its hover
 * tooltip (except inside the collapsed rail's toggle, where the ref strips
 * the flag so the toggle's own tooltip and expand action survive).
 * @param props - brand-mark geometry, the agents store hook, and back.
 * @returns the whale/back mark element.
 */
export function AgentBrandMark({ size, useAgents, back, t }) {
    const state = useAgents(snapshot => snapshot);
    if (state.view !== 'agent' || state.selected === '') {
        return (_jsx("span", { className: css.brandSwap, ref: brandSiteRef, onClick: swallowBrandClick, children: _jsx(FishLogo, { size: size }) }));
    }
    return (_jsxs("span", { className: css.brandSwap, ref: brandSiteRef, onClick: swallowBrandClick, children: [_jsx(BrandWhale, { size: size, className: css.brandRailWhale }), _jsx("span", { className: css.brandBack, role: "button", title: t('agents.back'), onClick: (event) => {
                    event.stopPropagation();
                    back();
                }, children: _jsx(IconChevronLeftOutlineRegular, { size: 18 }) })] }));
}
/**
 * The `sidebar.brand.name` occupant: an agent's surface names the agent,
 * the roster re-renders the official local-build badge (title plus version
 * when the build metadata is reachable) flagged data-dsh-brand so the
 * enclosing button's New Session hover tooltip is suppressed, with the click
 * swallowed so the brand row stays decorative.
 * @param props - the agents store hook and the sidebar locale seat.
 * @returns the brand-name content.
 */
export function AgentBrandName({ useAgents, brandText }) {
    const state = useAgents(snapshot => snapshot);
    if (state.view === 'agent' && state.selected !== '') {
        const name = state.agents.find(agent => agent.id === state.selected)?.name ?? state.selected;
        return (_jsx("span", { className: css.brandAgentName, "data-dsh-brand": "1", title: name, onClick: swallowBrandClick, children: name }));
    }
    const version = localBuildVersionOf();
    // Off the agent surface the occupant renders the official badge content.
    // The data-dsh-brand flag suppresses the enclosing button's New Session
    // hover tooltip, and the click swallow turns the brand row decorative —
    // session creation belongs to the suite's own panel rows.
    if (version === undefined) {
        return (_jsx("span", { className: css.brandFallbackName, "data-dsh-brand": "1", onClick: swallowBrandClick, children: brandText('brand.localBuild') }));
    }
    return (_jsxs("span", { className: css.brandStack, "data-dsh-brand": "1", onClick: swallowBrandClick, children: [_jsx("span", { className: css.brandStackTitle, children: brandText('brand.localBuild') }), _jsx("span", { className: css.brandStackVersion, children: version })] }));
}
/**
/**
 * Marks one of the suite's panel rows: a `data-agents-panel` attribute the
 * row-swap CSS and the nav click handler key on. Marks ride a transparent
 * wrapper (`display: contents`) because the icon components are shared
 * primitives — the mark must not leak to unrelated usages, and the wrapper
 * stays invisible to flex layout.
 * @param props - the row identity and the glyph to wrap.
 * @returns the marked glyph wrapper.
 */
function PanelGlyph({ panel, children }) {
    return (_jsx("span", { "data-agents-panel": panel, style: { display: 'contents' }, children: children }));
}
/**
 * Render the create-agent glyph at the size the sidebar asks for.
 * @param props - the sidebar's icon share: the requested square edge.
 * @returns the icon element.
 */
export function CreateAgentPanelIcon({ size }) {
    return (_jsx(PanelGlyph, { panel: "create", children: _jsx(IconPlusOutlineRegular, { size: size }) }));
}
/**
 * Nav glyphs for the per-agent action rows (new chat / profile / memory):
 * the same icons their former sidebar-surface buttons carried.
 * @param props - the sidebar's icon share: the requested square edge.
 * @returns the icon element.
 */
export function NewChatPanelIcon({ size }) {
    return (_jsx(PanelGlyph, { panel: "newchat", children: _jsx(IconNewChatOutlineMedium, { size: size }) }));
}
export function ProfilePanelIcon({ size }) {
    return (_jsx(PanelGlyph, { panel: "profile", children: _jsx(IconEditOutlineRegular, { size: size }) }));
}
export function MemoryPanelIcon({ size }) {
    return (_jsx(PanelGlyph, { panel: "memory", children: _jsx(IconDatabaseOutlineRegular, { size: size }) }));
}
/**
 * The 创建 Agent page as a genuine main-area panel, so its nav row is the
 * same control as 插件/技能 — the sidebar-embedded button could never sit
 * flush with the panel rows (its host region clips everything above its
 * box). Creating closes the panel and returns to the conversation; the
 * roster reloads through the shared controller either way.
 * @param props - the agents store hook, the create action, close, locale.
 * @returns the create form page.
 */
export function CreateAgentPage({ useAgents, create, close, t }) {
    const state = useAgents(snapshot => snapshot);
    return (_jsx("div", { className: css.createPage, children: _jsx(AgentForm, { mode: "create", initial: null, busy: state.busy, error: state.error, t: t, onSubmit: (input) => {
                Promise.resolve(create(input)).then(() => close());
            }, onCancel: close, onDelete: undefined }) }));
}
/**
 * The 助理档案 page: a bare edit form on the panel's blank page — fields
 * and save only, no chrome. Data is prefilled by the controller's profile
 * loader, which the nav row fires before selecting the panel.
 * @param props - the agents store hook, save action, locale.
 * @returns the bare profile fields page.
 */
export function ProfileMainPage({ useAgents, saveEdit, t }) {
    const state = useAgents(snapshot => snapshot);
    const profile = state.profile;
    const [name, setName] = useState('');
    const [language, setLanguage] = useState('');
    const [description, setDescription] = useState('');
    const [persona, setPersona] = useState('');
    useEffect(() => {
        if (profile === null || profile === undefined)
            return;
        setName(profile.name);
        setLanguage(profile.language);
        setDescription(profile.description);
        setPersona(profile.persona);
    }, [profile]);
    const save = () => {
        if (name.trim() === '' || persona.trim() === '')
            return;
        void saveEdit(state.selected, {
            name: name.trim(),
            language: language.trim(),
            description: description.trim(),
            persona,
        });
    };
    return (_jsx("div", { className: css.createPage, children: _jsxs("div", { className: formCss.fields, children: [_jsxs("label", { className: formCss.field, children: [_jsx("span", { className: formCss.label, children: t('form.name') }), _jsx("input", { className: formCss.input, value: name, onChange: event => { setName(event.target.value); }, placeholder: t('form.name.placeholder'), disabled: state.busy })] }), _jsxs("label", { className: formCss.field, children: [_jsx("span", { className: formCss.label, children: t('form.description') }), _jsx("input", { className: formCss.input, value: description, onChange: event => { setDescription(event.target.value); }, placeholder: t('form.description.placeholder'), disabled: state.busy })] }), _jsxs("label", { className: formCss.field, children: [_jsx("span", { className: formCss.label, children: t('form.language') }), _jsx("input", { className: formCss.input, value: language, onChange: event => { setLanguage(event.target.value); }, placeholder: t('form.language.placeholder'), disabled: state.busy })] }), _jsxs("label", { className: formCss.field, children: [_jsx("span", { className: formCss.label, children: t('form.persona') }), _jsx("textarea", { className: formCss.textarea, value: persona, onChange: event => { setPersona(event.target.value); }, placeholder: t('form.persona.placeholder'), disabled: state.busy })] }), _jsx("button", { type: "button", className: formCss.submit, disabled: state.busy, onClick: save, children: t('agents.memory.save') })] }) }));
}
/**
 * The 助理记忆 page: a bare editor on the panel's blank page — textarea and
 * save only, no chrome. Data is prefilled by the controller's memory
 * loader, which the nav row fires before selecting the panel.
 * @param props - the agents store hook, memory actions, locale.
 * @returns the bare memory editor page.
 */
export function MemoryMainPage({ useAgents, setMemoryText, saveMemory, t }) {
    const state = useAgents(snapshot => snapshot);
    const saving = state.memoryState === 'saving';
    return (_jsxs("div", { className: css.createPage, children: [_jsx("textarea", { className: css.memoryTextarea, value: state.memoryText, disabled: saving, onChange: event => { setMemoryText(event.target.value); }, spellCheck: false }), _jsxs("div", { className: css.memoryFooter, children: [_jsx("button", { type: "button", className: css.action, disabled: saving, onClick: () => { void saveMemory(); }, children: saving ? t('agents.memory.saving') : t('agents.memory.save') }), state.memoryState === 'saved' && _jsx("span", { className: css.memorySaved, children: t('agents.memory.saved') })] })] }));
}
/**
 * Render the agent browsing region.
 * @param props - composed slot props.
 * @returns the agent surface for the current view.
 */
export function AgentBrowser({ useAgents, useSessions, useArchived, usePinned, useWorkspaceProjection, useView, useScheduleCatalog, viewActions, load, modeName, selectAgent, back, openCreate: _openCreate, startChat: _startChat, openSession, openProfile: _openProfile, openMemory: _openMemory, setMemoryText: _setMemoryText, saveMemory: _saveMemory, backFromMemory: _backFromMemory, toggleCollapsed, create, saveEdit: _saveEdit, remove: _remove, renameSession, archiveSession, removeSession, pinSession, unpinSession, forkSession, unarchiveSession, searchSessions, searchResultLimit, insertWorkspaceBefore, addWorkspace, wide, expandSidebar: _expandSidebar, t, }) {
    const state = useAgents(snapshot => snapshot);
    // The full session snapshot, not a filtered selector: a uSES selector is
    // re-run only when its source changes, so a selector closing over the
    // current selection would keep showing the previous agent's chats when the
    // selection moves but the session list does not. Reading the whole snapshot
    // and filtering in-render keeps the list keyed to the live selection.
    const sessionSnapshot = useSessions(snapshot => snapshot);
    const archivedSet = new Set(useArchived(snapshot => snapshot));
    const pinnedSet = new Set(usePinned(snapshot => snapshot));
    const projection = useWorkspaceProjection(snapshot => snapshot);
    const scheduleCatalog = useScheduleCatalog(snapshot => snapshot);
    const titleByWorkspace = new Map(projection.order.map(workspace => [workspace.id, workspace.title]));
    // Chat-history view options (the official workspace browser's trio),
    // persisted across reloads through the plugin's viewing store.
    const view = useView(snapshot => snapshot);
    // Publish the surface mode for the global panel-row swap (see the
    // AgentBrowser.module.css panelList rules): the roster shows the create
    // row, an agent page swaps it for the three per-agent action rows.
    useEffect(() => {
        const inside = state.selected !== '' && (state.view === 'agent' || state.view === 'edit' || state.view === 'memory');
        document.body.dataset.agentsView = inside ? 'agent' : 'roster';
    }, [state.view, state.selected]);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [chatCollapsed, setChatCollapsed] = useState(false);
    const [viewMenuOpen, setViewMenuOpen] = useState(false);
    const [query, setQuery] = useState('');
    const searchInput = useRef(null);
    const searchRoot = useRef(null);
    // The chat-history member set ignores the archive filter (membership is
    // workspace-owned, so saved manual orders keep every member's slot); the
    // visible rows apply the filter on top.
    const ownedSessions = agentSessionsOf(sessionSnapshot, state.selected, archivedSet, pinnedSet, 'show');
    // A blank draft (never prompted) carries no stored title and would read as
    // a raw session id: it renders as what it is — the agent, its workspace,
    // and its bound mode — instead of the official "New Session" spelling.
    const agentName = state.agents.find(agent => agent.id === state.selected)?.name ?? state.selected;
    const wsTitleOf = (sessionId) => {
        const workspaceId = projection.bySession[sessionId];
        return workspaceId === undefined ? undefined : titleByWorkspace.get(workspaceId);
    };
    const titleOf = (session) => {
        if (!session.blank)
            return session.title;
        const parts = [
            agentName,
            wsTitleOf(session.id),
            ...session.modeId === undefined ? [] : [modeName(session.modeId)],
        ];
        return parts.filter(part => part !== undefined && part !== '').join(' · ');
    };
    const trimmedQuery = query.trim();
    // In-flight chat-row drag: source identity plus the current insert marker.
    // Search swaps the list for merged results, so drags pause there too.
    const [drag, setDrag] = useState(null);
    const dropCommitted = useRef(false);
    useNativeDragAcceptance(drag !== null);
    // The remote half of the search: the Host content index paged behind the
    // local title matches. Debounced like the official browser; a superseded
    // query's response is dropped by the aborted controller.
    const [remoteSearch, setRemoteSearch] = useState({ query: '', status: 'idle', items: [], hasMore: false });
    useEffect(() => {
        if (trimmedQuery === '') {
            setRemoteSearch({ query: '', status: 'idle', items: [], hasMore: false });
            return;
        }
        const controller = new AbortController();
        setRemoteSearch({ query: trimmedQuery, status: 'loading', items: [], hasMore: false });
        const timer = window.setTimeout(() => {
            searchSessions(trimmedQuery, controller.signal).then((result) => {
                if (controller.signal.aborted)
                    return;
                setRemoteSearch({ query: trimmedQuery, status: 'ready', items: result.items, hasMore: result.hasMore });
            }).catch(() => {
                if (controller.signal.aborted)
                    return;
                setRemoteSearch({ query: trimmedQuery, status: 'error', items: [], hasMore: false });
            });
        }, 250);
        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [trimmedQuery, searchSessions]);
    // Workspace drag (grouped view): reorder via the Host's insert-before verb.
    // The order lives Host-side, so there is no local store to write.
    const [wsDrag, setWsDrag] = useState(null);
    const wsDropCommitted = useRef(false);
    useNativeDragAcceptance(wsDrag !== null);
    // Official web defaults for the two browsing shortcuts the official
    // browser owns (its hidden handlers resolve harmlessly beneath the shadow):
    // Ctrl/Cmd+Alt+K opens this browser's search, Ctrl/Cmd+Alt+O adds a
    // workspace through the Host picker.
    useEffect(() => {
        const onKeyDown = (event) => {
            if (!(event.ctrlKey || event.metaKey) || !event.altKey || event.shiftKey)
                return;
            if (event.code === 'KeyK') {
                if (searchInput.current === null)
                    return;
                event.preventDefault();
                setSearchExpanded(true);
                searchInput.current.focus({ preventScroll: true });
            }
            else if (event.code === 'KeyO') {
                event.preventDefault();
                addWorkspace().catch((reason) => {
                    console.warn('workspace add failed:', reason);
                });
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => { document.removeEventListener('keydown', onKeyDown); };
    }, [addWorkspace]);
    // The selected session, for the workspace group's auto-expand.
    const currentSessionId = Object.values(sessionSnapshot.byId)
        .find(session => (session.retainedBy.mainView ?? 0) > 0)?.id;
    useEffect(() => {
        if (view.groupBy !== 'workspace' || currentSessionId === undefined)
            return;
        const workspaceId = projection.bySession[currentSessionId];
        const key = workspaceId !== undefined && projection.order.some(ws => ws.id === workspaceId)
            ? `ws:${workspaceId}`
            : 'ung';
        if (view.groupExpansion[key] !== undefined)
            return;
        viewActions.setGroupExpanded(key, true);
    }, [view.groupBy, view.groupExpansion, projection, currentSessionId, viewActions]);
    // Saved orders of deleted agents and deleted workspaces are dead weight.
    // Both registries must have streamed in first: pruning against an empty
    // roster or an empty workspace list would mistake every saved order for an
    // orphan (the official browser gates the same pass on its ready phase).
    useEffect(() => {
        if (state.status !== 'ready' || projection.order.length === 0)
            return;
        viewActions.retainAgents(state.agents.map(agent => agent.id), projection.order.map(workspace => workspace.id));
    }, [state.status, state.agents, projection, viewActions]);
    useEffect(() => {
        void load();
    }, [load]);
    // Chat row actions: the three-dot menu, plus the rename / delete dialogs.
    // Hooks run unconditionally above every view branch (React rules); the
    // dialogs themselves render only on the agent page, where rows exist.
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [renameTarget, setRenameTarget] = useState(null);
    const [renameDraft, setRenameDraft] = useState('');
    const [renaming, setRenaming] = useState(false);
    const [renameError, setRenameError] = useState(null);
    const composingRef = useRef(false);
    const renameTrimmed = renameDraft.trim();
    const renameBlocked = renaming || renameTrimmed === '' || renameTarget === null;
    const closeRename = () => {
        if (renaming)
            return;
        setRenameTarget(null);
        setRenameError(null);
    };
    const confirmRename = () => {
        if (renameBlocked || renameTarget === null)
            return;
        setRenaming(true);
        setRenameError(null);
        renameSession(renameTarget.sessionId, renameTrimmed).then(() => {
            setRenaming(false);
            setRenameTarget(null);
        }).catch((reason) => {
            setRenaming(false);
            setRenameError(reason instanceof Error ? reason.message : String(reason));
        });
    };
    const onRename = (sessionId, currentTitle) => {
        setRenameTarget({ sessionId, currentTitle });
        setRenameDraft(currentTitle);
        setRenameError(null);
    };
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const closeDelete = () => {
        if (deleting)
            return;
        setDeleteTarget(null);
        setDeleteError(null);
    };
    const confirmDelete = () => {
        if (deleting || deleteTarget === null)
            return;
        setDeleting(true);
        setDeleteError(null);
        removeSession(deleteTarget.sessionId).then((failure) => {
            setDeleting(false);
            if (failure !== undefined) {
                setDeleteError(t(failure));
                return;
            }
            setDeleteTarget(null);
        }).catch((reason) => {
            setDeleting(false);
            setDeleteError(reason instanceof Error ? reason.message : String(reason));
        });
    };
    if (state.status === 'loading' || state.status === 'idle') {
        return _jsx("div", { className: css.centered, children: t('agents.loading') });
    }
    if (state.status === 'error') {
        return (_jsxs("div", { className: css.centered, children: [_jsx("div", { className: css.error, children: state.error ?? t('error.loadFailed') }), _jsx("button", { type: "button", className: css.retry, onClick: () => { void load(); }, children: t('agents.retry') })] }));
    }
    if (state.view === 'create') {
        return (_jsx(AgentForm, { mode: "create", initial: null, busy: state.busy, error: state.error, t: t, onSubmit: (input) => { void create(input); }, onCancel: back, onDelete: undefined }));
    }
    // The agent page: the selected agent's chat history. The profile and
    // memory editors live on their own main-area panels now (opened by the
    // nav rows), so edit/memory views ride this same agent surface instead
    // of swapping the sidebar to an embedded form.
    if ((state.view === 'agent' || state.view === 'edit' || state.view === 'memory') && state.selected !== '') {
        const selected = state.selected;
        const name = state.agents.find(agent => agent.id === selected)?.name ?? selected;
        void name;
        // History accounts: one per workspace section plus the ungrouped bucket
        // (grouped view), or the single flat account. Membership is complete —
        // archives included — so saved manual orders keep every member's slot.
        const accounts = new Map();
        if (view.groupBy === 'workspace') {
            for (const workspace of projection.order)
                accounts.set(`ws:${workspace.id}`, []);
            accounts.set('ung', []);
        }
        for (const entry of ownedSessions) {
            const key = view.groupBy !== 'workspace'
                ? 'flat'
                : (() => {
                    const workspaceId = projection.bySession[entry.id];
                    return workspaceId !== undefined && accounts.has(`ws:${workspaceId}`) ? `ws:${workspaceId}` : 'ung';
                })();
            const members = accounts.get(key);
            if (members === undefined)
                accounts.set(key, [entry]);
            else
                members.push(entry);
        }
        const fullKey = (account) => accountKeyOf(selected, account);
        const rowState = {
            pinnedSessionIds: [...pinnedSet],
            archivedSessionIds: [...archivedSet],
        };
        // The account's full membership in display order: recency (already
        // projected above) or the reconciled saved manual order.
        const orderedIdsOf = (account) => {
            const members = accounts.get(account) ?? [];
            if (view.orderBy === 'updated')
                return members.map(entry => entry.id);
            return reconcileManualOrder(members.map(entry => entry.id), view.sessionOrderByAccount[fullKey(account)], sessionSnapshot.byId, rowState);
        };
        const visibleOf = (entry) => {
            if (view.archivedFilter === 'show')
                return true;
            return view.archivedFilter === 'only' ? archivedSet.has(entry.id) : !archivedSet.has(entry.id);
        };
        const rowsOf = (account) => {
            const byId = new Map((accounts.get(account) ?? []).map(entry => [entry.id, entry]));
            return orderedIdsOf(account).flatMap((id) => {
                const entry = byId.get(id);
                return entry !== undefined && visibleOf(entry) ? [entry] : [];
            });
        };
        // The merged search view: local title/workspace matches lead (this
        // browser's scope is the selected agent's history), then the Host content
        // page in backend order; duplicates keep the local row. Blanks never
        // match, and the archived filter applies to both halves.
        const searchQ = trimmedQuery.toLowerCase();
        const searchView = (() => {
            if (trimmedQuery === '')
                return null;
            const merged = [];
            const seen = new Set();
            for (const entry of ownedSessions) {
                if (entry.blank || !visibleOf(entry))
                    continue;
                if (titleOf(entry).toLowerCase().includes(searchQ)
                    || (wsTitleOf(entry.id) ?? '').toLowerCase().includes(searchQ)) {
                    merged.push({ entry });
                    seen.add(entry.id);
                }
            }
            for (const item of remoteSearch.items) {
                if (seen.has(item.sessionId))
                    continue;
                const entry = ownedSessions.find(candidate => candidate.id === item.sessionId);
                if (entry === undefined || entry.blank || !visibleOf(entry))
                    continue;
                merged.push({ entry, snippet: item.snippet });
                seen.add(item.sessionId);
            }
            return {
                rows: merged.slice(0, searchResultLimit),
                hasMore: remoteSearch.hasMore || merged.length > searchResultLimit,
                pending: remoteSearch.query !== trimmedQuery || remoteSearch.status === 'loading',
            };
        })();
        // Every account's current order: the manual switch's and a drag's base.
        const initialOrders = () => Object.fromEntries([...accounts.keys()].map(account => [fullKey(account), orderedIdsOf(account)]));
        // Workspace sections lead in Host order, the ungrouped bucket trails;
        // sections without visible rows stay out of the way. The section holding
        // the open session tints its folder, the official active-group mark.
        const currentAccount = view.groupBy !== 'workspace' || currentSessionId === undefined
            ? undefined
            : (() => {
                const workspaceId = projection.bySession[currentSessionId];
                return workspaceId !== undefined && accounts.has(`ws:${workspaceId}`) ? `ws:${workspaceId}` : 'ung';
            })();
        const sections = view.groupBy === 'workspace'
            ? [
                ...projection.order
                    .map(workspace => ({
                    key: `ws:${workspace.id}`,
                    label: workspace.title,
                    active: `ws:${workspace.id}` === currentAccount,
                    rows: rowsOf(`ws:${workspace.id}`),
                }))
                    .filter(section => section.rows.length > 0),
                ...rowsOf('ung').length > 0
                    ? [{ key: 'ung', label: t('chat.group.ungrouped'), active: currentAccount === 'ung', rows: rowsOf('ung') }]
                    : [],
            ]
            : [{ key: 'flat', label: '', active: false, rows: rowsOf('flat') }];
        const commitDrag = (activeDrag, over) => {
            if (dropCommitted.current)
                return;
            dropCommitted.current = true;
            setDrag(null);
            if (over.id === activeDrag.sessionId)
                return;
            const dragRows = rowsOf(activeDrag.account).map(entry => ({
                id: entry.id,
                blank: entry.blank,
                pinned: pinnedSet.has(entry.id),
            }));
            const next = sessionDragOrder((accounts.get(activeDrag.account) ?? []).map(entry => entry.id), dragRows, activeDrag, over);
            if (next !== undefined)
                viewActions.setSessionOrder(fullKey(activeDrag.account), next, initialOrders());
        };
        // The official workspace reorder: the anchor is the target row for a
        // 'before' half, the following sibling for 'after'; no-ops for self and
        // for moves that change nothing.
        const commitWorkspaceDrag = (activeDrag, over) => {
            if (wsDropCommitted.current)
                return;
            wsDropCommitted.current = true;
            setWsDrag(null);
            const order = projection.order.map(workspace => workspace.id);
            const rowIndex = order.indexOf(over.id);
            if (rowIndex === -1)
                return;
            const anchor = over.half === 'before' ? over.id : order[rowIndex + 1];
            if (anchor === activeDrag.workspaceId)
                return;
            const sourceIndex = order.indexOf(activeDrag.workspaceId);
            const anchorIndex = anchor === undefined ? order.length : order.indexOf(anchor);
            if (sourceIndex === -1 || anchorIndex === sourceIndex || anchorIndex === sourceIndex + 1)
                return;
            insertWorkspaceBefore(activeDrag.workspaceId, anchor).catch((reason) => {
                console.warn('workspace reorder rejected:', reason);
            });
        };
        // One chat row on the official session-row anatomy: a 16px leading slot
        // (offering the extension seat — the schedule mark lives there), the
        // title, the relative time (blank drafts carry none), the rest-state
        // pin marker, and the hover-revealed action strip that takes the time's
        // place. The row itself opens the session; the action strip keeps its
        // clicks. Blanks, archives, and search results never start a drag; a drop
        // onto a blank always lands after it. A content-search row carries the
        // matched snippet as a second line.
        const renderChatRow = (session, account, snippet) => {
            const isArchived = archivedSet.has(session.id);
            const isPinned = pinnedSet.has(session.id);
            const draggable = trimmedQuery === '' && !session.blank && !isArchived;
            const compatible = drag !== null && drag.account === account && drag.pinned === isPinned;
            const normalizeHalf = (half) => session.blank ? 'after' : half;
            const marker = compatible && drag?.over?.id === session.id ? drag.over.half : null;
            return (_jsxs("div", { role: "treeitem", "aria-selected": session.current, className: clsx(css.chatRow, session.current && css.active, menuOpenId === session.id && css.menuOpen, isArchived && css.chatArchived, marker === 'before' && css.dropBefore, marker === 'after' && css.dropAfter), onClick: () => { openSession(session.id); }, draggable: draggable, onDragStart: !draggable
                    ? undefined
                    : (e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', session.id);
                        dropCommitted.current = false;
                        setDrag({ account, sessionId: session.id, pinned: isPinned, over: null });
                    }, onDragEnd: !draggable
                    ? undefined
                    : () => {
                        if (drag?.over !== null && drag?.over !== undefined)
                            commitDrag(drag, drag.over);
                        else
                            setDrag(null);
                        dropCommitted.current = false;
                    }, onDragOver: !compatible
                    ? undefined
                    : (e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        const half = normalizeHalf(rowHalf(e));
                        setDrag(current => current === null ? current : { ...current, over: { id: session.id, half } });
                    }, onDrop: !compatible
                    ? undefined
                    : (e) => {
                        e.preventDefault();
                        if (drag !== null)
                            commitDrag(drag, { id: session.id, half: normalizeHalf(rowHalf(e)) });
                    }, children: [_jsx("span", { className: css.chatSlot, children: !session.blank && !isArchived && scheduleCatalog.settled
                            && scheduleCatalog.records.some(record => record.sessionId === session.id && record.status === 'active') && (_jsx("span", { className: css.scheduleMark, "data-session-schedule-mark": "", title: t('chat.schedule.mark'), onClick: (e) => { e.stopPropagation(); }, children: _jsx(IconClockOutlineRegular, { size: 12 }) })) }), snippet === undefined
                        ? _jsx("span", { className: css.chatTitle, children: titleOf(session) })
                        : (_jsxs("span", { className: css.chatBody, children: [_jsx("span", { className: css.chatTitle, children: titleOf(session) }), snippet !== '' && _jsx("span", { className: css.chatSnippet, children: snippet })] })), !session.blank && (_jsx("span", { className: css.chatTime, children: chatTimeLabel(session.updatedAt, Date.now(), t) })), isPinned && !isArchived && (_jsx("span", { className: css.chatPinIndicator, role: "img", "aria-label": t('chat.actions.pin'), title: t('chat.actions.pin'), children: _jsx(IconPinFillRegular, { size: 14 }) })), _jsxs("span", { className: css.chatRowActions, onClick: (e) => { e.stopPropagation(); }, children: [_jsx(Menu, { open: menuOpenId === session.id, onClose: () => { setMenuOpenId(null); }, items: [
                                    ...isArchived ? [] : [{
                                            id: 'pin',
                                            label: t(isPinned ? 'chat.menu.unpinSession' : 'chat.menu.pinSession'),
                                            icon: isPinned ? _jsx(IconPinFillRegular, {}) : _jsx(IconPinOutlineRegular, {}),
                                        }],
                                    {
                                        id: 'rename', label: t('chat.menu.rename'), icon: _jsx(IconEditOutlineRegular, {}),
                                        shortcut: { keys: ['Ctrl', 'Shift', 'R'], aria: 'Control+Shift+R' },
                                    },
                                    {
                                        id: 'fork', label: t('chat.menu.fork'), icon: _jsx(IconBranchOutlineRegular, {}),
                                        shortcut: { keys: ['Ctrl', 'Shift', 'F'], aria: 'Control+Shift+F' },
                                    },
                                    {
                                        id: isArchived ? 'unarchive' : 'archive',
                                        label: t(isArchived ? 'chat.menu.unarchive' : 'chat.menu.archive'),
                                        icon: _jsx(IconArchiveOutlineRegular, {}),
                                        ...isArchived ? {} : { shortcut: { keys: ['Ctrl', 'Alt', 'A'], aria: 'Control+Alt+A' } },
                                    },
                                    { type: 'separator', id: 'danger-separator' },
                                    { id: 'delete', label: t('chat.menu.delete'), icon: _jsx(IconTrashOutlineRegular, {}) },
                                ], onSelect: (id) => {
                                    setMenuOpenId(null);
                                    if (id === 'pin') {
                                        ;
                                        (isPinned ? unpinSession : pinSession)(session.id).catch((reason) => {
                                            console.warn('session pin rejected:', reason);
                                        });
                                    }
                                    if (id === 'rename')
                                        onRename(session.id, titleOf(session));
                                    if (id === 'fork') {
                                        forkSession(session.id).catch((reason) => {
                                            console.warn('session fork rejected:', reason);
                                        });
                                    }
                                    if (id === 'archive') {
                                        archiveSession(session.id).catch((reason) => {
                                            console.warn('session archive rejected:', reason);
                                        });
                                    }
                                    if (id === 'unarchive') {
                                        unarchiveSession(session.id).catch((reason) => {
                                            console.warn('session unarchive rejected:', reason);
                                        });
                                    }
                                    if (id === 'delete') {
                                        setDeleteTarget({ sessionId: session.id, title: session.title });
                                        setDeleteError(null);
                                    }
                                }, portal: true, closeOnPointerLeave: true, anchor: (_jsx("button", { type: "button", className: css.chatRowAction, "aria-label": t('chat.menu.rename'), onClick: (e) => { e.stopPropagation(); setMenuOpenId(v => v === session.id ? null : session.id); }, children: _jsx(IconEllipsisOutlineMedium, {}) })) }), _jsx("button", { type: "button", className: css.chatRowAction, "aria-label": t(isArchived ? 'chat.actions.unarchive' : 'chat.actions.archive'), onClick: (e) => {
                                    e.stopPropagation();
                                    (isArchived ? unarchiveSession : archiveSession)(session.id).catch((reason) => {
                                        console.warn('session archive toggle rejected:', reason);
                                    });
                                }, children: _jsx(IconArchiveOutlineRegular, { size: 14 }) }), !isArchived && (_jsx("button", { type: "button", className: css.chatRowAction, "aria-label": t(isPinned ? 'chat.actions.unpin' : 'chat.actions.pin'), onClick: (e) => {
                                    e.stopPropagation();
                                    (isPinned ? unpinSession : pinSession)(session.id).catch((reason) => {
                                        console.warn('session pin rejected:', reason);
                                    });
                                }, children: isPinned
                                    ? _jsx(IconPinFillRegular, { size: 14 })
                                    : _jsx(IconPinOutlineRegular, { size: 14 }) }))] })] }));
        };
        return (_jsxs("div", { className: css.root, children: [state.error !== null && _jsx("div", { className: css.error, role: "alert", children: t(state.error) }), wide && (_jsxs("div", { className: css.sectionHeader, children: [_jsxs("button", { type: "button", className: css.collapsibleTitle, onClick: () => { setChatCollapsed(v => !v); }, "aria-expanded": !chatCollapsed, children: [_jsx("span", { className: clsx(css.chevron, chatCollapsed && css.chevronClosed), children: "\u25B8" }), _jsx("span", { className: css.sectionLabel, children: t('agents.chatHistory') })] }), !chatCollapsed && (_jsx("div", { className: clsx(css.searchSlot, searchExpanded && css.searchSlotExpanded), children: _jsxs("div", { ref: searchRoot, className: clsx(css.search, searchExpanded && css.searchExpanded), onClick: () => { setSearchExpanded(true); searchInput.current?.focus(); }, children: [_jsx(Tooltip, { label: t('chat.search'), side: "bottom", delayMs: 500, disabled: searchExpanded, children: _jsx("button", { type: "button", className: css.searchButton, "aria-label": t('chat.search'), "aria-expanded": searchExpanded, onClick: (e) => { e.stopPropagation(); setSearchExpanded(true); searchInput.current?.focus(); }, children: _jsx(IconSearchOutlineRegular, { size: searchExpanded ? 11 : 14 }) }) }), _jsx("input", { ref: searchInput, className: css.searchInput, type: "text", placeholder: t('chat.search.placeholder'), value: query, tabIndex: searchExpanded ? 0 : -1, onChange: (e) => { setQuery(e.target.value); }, onKeyDown: (e) => {
                                            if (e.key !== 'Escape')
                                                return;
                                            setQuery('');
                                            setSearchExpanded(false);
                                        } }), searchExpanded && (_jsx("button", { type: "button", className: css.clearButton, "aria-label": t('chat.search.clear'), onClick: (e) => {
                                            e.stopPropagation();
                                            setQuery('');
                                            setSearchExpanded(false);
                                        }, children: _jsx(IconCloseFillRegular, {}) }))] }) })), !chatCollapsed && (_jsxs("div", { className: css.headerActions, children: [_jsx(Menu, { open: viewMenuOpen, onClose: () => { setViewMenuOpen(false); }, items: [
                                        { type: 'label', id: 'group-by', text: t('chat.groupBy.label') },
                                        { id: 'workspace', label: t('chat.groupBy.workspace'), icon: _jsx(IconFolderCloseRegular, {}) },
                                        { id: 'flat', label: t('chat.groupBy.flat'), icon: _jsx(IconFlatListOutlineRegular, {}) },
                                        { type: 'separator', id: 'order-by-separator' },
                                        { type: 'label', id: 'order-by', text: t('chat.orderBy.label') },
                                        { id: 'manual', label: t('chat.orderBy.manual'), icon: _jsx(IconChevronsUpDownOutlineRegular, {}) },
                                        { id: 'updated', label: t('chat.orderBy.updated'), icon: _jsx(IconClockOutlineRegular, {}) },
                                        { type: 'separator', id: 'archived-filter-separator' },
                                        { type: 'label', id: 'filter-by', text: t('chat.filterBy.label') },
                                        { id: 'hide-archived', label: t('chat.viewOptions.hideArchived'), icon: _jsx(IconArchiveOffOutlineRegular, {}) },
                                        { id: 'show-archived', label: t('chat.viewOptions.showArchived'), icon: _jsx(IconQueueOutlineRegular, {}) },
                                        { id: 'only-archived', label: t('chat.viewOptions.onlyArchived'), icon: _jsx(IconArchiveCheckOutlineRegular, {}) },
                                    ], selectedIds: [
                                        view.groupBy,
                                        view.orderBy,
                                        { default: 'hide-archived', show: 'show-archived', only: 'only-archived' }[view.archivedFilter],
                                    ], onSelect: (id) => {
                                        if (id === 'workspace' || id === 'flat')
                                            viewActions.setGroupBy(id);
                                        else if (id === 'manual' || id === 'updated')
                                            viewActions.setOrderBy(id, initialOrders());
                                        else if (id === 'hide-archived')
                                            viewActions.setArchivedFilter('default');
                                        else if (id === 'show-archived')
                                            viewActions.setArchivedFilter('show');
                                        else if (id === 'only-archived')
                                            viewActions.setArchivedFilter('only');
                                        setViewMenuOpen(false);
                                    }, align: "end", dense: true, portal: true, listClassName: css.viewOptionsMenu, anchor: (_jsx(Tooltip, { label: t('chat.viewOptions.label'), side: "bottom", delayMs: 500, children: _jsx("button", { type: "button", className: css.iconButton, "aria-label": t('chat.viewOptions.label'), onClick: () => { setViewMenuOpen(v => !v); }, children: _jsx(IconSlidersTwoOutlineRegular, {}) }) })) }), _jsx(Tooltip, { label: t('chat.workspace.add'), side: "bottom", delayMs: 500, children: _jsx("button", { type: "button", className: css.iconButton, "aria-label": t('chat.workspace.add'), onClick: () => {
                                            addWorkspace().catch((reason) => {
                                                console.warn('workspace add failed:', reason);
                                            });
                                        }, children: _jsx(IconProjectAddOutlineRegular, { size: 16 }) }) })] }))] })), chatCollapsed || !wide ? undefined : searchView !== null ? (_jsxs("div", { className: css.searchResults, role: "tree", "aria-label": t('chat.search'), children: [searchView.rows.map(({ entry, snippet }) => (_jsx("div", { children: renderChatRow(entry, 'flat', snippet) }, entry.id))), searchView.pending && (_jsx("div", { className: css.searchStatus, role: "status", children: t('search.pending') })), !searchView.pending && searchView.rows.length === 0 && (_jsx("div", { className: css.empty, children: t('search.noMatches') })), searchView.hasMore && (_jsx("div", { className: css.searchStatus, children: t('search.hasMore', { n: searchResultLimit }) }))] })) : (_jsxs(_Fragment, { children: [sections.every(section => section.rows.length === 0) && (_jsx("div", { className: css.empty, children: t(view.archivedFilter === 'only' ? 'chat.search.empty' : 'agents.chatHistory.empty') })), _jsx("ul", { className: css.list, children: sections.map(section => {
                                const expanded = section.label === '' || (view.groupExpansion[section.key] ?? false);
                                const workspaceId = section.key.startsWith('ws:') ? section.key.slice(3) : undefined;
                                const wsCompatible = wsDrag !== null && workspaceId !== undefined
                                    && wsDrag.workspaceId !== workspaceId;
                                const wsMarker = workspaceId !== undefined && wsDrag?.over?.id === workspaceId
                                    ? wsDrag.over.half
                                    : null;
                                return (_jsxs("li", { className: section.label === '' ? undefined : css.groupSection, children: [section.label !== '' && (_jsxs("button", { type: "button", className: clsx(css.groupHeader, wsMarker === 'before' && css.groupDropBefore, wsMarker === 'after' && css.groupDropAfter), "aria-expanded": expanded, draggable: workspaceId !== undefined && trimmedQuery === '', onDragStart: workspaceId === undefined
                                                ? undefined
                                                : (e) => {
                                                    e.dataTransfer.effectAllowed = 'move';
                                                    e.dataTransfer.setData('text/plain', workspaceId);
                                                    wsDropCommitted.current = false;
                                                    setWsDrag({ workspaceId, over: null });
                                                }, onDragEnd: workspaceId === undefined
                                                ? undefined
                                                : () => {
                                                    if (wsDrag?.over !== null && wsDrag?.over !== undefined) {
                                                        commitWorkspaceDrag(wsDrag, wsDrag.over);
                                                    }
                                                    else
                                                        setWsDrag(null);
                                                    wsDropCommitted.current = false;
                                                }, onDragOver: !wsCompatible
                                                ? undefined
                                                : (e) => {
                                                    e.preventDefault();
                                                    e.dataTransfer.dropEffect = 'move';
                                                    const half = rowHalf(e);
                                                    setWsDrag(current => current === null
                                                        ? current
                                                        : { ...current, over: { id: workspaceId, half } });
                                                }, onDrop: !wsCompatible
                                                ? undefined
                                                : (e) => {
                                                    e.preventDefault();
                                                    if (wsDrag !== null)
                                                        commitWorkspaceDrag(wsDrag, { id: workspaceId, half: rowHalf(e) });
                                                }, onClick: () => { viewActions.setGroupExpanded(section.key, !expanded); }, children: [_jsxs("span", { className: clsx(css.groupSlot, section.active && css.groupSlotActive), children: [_jsx("span", { className: css.groupFolder, children: expanded ? _jsx(IconFolderOpenRegular, {}) : _jsx(IconFolderCloseRegular, {}) }), _jsx("span", { className: css.groupChevron, children: _jsx(IconTriangleRightFillRegular, { className: clsx(css.groupArrow, expanded && css.groupArrowOpen) }) })] }), _jsx("span", { className: css.groupTitle, children: section.label })] })), expanded && (_jsx("ul", { className: css.groupRows, children: section.rows.map(session => (_jsx("li", { children: renderChatRow(session, section.key) }, session.id))) }))] }, section.key));
                            }) })] })), _jsxs(Modal, { open: renameTarget !== null, onClose: closeRename, closeLabel: t('close'), title: t('chat.rename.title'), footer: (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", disabled: renaming, onClick: closeRename, children: t('cancel') }), _jsx(Button, { variant: "primary", disabled: renameBlocked, onClick: confirmRename, children: t('chat.menu.rename') })] })), children: [_jsx("input", { className: css.renameInput, value: renameDraft, "aria-label": t('chat.rename.field'), autoFocus: true, disabled: renaming, onFocus: (e) => { e.target.select(); }, onChange: (e) => { setRenameDraft(e.target.value); setRenameError(null); }, onCompositionStart: () => { composingRef.current = true; }, onCompositionEnd: () => { composingRef.current = false; }, onKeyDown: (e) => {
                                if (e.key === 'Enter' && !composingRef.current) {
                                    e.preventDefault();
                                    confirmRename();
                                }
                            } }), renameError !== null && _jsx("div", { className: css.dialogError, role: "alert", children: renameError })] }), _jsx(Modal, { open: deleteTarget !== null, onClose: closeDelete, closeLabel: t('close'), title: t('chat.delete.title'), ...deleteTarget === null
                        ? {}
                        : { description: t('chat.delete.desc') }, footer: (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", disabled: deleting, onClick: closeDelete, children: t('cancel') }), _jsx(Button, { variant: "outline", className: css.deleteAction, disabled: deleting, onClick: confirmDelete, children: t('chat.delete.confirm') })] })), children: deleteError !== null && _jsx("div", { className: css.dialogError, role: "alert", children: deleteError }) })] }));
    }
    // The roster page: the collapsible "My Agents" list. Creating happens on
    // the main-area panel opened by the global panel row, so the region only
    // renders wide content (the rail carries no roster).
    return (_jsxs("div", { className: css.root, children: [wide && (_jsx("div", { className: css.sectionHeader, children: _jsxs("button", { type: "button", className: css.collapsibleTitle, onClick: toggleCollapsed, "aria-expanded": !state.collapsed, children: [_jsx("span", { className: clsx(css.chevron, state.collapsed && css.chevronClosed), children: "\u25B8" }), _jsx("span", { className: css.sectionLabel, children: t('agents.title') })] }) })), wide && state.agents.length === 0 && (_jsx("div", { className: css.empty, children: t('agents.empty') })), wide && !state.collapsed && (_jsx("ul", { className: css.list, children: state.agents.map(agent => (_jsx("li", { children: _jsxs("button", { type: "button", className: rowClass(agent.id === state.selected), onClick: () => { selectAgent(agent.id); }, children: [_jsx("span", { className: css.rowName, children: agent.name }), agent.description !== undefined && (_jsx("span", { className: css.rowDescription, children: agent.description }))] }) }, agent.id))) }))] }));
}
//# sourceMappingURL=AgentBrowser.js.map