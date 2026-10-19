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
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store';
/** Copy read-only projections into the persisted mutable representation. */
function copyOrders(orders) {
    return Object.fromEntries(Object.entries(orders).map(([key, order]) => [key, [...order]]));
}
/** The stored key of one agent's account. */
export function accountKeyOf(agentId, account) {
    return `${agentId}/${account}`;
}
/**
 * Create the viewing store handle.
 * @returns the store and its write set.
 */
export function createAgentViewStore() {
    const store = createSnapshotStore({
        groupBy: 'flat',
        orderBy: 'updated',
        archivedFilter: 'default',
        groupExpansion: {},
        sessionOrderByAccount: {},
    }, { persist: { name: 'dsh.agents.view.v1' } });
    const actions = {
        setGroupBy: (mode) => {
            const current = store.getSnapshot();
            if (current.groupBy === mode)
                return;
            store.set({ ...current, groupBy: mode });
        },
        setOrderBy: (mode, initialOrders) => {
            const current = store.getSnapshot();
            if (current.orderBy === mode)
                return;
            store.set({
                ...current,
                sessionOrderByAccount: mode === 'manual' ? copyOrders(initialOrders) : {},
                orderBy: mode,
            });
        },
        setArchivedFilter: (filter) => {
            const current = store.getSnapshot();
            if (current.archivedFilter === filter)
                return;
            store.set({ ...current, archivedFilter: filter });
        },
        setGroupExpanded: (key, expanded) => {
            const current = store.getSnapshot();
            if (current.groupExpansion[key] === expanded)
                return;
            store.set({ ...current, groupExpansion: { ...current.groupExpansion, [key]: expanded } });
        },
        setSessionOrder: (fullKey, order, initialOrders) => {
            const current = store.getSnapshot();
            const saved = current.orderBy === 'updated'
                ? copyOrders(initialOrders)
                : { ...current.sessionOrderByAccount, ...copyOrders(initialOrders) };
            saved[fullKey] = [...order];
            store.set({ ...current, sessionOrderByAccount: saved, orderBy: 'manual' });
        },
        retainAgents: (agentIds, workspaceIds) => {
            const current = store.getSnapshot();
            const agents = new Set(agentIds);
            const spaces = new Set(workspaceIds);
            // Keys are `${agentId}/${account}`; agent ids never contain a slash.
            const keep = (key) => {
                const separator = key.indexOf('/');
                if (separator <= 0)
                    return false;
                if (!agents.has(key.slice(0, separator)))
                    return false;
                const account = key.slice(separator + 1);
                return !(account.startsWith('ws:') && !spaces.has(account.slice(3)));
            };
            const orders = Object.fromEntries(Object.entries(current.sessionOrderByAccount)
                .filter(([key]) => keep(key)));
            // Expansion keys are account-shaped without the agent prefix.
            const expansion = Object.fromEntries(Object.entries(current.groupExpansion)
                .filter(([key]) => !(key.startsWith('ws:') && !spaces.has(key.slice(3)))));
            if (Object.keys(orders).length === Object.keys(current.sessionOrderByAccount).length
                && Object.keys(expansion).length === Object.keys(current.groupExpansion).length)
                return;
            store.set({ ...current, sessionOrderByAccount: orders, groupExpansion: expansion });
        },
    };
    return { store, actions };
}
/**
 * Project known members by current recency, identity as the tie-break.
 * Members without a summary are omitted until theirs arrives.
 */
function orderByRecency(sessionIds, summaries) {
    return sessionIds.flatMap((id) => {
        const summary = summaries[id];
        if (summary === undefined)
            return [];
        return [{ id, rank: summary.updatedAt }];
    })
        .sort((a, b) => {
        if (a.rank !== b.rank)
            return b.rank - a.rank;
        return a.id < b.id ? -1 : 1;
    })
        .map(member => member.id);
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
export function reconcileManualOrder(memberIds, savedOrder, summaries, rowState) {
    const members = new Map(memberIds.map(id => [id, id]));
    const included = new Set();
    const ordered = [];
    for (const key of savedOrder ?? []) {
        const id = members.get(key);
        if (id === undefined || included.has(key))
            continue;
        ordered.push(id);
        included.add(key);
    }
    const archived = new Set(rowState.archivedSessionIds);
    const pins = [];
    for (const sessionId of rowState.pinnedSessionIds) {
        const id = members.get(sessionId);
        if (id === undefined || included.has(id) || archived.has(id) || summaries[id] === undefined)
            continue;
        pins.push(id);
        included.add(id);
    }
    const ordinary = [];
    const archives = [];
    for (const id of orderByRecency([...members.values()].filter(id => !included.has(id)), summaries)) {
        if (archived.has(id))
            archives.push(id);
        else
            ordinary.push(id);
    }
    const result = [...pins, ...ordered, ...ordinary, ...archives];
    const pending = new Set(ordinary);
    const placeFork = (id) => {
        if (!pending.delete(id))
            return;
        const parentId = summaries[id]?.parentId;
        if (parentId === undefined || parentId === id || !result.includes(parentId))
            return;
        placeFork(parentId);
        result.splice(result.indexOf(id), 1);
        result.splice(result.indexOf(parentId), 0, id);
    };
    for (const id of [...ordinary].reverse())
        placeFork(id);
    return result;
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
export function sessionDragOrder(order, rows, drag, over) {
    const source = rows.find(row => row.id === drag.sessionId);
    const target = rows.find(row => row.id === over.id);
    if (source === undefined || target === undefined || source.blank
        || source.pinned !== drag.pinned || target.pinned !== drag.pinned
        || source.id === target.id || !order.includes(source.id))
        return undefined;
    const section = rows.filter(row => row.pinned === drag.pinned);
    const sourceIndex = section.findIndex(row => row.id === source.id);
    const withoutSource = section.filter(row => row.id !== source.id);
    const insertAt = withoutSource.findIndex(row => row.id === target.id) + (over.half === 'after' ? 1 : 0);
    if (insertAt === sourceIndex)
        return undefined;
    const next = order.filter(id => id !== source.id);
    const targetIndex = next.indexOf(target.id);
    if (targetIndex === -1)
        return undefined;
    next.splice(targetIndex + (over.half === 'after' ? 1 : 0), 0, source.id);
    return next;
}
//# sourceMappingURL=view.js.map