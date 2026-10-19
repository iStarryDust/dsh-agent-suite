/**
 * The chat history's viewing store: grouping, ordering, the archived filter,
 * group expansion, and the saved manual order — persisted across reloads.
 * Module level exports the factory only (a module-level handle would pin the
 * store identity across plugin reloads); apply() receives the handle and
 * threads it into the browser through the injected face. The manual order
 * lives in per-agent accounts (`${agentId}/ws:${workspaceId}`, `ung`, or
 * `flat`), so two agents sharing a workspace never overwrite each other's
 * arrangement. The order reconciliation and the drag-order computation
 * follow the official workspace browser's semantics (pinned rows lead,
 * forks follow their source, archives trail; a drag can only reorder rows
 * of one account and one pinned block).
 */
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
/** Chat-history grouping: per-workspace sections or one flat list. */
export type AgentGroupBy = 'workspace' | 'flat';
/** Chat order: saved manual positions or current recency. */
export type AgentOrderBy = 'manual' | 'updated';
/** Archived-row visibility choice, shared with the official browser's vocabulary. */
export type AgentArchivedFilter = 'default' | 'show' | 'only';
/** Persisted viewing state of the agent chat history. */
export interface AgentViewState {
    groupBy: AgentGroupBy;
    orderBy: AgentOrderBy;
    archivedFilter: AgentArchivedFilter;
    /** Explicit group expansion keyed by account (`ws:${id}` / `ung`), shared across agents. */
    groupExpansion: Record<string, boolean>;
    /** Saved manual order keyed `${agentId}/${account}`. */
    sessionOrderByAccount: Record<string, string[]>;
}
/** The store handle plus its bound write set, created once per plugin load. */
export interface AgentViewStore {
    store: SnapshotStore<AgentViewState>;
    actions: {
        setGroupBy: (mode: AgentGroupBy) => void;
        /** Switch the order; switching to manual snapshots the current orders as its base. */
        setOrderBy: (mode: AgentOrderBy, initialOrders: Readonly<Record<string, readonly string[]>>) => void;
        setArchivedFilter: (filter: AgentArchivedFilter) => void;
        setGroupExpanded: (key: string, expanded: boolean) => void;
        /** Save one drag order and select Manual (the official drag-to-reorder semantics). */
        setSessionOrder: (fullKey: string, order: readonly string[], initialOrders: Readonly<Record<string, readonly string[]>>) => void;
        /** Drop saved orders of deleted agents and deleted workspaces. */
        retainAgents: (agentIds: readonly string[], workspaceIds: readonly string[]) => void;
    };
}
/** The stored key of one agent's account. */
export declare function accountKeyOf(agentId: string, account: string): string;
/**
 * Create the viewing store handle.
 * @returns the store and its write set.
 */
export declare function createAgentViewStore(): AgentViewStore;
/** The session facts the manual-order reconciliation reads. */
export interface ManualOrderSummary {
    updatedAt: number;
    parentId?: string;
}
/** Registry-global row state consumed by the reconciliation. */
export interface ManualOrderRowState {
    pinnedSessionIds: readonly string[];
    archivedSessionIds: readonly string[];
}
/**
 * Reconcile a saved manual order with current account membership: saved
 * relative positions hold, pinned rows lead, new members arrive by recency
 * (a fork directly after its source), and archives trail.
 * @param memberIds - the account's full membership.
 * @param savedOrder - the previously saved order.
 * @param summaries - current session metadata.
 * @param rowState - registry-global pin and archive membership.
 * @returns the reconciled order.
 */
export declare function reconcileManualOrder(memberIds: readonly string[], savedOrder: readonly string[] | undefined, summaries: Readonly<Record<string, ManualOrderSummary>>, rowState: ManualOrderRowState): string[];
/** One row's drag-relevant facts. */
export interface ChatDragRow {
    id: string;
    blank: boolean;
    pinned: boolean;
}
/** Where the pointer released relative to the row under it. */
export interface ChatDropTarget {
    id: string;
    half: 'before' | 'after';
}
/** In-flight drag: the source row's identity plus the current insert marker. */
export interface ChatDragIntent {
    /** The account (workspace section, ungrouped, or flat) the drag stays inside. */
    account: string;
    sessionId: string;
    pinned: boolean;
    over: ChatDropTarget | null;
}
/**
 * Apply a visible drop to the complete account order without disturbing
 * hidden members (archives, unrendered rows). A drop may only move one row
 * within its pinned block, and a blank draft is never the moved row.
 * @param order - the account's full membership in the displayed order.
 * @param rows - the rendered rows.
 * @param drag - the in-flight drag.
 * @param over - the row and half the pointer released on.
 * @returns the new full order, or undefined when the drop moves nothing.
 */
export declare function sessionDragOrder(order: readonly string[], rows: readonly ChatDragRow[], drag: ChatDragIntent, over: ChatDropTarget): string[] | undefined;
//# sourceMappingURL=view.d.ts.map