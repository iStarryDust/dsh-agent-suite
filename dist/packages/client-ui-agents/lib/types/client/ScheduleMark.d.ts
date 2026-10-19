/**
 * The chat row's scheduled-task mark: a shared read of the Host reminder
 * catalog (`remote.schedule.catalog()`), projected per row as a leading clock
 * icon while the session holds an active task. Official ui-schedule parity —
 * one Remote read shared by every visible row, `schedule/changed`
 * invalidation, and a connection-reset clear — but seated directly in our
 * rows: the official `sidebar.session.row.leading` slot is single-declarer
 * (ui-workspace), so a shadowed browser cannot render through it.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
/** The one row-projected fact: does this session hold an active reminder. */
export interface ScheduleCatalogSnapshot {
    /** Whether a catalog read has settled; unsettled reads carry no marks. */
    readonly settled: boolean;
    /** Every Host reminder with its owning session and durable status. */
    readonly records: readonly {
        readonly sessionId: string;
        readonly status: string;
    }[];
}
/** The shared catalog source: read, invalidation, and reset wiring in one. */
export interface ScheduleCatalogSource {
    /** The observable every row projects. */
    readonly catalog: SnapshotStore<ScheduleCatalogSnapshot>;
    /** One fresh read (first subscriber path: the remote may mount later than apply). */
    readonly ensureRead: () => void;
    /** Drop the event subscriptions. */
    readonly dispose: () => void;
}
/**
 * Create the shared reminder catalog source.
 * @param ctx - client context carrying the remote face and lifecycle events.
 * @returns the catalog observable, a manual re-read, and the disposer.
 */
export declare function createScheduleCatalogSource(ctx: ClientContext): ScheduleCatalogSource;
//# sourceMappingURL=ScheduleMark.d.ts.map