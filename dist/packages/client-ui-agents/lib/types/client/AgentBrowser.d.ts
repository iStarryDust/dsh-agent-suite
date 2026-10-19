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
import { type ReactNode } from 'react';
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ScheduleCatalogSnapshot } from './ScheduleMark.ts';
import type { AgentFormInput, AgentBrowserState } from './stores.ts';
import { type AgentViewStore, type AgentViewState } from './view.ts';
/** The workspace registry projected for the chat history. */
export interface WorkspaceProjection {
    /** Workspaces in Host group order, display titles resolved. */
    readonly order: readonly {
        readonly id: string;
        readonly title: string;
    }[];
    /** Session id → member workspace id. */
    readonly bySession: Readonly<Record<string, string>>;
}
/** Registration-side business face for the agent browser. */
export interface AgentBrowserInjected {
    hooks: {
        /** Browser snapshot bound by the renderer as useAgents. */
        agents: SnapshotStore<AgentBrowserState>;
        /** Registry-global archive set: archived sessions hide from every agent's history. */
        archived: SnapshotStore<readonly string[]>;
        /** Registry-global pinned set: pinned sessions lead every agent's history. */
        pinned: SnapshotStore<readonly string[]>;
        /** Workspace registry projection: group order and session membership. */
        workspaceProjection: SnapshotStore<WorkspaceProjection>;
        /** Persisted chat-history viewing state (grouping / ordering / saved manual order). */
        view: SnapshotStore<AgentViewState>;
        /** The shared Host reminder catalog feeding the rows' clock marks. */
        scheduleCatalog: SnapshotStore<ScheduleCatalogSnapshot>;
    };
    /** The viewing store's write set. */
    viewActions: AgentViewStore['actions'];
    /** Read the roster. */
    load: () => Promise<void>;
    /** Localize one shipped mode id (the official preset display dictionary). */
    modeName: (modeId: string) => string;
    /** Enter one agent's page. */
    selectAgent: (id: string) => void;
    /** Return to the roster page. */
    back: () => void;
    /** Open the create form. */
    openCreate: () => void;
    /** Start a new chat with one agent; resolves to a failure message when the chat could not start. */
    startChat: (id: string) => Promise<string | undefined>;
    /** Open one chat from the agent's history. */
    openSession: (sessionId: string) => void;
    /** Open one agent's profile for editing. */
    openProfile: (id: string) => Promise<void>;
    /** Open one agent's memory editor. */
    openMemory: (id: string) => Promise<void>;
    /** Update the memory editor draft. */
    setMemoryText: (text: string) => void;
    /** Save the memory editor draft; resolves to a failure message. */
    saveMemory: () => Promise<string | undefined>;
    /** Return from the memory editor to the agent page. */
    backFromMemory: () => void;
    /** Toggle the roster list's collapsed state. */
    toggleCollapsed: () => void;
    /** Create an agent from the form; resolves to a failure message. */
    create: (input: AgentFormInput) => Promise<string | undefined>;
    /** Save a profile edit; resolves to a failure message. */
    saveEdit: (id: string, input: AgentFormInput) => Promise<string | undefined>;
    /** Delete an agent; resolves to a failure message. */
    remove: (id: string) => Promise<string | undefined>;
    /** Rename one chat's durable title. */
    renameSession: (sessionId: string, title: string) => Promise<void>;
    /** Archive one chat (hide from every list; the log stays). */
    archiveSession: (sessionId: string) => Promise<void>;
    /** Delete one chat for good; resolves to a failure key or message. */
    removeSession: (sessionId: string) => Promise<string | undefined>;
    /** Pin one chat (registry-global pin set; leads the agent's history). */
    pinSession: (sessionId: string) => Promise<void>;
    /** Unpin one chat. */
    unpinSession: (sessionId: string) => Promise<void>;
    /** Fork one chat at its last completed turn (the child arrives beside the source). */
    forkSession: (sessionId: string) => Promise<void>;
    /** Restore one archived chat to its workspace position. */
    unarchiveSession: (sessionId: string) => Promise<void>;
    /** One Host content-search hit: the session and the matched snippet. */
    searchSessions: (query: string, signal: AbortSignal) => Promise<{
        items: readonly {
            sessionId: string;
            snippet: string;
        }[];
        hasMore: boolean;
    }>;
    /** Protocol-owned maximum merged row count for one search. */
    searchResultLimit: number;
    /** Move one workspace before another in the Host group order (move-to-end when the anchor is absent). */
    insertWorkspaceBefore: (workspaceId: string, beforeWorkspaceId: string | undefined) => Promise<void>;
    /** Add a workspace: the Host-native directory picker, then adoption. */
    addWorkspace: () => Promise<void>;
}
/** Full component props. */
export type AgentBrowserProps = PropsRuntime<'sidebar.workspaces'> & PropsLocale<'agents'> & InjectFace<AgentBrowserInjected>;
/** Injected face of the `sidebar.brand.mark` occupant. */
export interface AgentBrandMarkInjected {
    hooks: {
        /** Browser snapshot bound by the renderer as useAgents. */
        agents: SnapshotStore<AgentBrowserState>;
    };
    /** Leave the agent surface for the roster. */
    back: () => void;
}
/** Full component props of the brand-mark occupant. */
export type AgentBrandMarkProps = PropsRuntime<'sidebar.brand.mark'> & PropsLocale<'agents'> & InjectFace<AgentBrandMarkInjected>;
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
export declare function AgentBrandMark({ size, useAgents, back, t }: AgentBrandMarkProps): ReactNode;
/** Injected face of the `sidebar.brand.name` occupant. */
export interface AgentBrandNameInjected {
    hooks: {
        /** Browser snapshot bound by the renderer as useAgents. */
        agents: SnapshotStore<AgentBrowserState>;
    };
    /** The sidebar namespace's locale seat for the official badge copy. */
    brandText: (key: string) => string;
}
/** Full component props of the brand-name occupant. */
export type AgentBrandNameProps = PropsRuntime<'sidebar.brand.name'> & InjectFace<AgentBrandNameInjected>;
/**
 * The `sidebar.brand.name` occupant: an agent's surface names the agent,
 * the roster re-renders the official local-build badge (title plus version
 * when the build metadata is reachable) flagged data-dsh-brand so the
 * enclosing button's New Session hover tooltip is suppressed, with the click
 * swallowed so the brand row stays decorative.
 * @param props - the agents store hook and the sidebar locale seat.
 * @returns the brand-name content.
 */
export declare function AgentBrandName({ useAgents, brandText }: AgentBrandNameProps): ReactNode;
/**
 * Render the create-agent glyph at the size the sidebar asks for.
 * @param props - the sidebar's icon share: the requested square edge.
 * @returns the icon element.
 */
export declare function CreateAgentPanelIcon({ size }: {
    size: number;
}): ReactNode;
/**
 * Nav glyphs for the per-agent action rows (new chat / profile / memory):
 * the same icons their former sidebar-surface buttons carried.
 * @param props - the sidebar's icon share: the requested square edge.
 * @returns the icon element.
 */
export declare function NewChatPanelIcon({ size }: {
    size: number;
}): ReactNode;
export declare function ProfilePanelIcon({ size }: {
    size: number;
}): ReactNode;
export declare function MemoryPanelIcon({ size }: {
    size: number;
}): ReactNode;
/** Injected face of the create-agent main panel. */
export interface CreateAgentPageInjected {
    hooks: {
        /** Browser snapshot bound by the renderer as useAgents. */
        agents: SnapshotStore<AgentBrowserState>;
    };
    /** Create the agent (identity only). */
    create: (input: AgentFormInput) => Promise<string | undefined>;
    /** Close the panel (back to the conversation). */
    close: () => void;
}
/** Full component props of the create-agent main panel. */
export type CreateAgentPageProps = PropsRuntime<'main'> & PropsLocale<'agents'> & InjectFace<CreateAgentPageInjected>;
/**
 * The 创建 Agent page as a genuine main-area panel, so its nav row is the
 * same control as 插件/技能 — the sidebar-embedded button could never sit
 * flush with the panel rows (its host region clips everything above its
 * box). Creating closes the panel and returns to the conversation; the
 * roster reloads through the shared controller either way.
 * @param props - the agents store hook, the create action, close, locale.
 * @returns the create form page.
 */
export declare function CreateAgentPage({ useAgents, create, close, t }: CreateAgentPageProps): ReactNode;
/** Injected face of the profile main panel. */
export interface ProfileMainPageInjected {
    hooks: {
        /** Browser snapshot bound by the renderer as useAgents. */
        agents: SnapshotStore<AgentBrowserState>;
    };
    /** Save the edited identity. */
    saveEdit: (id: string, input: AgentFormInput) => Promise<string | undefined>;
}
/** Full component props of the profile main panel. */
export type ProfileMainPageProps = PropsRuntime<'main'> & PropsLocale<'agents'> & InjectFace<ProfileMainPageInjected>;
/**
 * The 助理档案 page: a bare edit form on the panel's blank page — fields
 * and save only, no chrome. Data is prefilled by the controller's profile
 * loader, which the nav row fires before selecting the panel.
 * @param props - the agents store hook, save action, locale.
 * @returns the bare profile fields page.
 */
export declare function ProfileMainPage({ useAgents, saveEdit, t }: ProfileMainPageProps): ReactNode;
/** Injected face of the memory main panel. */
export interface MemoryMainPageInjected {
    hooks: {
        /** Browser snapshot bound by the renderer as useAgents. */
        agents: SnapshotStore<AgentBrowserState>;
    };
    /** Update the memory editor draft. */
    setMemoryText: (text: string) => void;
    /** Save the draft to the agent's store. */
    saveMemory: () => Promise<string | undefined>;
}
/** Full component props of the memory main panel. */
export type MemoryMainPageProps = PropsRuntime<'main'> & PropsLocale<'agents'> & InjectFace<MemoryMainPageInjected>;
/**
 * The 助理记忆 page: a bare editor on the panel's blank page — textarea and
 * save only, no chrome. Data is prefilled by the controller's memory
 * loader, which the nav row fires before selecting the panel.
 * @param props - the agents store hook, memory actions, locale.
 * @returns the bare memory editor page.
 */
export declare function MemoryMainPage({ useAgents, setMemoryText, saveMemory, t }: MemoryMainPageProps): ReactNode;
/**
 * Render the agent browsing region.
 * @param props - composed slot props.
 * @returns the agent surface for the current view.
 */
export declare function AgentBrowser({ useAgents, useSessions, useArchived, usePinned, useWorkspaceProjection, useView, useScheduleCatalog, viewActions, load, modeName, selectAgent, back, openCreate: _openCreate, startChat: _startChat, openSession, openProfile: _openProfile, openMemory: _openMemory, setMemoryText: _setMemoryText, saveMemory: _saveMemory, backFromMemory: _backFromMemory, toggleCollapsed, create, saveEdit: _saveEdit, remove: _remove, renameSession, archiveSession, removeSession, pinSession, unpinSession, forkSession, unarchiveSession, searchSessions, searchResultLimit, insertWorkspaceBefore, addWorkspace, wide, expandSidebar: _expandSidebar, t, }: AgentBrowserProps): import("react").JSX.Element;
//# sourceMappingURL=AgentBrowser.d.ts.map