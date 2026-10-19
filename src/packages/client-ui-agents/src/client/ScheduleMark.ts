/**
 * The chat row's scheduled-task mark: a shared read of the Host reminder
 * catalog (`remote.schedule.catalog()`), projected per row as a leading clock
 * icon while the session holds an active task. Official ui-schedule parity —
 * one Remote read shared by every visible row, `schedule/changed`
 * invalidation, and a connection-reset clear — but seated directly in our
 * rows: the official `sidebar.session.row.leading` slot is single-declarer
 * (ui-workspace), so a shadowed browser cannot render through it.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'

/** The one row-projected fact: does this session hold an active reminder. */
export interface ScheduleCatalogSnapshot {
  /** Whether a catalog read has settled; unsettled reads carry no marks. */
  readonly settled: boolean
  /** Every Host reminder with its owning session and durable status. */
  readonly records: readonly { readonly sessionId: string; readonly status: string }[]
}

/** The wire face this module reads (structurally typed; absent without the schedule plugin). */
type ScheduleRemote = {
  catalog(): Promise<{ ok: boolean; value?: unknown; error?: { message: string } }>
}

/** The shared catalog source: read, invalidation, and reset wiring in one. */
export interface ScheduleCatalogSource {
  /** The observable every row projects. */
  readonly catalog: SnapshotStore<ScheduleCatalogSnapshot>
  /** One fresh read (first subscriber path: the remote may mount later than apply). */
  readonly ensureRead: () => void
  /** Drop the event subscriptions. */
  readonly dispose: () => void
}

/**
 * Create the shared reminder catalog source.
 * @param ctx - client context carrying the remote face and lifecycle events.
 * @returns the catalog observable, a manual re-read, and the disposer.
 */
export function createScheduleCatalogSource(ctx: ClientContext): ScheduleCatalogSource {
  const catalog = createSnapshotStore<ScheduleCatalogSnapshot>({ settled: false, records: [] })
  const read = (): void => {
    const schedule = ctx.get('remote.schedule') as ScheduleRemote | undefined
    if (schedule === undefined) return
    void schedule.catalog().then((result) => {
      if (!result.ok) return
      const records = Array.isArray(result.value) ? result.value : []
      catalog.set({
        settled: true,
        records: records.flatMap(record => {
          const entry = record as { sessionId?: unknown; status?: unknown }
          return typeof entry.sessionId === 'string' && typeof entry.status === 'string'
            ? [{ sessionId: entry.sessionId, status: entry.status }]
            : []
        }),
      })
    }).catch(() => { /* failed read: no marks until the next invalidation */ })
  }
  // The host only forwards the events it declares: when the schedule provider is
  // not installed in this profile, `$on` throws and would take the whole entry
  // down with it. A missing event means "no clock marks", not "no plugin".
  let offChanged: () => void = () => {}
  try {
    const subscribe = ctx.remote.$on as unknown as (
      event: string,
      listener: () => void,
    ) => (() => void) | undefined
    const disposer = subscribe.call(ctx.remote, 'schedule/changed', () => { read() })
    if (typeof disposer === 'function') offChanged = disposer
  } catch {
    // schedule/changed is not offered by this host: keep the catalog empty.
  }
  const offReset = ctx.on('connection/reset', () => {
    catalog.set({ settled: false, records: [] })
    read()
  })
  read()
  return { catalog, ensureRead: read, dispose: () => { offChanged(); offReset() } }
}
