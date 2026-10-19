/**
 * The `shell.overlay` entries for the agent browser's archive flow: the
 * stop-and-archive confirmation dialog and the row-action toast. They live in
 * the frame-wide layer so they outlive the row menu that raised them (and the
 * sidebar collapse that may follow). The pending request and the notice on
 * display are plugin stores written by the archive wrapper in apply().
 */
import { useState, type ReactNode } from 'react'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the ui-layout SlotMap merge ('shell.overlay').
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type { SessionActivity } from '@deepseek-ai/dsh-api-workspace-controller/client'
import { Button, Modal, Toast } from '@deepseek-ai/dsh-client-ui-primitives'
import type { AgentsKey } from './locales.ts'
import type { AgentViewState } from './view.ts'
import css from './AgentBrowser.module.css'

/** A refusal's pending confirmation: the session and the work that must stop. */
export interface ArchiveConfirmRequest {
  readonly sessionId: string
  readonly displayTitle: string
  readonly activity: readonly SessionActivity[]
}

/** One row-action notice on display. */
export interface RowToastState {
  readonly kind: 'archived' | 'stoppedAndArchived'
  readonly sessionId: string
}

/** Confirm-dialog share: the pending request, its settlement, and the hop. */
export interface ArchiveConfirmInjected {
  hooks: {
    /** The pending stop-and-archive request, or none. */
    request: SnapshotStore<ArchiveConfirmRequest | null>
  }
  /** Take the dialog down without archiving. */
  settle: () => void
  /** Ask the Host to stop the listed work, then archive. */
  stopAndArchive: (sessionId: string) => Promise<void>
}

/** Full props of the archive confirm dialog. */
export type ArchiveConfirmProps =
  PropsRuntime<'shell.overlay'>
  & PropsLocale<'agents'>
  & InjectFace<ArchiveConfirmInjected>

/**
 * The `shell.overlay` entry: nothing while no confirmation is pending,
 * otherwise one dialog per request (keyed by the session). Confirming asks
 * the Host to stop the listed work and archive; cancelling leaves the
 * session running and visible.
 */
export function ArchiveConfirmDialog({ useRequest, settle, stopAndArchive, t }: ArchiveConfirmProps): ReactNode {
  const request = useRequest(pending => pending)
  if (request === null) return null
  return (
    <ArchiveConfirmForm
      key={request.sessionId}
      request={request}
      stopAndArchive={stopAndArchive}
      onSettle={settle}
      t={t}
    />
  )
}

/** One request's dialog: in-flight and error state die with it. */
function ArchiveConfirmForm({ request, stopAndArchive, onSettle, t }: {
  request: ArchiveConfirmRequest
  stopAndArchive: (sessionId: string) => Promise<void>
  onSettle: () => void
  t: (key: AgentsKey, params?: Record<string, unknown>) => string
}): ReactNode {
  const [archiving, setArchiving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const close = () => {
    if (archiving) return
    onSettle()
  }
  const confirm = () => {
    setArchiving(true)
    setError(null)
    stopAndArchive(request.sessionId).then(() => {
      setArchiving(false)
      onSettle()
    }).catch((reason: unknown) => {
      setArchiving(false)
      setError(reason instanceof Error ? reason.message : String(reason))
    })
  }
  return (
    <Modal
      open
      onClose={close}
      closeLabel={t('close')}
      title={t('archive.confirm.title')}
      description={t('archive.confirm.desc', { title: request.displayTitle })}
      footer={(
        <>
          <Button variant="outline" disabled={archiving} onClick={close}>{t('cancel')}</Button>
          <Button
            variant="outline"
            className={css.deleteAction}
            disabled={archiving}
            onClick={confirm}
          >
            {t('archive.confirm.action')}
          </Button>
        </>
      )}
    >
      {request.activity.length > 0 && (
        <ul className={css.archiveActivity} aria-label={t('archive.confirm.activity')}>
          {request.activity.map((entry, index) => (
            <li key={`${entry.kind}-${String(index)}`}>{activityLine(entry, t)}</li>
          ))}
        </ul>
      )}
      {archiving && <div className={css.deleteStatus} role="status">{t('archive.confirm.pending')}</div>}
      {error !== null && <div className={css.dialogError} role="alert">{error}</div>}
    </Modal>
  )
}

/**
 * One family's line: its count and the items' labels (ids when a family
 * carries no label). A family this dictionary does not know falls through to
 * the generic line.
 */
function activityLine(entry: SessionActivity, t: (key: AgentsKey, params?: Record<string, unknown>) => string): string {
  const items = entry.items ?? []
  const n = items.length
  const names = items.map(item => item.label ?? item.id).join(t('archive.confirm.listSeparator'))
  switch (entry.kind) {
    case 'turn': return t('archive.confirm.turn')
    case 'subagent': return t('archive.confirm.subagents', { n, names })
    case 'job': return t('archive.confirm.jobs', { n, names })
    case 'schedule': return t('archive.confirm.schedules', { n, names })
    default: return t('archive.confirm.other', { kind: entry.kind, n })
  }
}

/** Row-toast share: the notice, its dismissal, and the two archived actions. */
export interface RowToastInjected {
  hooks: {
    /** The notice on display, or none. */
    toast: SnapshotStore<RowToastState | null>
    /** The viewing store, for the show-archived action's visibility. */
    view: SnapshotStore<AgentViewState>
  }
  /** Take the notice down. */
  dismiss: () => void
  /** Restore the archived session the notice reports. */
  undoArchive: (sessionId: string) => void
  /** Switch the viewing store's archived filter so archived rows appear. */
  showArchived: () => void
}

/** Full props of the row-action toast. */
export type RowToastProps =
  PropsRuntime<'shell.overlay'>
  & PropsLocale<'agents'>
  & InjectFace<RowToastInjected>

/** Hold for the actionable archived notice: two buttons to react to. */
const LONG_TOAST_HOLD_MS = 6000

/**
 * Render the current notice: the archived and stopped-and-archived notices
 * with their undo action — plus the show-archived action while archived rows
 * are hidden — on a 6 s hold.
 */
export function RowActionToast({ useToast, useView, dismiss, undoArchive, showArchived, t }: RowToastProps): ReactNode {
  const toast = useToast(current => current)
  const view = useView(state => state)
  if (toast === null) return null
  const archivedRowsHidden = (view.archivedFilter ?? 'default') === 'default'
  return (
    <Toast
      key={`toast-${toast.sessionId}`}
      text={t(toast.kind === 'archived' ? 'toast.archived' : 'toast.stoppedAndArchived')}
      tone="success"
      holdMs={LONG_TOAST_HOLD_MS}
      actions={[
        { label: t('toast.undo'), onClick: () => { dismiss(); undoArchive(toast.sessionId) } },
        ...archivedRowsHidden
          ? [{ prefix: t('toast.or'), label: t('toast.showArchived'), onClick: () => { dismiss(); showArchived() } }]
          : [],
      ]}
      onDone={dismiss}
    />
  )
}
