/**
 * Agent management plugin, browser half: the whole agent suite in one
 * package. It mounts its own Remote namespaces (identity authoring and
 * long-term memory) onto the shared `remote` service, registers the sidebar's
 * agent browser into the shell's browsing hole (shadowing the workspace
 * browser at a lower priority), shadows the official hero mode chip with one
 * scoped to the shipped modes and authored-agent ownership, seats the memory
 * button in the assistant actions strip that sends selected messages through
 * the memory plugin's remember path, gates the
 * conversation region (the bare brand hero outside an agent page), and
 * publishes the chat-time agent context the mode pick composes through.
 *
 * An agent is identity only — name, language, persona, description. One agent
 * is one folder under the authoring root; its chat-time compositions live as
 * entries of a single `compositions.yml` inside it, and a session's ownership
 * is the host-side `agentOwner` projection.
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
// The generated Remote contributions this package owns: mounted here, not by
// the deployment's shared remote assembly, so the suite installs as one unit.
import agentPresetAuthoringRemote from '@istarry/dsh-agent-preset-authoring/remote'
import agentMemoryRemote from '@istarry/dsh-agent-memory/remote'
// Type-only: pulls the ctx.remote merge and the namespaces' payload faces.
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the Session Controller service merge (ctx.sessions).
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
// Type-only: pulls the Workspace Controller service merge (ctx.workspaces).
import type {} from '@deepseek-ai/dsh-api-workspace-controller/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the ui-sidebar SlotMap merge ('sidebar.workspaces',
// 'sidebar.brand.mark', 'sidebar.brand.name', 'sidebar.panellist').
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
// Type-only: pulls the ui-layout service merge (ctx.layout) and the 'main'
// keyed slot declaration.
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
// Type-only: pulls the SlotRegistry service merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
// Type-only: pulls the ui-conversation SlotMap merge ('conversation.content').
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Type-only: pulls the ui-workspace service merge (ctx.uiWorkspace).
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
// Type-only: pulls the ui-chat SlotMap + SessionStandardProps merges (the
// assistant-actions entry and its useChat seat).
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
// Type-only: pulls the official preset display dictionary namespace.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { WorkspaceId } from '@deepseek-ai/dsh-api-workspace-controller/client'
import { presetDisplayText } from '@deepseek-ai/dsh-agent-preset-registry/display'
import { DEFAULT_WORKSPACE_DIRECTORY } from '@deepseek-ai/dsh-api-workspace-controller/default-workspace'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store'
import { AgentBrowser } from './AgentBrowser.tsx'
import {
  AgentBrandMark, AgentBrandName,
  CreateAgentPage, CreateAgentPanelIcon,
  MemoryMainPage, MemoryPanelIcon,
  NewChatPanelIcon, ProfileMainPage, ProfilePanelIcon,
} from './AgentBrowser.tsx'
import type { AgentBrowserInjected, WorkspaceProjection } from './AgentBrowser.tsx'
import { ArchiveConfirmDialog, RowActionToast } from './ArchiveSurfaces.tsx'
import type { ArchiveConfirmRequest, RowToastState } from './ArchiveSurfaces.tsx'
import { HeroChip } from './hero.tsx'
import type { HeroChipInjected } from './hero.tsx'
import { MemoryActions } from './MemoryEntry.tsx'
import type { MemoryActionsInjected } from './MemoryEntry.tsx'
import { ConversationGate } from './ConversationGates.tsx'
import { AgentBrowserController, HeroSeatController } from './stores.ts'
import type { AgentFormInput, WorkspaceLaunchFace } from './stores.ts'
import { createAgentViewStore } from './view.ts'
import { createScheduleCatalogSource } from './ScheduleMark.ts'
import { en, zh, type AgentsKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The agent roster, forms, hero chip, and Define-mode copy. */
    agents: AgentsKey
  }
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /**
     * The chat-time agent context: which agent a pending chat-start belongs
     * to, and how a mode pick composes a combined preset for it.
     */
    uiAgents?: UiAgentsService
  }
}

/** The service ui-agents publishes for the chat-time mode pick. */
export interface UiAgentsService {
  /** The agent a pending chat-start belongs to, absent otherwise. */
  pendingAgent: () => string | undefined
  /**
   * Ensure the combined preset for the pending agent + mode exists and
   * return its id.
   * @param modeId - the mode the user picked.
   */
  composeForPendingAgent: (modeId: string) => Promise<string | undefined>
  /**
   * Ensure the combined preset for one agent + mode exists and return its
   * id — the same path a pending chat start takes, so a later mode pick on a
   * blank agent-owned session re-composes for the SAME agent.
   * @param agentId - the agent whose chat the composition belongs to.
   * @param modeId - the mode the user picked.
   */
  composeForAgent: (agentId: string, modeId: string) => Promise<string | undefined>
  /** Map a combined preset id back to its mode id, when it is one. */
  modeIdFor: (combinedId: string) => string | undefined
  /** Clear the pending chat context once the session has bound its preset. */
  consumePendingAgent: () => void
}

/** Dictionary namespace owned by this plugin. */
const NS = 'agents'

/** Lower priority than ui-workspace's registration (default 0): lowest renders. */
const SIDEBAR_SHADOW_PRIORITY = -20

/** Lower priority than ui-conversation's own registration (default 0). */
const CONVERSATION_SHADOW_PRIORITY = -30

/** Lower priority than the official agent-preset chip (default 0). */
const HERO_SHADOW_PRIORITY = -20

/**
 * Global panel ids: each addresses a `main`-slot page by the same key. The
 * create page is the roster's control; profile and memory are per-agent
 * panels the nav rows select.
 */
const AGENTS_CREATE_PANEL = 'agents-create' as MainPanelId
const AGENTS_PROFILE_PANEL = 'agents-profile' as MainPanelId
const AGENTS_MEMORY_PANEL = 'agents-memory' as MainPanelId

/** Required services (cordis fiber inject). */
export const inject = [
  'slots', 'locale', 'sessions', 'workspaces', 'uiWorkspace', 'remote',
]

/**
 * Mount the agent suite's surfaces and services.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-agents: dictionaries')
  const agentT = ctx.locale.bind(NS)

  // The shell's own New Session button has no slot seam, and this plugin
  // replaces it outright (创建 Agent on the roster, 返回 inside an agent),
  // so the shell button is hidden for the plugin's lifetime. The class
  // suffix is the shell's emitted CSS-module name and stable across deploys.
  ctx.effect(() => {
    const style = document.createElement('style')
    style.textContent = '[class$="_newSession"] { display: none !important; }'
    document.head.appendChild(style)
    return () => { style.remove() }
  }, 'ui-agents: hide shell new-session button')

  // Mount the namespaces this suite owns. The shared remote assembly knows
  // nothing about them; mounting here keeps the suite one installable unit.
  // The gate hands the mount settlement to the controllers, so no read races
  // an in-flight `$mount`.
  const whenRemoteReady = Promise.all([
    ctx.remote.$mount(agentPresetAuthoringRemote),
    ctx.remote.$mount(agentMemoryRemote),
  ]).then(() => undefined, () => undefined)

  // Chat launches: ONE persistent binding worker owns every blank-draft bind
  // and release. A click only refreshes the intent (preset + deadline); the
  // worker re-reads it between serial steps, so rapid clicks can never
  // interleave a superseded release with a fresh bind — the interleaving that
  // used to land 'standard' on the reused blank after its newer bind (the
  // vanishing-binding bug). The official New Session flow reuses the same
  // blank on rapid clicks, and may move to another workspace's blank (the
  // hero workspace chip): the worker releases an abandoned draft only while
  // it is still blank, and rebinds the displayed one — in one path.
  let launchPreset: string | undefined
  let launchDeadline = 0
  let bindingWorker: Promise<void> | undefined
  // The workspace of the last bound draft: the next launch passes it
  // explicitly, because the official current-or-recent inheritance has
  // nothing to inherit once the previous draft was deleted with its agent.
  let lastBoundWorkspace: string | undefined
  const workspaceIdOf = (sessionId: string): string | undefined => {
    const items = ctx.workspaces.list.getSnapshot().items
    return items.find(item => (item.sessionIds as readonly string[]).includes(sessionId))?.workspaceId
  }

  const launch: WorkspaceLaunchFace = {
    openSession: (sessionId) => { ctx.uiWorkspace.openSession(sessionId as SessionId) },
    launchWithPreset: (presetId) => {
      launchPreset = presetId
      launchDeadline = Date.now() + 30_000
      ctx.uiWorkspace.startSession(lastBoundWorkspace as WorkspaceId | undefined)
      if (bindingWorker !== undefined) return
      bindingWorker = (async () => {
        await whenRemoteReady
        const presets = ctx.get('remote.agentPresets') as
          | ClientContext['remote']['agentPresets']
          | undefined
        if (presets === undefined) return
        // Release a superseded draft only while it is still blank: a draft
        // that grew content is a real conversation and keeps its binding.
        const release = async (id: string): Promise<void> => {
          const entry = ctx.sessions.list.getSnapshot().byId[id as SessionId]
          if (entry?.blank === true) await presets.select(id as SessionId, 'standard')
        }
        let bound: string | undefined
        let boundPreset: string | undefined
        while (Date.now() < launchDeadline) {
          const presetId = launchPreset
          const displayed = Object.values(ctx.sessions.list.getSnapshot().byId)
            .find(candidate => candidate.blank && (candidate.retainedBy.mainView ?? 0) > 0)
          if (presetId === undefined || displayed === undefined
            || (displayed.id === bound && boundPreset === presetId)) {
            await new Promise(resolve => setTimeout(resolve, 200))
            continue
          }
          try {
            const old = bound
            bound = undefined
            if (old !== undefined && old !== displayed.id) await release(old)
            await presets.select(displayed.id, presetId)
            bound = displayed.id
            boundPreset = presetId
            lastBoundWorkspace = workspaceIdOf(displayed.id) ?? lastBoundWorkspace
          } catch (error) {
            ctx.logger.warn(`ui-agents: draft binding failed: ${String(error)}`)
          }
          await new Promise(resolve => setTimeout(resolve, 400))
        }
      })().finally(() => { bindingWorker = undefined })
    },
  }

  // The registry-global archive and pin sets, projected for the browser's
  // chat history: archived sessions belong to no agent's list, pinned ones
  // lead it.
  const archived = createSnapshotStore<readonly string[]>(
    ctx.workspaces.list.getSnapshot().archivedSessionIds,
  )
  const pinned = createSnapshotStore<readonly string[]>(
    ctx.workspaces.list.getSnapshot().pinnedSessionIds,
  )
  // The workspace registry projected for the chat history: the group order
  // (Host group order) and each session's member workspace, both feeding the
  // grouped view and the blank-draft labels. The default workspace's stored
  // title is the canonical directory constant; display the localized name.
  const workspaceProjectionOf = (snapshot: {
    items: readonly { workspaceId: string; title: string; sessionIds: readonly string[] }[]
  }): WorkspaceProjection => {
    const order: { id: string; title: string }[] = []
    const bySession: Record<string, string> = {}
    for (const item of snapshot.items) {
      const title = item.title === DEFAULT_WORKSPACE_DIRECTORY ? agentT('workspace.default') : item.title
      order.push({ id: item.workspaceId, title })
      for (const sessionId of item.sessionIds) bySession[sessionId] = item.workspaceId
    }
    return { order, bySession }
  }
  const workspaceProjection = createSnapshotStore<WorkspaceProjection>(
    workspaceProjectionOf(ctx.workspaces.list.getSnapshot()),
  )
  const stopWorkspaceSets = ctx.workspaces.list.subscribe(() => {
    const snapshot = ctx.workspaces.list.getSnapshot()
    archived.set(snapshot.archivedSessionIds)
    pinned.set(snapshot.pinnedSessionIds)
    workspaceProjection.set(workspaceProjectionOf(snapshot))
  })
  // The chat history's persisted viewing state: grouping, ordering, the
  // archived filter, group expansion, and the per-agent manual orders.
  const view = createAgentViewStore()

  // The archive flow, wrapped like the official browser's: a plain archive
  // raises the undo toast; the Host's running-work refusal opens the
  // stop-and-archive confirmation naming that work. The request and the
  // notice live in plugin stores rendered by the shell.overlay entries below,
  // so they outlive the row menu (and the sidebar) that raised them.
  const archiveRequest = createSnapshotStore<ArchiveConfirmRequest | null>(null)
  const rowToast = createSnapshotStore<RowToastState | null>(null)
  const showToast = (toast: RowToastState): void => { rowToast.set(toast) }
  // The class-identity check goes by name: client plugin bundles do not share
  // error-class identity with the workspace controller's rejection class.
  const activeSessionRefusal = (reason: unknown): ArchiveConfirmRequest['activity'] | undefined => {
    if (!(reason instanceof Error) || reason.name !== 'WorkspaceArchiveError') return undefined
    const refusal = (reason as { rpcError?: { code?: string; details?: { activity?: ArchiveConfirmRequest['activity'] } } }).rpcError
    return refusal?.code === 'workspace/session-active' ? refusal.details?.activity : undefined
  }
  const displayTitleOf = (sessionId: string): string =>
    ctx.sessions.list.getSnapshot().byId[sessionId as SessionId]?.displayTitle ?? sessionId

  const controller = new AgentBrowserController(ctx, {
    list: ctx.sessions.list,
    archived,
    pinned,
    rename: async (sessionId, title) => {
      // Row → session-face hop: rename is a per-session verb (ISession),
      // not a list-service verb; the binding resolves any listed session.
      const session = ctx.sessions.binding(sessionId as SessionId)?.session
      if (session === undefined) throw new Error(`unknown session "${sessionId}"`)
      const result = await session.rename(title)
      if (!result.ok) throw new Error(result.error.message)
    },
    archive: async (sessionId) => {
      try {
        await ctx.uiWorkspace.archiveSession(sessionId as SessionId)
        showToast({ kind: 'archived', sessionId })
      } catch (reason) {
        const activity = activeSessionRefusal(reason)
        if (activity === undefined) throw reason
        archiveRequest.set({ sessionId, displayTitle: displayTitleOf(sessionId), activity })
      }
    },
  }, launch)
  const stopAndArchive = async (sessionId: string): Promise<void> => {
    await ctx.uiWorkspace.archiveSession(sessionId as SessionId, { stopActivity: true })
    showToast({ kind: 'stoppedAndArchived', sessionId })
  }

  // The shared Host reminder catalog feeding the chat rows' clock marks.
  const scheduleCatalog = createScheduleCatalogSource(ctx)
  // Any open main-area panel (create / profile / memory) hides the
  // conversation; opening a session therefore closes it first, so the chat
  // the user asked for is never left hidden behind the panel.
  const closeMainPanel = (): void => {
    const layout = ctx.get('layout')
    if (layout !== undefined && typeof layout.selectPanel === 'function') layout.selectPanel(null)
  }
  controller.whenRemoteReady = whenRemoteReady

  // Localized shipped-mode copy: the official preset display dictionary is
  // the one home for which shipped id carries which name.
  const modeText = ctx.locale.bind('settings.agentPreset')
  const hero = new HeroSeatController(controller, (id) => {
    const text = presetDisplayText({ id }, modeText)
    return { name: text.name, description: text.description ?? '' }
  })

  ctx.effect(() => () => {
    stopWorkspaceSets()
    controller.dispose()
    hero.dispose()
    scheduleCatalog.dispose()
  }, 'ui-agents: lifecycle')

  ctx.provide('uiAgents', {
    pendingAgent: () => controller.pendingAgent(),
    composeForPendingAgent: (modeId: string) => controller.composeForPendingAgent(modeId),
    composeForAgent: (agentId: string, modeId: string) => controller.composeForAgent(agentId, modeId),
    modeIdFor: (combinedId: string) => controller.modeIdFor(combinedId),
    consumePendingAgent: () => { controller.consumePendingAgent() },
  })

  ctx.slots.inject('sidebar.workspaces', () => {
    const injected = (): AgentBrowserInjected => ({
      hooks: {
        agents: controller.store,
        archived,
        pinned,
        workspaceProjection,
        view: view.store,
        scheduleCatalog: scheduleCatalog.catalog,
      },
      viewActions: view.actions,
      load: () => {
        // The reminder catalog's remote may mount after apply's first read.
        scheduleCatalog.ensureRead()
        return controller.load()
      },
      modeName: (modeId: string) => presetDisplayText({ id: modeId }, modeText).name,
      selectAgent: (id: string) => {
        closeMainPanel()
        controller.selectAgent(id)
      },
      back: () => { controller.back() },
      openCreate: () => { controller.openCreate() },
      startChat: (id: string) => {
        closeMainPanel()
        return controller.startChat(id)
      },
      openSession: (sessionId: string) => {
        closeMainPanel()
        controller.openSession(sessionId)
      },
      openProfile: (id: string) => controller.openProfile(id),
      openMemory: (id: string) => controller.openMemory(id),
      setMemoryText: (text: string) => { controller.setMemoryText(text) },
      saveMemory: () => controller.saveMemory(),
      backFromMemory: () => { controller.backFromMemory() },
      toggleCollapsed: () => { controller.toggleCollapsed() },
      create: (input: AgentFormInput) => controller.create(input),
      saveEdit: (id: string, input: AgentFormInput) => controller.saveEdit(id, input),
      deleteAgent: (id: string) => controller.deleteAgent(id),
      remove: (id: string) => controller.remove(id),
      renameSession: (sessionId: string, title: string) => controller.renameSession(sessionId, title),
      archiveSession: (sessionId: string) => controller.archiveSession(sessionId),
      removeSession: (sessionId: string) => controller.removeSession(sessionId),
      pinSession: (sessionId: string) => ctx.uiWorkspace.pinSession(sessionId as SessionId),
      unpinSession: (sessionId: string) => ctx.uiWorkspace.unpinSession(sessionId as SessionId),
      forkSession: (sessionId: string) => ctx.uiWorkspace.forkSession(sessionId as SessionId),
      unarchiveSession: (sessionId: string) => ctx.uiWorkspace.unarchiveSession(sessionId as SessionId),
      searchSessions: async (query, signal) => {
        const result = await ctx.sessions.search(query, signal)
        if (!result.ok) throw new Error(result.error.message)
        return result.value
      },
      searchResultLimit: ctx.sessions.searchResultLimit,
      insertWorkspaceBefore: async (workspaceId, beforeWorkspaceId) => {
        await ctx.workspaces.insertBefore(
          workspaceId as WorkspaceId,
          ...(beforeWorkspaceId === undefined ? [] : [beforeWorkspaceId as WorkspaceId]),
        )
      },
      addWorkspace: async () => {
        const picked = await ctx.uiWorkspace.pickDirectory()
        if (picked === null) return
        await ctx.workspaces.create({ path: picked })
      },
    })

    return ctx.slots.register({
      name: 'sidebar.workspaces',
      priority: SIDEBAR_SHADOW_PRIORITY,
      locale: NS,
      inject: injected,
    }, AgentBrowser)
  })

  // The brand seat: an agent's surface swaps the whale and the local-build
  // badge for a back control and the agent's name, riding the shell's own
  // brand slots so the swap happens everywhere the brand renders. The badge
  // copy's key lives in the sidebar namespace at runtime, so the seat is
  // widened to plain keys here.
  const brandText = ctx.locale.bind('sidebar') as (key: string) => string
  ctx.slots.inject('sidebar.brand.mark', () => ctx.slots.register({
    name: 'sidebar.brand.mark',
    // 宿主 0.2.x 起 ui-brand-official 已在 priority 0 占了同一 slot，默认 0 会直接
    // 抛 "already has a registration at priority 0" 把整个 entry 拖挂；负优先级渲染
    // 更靠前，正好用来覆盖官方标记（Agent 视图下换成返回键 + Agent 名）。
    priority: -1,
    locale: NS,
    inject: () => ({
      hooks: { agents: controller.store },
      back: () => { controller.back() },
    }),
  }, AgentBrandMark))
  ctx.slots.inject('sidebar.brand.name', () => ctx.slots.register({
    name: 'sidebar.brand.name',
    // 同上：与官方 ui-brand-official 的 priority 0 冲突，必须用负优先级覆盖。
    priority: -1,
    locale: NS,
    inject: () => ({
      hooks: { agents: controller.store },
      brandText,
    }),
  }, AgentBrandName))

  // The global panel rows: the create control, and the per-agent action rows
  // (new chat / profile / memory) the sidebar-surface buttons became. Each
  // id addresses the matching `main`-slot page registered below, and the
  // AgentBrowser.module.css panelList rules swap the rows by surface mode.
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: AGENTS_CREATE_PANEL,
    order: 20,
    label: () => agentT('agents.create'),
    locale: NS,
  }, CreateAgentPanelIcon))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: 'agents-newchat',
    order: 21,
    label: () => agentT('agents.newChat'),
    locale: NS,
  }, NewChatPanelIcon))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: AGENTS_PROFILE_PANEL,
    order: 22,
    label: () => agentT('agents.profile'),
    locale: NS,
  }, ProfilePanelIcon))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: AGENTS_MEMORY_PANEL,
    order: 23,
    label: () => agentT('agents.memory'),
    locale: NS,
  }, MemoryPanelIcon))

  // The main-area panels: the create page and the per-agent profile and
  // memory editors. Each is a bare page on the panel's blank canvas; the
  // panel rows above own their visibility, and every conversation-opening
  // path closes the panel first (see closeMainPanel).
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main',
    key: AGENTS_CREATE_PANEL,
    locale: NS,
    inject: () => ({
      hooks: { agents: controller.store },
      create: (input: AgentFormInput) => controller.create(input),
      close: closeMainPanel,
    }),
  }, CreateAgentPage))
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main',
    key: AGENTS_PROFILE_PANEL,
    locale: NS,
    inject: () => ({
      hooks: { agents: controller.store },
      saveEdit: (id: string, input: AgentFormInput) => controller.saveEdit(id, input),
      deleteAgent: (id: string) => controller.deleteAgent(id),
    }),
  }, ProfileMainPage))
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main',
    key: AGENTS_MEMORY_PANEL,
    locale: NS,
    inject: () => ({
      hooks: { agents: controller.store },
      setMemoryText: (text: string) => {
        controller.setMemoryText(text)
      },
      saveMemory: () => controller.saveMemory(),
    }),
  }, MemoryMainPage))

  // The nav rows' actions. The sidebar's own row click selects the panel;
  // this document-level capture handler maps each MARKED row (the
  // data-agents-panel marker its glyph carries) to the per-agent verbs
  // (start chat, open profile/memory) and toggles the panels, so the rows
  // behave like the official ones without the sidebar knowing about the agent
  // state. Unmarked rows (plugins, skills, scheduled tasks, …) pass through
  // untouched — row identity, never row position, is what dispatches, because
  // the official row count varies by deployment and positional indexing
  // silently misroutes every click when it differs. The create branch
  // deliberately runs before the selected-agent guard, because the roster
  // (where the create row shows) is exactly the state with nothing selected.
  ctx.effect(() => {
    const onNavClick = (event: MouseEvent): void => {
      const target = event.target
      if (!(target instanceof Element)) return
      const button = target.closest('button')
      if (button === null) return
      const nav = button.closest('nav')
      if (nav === null || !/panellist/i.test(nav.className)) return
      const mark = button.querySelector('[data-agents-panel]')?.getAttribute('data-agents-panel')
      if (mark === null || mark === undefined) return
      event.stopPropagation()
      event.preventDefault()
      const state = controller.store.getSnapshot()
      const layout = ctx.get('layout')
      if (layout === undefined || typeof layout.selectPanel !== 'function') return
      const active = layout.panelInfo !== undefined && typeof layout.panelInfo.getSnapshot === 'function'
        ? layout.panelInfo.getSnapshot().activePanelId
        : undefined
      if (mark === 'create') {
        layout.selectPanel(active === AGENTS_CREATE_PANEL ? null : AGENTS_CREATE_PANEL)
        return
      }
      if (state.selected === '') return
      if (mark === 'newchat') {
        closeMainPanel()
        controller.startChat(state.selected)
        return
      }
      const panel = mark === 'profile' ? AGENTS_PROFILE_PANEL : AGENTS_MEMORY_PANEL
      if (active === panel) {
        layout.selectPanel(null)
        return
      }
      if (mark === 'profile') void controller.openProfile(state.selected)
      else void controller.openMemory(state.selected)
      layout.selectPanel(panel)
    }
    document.addEventListener('click', onNavClick, true)
    return () => {
      document.removeEventListener('click', onNavClick, true)
    }
  }, 'ui-agents: nav action rows')

  // The archive surfaces ride the frame-wide overlay layer: the confirmation
  // outlives the row menu that raised it, and the toast survives the sidebar
  // collapsing afterwards. Official parity: same layer, same hold semantics.
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'agents-archive-confirm',
    locale: NS,
    inject: () => ({
      hooks: { request: archiveRequest },
      settle: () => { archiveRequest.set(null) },
      stopAndArchive,
    }),
  }, ArchiveConfirmDialog))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'agents-row-toast',
    locale: NS,
    inject: () => ({
      hooks: { toast: rowToast, view: view.store },
      dismiss: () => { rowToast.set(null) },
      undoArchive: (sessionId: string) => {
        ctx.uiWorkspace.unarchiveSession(sessionId as SessionId).catch((reason: unknown) => {
          console.warn('session unarchive rejected:', reason)
        })
      },
      showArchived: () => { view.actions.setArchivedFilter('show') },
    }),
  }, RowActionToast))

  // The hero mode chip: the official seat's slot, shadowed at a lower
  // priority so the shipped-modes-only chip with agent ownership renders.
  ctx.slots.inject('conversation.hero.agentPreset', () => ctx.slots.register({
    name: 'conversation.hero.agentPreset',
    priority: HERO_SHADOW_PRIORITY,
    locale: NS,
    inject: (): HeroChipInjected => ({
      hooks: { heroSeat: hero.store, heroDefine: hero.define },
      load: (current) => hero.load(current),
      select: (current, id) => hero.select(current, id),
      defineTarget: (current) => hero.defineTarget(current),
      loadDefine: () => hero.loadDefine(),
      suggestDefine: (description) => hero.suggestDefine(description),
      composeDefine: (agentPreset, groups) => hero.composeDefine(agentPreset, groups),
    }),
  }, HeroChip))

  // The per-message memory entry: seated in the assistant-actions strip after
  // the official feedback pair (order 10), so the 记住 button renders beside
  // the built-in copy and branch controls. It opens the message-selection
  // dialog and hands the checked text to the host remember path.
  ctx.slots.inject('conversation.chat.assistant-actions', () => ctx.slots.register({
    name: 'conversation.chat.assistant-actions',
    id: 'agent-memory',
    order: 12,
    locale: NS,
    inject: (sessionId: SessionId): MemoryActionsInjected => ({
      remember: async (text) => {
        await whenRemoteReady
        const memory = ctx.get('remote.agentMemory') as
          | ClientContext['remote']['agentMemory']
          | undefined
        if (memory === undefined) throw new Error('agent memory remote is unavailable')
        const carried = await memory.remember(sessionId, text)
        if (!carried.ok) throw new Error(`agentMemory.remember failed: ${carried.error.message}`)
        return carried.value
      },
    }),
  }, MemoryActions))

  // The conversation gate: while the browser is outside an agent page, one
  // shadow occupant replaces the official conversation shell — header,
  // transcript, and composer alike — so a still-open session cannot show
  // through behind the bare brand hero. The shell returns when the occupant
  // retires on an agent page.
  const heroText = ctx.locale.bind('conversation')
  controller.bindConversationShadow(() => ctx.slots.register({
    name: 'main.conversation',
    priority: CONVERSATION_SHADOW_PRIORITY,
    locale: NS,
    inject: () => ({ heroText }),
  }, ConversationGate))
  void controller.load()
}
