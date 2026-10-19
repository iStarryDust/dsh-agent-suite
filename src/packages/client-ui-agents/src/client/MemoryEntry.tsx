/**
 * The per-message memory entry, browser half: the memory button seated in the
 * assistant-actions strip beside the official feedback pair. It opens the
 * session's message-selection dialog; the checked messages go to the host
 * remember path, which condenses them into the agent's own long-term memory
 * store. Nothing is written until the human checks messages and submits.
 * @module @istarry/dsh-client-ui-agents/client/MemoryEntry
 */

import { useMemo, useState } from 'react'
import { Button, IconAgentPresetOutlineRegular, Modal, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
// Type-only: pulls the ui-chat merges — the assistant-actions SlotMap entry,
// the useChat session-standard prop, and the snapshot/node faces.
import type {
  AssistantBlock, ChatSnapshot,
} from '@deepseek-ai/dsh-client-ui-chat/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { RememberValue } from '@istarry/dsh-agent-memory/types'
import css from './MemoryEntry.module.css'

/** One selectable row: a stable key, an order anchor, the side, a preview, and the raw text. */
interface MemoryCandidate {
  key: string
  anchorSeq: number
  side: 'user' | 'assistant'
  preview: string
  text: string
}

/** Minimal extractor over a settled assistant node's blocks. */
function assistantText(blocks: readonly AssistantBlock[]): string {
  return blocks.flatMap(block => block.kind === 'text' ? [block.text] : []).join('')
}

/** Pull the text blocks out of a user node's content array. */
function contentText(content: readonly { type: string; text?: string }[]): string {
  return content.flatMap(block => block.type === 'text' && typeof block.text === 'string' ? [block.text] : []).join('')
}

/** Condense a long message to a short preview line. */
function preview(text: string, limit = 120): string {
  const trimmed = text.replace(/\s+/g, ' ').trim()
  return trimmed.length <= limit ? trimmed : `${trimmed.slice(0, limit)}…`
}

/**
 * Build the selectable candidate list from the session chat snapshot. User
 * (and admitted steering) nodes carry durable content blocks; assistant nodes
 * render under the `assistant-step` kind with settled text blocks. Running
 * replies, tool rows, commands, and context snapshots carry no durable prose
 * and are skipped. The list reads in timeline order.
 */
function candidatesOf(snapshot: ChatSnapshot | undefined): MemoryCandidate[] {
  if (snapshot === undefined) return []
  const list: MemoryCandidate[] = []
  for (const node of snapshot.nodes.values()) {
    if (node.visibility === 'hidden') continue
    if (node.kind === 'user' || node.kind === 'steering') {
      const data = node.data as { content?: readonly { type: string; text?: string }[] }
      const text = contentText(data.content ?? [])
      if (text.trim() === '') continue
      list.push({ key: node.id, anchorSeq: node.anchorSeq, side: 'user', preview: preview(text), text })
    } else if (node.kind === 'assistant-step') {
      const data = node.data as { status?: string; blocks?: readonly AssistantBlock[] }
      if (data.status === 'running') continue
      const text = assistantText(data.blocks ?? [])
      if (text.trim() === '') continue
      list.push({ key: node.id, anchorSeq: node.anchorSeq, side: 'assistant', preview: preview(text), text })
    }
  }
  return list.sort((left, right) => left.anchorSeq - right.anchorSeq)
}

/** Map a fail-closed remember outcome to the dialog's copy. */
function outcomeText(outcome: string | undefined, t: MemoryDialogProps['t']): string {
  if (outcome === 'not an agent chat') return t('memoryEntry.notAgent')
  if (outcome === 'session not open') return t('memoryEntry.notOpen')
  return outcome !== undefined && outcome !== '' ? outcome : t('memoryEntry.failed')
}

/** Injected business face of the memory entry. */
export interface MemoryActionsInjected {
  /**
   * Analyze the checked conversation text into the owning session's agent
   * memory; resolves the host outcome (saved, entries, or a failure detail).
   */
  remember: (text: string) => Promise<RememberValue>
}

/** Full props of the assistant-actions memory entry. */
export type MemoryActionsProps =
  PropsRuntime<'conversation.chat.assistant-actions'>
  & InjectFace<MemoryActionsInjected>
  & PropsLocale<'agents'>

/**
 * The strip button and its transient saved note. The dialog is local state:
 * only one instance exists per message row, and nothing outside it needs the
 * selection.
 * @param props - the injected remember verb and the runtime session kit.
 * @returns the memory icon button with any transient inline copy.
 */
export function MemoryActions({ useChat, remember, t }: MemoryActionsProps) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  return (
    <>
      <Tooltip label={t('memoryEntry.action')} side="bottom">
        <button
          type="button"
          className={css.action}
          aria-label={t('memoryEntry.action')}
          onClick={() => { setNote(null); setOpen(true) }}
        >
          <IconAgentPresetOutlineRegular />
        </button>
      </Tooltip>
      {note !== null && <span className={css.note} role="status">{note}</span>}
      {open && (
        <MemoryDialog
          useChat={useChat}
          remember={remember}
          onClose={(saved) => {
            setOpen(false)
            if (saved) setNote(t('memoryEntry.saved'))
          }}
          t={t}
        />
      )}
    </>
  )
}

/** Props of the message-selection dialog: the chat hook, the verb, and the copy. */
export interface MemoryDialogProps {
  /** Selector hook over the session's chat snapshot. */
  useChat: MemoryActionsProps['useChat']
  /** The injected remember verb (bound to this session's agent). */
  remember: (text: string) => Promise<RememberValue>
  /** Close the dialog; `saved` promotes the strip's transient note. */
  onClose: (saved: boolean) => void
  /** The agents-namespace copy. */
  t: MemoryActionsProps['t']
}

/**
 * The memory-selection dialog: the official modal shell over the current
 * session's selectable messages (a condensed preview per row). The human
 * checks the ones worth keeping, and the checked text goes to the injected
 * remember verb.
 */
export function MemoryDialog({ useChat, remember, onClose, t }: MemoryDialogProps) {
  const snapshot = useChat(snapshot => snapshot)
  const candidates = useMemo(() => candidatesOf(snapshot), [snapshot])
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggle = (key: string): void => {
    const next = new Set(checked)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setChecked(next)
  }

  const submit = async (): Promise<void> => {
    const rows = candidates.filter(item => checked.has(item.key))
    const text = rows
      .map(item => (item.side === 'user' ? t('memoryEntry.side.user') : t('memoryEntry.side.assistant')) + '：' + item.text)
      .join('\n\n')
    if (text.trim() === '' || busy) return
    setBusy(true)
    setError(null)
    try {
      const result = await remember(text)
      if (result.saved) {
        onClose(true)
        return
      }
      setError(outcomeText(result.outcome, t))
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : t('memoryEntry.failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open
      onClose={() => { if (!busy) onClose(false) }}
      closeLabel={t('memoryEntry.cancel')}
      title={t('memoryEntry.title')}
      description={t('memoryEntry.subtitle')}
      footer={(
        <>
          {error !== null && <span className={css.dialogError} role="alert">{error}</span>}
          <Button variant="outline" disabled={busy} onClick={() => { onClose(false) }}>
            {t('memoryEntry.cancel')}
          </Button>
          <Button variant="primary" disabled={busy || checked.size === 0} onClick={() => { void submit() }}>
            {busy ? t('memoryEntry.submitting') : t('memoryEntry.submit')}
          </Button>
        </>
      )}
    >
      <div className={css.dialogList}>
        {candidates.length === 0 && (
          <div className={css.dialogEmpty}>{t('memoryEntry.empty')}</div>
        )}
        {candidates.map((item) => {
          const active = checked.has(item.key)
          return (
            <label key={item.key} className={active ? css.dialogRowChecked : css.dialogRow}>
              <input
                type="checkbox"
                checked={active}
                onChange={() => { toggle(item.key) }}
                className={css.dialogCheck}
              />
              <span className={css.dialogSideTag}>
                {item.side === 'user' ? t('memoryEntry.side.user') : t('memoryEntry.side.assistant')}
              </span>
              <span className={css.dialogPreview}>{item.preview}</span>
            </label>
          )
        })}
      </div>
    </Modal>
  )
}
