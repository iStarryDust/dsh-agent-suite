/**
 * Agent-memory settings section: the four memory switches and the global
 * memory editor. Visual language mirrors the official settings sections
 * (ui-agent-preset AgentPresetSection): one column capped at 720px, an 18px
 * title over a tertiary intro, uppercase group heads, card rows built on the
 * settings-card tokens, and a mono editor styled like the composition viewer.
 */
import { useEffect, useState } from 'react'
import { Button, Switch } from '@deepseek-ai/dsh-client-ui-primitives'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { MemorySectionState, MemorySwitches } from './memory-store.ts'
import css from './MemorySection.module.css'

/** Settings actions and their shared controller state. */
export interface MemorySectionInjected {
  hooks: {
    /** Page snapshot bound by the renderer as useMemorySection. */
    memorySection: SnapshotStore<MemorySectionState>
  }
  /** Toggle one memory switch. */
  toggle: (field: keyof MemorySwitches, next: boolean) => Promise<void>
  /** Update the global-memory editor draft. */
  setDraft: (text: string) => void
  /** Save the global document. */
  saveGlobal: () => Promise<void>
  /** Load the global document. */
  loadGlobal: () => Promise<void>
}

/** Props assembled by the settings renderer. */
export type MemorySectionProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'settings.agentMemory'>
  & InjectFace<MemorySectionInjected>

/** One switch row: title, description, and the control. */
function SwitchRow({
  title, description, checked, disabled, busy, failed, onChange, t,
}: {
  title: string
  description: string
  checked: boolean
  disabled: boolean
  busy: boolean
  failed: boolean
  onChange: (next: boolean) => void
  t: (key: 'writeFailed') => string
}) {
  return (
    <li className={css.rowCard}>
      <div className={css.rowText}>
        <span className={css.rowTitle}>{title}</span>
        <span className={css.rowDesc}>{description}</span>
        {failed && <span className={css.error} role="alert">{t('writeFailed')}</span>}
      </div>
      <Switch checked={checked} disabled={disabled || busy} label={title} onChange={onChange} />
    </li>
  )
}

/**
 * Render the agent-memory settings section.
 * @param props - settings actions, snapshot hook, and localized copy.
 * @returns the section page.
 */
export function MemorySection({
  useMemorySection, toggle, setDraft, saveGlobal, loadGlobal, t,
}: MemorySectionProps) {
  const state = useMemorySection(value => value)
  const [busyField, setBusyField] = useState<keyof MemorySwitches | null>(null)
  const [failedField, setFailedField] = useState<keyof MemorySwitches | null>(null)

  useEffect(() => { void loadGlobal() }, [loadGlobal])

  const disabled = state.status !== 'ready'
  const change = (field: keyof MemorySwitches) => (next: boolean) => {
    setFailedField(null)
    setBusyField(field)
    void toggle(field, next)
      .catch(() => { setFailedField(field) })
      .finally(() => { setBusyField(null) })
  }

  const rows: readonly (readonly [keyof MemorySwitches, string, string])[] = [
    ['globalEnabled', t('globalEnabled.title'), t('globalEnabled.description')],
    ['agentEnabled', t('agentEnabled.title'), t('agentEnabled.description')],
    ['autoMemory', t('autoMemory.title'), t('autoMemory.description')],
    ['askMemory', t('askMemory.title'), t('askMemory.description')],
  ]

  const editor = state.editor
  return (
    <section className={css.section}>
      <h2 className={css.title}>{t('nav')}</h2>
      <p className={css.intro}>{t('intro')}</p>
      {state.status === 'unavailable' && <p className={css.error} role="alert">{t('unavailable')}</p>}
      <section className={css.group}>
        <h3 className={css.groupHead}>{t('switchesGroup')}</h3>
        <ul className={css.rows}>
          {rows.map(([field, title, description]) => (
            <SwitchRow
              key={field}
              title={title}
              description={description}
              checked={state.switches[field]}
              disabled={disabled}
              busy={busyField === field}
              failed={failedField === field}
              onChange={change(field)}
              t={t}
            />
          ))}
        </ul>
      </section>
      <section className={css.group}>
        <h3 className={css.groupHead}>{t('globalGroup')}</h3>
        <p className={css.rowDesc}>{t('globalEditor.hint')}</p>
        <textarea
          className={css.editor}
          value={editor.globalText}
          placeholder={t('globalEditor.placeholder')}
          spellCheck={false}
          disabled={editor.saveState === 'saving'}
          onChange={(event) => { setDraft(event.target.value) }}
        />
        <div className={css.editorFooter}>
          <Button
            variant="primary"
            disabled={editor.saveState === 'saving'}
            onClick={() => { void saveGlobal() }}
          >
            {editor.saveState === 'saving' ? t('globalEditor.saving') : t('globalEditor.save')}
          </Button>
          {editor.saveState === 'saved' && <span className={css.status} role="status">{t('globalEditor.saved')}</span>}
          {editor.saveState === 'failed' && <span className={css.error} role="alert">{editor.error ?? t('globalEditor.saveFailed')}</span>}
        </div>
      </section>
    </section>
  )
}
