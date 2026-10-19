import { createSnapshotStore } from '@deepseek-ai/dsh-client-store';
/**
 * Create the shared reminder catalog source.
 * @param ctx - client context carrying the remote face and lifecycle events.
 * @returns the catalog observable, a manual re-read, and the disposer.
 */
export function createScheduleCatalogSource(ctx) {
    const catalog = createSnapshotStore({ settled: false, records: [] });
    const read = () => {
        const schedule = ctx.get('remote.schedule');
        if (schedule === undefined)
            return;
        void schedule.catalog().then((result) => {
            if (!result.ok)
                return;
            const records = Array.isArray(result.value) ? result.value : [];
            catalog.set({
                settled: true,
                records: records.flatMap(record => {
                    const entry = record;
                    return typeof entry.sessionId === 'string' && typeof entry.status === 'string'
                        ? [{ sessionId: entry.sessionId, status: entry.status }]
                        : [];
                }),
            });
        }).catch(() => { });
    };
    const offChanged = ctx.remote.$on('schedule/changed', () => { read(); });
    const offReset = ctx.on('connection/reset', () => {
        catalog.set({ settled: false, records: [] });
        read();
    });
    read();
    return { catalog, ensureRead: read, dispose: () => { offChanged(); offReset(); } };
}
//# sourceMappingURL=ScheduleMark.js.map