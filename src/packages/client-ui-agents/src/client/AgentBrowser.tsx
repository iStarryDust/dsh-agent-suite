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

import { useEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the ui-sidebar SlotMap merge (the 'sidebar.workspaces'
// entry and its owner props) into this program.
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { ScheduleCatalogSnapshot } from './ScheduleMark.ts'
import {
  Button, FISH_LOGO_PATH, FISH_LOGO_VIEWBOX, Menu, Modal, Tooltip, relativeTime,
  IconArchiveCheckOutlineRegular, IconArchiveOffOutlineRegular, IconArchiveOutlineRegular,
  IconBranchOutlineRegular, IconChevronsUpDownOutlineRegular, IconClockOutlineRegular,
  IconCloseFillRegular, IconDatabaseOutlineRegular, IconEditOutlineRegular,
  IconChevronLeftOutlineRegular, IconEllipsisOutlineMedium, IconFlatListOutlineRegular, IconFolderCloseRegular,
  IconFolderOpenRegular, IconNewChatOutlineMedium, IconPinFillRegular, IconPinOutlineRegular,
  IconPlusOutlineRegular, IconProjectAddOutlineRegular, IconQueueOutlineRegular,
  IconSearchOutlineRegular, IconSlidersTwoOutlineRegular, IconTrashOutlineRegular,
  IconTriangleRightFillRegular,
} from '@deepseek-ai/dsh-client-ui-primitives'
// Type-only: pulls the ui-sidebar SlotMap merge (the 'sidebar.workspaces'
// entry and its owner props) into this program.
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { AgentForm } from './AgentForm.tsx'
import { agentSessionsOf } from './stores.ts'
import type { AgentFormInput, AgentBrowserState, AgentSessionEntry } from './stores.ts'
import {
  accountKeyOf, reconcileManualOrder, sessionDragOrder,
  type AgentViewStore, type AgentViewState, type ChatDragIntent, type ChatDropTarget,
} from './view.ts'
import formCss from './AgentForm.module.css'
import type { AgentsKey } from './locales.ts'
import css from './AgentBrowser.module.css'

/** The workspace registry projected for the chat history. */
export interface WorkspaceProjection {
  /** Workspaces in Host group order, display titles resolved. */
  readonly order: readonly { readonly id: string; readonly title: string }[]
  /** Session id → member workspace id. */
  readonly bySession: Readonly<Record<string, string>>
}

/** Registration-side business face for the agent browser. */
export interface AgentBrowserInjected {
  hooks: {
    /** Browser snapshot bound by the renderer as useAgents. */
    agents: SnapshotStore<AgentBrowserState>
    /** Registry-global archive set: archived sessions hide from every agent's history. */
    archived: SnapshotStore<readonly string[]>
    /** Registry-global pinned set: pinned sessions lead every agent's history. */
    pinned: SnapshotStore<readonly string[]>
    /** Workspace registry projection: group order and session membership. */
    workspaceProjection: SnapshotStore<WorkspaceProjection>
    /** Persisted chat-history viewing state (grouping / ordering / saved manual order). */
    view: SnapshotStore<AgentViewState>
    /** The shared Host reminder catalog feeding the rows' clock marks. */
    scheduleCatalog: SnapshotStore<ScheduleCatalogSnapshot>
  }
  /** The viewing store's write set. */
  viewActions: AgentViewStore['actions']
  /** Read the roster. */
  load: () => Promise<void>
  /** Localize one shipped mode id (the official preset display dictionary). */
  modeName: (modeId: string) => string
  /** Enter one agent's page. */
  selectAgent: (id: string) => void
  /** Return to the roster page. */
  back: () => void
  /** Open the create form. */
  openCreate: () => void
  /** Start a new chat with one agent; resolves to a failure message when the chat could not start. */
  startChat: (id: string) => Promise<string | undefined>
  /** Open one chat from the agent's history. */
  openSession: (sessionId: string) => void
  /** Open one agent's profile for editing. */
  openProfile: (id: string) => Promise<void>
  /** Open one agent's memory editor. */
  openMemory: (id: string) => Promise<void>
  /** Update the memory editor draft. */
  setMemoryText: (text: string) => void
  /** Save the memory editor draft; resolves to a failure message. */
  saveMemory: () => Promise<string | undefined>
  /** Return from the memory editor to the agent page. */
  backFromMemory: () => void
  /** Toggle the roster list's collapsed state. */
  toggleCollapsed: () => void
  /** Create an agent from the form; resolves to a failure message. */
  create: (input: AgentFormInput) => Promise<string | undefined>
  /** Save a profile edit; resolves to a failure message. */
  saveEdit: (id: string, input: AgentFormInput) => Promise<string | undefined>
  /** Delete an agent; resolves to a failure message. */
  remove: (id: string) => Promise<string | undefined>
  /** Rename one chat's durable title. */
  renameSession: (sessionId: string, title: string) => Promise<void>
  /** Archive one chat (hide from every list; the log stays). */
  archiveSession: (sessionId: string) => Promise<void>
  /** Delete one chat for good; resolves to a failure key or message. */
  removeSession: (sessionId: string) => Promise<string | undefined>
  /** Pin one chat (registry-global pin set; leads the agent's history). */
  pinSession: (sessionId: string) => Promise<void>
  /** Unpin one chat. */
  unpinSession: (sessionId: string) => Promise<void>
  /** Fork one chat at its last completed turn (the child arrives beside the source). */
  forkSession: (sessionId: string) => Promise<void>
  /** Restore one archived chat to its workspace position. */
  unarchiveSession: (sessionId: string) => Promise<void>
  /** One Host content-search hit: the session and the matched snippet. */
  searchSessions: (
    query: string,
    signal: AbortSignal,
  ) => Promise<{ items: readonly { sessionId: string; snippet: string }[]; hasMore: boolean }>
  /** Protocol-owned maximum merged row count for one search. */
  searchResultLimit: number
  /** Move one workspace before another in the Host group order (move-to-end when the anchor is absent). */
  insertWorkspaceBefore: (workspaceId: string, beforeWorkspaceId: string | undefined) => Promise<void>
  /** Add a workspace: the Host-native directory picker, then adoption. */
  addWorkspace: () => Promise<void>
}

/** Full component props. */
export type AgentBrowserProps =
  PropsRuntime<'sidebar.workspaces'>
  & PropsLocale<'agents'>
  & InjectFace<AgentBrowserInjected>

/** One list row's class pair, so the row can stay a single element. */
function rowClass(active: boolean): string {
  return clsx(css.row, active && css.active)
}

/**
 * Accept the native drag at document level while a row drag is active: the
 * hovered row still owns the insertion marker, and releasing outside the list
 * must not render as a rejected drop before dragend commits that last marker.
 */
function useNativeDragAcceptance(active: boolean): void {
  useEffect(() => {
    if (!active) return
    const acceptDrag = (event: DragEvent): void => {
      event.preventDefault()
      if (event.dataTransfer !== null) event.dataTransfer.dropEffect = 'move'
    }
    const acceptDrop = (event: DragEvent): void => { event.preventDefault() }
    document.addEventListener('dragover', acceptDrag)
    document.addEventListener('drop', acceptDrop)
    return () => {
      document.removeEventListener('dragover', acceptDrag)
      document.removeEventListener('drop', acceptDrop)
    }
  }, [active])
}

/** Pointer-position half of a row (insert line above or below). */
function rowHalf(e: { clientY: number; currentTarget: HTMLElement }): 'before' | 'after' {
  const rect = e.currentTarget.getBoundingClientRect()
  return e.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
}

/** Localized compact row time ("刚刚"/"5分钟" in zh), the official row metric. */
function chatTimeLabel(
  updatedAt: number,
  now: number,
  t: (key: AgentsKey, params?: Record<string, unknown>) => string,
): string {
  const { unit, n } = relativeTime(updatedAt, now)
  return unit === 'now' ? t('chat.time.now') : t(`chat.time.${unit}`, { n })
}

/**
 * Read the running harness version the host half publishes through the
 * index-injection global (see the host entry): the official badge inlines
 * the version at web-build time, which a client plugin cannot reach.
 * @returns the formatted version, or undefined when the host wrote none.
 */
function localBuildVersionOf(): string | undefined {
  try {
    const value = (globalThis as { __DSH_BRAND_VERSION__?: unknown }).__DSH_BRAND_VERSION__
    return typeof value === 'string' && value !== '' ? value : undefined
  } catch {
    return undefined
  }
}

/**
 * The official brand whale, re-rendered from the shared primitives path.
 * @param props - square edge and an optional class hook.
 * @returns the whale svg element.
 */
function BrandWhale({ size, className }: { size: number; className?: string | undefined }): ReactNode {
  return (
    <svg
      className={className}
      width={size}
      height={size * FISH_LOGO_VIEWBOX.height / FISH_LOGO_VIEWBOX.width}
      viewBox={`0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`}
      fill="none"
      aria-hidden="true"
    >
      <path d={FISH_LOGO_PATH} fill="currentColor" />
    </svg>
  )
}

/**
 * Position flags for one brand-mark mount. `data-rail` selects whale over
 * chevron inside the collapsed rail's toggle; `data-dsh-brand` arms the
 * stylesheet rule that hides the enclosing New Session tooltip while the
 * repurposed brand content is hovered — the toggle's own tooltip must
 * survive, so the flag is stripped on toggle mounts.
 * @param node - the mounted brand wrapper, or null on detach.
 */
function brandSiteRef(node: HTMLSpanElement | null): void {
  if (node === null) return
  const host = node.closest('button')
  const inToggle = host !== null && /toggle/i.test(host.className)
  node.dataset.rail = inToggle ? 'true' : 'false'
  if (inToggle) delete node.dataset.dshBrand
  else node.dataset.dshBrand = '1'
}

/**
 * Whether a click inside a brand mount should be swallowed: on the
 * expanded brand yes (the wrapper button would otherwise start a session),
 * inside the collapsed rail's toggle never (the click must still expand).
 * @param event - the React mouse event on a brand mount.
 */
function swallowBrandClick(event: { currentTarget: Element; stopPropagation(): void }): void {
  const host = event.currentTarget.closest('button')
  if (host === null || !/toggle/i.test(host.className)) event.stopPropagation()
}

/** Injected face of the `sidebar.brand.mark` occupant. */
export interface AgentBrandMarkInjected {
  hooks: {
    /** Browser snapshot bound by the renderer as useAgents. */
    agents: SnapshotStore<AgentBrowserState>
  }
  /** Leave the agent surface for the roster. */
  back: () => void
}

/** Full component props of the brand-mark occupant. */
export type AgentBrandMarkProps =
  PropsRuntime<'sidebar.brand.mark'>
  & PropsLocale<'agents'>
  & InjectFace<AgentBrandMarkInjected>

/**
 * The `sidebar.brand.mark` occupant: on an agent's surface the whale gives
 * way to the small back control (whose click is stopped from reaching the
 * brand button underneath, which starts a session). The collapsed rail's
 * toggle reuses this same slot for its resting whale, and there the chevron
 * would read as a back control while the button expands — so the occupant
 * mounts both marks and the mount-site ref picks per site: inside the
 * toggle button the whale shows, in the expanded brand the chevron shows.
 * Everywhere off the agent surface it re-renders the official whale
 * fallback, because a registered occupant disables the owner's own
 * fallback path.
 * @param props - brand-mark geometry, the agents store hook, and back.
 * @returns the whale/back mark element.
 */
export function AgentBrandMark({ size, useAgents, back, t }: AgentBrandMarkProps): ReactNode {
  const state = useAgents(snapshot => snapshot)
  if (state.view !== 'agent' || state.selected === '') {
    return (
      <span className={css.brandSwap} ref={brandSiteRef} onClick={swallowBrandClick}>
        <BrandWhale size={size} />
      </span>
    )
  }
  return (
    <span className={css.brandSwap} ref={brandSiteRef} onClick={swallowBrandClick}>
      <BrandWhale size={size} className={css.brandRailWhale} />
      <span
        className={css.brandBack}
        role="button"
        title={t('agents.back')}
        onClick={(event) => {
          event.stopPropagation()
          back()
        }}
      >
        <IconChevronLeftOutlineRegular size={18} />
      </span>
    </span>
  )
}

/** Injected face of the `sidebar.brand.name` occupant. */
export interface AgentBrandNameInjected {
  hooks: {
    /** Browser snapshot bound by the renderer as useAgents. */
    agents: SnapshotStore<AgentBrowserState>
  }
  /** The sidebar namespace's locale seat for the official badge copy. */
  brandText: (key: string) => string
}

/** Full component props of the brand-name occupant. */
export type AgentBrandNameProps =
  PropsRuntime<'sidebar.brand.name'>
  & InjectFace<AgentBrandNameInjected>

/**
 * The `sidebar.brand.name` occupant: an agent's surface names the agent,
 * the roster re-renders the official local-build badge (title plus version
 * when the build metadata is reachable).
 * @param props - the agents store hook and the sidebar locale seat.
 * @returns the brand-name content.
 */
export function AgentBrandName({ useAgents, brandText }: AgentBrandNameProps): ReactNode {
  const state = useAgents(snapshot => snapshot)
  if (state.view === 'agent' && state.selected !== '') {
    const name = state.agents.find(agent => agent.id === state.selected)?.name ?? state.selected
    return (
      <span
        className={css.brandAgentName}
        data-dsh-brand="1"
        title={name}
        onClick={swallowBrandClick}
      >
        {name}
      </span>
    )
  }
  const version = localBuildVersionOf()
  if (version === undefined) {
    return (
      <span className={css.brandFallbackName} data-dsh-brand="1" onClick={swallowBrandClick}>
        {brandText('brand.localBuild')}
      </span>
    )
  }
  return (
    <span className={css.brandStack} data-dsh-brand="1" onClick={swallowBrandClick}>
      <span className={css.brandStackTitle}>{brandText('brand.localBuild')}</span>
      <span className={css.brandStackVersion}>{version}</span>
    </span>
  )
}

/**
 * Seat one nav glyph behind the marker its row is addressed by.
 *
 * The sidebar's panel list is a flat button column whose official rows above
 * the suite's (plugins, skills, scheduled tasks) differ between deployments, so
 * a row cannot be identified by position. The marker travels with the glyph —
 * the click handler dispatches on it and the stylesheet hides/show rows by it.
 * `display: contents` keeps the wrapper out of the layout: the button's own
 * flex rules still see the glyph as their direct child.
 * @param props - row marker and the glyph to seat.
 * @returns the marked glyph.
 */
function MarkedPanelIcon({ mark, children }: { mark: string; children: ReactNode }): ReactNode {
  return <span data-agents-panel={mark} style={{ display: 'contents' }}>{children}</span>
}

/**
 * Render the create-agent glyph at the size the sidebar asks for.
 * @param props - the sidebar's icon share: the requested square edge.
 * @returns the icon element.
 */
export function CreateAgentPanelIcon({ size }: { size: number }): ReactNode {
  return <MarkedPanelIcon mark="create"><IconPlusOutlineRegular size={size} /></MarkedPanelIcon>
}

/**
 * Nav glyphs for the per-agent action rows (new chat / profile / memory):
 * the same icons their former sidebar-surface buttons carried.
 * @param props - the sidebar's icon share: the requested square edge.
 * @returns the icon element.
 */
export function NewChatPanelIcon({ size }: { size: number }): ReactNode {
  return <MarkedPanelIcon mark="newchat"><IconNewChatOutlineMedium size={size} /></MarkedPanelIcon>
}

export function ProfilePanelIcon({ size }: { size: number }): ReactNode {
  return <MarkedPanelIcon mark="profile"><IconEditOutlineRegular size={size} /></MarkedPanelIcon>
}

export function MemoryPanelIcon({ size }: { size: number }): ReactNode {
  return <MarkedPanelIcon mark="memory"><IconDatabaseOutlineRegular size={size} /></MarkedPanelIcon>
}

/** Injected face of the create-agent main panel. */
export interface CreateAgentPageInjected {
  hooks: {
    /** Browser snapshot bound by the renderer as useAgents. */
    agents: SnapshotStore<AgentBrowserState>
  }
  /** Create the agent (identity only). */
  create: (input: AgentFormInput) => Promise<string | undefined>
  /** Close the panel (back to the conversation). */
  close: () => void
}

/** Full component props of the create-agent main panel. */
export type CreateAgentPageProps =
  PropsRuntime<'main'>
  & PropsLocale<'agents'>
  & InjectFace<CreateAgentPageInjected>

/**
 * The 创建 Agent page as a genuine main-area panel, so its nav row is the
 * same control as 插件/技能 — the sidebar-embedded button could never sit
 * flush with the panel rows (its host region clips everything above its
 * box). Creating closes the panel and returns to the conversation; the
 * roster reloads through the shared controller either way.
 * @param props - the agents store hook, the create action, close, locale.
 * @returns the create form page.
 */
export function CreateAgentPage({ useAgents, create, close, t }: CreateAgentPageProps): ReactNode {
  const state = useAgents(snapshot => snapshot)
  return (
    <div className={css.createPage}>
      <AgentForm
        mode="create"
        initial={null}
        busy={state.busy}
        error={state.error}
        t={t}
        onSubmit={(input) => {
          Promise.resolve(create(input)).then(() => close())
        }}
        onCancel={close}
        onDelete={undefined}
      />
    </div>
  )
}

/** Injected face of the profile main panel. */
export interface ProfileMainPageInjected {
  hooks: {
    /** Browser snapshot bound by the renderer as useAgents. */
    agents: SnapshotStore<AgentBrowserState>
  }
  /** Save the edited identity. */
  saveEdit: (id: string, input: AgentFormInput) => Promise<string | undefined>
}

/** Full component props of the profile main panel. */
export type ProfileMainPageProps =
  PropsRuntime<'main'>
  & PropsLocale<'agents'>
  & InjectFace<ProfileMainPageInjected>

/**
 * The 助理档案 page: a bare edit form on the panel's blank page — fields
 * and save only, no chrome. Data is prefilled by the controller's profile
 * loader, which the nav row fires before selecting the panel.
 * @param props - the agents store hook, save action, locale.
 * @returns the bare profile fields page.
 */
export function ProfileMainPage({ useAgents, saveEdit, t }: ProfileMainPageProps): ReactNode {
  const state = useAgents(snapshot => snapshot)
  const profile = state.profile
  const [name, setName] = useState('')
  const [language, setLanguage] = useState('')
  const [description, setDescription] = useState('')
  const [persona, setPersona] = useState('')
  useEffect(() => {
    if (profile === null || profile === undefined) return
    setName(profile.name)
    setLanguage(profile.language)
    setDescription(profile.description)
    setPersona(profile.persona)
  }, [profile])
  const save = (): void => {
    if (name.trim() === '' || persona.trim() === '') return
    void saveEdit(state.selected, {
      name: name.trim(),
      language: language.trim(),
      description: description.trim(),
      persona,
    })
  }
  return (
    <div className={css.createPage}>
      <div className={formCss.fields}>
        <label className={formCss.field}>
          <span className={formCss.label}>{t('form.name')}</span>
          <input
            className={formCss.input}
            value={name}
            onChange={event => { setName(event.target.value) }}
            placeholder={t('form.name.placeholder')}
            disabled={state.busy}
          />
        </label>
        <label className={formCss.field}>
          <span className={formCss.label}>{t('form.description')}</span>
          <input
            className={formCss.input}
            value={description}
            onChange={event => { setDescription(event.target.value) }}
            placeholder={t('form.description.placeholder')}
            disabled={state.busy}
          />
        </label>
        <label className={formCss.field}>
          <span className={formCss.label}>{t('form.language')}</span>
          <input
            className={formCss.input}
            value={language}
            onChange={event => { setLanguage(event.target.value) }}
            placeholder={t('form.language.placeholder')}
            disabled={state.busy}
          />
        </label>
        <label className={formCss.field}>
          <span className={formCss.label}>{t('form.persona')}</span>
          <textarea
            className={formCss.textarea}
            value={persona}
            onChange={event => { setPersona(event.target.value) }}
            placeholder={t('form.persona.placeholder')}
            disabled={state.busy}
          />
        </label>
        <button
          type="button"
          className={formCss.submit}
          disabled={state.busy}
          onClick={save}
        >
          {t('agents.memory.save')}
        </button>
      </div>
    </div>
  )
}

/** Injected face of the memory main panel. */
export interface MemoryMainPageInjected {
  hooks: {
    /** Browser snapshot bound by the renderer as useAgents. */
    agents: SnapshotStore<AgentBrowserState>
  }
  /** Update the memory editor draft. */
  setMemoryText: (text: string) => void
  /** Save the draft to the agent's store. */
  saveMemory: () => Promise<string | undefined>
}

/** Full component props of the memory main panel. */
export type MemoryMainPageProps =
  PropsRuntime<'main'>
  & PropsLocale<'agents'>
  & InjectFace<MemoryMainPageInjected>

/**
 * The 助理记忆 page: a bare editor on the panel's blank page — textarea and
 * save only, no chrome. Data is prefilled by the controller's memory
 * loader, which the nav row fires before selecting the panel.
 * @param props - the agents store hook, memory actions, locale.
 * @returns the bare memory editor page.
 */
export function MemoryMainPage({ useAgents, setMemoryText, saveMemory, t }: MemoryMainPageProps): ReactNode {
  const state = useAgents(snapshot => snapshot)
  const saving = state.memoryState === 'saving'
  return (
    <div className={css.createPage}>
      <textarea
        className={css.memoryTextarea}
        value={state.memoryText}
        disabled={saving}
        onChange={event => { setMemoryText(event.target.value) }}
        spellCheck={false}
      />
      <div className={css.memoryFooter}>
        <button
          type="button"
          className={css.action}
          disabled={saving}
          onClick={() => { void saveMemory() }}
        >
          {saving ? t('agents.memory.saving') : t('agents.memory.save')}
        </button>
        {state.memoryState === 'saved' && <span className={css.memorySaved}>{t('agents.memory.saved')}</span>}
      </div>
    </div>
  )
}

/**
 * Render the agent browsing region.
 * @param props - composed slot props.
 * @returns the agent surface for the current view.
 */
export function AgentBrowser({
  useAgents, useSessions, useArchived, usePinned, useWorkspaceProjection, useView, useScheduleCatalog, viewActions,
  load, modeName, selectAgent, back, openCreate: _openCreate,
  startChat: _startChat, openSession, openProfile: _openProfile, openMemory: _openMemory,
  setMemoryText: _setMemoryText, saveMemory: _saveMemory, backFromMemory: _backFromMemory, toggleCollapsed,
  create, saveEdit: _saveEdit, remove: _remove, renameSession, archiveSession, removeSession, pinSession,
  unpinSession, forkSession, unarchiveSession, searchSessions, searchResultLimit, insertWorkspaceBefore,
  addWorkspace,
  wide, expandSidebar: _expandSidebar,
  t,
}: AgentBrowserProps) {
  const state = useAgents(snapshot => snapshot)
  // The full session snapshot, not a filtered selector: a uSES selector is
  // re-run only when its source changes, so a selector closing over the
  // current selection would keep showing the previous agent's chats when the
  // selection moves but the session list does not. Reading the whole snapshot
  // and filtering in-render keeps the list keyed to the live selection.
  const sessionSnapshot = useSessions(snapshot => snapshot)
  const archivedSet = new Set(useArchived(snapshot => snapshot))
  const pinnedSet = new Set(usePinned(snapshot => snapshot))
  const projection = useWorkspaceProjection(snapshot => snapshot)
  const scheduleCatalog = useScheduleCatalog(snapshot => snapshot)
  const titleByWorkspace = new Map(projection.order.map(workspace => [workspace.id, workspace.title]))
  // Chat-history view options (the official workspace browser's trio),
  // persisted across reloads through the plugin's viewing store.
  const view = useView(snapshot => snapshot)
  // Publish the surface mode for the global panel-row swap (see the
  // AgentBrowser.module.css panelList rules): the roster shows the create
  // row, an agent page swaps it for the three per-agent action rows.
  useEffect(() => {
    const inside = state.selected !== '' && (state.view === 'agent' || state.view === 'edit' || state.view === 'memory')
    document.body.dataset.agentsView = inside ? 'agent' : 'roster'
  }, [state.view, state.selected])
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [chatCollapsed, setChatCollapsed] = useState(false)
  const [viewMenuOpen, setViewMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchInput = useRef<HTMLInputElement>(null)
  const searchRoot = useRef<HTMLDivElement | null>(null)
  // The chat-history member set ignores the archive filter (membership is
  // workspace-owned, so saved manual orders keep every member's slot); the
  // visible rows apply the filter on top.
  const ownedSessions = agentSessionsOf(sessionSnapshot, state.selected, archivedSet, pinnedSet, 'show')
  // A blank draft (never prompted) carries no stored title and would read as
  // a raw session id: it renders as what it is — the agent, its workspace,
  // and its bound mode — instead of the official "New Session" spelling.
  const agentName = state.agents.find(agent => agent.id === state.selected)?.name ?? state.selected
  const wsTitleOf = (sessionId: string): string | undefined => {
    const workspaceId = projection.bySession[sessionId]
    return workspaceId === undefined ? undefined : titleByWorkspace.get(workspaceId)
  }
  const titleOf = (session: AgentSessionEntry): string => {
    if (!session.blank) return session.title
    const parts = [
      agentName,
      wsTitleOf(session.id),
      ...session.modeId === undefined ? [] : [modeName(session.modeId)],
    ]
    return parts.filter(part => part !== undefined && part !== '').join(' · ')
  }
  const trimmedQuery = query.trim()

  // In-flight chat-row drag: source identity plus the current insert marker.
  // Search swaps the list for merged results, so drags pause there too.
  const [drag, setDrag] = useState<ChatDragIntent | null>(null)
  const dropCommitted = useRef(false)
  useNativeDragAcceptance(drag !== null)

  // The remote half of the search: the Host content index paged behind the
  // local title matches. Debounced like the official browser; a superseded
  // query's response is dropped by the aborted controller.
  const [remoteSearch, setRemoteSearch] = useState<{
    query: string
    status: 'idle' | 'loading' | 'ready' | 'error'
    items: readonly { sessionId: string; snippet: string }[]
    hasMore: boolean
  }>({ query: '', status: 'idle', items: [], hasMore: false })
  useEffect(() => {
    if (trimmedQuery === '') {
      setRemoteSearch({ query: '', status: 'idle', items: [], hasMore: false })
      return
    }
    const controller = new AbortController()
    setRemoteSearch({ query: trimmedQuery, status: 'loading', items: [], hasMore: false })
    const timer = window.setTimeout(() => {
      searchSessions(trimmedQuery, controller.signal).then((result) => {
        if (controller.signal.aborted) return
        setRemoteSearch({ query: trimmedQuery, status: 'ready', items: result.items, hasMore: result.hasMore })
      }).catch(() => {
        if (controller.signal.aborted) return
        setRemoteSearch({ query: trimmedQuery, status: 'error', items: [], hasMore: false })
      })
    }, 250)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [trimmedQuery, searchSessions])

  // Workspace drag (grouped view): reorder via the Host's insert-before verb.
  // The order lives Host-side, so there is no local store to write.
  const [wsDrag, setWsDrag] = useState<{
    workspaceId: string
    over: { id: string; half: 'before' | 'after' } | null
  } | null>(null)
  const wsDropCommitted = useRef(false)
  useNativeDragAcceptance(wsDrag !== null)

  // Official web defaults for the two browsing shortcuts the official
  // browser owns (its hidden handlers resolve harmlessly beneath the shadow):
  // Ctrl/Cmd+Alt+K opens this browser's search, Ctrl/Cmd+Alt+O adds a
  // workspace through the Host picker.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!(event.ctrlKey || event.metaKey) || !event.altKey || event.shiftKey) return
      if (event.code === 'KeyK') {
        if (searchInput.current === null) return
        event.preventDefault()
        setSearchExpanded(true)
        searchInput.current.focus({ preventScroll: true })
      } else if (event.code === 'KeyO') {
        event.preventDefault()
        addWorkspace().catch((reason: unknown) => {
          console.warn('workspace add failed:', reason)
        })
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown) }
  }, [addWorkspace])

  // The selected session, for the workspace group's auto-expand.
  const currentSessionId = Object.values(sessionSnapshot.byId)
    .find(session => (session.retainedBy.mainView ?? 0) > 0)?.id

  useEffect(() => {
    if (view.groupBy !== 'workspace' || currentSessionId === undefined) return
    const workspaceId = projection.bySession[currentSessionId]
    const key = workspaceId !== undefined && projection.order.some(ws => ws.id === workspaceId)
      ? `ws:${workspaceId}`
      : 'ung'
    if (view.groupExpansion[key] !== undefined) return
    viewActions.setGroupExpanded(key, true)
  }, [view.groupBy, view.groupExpansion, projection, currentSessionId, viewActions])

  // Saved orders of deleted agents and deleted workspaces are dead weight.
  // Both registries must have streamed in first: pruning against an empty
  // roster or an empty workspace list would mistake every saved order for an
  // orphan (the official browser gates the same pass on its ready phase).
  useEffect(() => {
    if (state.status !== 'ready' || projection.order.length === 0) return
    viewActions.retainAgents(
      state.agents.map(agent => agent.id),
      projection.order.map(workspace => workspace.id),
    )
  }, [state.status, state.agents, projection, viewActions])

  useEffect(() => {
    void load()
  }, [load])

  // Chat row actions: the three-dot menu, plus the rename / delete dialogs.
  // Hooks run unconditionally above every view branch (React rules); the
  // dialogs themselves render only on the agent page, where rows exist.
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [renameTarget, setRenameTarget] = useState<{ sessionId: string; currentTitle: string } | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)
  const composingRef = useRef(false)
  const renameTrimmed = renameDraft.trim()
  const renameBlocked = renaming || renameTrimmed === '' || renameTarget === null
  const closeRename = () => {
    if (renaming) return
    setRenameTarget(null)
    setRenameError(null)
  }
  const confirmRename = () => {
    if (renameBlocked || renameTarget === null) return
    setRenaming(true)
    setRenameError(null)
    renameSession(renameTarget.sessionId, renameTrimmed).then(() => {
      setRenaming(false)
      setRenameTarget(null)
    }).catch((reason: unknown) => {
      setRenaming(false)
      setRenameError(reason instanceof Error ? reason.message : String(reason))
    })
  }
  const onRename = (sessionId: string, currentTitle: string) => {
    setRenameTarget({ sessionId, currentTitle })
    setRenameDraft(currentTitle)
    setRenameError(null)
  }

  const [deleteTarget, setDeleteTarget] = useState<{ sessionId: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const closeDelete = () => {
    if (deleting) return
    setDeleteTarget(null)
    setDeleteError(null)
  }
  const confirmDelete = () => {
    if (deleting || deleteTarget === null) return
    setDeleting(true)
    setDeleteError(null)
    removeSession(deleteTarget.sessionId).then((failure) => {
      setDeleting(false)
      if (failure !== undefined) {
        setDeleteError(t(failure as AgentsKey))
        return
      }
      setDeleteTarget(null)
    }).catch((reason: unknown) => {
      setDeleting(false)
      setDeleteError(reason instanceof Error ? reason.message : String(reason))
    })
  }

  if (state.status === 'loading' || state.status === 'idle') {
    return <div className={css.centered}>{t('agents.loading')}</div>
  }
  if (state.status === 'error') {
    return (
      <div className={css.centered}>
        <div className={css.error}>{state.error ?? t('error.loadFailed')}</div>
        <button type="button" className={css.retry} onClick={() => { void load() }}>
          {t('agents.retry')}
        </button>
      </div>
    )
  }

  if (state.view === 'create') {
    return (
      <AgentForm
        mode="create"
        initial={null}
        busy={state.busy}
        error={state.error}
        t={t}
        onSubmit={(input) => { void create(input) }}
        onCancel={back}
        onDelete={undefined}
      />
    )
  }

  // The agent page: the selected agent's chat history. The profile and
  // memory editors live on their own main-area panels now (opened by the
  // nav rows), so edit/memory views ride this same agent surface instead
  // of swapping the sidebar to an embedded form.
  if ((state.view === 'agent' || state.view === 'edit' || state.view === 'memory') && state.selected !== '') {
    const selected = state.selected
    const name = state.agents.find(agent => agent.id === selected)?.name ?? selected
    void name

    // History accounts: one per workspace section plus the ungrouped bucket
    // (grouped view), or the single flat account. Membership is complete —
    // archives included — so saved manual orders keep every member's slot.
    const accounts = new Map<string, AgentSessionEntry[]>()
    if (view.groupBy === 'workspace') {
      for (const workspace of projection.order) accounts.set(`ws:${workspace.id}`, [])
      accounts.set('ung', [])
    }
    for (const entry of ownedSessions) {
      const key = view.groupBy !== 'workspace'
        ? 'flat'
        : (() => {
          const workspaceId = projection.bySession[entry.id]
          return workspaceId !== undefined && accounts.has(`ws:${workspaceId}`) ? `ws:${workspaceId}` : 'ung'
        })()
      const members = accounts.get(key)
      if (members === undefined) accounts.set(key, [entry])
      else members.push(entry)
    }
    const fullKey = (account: string): string => accountKeyOf(selected, account)
    const rowState = {
      pinnedSessionIds: [...pinnedSet],
      archivedSessionIds: [...archivedSet],
    }
    // The account's full membership in display order: recency (already
    // projected above) or the reconciled saved manual order.
    const orderedIdsOf = (account: string): string[] => {
      const members = accounts.get(account) ?? []
      if (view.orderBy === 'updated') return members.map(entry => entry.id)
      return reconcileManualOrder(
        members.map(entry => entry.id),
        view.sessionOrderByAccount[fullKey(account)],
        sessionSnapshot.byId,
        rowState,
      )
    }
    const visibleOf = (entry: AgentSessionEntry): boolean => {
      if (view.archivedFilter === 'show') return true
      return view.archivedFilter === 'only' ? archivedSet.has(entry.id) : !archivedSet.has(entry.id)
    }
    const rowsOf = (account: string): AgentSessionEntry[] => {
      const byId = new Map((accounts.get(account) ?? []).map(entry => [entry.id, entry]))
      return orderedIdsOf(account).flatMap((id) => {
        const entry = byId.get(id)
        return entry !== undefined && visibleOf(entry) ? [entry] : []
      })
    }
    // The merged search view: local title/workspace matches lead (this
    // browser's scope is the selected agent's history), then the Host content
    // page in backend order; duplicates keep the local row. Blanks never
    // match, and the archived filter applies to both halves.
    const searchQ = trimmedQuery.toLowerCase()
    const searchView = (() => {
      if (trimmedQuery === '') return null
      const merged: { entry: AgentSessionEntry; snippet?: string }[] = []
      const seen = new Set<string>()
      for (const entry of ownedSessions) {
        if (entry.blank || !visibleOf(entry)) continue
        if (titleOf(entry).toLowerCase().includes(searchQ)
          || (wsTitleOf(entry.id) ?? '').toLowerCase().includes(searchQ)) {
          merged.push({ entry })
          seen.add(entry.id)
        }
      }
      for (const item of remoteSearch.items) {
        if (seen.has(item.sessionId)) continue
        const entry = ownedSessions.find(candidate => candidate.id === item.sessionId)
        if (entry === undefined || entry.blank || !visibleOf(entry)) continue
        merged.push({ entry, snippet: item.snippet })
        seen.add(item.sessionId)
      }
      return {
        rows: merged.slice(0, searchResultLimit),
        hasMore: remoteSearch.hasMore || merged.length > searchResultLimit,
        pending: remoteSearch.query !== trimmedQuery || remoteSearch.status === 'loading',
      }
    })()
    // Every account's current order: the manual switch's and a drag's base.
    const initialOrders = (): Record<string, readonly string[]> =>
      Object.fromEntries([...accounts.keys()].map(account => [fullKey(account), orderedIdsOf(account)]))

    // Workspace sections lead in Host order, the ungrouped bucket trails;
    // sections without visible rows stay out of the way. The section holding
    // the open session tints its folder, the official active-group mark.
    const currentAccount = view.groupBy !== 'workspace' || currentSessionId === undefined
      ? undefined
      : (() => {
        const workspaceId = projection.bySession[currentSessionId]
        return workspaceId !== undefined && accounts.has(`ws:${workspaceId}`) ? `ws:${workspaceId}` : 'ung'
      })()
    const sections: { key: string; label: string; active: boolean; rows: AgentSessionEntry[] }[] =
      view.groupBy === 'workspace'
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
        : [{ key: 'flat', label: '', active: false, rows: rowsOf('flat') }]

    const commitDrag = (activeDrag: ChatDragIntent, over: ChatDropTarget): void => {
      if (dropCommitted.current) return
      dropCommitted.current = true
      setDrag(null)
      if (over.id === activeDrag.sessionId) return
      const dragRows = rowsOf(activeDrag.account).map(entry => ({
        id: entry.id,
        blank: entry.blank,
        pinned: pinnedSet.has(entry.id),
      }))
      const next = sessionDragOrder(
        (accounts.get(activeDrag.account) ?? []).map(entry => entry.id),
        dragRows,
        activeDrag,
        over,
      )
      if (next !== undefined) viewActions.setSessionOrder(fullKey(activeDrag.account), next, initialOrders())
    }

    // The official workspace reorder: the anchor is the target row for a
    // 'before' half, the following sibling for 'after'; no-ops for self and
    // for moves that change nothing.
    const commitWorkspaceDrag = (
      activeDrag: { workspaceId: string },
      over: { id: string; half: 'before' | 'after' },
    ): void => {
      if (wsDropCommitted.current) return
      wsDropCommitted.current = true
      setWsDrag(null)
      const order = projection.order.map(workspace => workspace.id)
      const rowIndex = order.indexOf(over.id)
      if (rowIndex === -1) return
      const anchor = over.half === 'before' ? over.id : order[rowIndex + 1]
      if (anchor === activeDrag.workspaceId) return
      const sourceIndex = order.indexOf(activeDrag.workspaceId)
      const anchorIndex = anchor === undefined ? order.length : order.indexOf(anchor)
      if (sourceIndex === -1 || anchorIndex === sourceIndex || anchorIndex === sourceIndex + 1) return
      insertWorkspaceBefore(activeDrag.workspaceId, anchor).catch((reason: unknown) => {
        console.warn('workspace reorder rejected:', reason)
      })
    }

    // One chat row on the official session-row anatomy: a 16px leading slot
    // (offering the extension seat — the schedule mark lives there), the
    // title, the relative time (blank drafts carry none), the rest-state
    // pin marker, and the hover-revealed action strip that takes the time's
    // place. The row itself opens the session; the action strip keeps its
    // clicks. Blanks, archives, and search results never start a drag; a drop
    // onto a blank always lands after it. A content-search row carries the
    // matched snippet as a second line.
    const renderChatRow = (session: AgentSessionEntry, account: string, snippet?: string): ReactNode => {
      const isArchived = archivedSet.has(session.id)
      const isPinned = pinnedSet.has(session.id)
      const draggable = trimmedQuery === '' && !session.blank && !isArchived
      const compatible = drag !== null && drag.account === account && drag.pinned === isPinned
      const normalizeHalf = (half: 'before' | 'after'): 'before' | 'after' =>
        session.blank ? 'after' : half
      const marker = compatible && drag?.over?.id === session.id ? drag.over.half : null
      return (
        <div
          role="treeitem"
          aria-selected={session.current}
          className={clsx(
            css.chatRow,
            session.current && css.active,
            menuOpenId === session.id && css.menuOpen,
            isArchived && css.chatArchived,
            marker === 'before' && css.dropBefore,
            marker === 'after' && css.dropAfter,
          )}
          onClick={() => { openSession(session.id) }}
          draggable={draggable}
          onDragStart={!draggable
            ? undefined
            : (e) => {
              e.dataTransfer.effectAllowed = 'move'
              e.dataTransfer.setData('text/plain', session.id)
              dropCommitted.current = false
              setDrag({ account, sessionId: session.id, pinned: isPinned, over: null })
            }}
          onDragEnd={!draggable
            ? undefined
            : () => {
              if (drag?.over !== null && drag?.over !== undefined) commitDrag(drag, drag.over)
              else setDrag(null)
              dropCommitted.current = false
            }}
          onDragOver={!compatible
            ? undefined
            : (e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
              const half = normalizeHalf(rowHalf(e))
              setDrag(current => current === null ? current : { ...current, over: { id: session.id, half } })
            }}
          onDrop={!compatible
            ? undefined
            : (e) => {
              e.preventDefault()
              if (drag !== null) commitDrag(drag, { id: session.id, half: normalizeHalf(rowHalf(e)) })
            }}
        >
          <span className={css.chatSlot}>
            {!session.blank && !isArchived && scheduleCatalog.settled
              && scheduleCatalog.records.some(
                record => record.sessionId === session.id && record.status === 'active',
              ) && (
              <span
                className={css.scheduleMark}
                data-session-schedule-mark=""
                title={t('chat.schedule.mark')}
                onClick={(e) => { e.stopPropagation() }}
              >
                <IconClockOutlineRegular size={12} />
              </span>
            )}
          </span>
          {snippet === undefined
            ? <span className={css.chatTitle}>{titleOf(session)}</span>
            : (
              <span className={css.chatBody}>
                <span className={css.chatTitle}>{titleOf(session)}</span>
                {snippet !== '' && <span className={css.chatSnippet}>{snippet}</span>}
              </span>
            )}
          {!session.blank && (
            <span className={css.chatTime}>{chatTimeLabel(session.updatedAt, Date.now(), t)}</span>
          )}
          {isPinned && !isArchived && (
            <span className={css.chatPinIndicator} role="img" aria-label={t('chat.actions.pin')}
              title={t('chat.actions.pin')}
            >
              <IconPinFillRegular size={14} />
            </span>
          )}
          <span className={css.chatRowActions} onClick={(e) => { e.stopPropagation() }}>
            <Menu
              open={menuOpenId === session.id}
              onClose={() => { setMenuOpenId(null) }}
              items={[
                ...isArchived ? [] : [{
                  id: 'pin',
                  label: t(isPinned ? 'chat.menu.unpinSession' : 'chat.menu.pinSession'),
                  icon: isPinned ? <IconPinFillRegular /> : <IconPinOutlineRegular />,
                }],
                {
                  id: 'rename', label: t('chat.menu.rename'), icon: <IconEditOutlineRegular />,
                  shortcut: { keys: ['Ctrl', 'Shift', 'R'], aria: 'Control+Shift+R' },
                },
                {
                  id: 'fork', label: t('chat.menu.fork'), icon: <IconBranchOutlineRegular />,
                  shortcut: { keys: ['Ctrl', 'Shift', 'F'], aria: 'Control+Shift+F' },
                },
                {
                  id: isArchived ? 'unarchive' : 'archive',
                  label: t(isArchived ? 'chat.menu.unarchive' : 'chat.menu.archive'),
                  icon: <IconArchiveOutlineRegular />,
                  ...isArchived ? {} : { shortcut: { keys: ['Ctrl', 'Alt', 'A'], aria: 'Control+Alt+A' } },
                },
                { type: 'separator' as const, id: 'danger-separator' },
                { id: 'delete', label: t('chat.menu.delete'), icon: <IconTrashOutlineRegular /> },
              ]}
              onSelect={(id) => {
                setMenuOpenId(null)
                if (id === 'pin') {
                  ;(isPinned ? unpinSession : pinSession)(session.id).catch((reason: unknown) => {
                    console.warn('session pin rejected:', reason)
                  })
                }
                if (id === 'rename') onRename(session.id, titleOf(session))
                if (id === 'fork') {
                  forkSession(session.id).catch((reason: unknown) => {
                    console.warn('session fork rejected:', reason)
                  })
                }
                if (id === 'archive') {
                  archiveSession(session.id).catch((reason: unknown) => {
                    console.warn('session archive rejected:', reason)
                  })
                }
                if (id === 'unarchive') {
                  unarchiveSession(session.id).catch((reason: unknown) => {
                    console.warn('session unarchive rejected:', reason)
                  })
                }
                if (id === 'delete') {
                  setDeleteTarget({ sessionId: session.id, title: session.title })
                  setDeleteError(null)
                }
              }}
              portal
              closeOnPointerLeave
              anchor={(
                <button
                  type="button"
                  className={css.chatRowAction}
                  aria-label={t('chat.menu.rename')}
                  onClick={(e) => { e.stopPropagation(); setMenuOpenId(v => v === session.id ? null : session.id) }}
                >
                  <IconEllipsisOutlineMedium />
                </button>
              )}
            />
            <button
              type="button"
              className={css.chatRowAction}
              aria-label={t(isArchived ? 'chat.actions.unarchive' : 'chat.actions.archive')}
              onClick={(e) => {
                e.stopPropagation()
                ;(isArchived ? unarchiveSession : archiveSession)(session.id).catch((reason: unknown) => {
                  console.warn('session archive toggle rejected:', reason)
                })
              }}
            >
              <IconArchiveOutlineRegular size={14} />
            </button>
            {!isArchived && (
              <button
                type="button"
                className={css.chatRowAction}
                aria-label={t(isPinned ? 'chat.actions.unpin' : 'chat.actions.pin')}
                onClick={(e) => {
                  e.stopPropagation()
                  ;(isPinned ? unpinSession : pinSession)(session.id).catch((reason: unknown) => {
                    console.warn('session pin rejected:', reason)
                  })
                }}
              >
                {isPinned
                  ? <IconPinFillRegular size={14} />
                  : <IconPinOutlineRegular size={14} />}
              </button>
            )}
          </span>
        </div>
      )
    }
    return (
      <div className={css.root}>
        {/* A local key translates; a raw wire message (not a key) falls back to itself. */}
        {state.error !== null && <div className={css.error} role="alert">{t(state.error as AgentsKey)}</div>}

        {wide && (
        <div className={css.sectionHeader}>
          <button
            type="button"
            className={css.collapsibleTitle}
            onClick={() => { setChatCollapsed(v => !v) }}
            aria-expanded={!chatCollapsed}
          >
            <span className={clsx(css.chevron, chatCollapsed && css.chevronClosed)}>▸</span>
            <span className={css.sectionLabel}>{t('agents.chatHistory')}</span>
          </button>
          {!chatCollapsed && (
          <div className={clsx(css.searchSlot, searchExpanded && css.searchSlotExpanded)}>
            <div
              ref={searchRoot}
              className={clsx(css.search, searchExpanded && css.searchExpanded)}
              onClick={() => { setSearchExpanded(true); searchInput.current?.focus() }}
            >
              <Tooltip label={t('chat.search')} side="bottom" delayMs={500} disabled={searchExpanded}>
                <button
                  type="button"
                  className={css.searchButton}
                  aria-label={t('chat.search')}
                  aria-expanded={searchExpanded}
                  onClick={(e) => { e.stopPropagation(); setSearchExpanded(true); searchInput.current?.focus() }}
                >
                  <IconSearchOutlineRegular size={searchExpanded ? 11 : 14} />
                </button>
              </Tooltip>
              <input
                ref={searchInput}
                className={css.searchInput}
                type="text"
                placeholder={t('chat.search.placeholder')}
                value={query}
                tabIndex={searchExpanded ? 0 : -1}
                onChange={(e) => { setQuery(e.target.value) }}
                onKeyDown={(e) => {
                  if (e.key !== 'Escape') return
                  setQuery('')
                  setSearchExpanded(false)
                }}
              />
              {searchExpanded && (
                <button
                  type="button"
                  className={css.clearButton}
                  aria-label={t('chat.search.clear')}
                  onClick={(e) => {
                    e.stopPropagation()
                    setQuery('')
                    setSearchExpanded(false)
                  }}
                >
                  <IconCloseFillRegular />
                </button>
              )}
            </div>
          </div>
          )}
          {!chatCollapsed && (
          <div className={css.headerActions}>
            <Menu
              open={viewMenuOpen}
              onClose={() => { setViewMenuOpen(false) }}
              items={[
                { type: 'label' as const, id: 'group-by', text: t('chat.groupBy.label') },
                { id: 'workspace', label: t('chat.groupBy.workspace'), icon: <IconFolderCloseRegular /> },
                { id: 'flat', label: t('chat.groupBy.flat'), icon: <IconFlatListOutlineRegular /> },
                { type: 'separator' as const, id: 'order-by-separator' },
                { type: 'label' as const, id: 'order-by', text: t('chat.orderBy.label') },
                { id: 'manual', label: t('chat.orderBy.manual'), icon: <IconChevronsUpDownOutlineRegular /> },
                { id: 'updated', label: t('chat.orderBy.updated'), icon: <IconClockOutlineRegular /> },
                { type: 'separator' as const, id: 'archived-filter-separator' },
                { type: 'label' as const, id: 'filter-by', text: t('chat.filterBy.label') },
                { id: 'hide-archived', label: t('chat.viewOptions.hideArchived'), icon: <IconArchiveOffOutlineRegular /> },
                { id: 'show-archived', label: t('chat.viewOptions.showArchived'), icon: <IconQueueOutlineRegular /> },
                { id: 'only-archived', label: t('chat.viewOptions.onlyArchived'), icon: <IconArchiveCheckOutlineRegular /> },
              ]}
              selectedIds={[
                view.groupBy,
                view.orderBy,
                { default: 'hide-archived', show: 'show-archived', only: 'only-archived' }[view.archivedFilter],
              ]}
              onSelect={(id) => {
                if (id === 'workspace' || id === 'flat') viewActions.setGroupBy(id)
                else if (id === 'manual' || id === 'updated') viewActions.setOrderBy(id, initialOrders())
                else if (id === 'hide-archived') viewActions.setArchivedFilter('default')
                else if (id === 'show-archived') viewActions.setArchivedFilter('show')
                else if (id === 'only-archived') viewActions.setArchivedFilter('only')
                setViewMenuOpen(false)
              }}
              align="end"
              dense
              portal
              listClassName={css.viewOptionsMenu}
              anchor={(
                <Tooltip label={t('chat.viewOptions.label')} side="bottom" delayMs={500}>
                  <button
                    type="button"
                    className={css.iconButton}
                    aria-label={t('chat.viewOptions.label')}
                    onClick={() => { setViewMenuOpen(v => !v) }}
                  >
                    <IconSlidersTwoOutlineRegular />
                  </button>
                </Tooltip>
              )}
            />
            <Tooltip label={t('chat.workspace.add')} side="bottom" delayMs={500}>
              <button
                type="button"
                className={css.iconButton}
                aria-label={t('chat.workspace.add')}
                onClick={() => {
                  addWorkspace().catch((reason: unknown) => {
                    console.warn('workspace add failed:', reason)
                  })
                }}
              >
                <IconProjectAddOutlineRegular size={16} />
              </button>
            </Tooltip>
          </div>
          )}
        </div>
        )}

        {chatCollapsed || !wide ? undefined : searchView !== null ? (
          <div className={css.searchResults} role="tree" aria-label={t('chat.search')}>
            {searchView.rows.map(({ entry, snippet }) => (
              <div key={entry.id}>{renderChatRow(entry, 'flat', snippet)}</div>
            ))}
            {searchView.pending && (
              <div className={css.searchStatus} role="status">{t('search.pending')}</div>
            )}
            {!searchView.pending && searchView.rows.length === 0 && (
              <div className={css.empty}>{t('search.noMatches')}</div>
            )}
            {searchView.hasMore && (
              <div className={css.searchStatus}>{t('search.hasMore', { n: searchResultLimit })}</div>
            )}
          </div>
        ) : (
          <>
            {sections.every(section => section.rows.length === 0) && (
              <div className={css.empty}>
                {t(view.archivedFilter === 'only' ? 'chat.search.empty' : 'agents.chatHistory.empty')}
              </div>
            )}

            <ul className={css.list}>
              {sections.map(section => {
                const expanded = section.label === '' || (view.groupExpansion[section.key] ?? false)
                const workspaceId = section.key.startsWith('ws:') ? section.key.slice(3) : undefined
                const wsCompatible = wsDrag !== null && workspaceId !== undefined
                  && wsDrag.workspaceId !== workspaceId
                const wsMarker = workspaceId !== undefined && wsDrag?.over?.id === workspaceId
                  ? wsDrag.over.half
                  : null
                return (
                  <li key={section.key} className={section.label === '' ? undefined : css.groupSection}>
                    {section.label !== '' && (
                      <button
                        type="button"
                        className={clsx(
                          css.groupHeader,
                          wsMarker === 'before' && css.groupDropBefore,
                          wsMarker === 'after' && css.groupDropAfter,
                        )}
                        aria-expanded={expanded}
                        draggable={workspaceId !== undefined && trimmedQuery === ''}
                        onDragStart={workspaceId === undefined
                          ? undefined
                          : (e) => {
                            e.dataTransfer.effectAllowed = 'move'
                            e.dataTransfer.setData('text/plain', workspaceId)
                            wsDropCommitted.current = false
                            setWsDrag({ workspaceId, over: null })
                          }}
                        onDragEnd={workspaceId === undefined
                          ? undefined
                          : () => {
                            if (wsDrag?.over !== null && wsDrag?.over !== undefined) {
                              commitWorkspaceDrag(wsDrag, wsDrag.over)
                            } else setWsDrag(null)
                            wsDropCommitted.current = false
                          }}
                        onDragOver={!wsCompatible
                          ? undefined
                          : (e) => {
                            e.preventDefault()
                            e.dataTransfer.dropEffect = 'move'
                            const half = rowHalf(e)
                            setWsDrag(current => current === null
                              ? current
                              : { ...current, over: { id: workspaceId, half } })
                          }}
                        onDrop={!wsCompatible
                          ? undefined
                          : (e) => {
                            e.preventDefault()
                            if (wsDrag !== null) commitWorkspaceDrag(wsDrag, { id: workspaceId, half: rowHalf(e) })
                          }}
                        onClick={() => { viewActions.setGroupExpanded(section.key, !expanded) }}
                      >
                        {/* The official group row: folder by default, expand
                            arrow on hover; the open session's folder tints. */}
                        <span className={clsx(css.groupSlot, section.active && css.groupSlotActive)}>
                          <span className={css.groupFolder}>
                            {expanded ? <IconFolderOpenRegular /> : <IconFolderCloseRegular />}
                          </span>
                          <span className={css.groupChevron}>
                            <IconTriangleRightFillRegular className={clsx(css.groupArrow, expanded && css.groupArrowOpen)} />
                          </span>
                        </span>
                        <span className={css.groupTitle}>{section.label}</span>
                      </button>
                    )}
                    {expanded && (
                      <ul className={css.groupRows}>
                        {section.rows.map(session => (
                          <li key={session.id}>{renderChatRow(session, section.key)}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </>
        )}

        <Modal
          open={renameTarget !== null}
          onClose={closeRename}
          closeLabel={t('close')}
          title={t('chat.rename.title')}
          footer={(
            <>
              <Button variant="outline" disabled={renaming} onClick={closeRename}>{t('cancel')}</Button>
              <Button variant="primary" disabled={renameBlocked} onClick={confirmRename}>{t('chat.menu.rename')}</Button>
            </>
          )}
        >
          <input
            className={css.renameInput}
            value={renameDraft}
            aria-label={t('chat.rename.field')}
            autoFocus
            disabled={renaming}
            onFocus={(e) => { e.target.select() }}
            onChange={(e) => { setRenameDraft(e.target.value); setRenameError(null) }}
            onCompositionStart={() => { composingRef.current = true }}
            onCompositionEnd={() => { composingRef.current = false }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !composingRef.current) {
                e.preventDefault()
                confirmRename()
              }
            }}
          />
          {renameError !== null && <div className={css.dialogError} role="alert">{renameError}</div>}
        </Modal>
        <Modal
          open={deleteTarget !== null}
          onClose={closeDelete}
          closeLabel={t('close')}
          title={t('chat.delete.title')}
          {...deleteTarget === null
            ? {}
            : { description: t('chat.delete.desc') }}
          footer={(
            <>
              <Button variant="outline" disabled={deleting} onClick={closeDelete}>{t('cancel')}</Button>
              <Button
                variant="outline"
                className={css.deleteAction}
                disabled={deleting}
                onClick={confirmDelete}
              >
                {t('chat.delete.confirm')}
              </Button>
            </>
          )}
        >
          {deleteError !== null && <div className={css.dialogError} role="alert">{deleteError}</div>}
        </Modal>
      </div>
    )
  }

  // The roster page: the collapsible "My Agents" list. Creating happens on
  // the main-area panel opened by the global panel row, so the region only
  // renders wide content (the rail carries no roster).
  return (
    <div className={css.root}>
      {wide && (
      <div className={css.sectionHeader}>
        <button
          type="button"
          className={css.collapsibleTitle}
          onClick={toggleCollapsed}
          aria-expanded={!state.collapsed}
        >
          <span className={clsx(css.chevron, state.collapsed && css.chevronClosed)}>▸</span>
          <span className={css.sectionLabel}>{t('agents.title')}</span>
        </button>
      </div>
      )}

      {wide && state.agents.length === 0 && (
        <div className={css.empty}>{t('agents.empty')}</div>
      )}

      {wide && !state.collapsed && (
        <ul className={css.list}>
          {state.agents.map(agent => (
            <li key={agent.id}>
              <button
                type="button"
                className={rowClass(agent.id === state.selected)}
                onClick={() => { selectAgent(agent.id) }}
              >
                <span className={css.rowName}>{agent.name}</span>
                {agent.description !== undefined && (
                  <span className={css.rowDescription}>{agent.description}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
