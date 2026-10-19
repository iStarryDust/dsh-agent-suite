/**
 * The hero mode chip, shadowing the official agent-preset seat at a lower
 * slot priority (lowest renders), plus the Define-mode dialog.
 *
 * The chip offers the deployment's SHIPPED modes only — authored agents and
 * their combined compositions belong to the agent browser. A pick on a
 * session owned by an authored agent re-composes THAT agent's combined
 * preset for the picked mode (so the chat stays in its agent's history); a
 * pick on a plain blank session stages the mode id itself. When no session
 * is current the chip renders nothing: the deployment default applies until
 * a session exists to bind.
 */

import { useEffect, useRef, useState } from 'react'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Button, Checkbox, IconAgentPresetOutlineRegular, IconChevronDownOutlineRegular, Menu, Modal, Toast } from '@deepseek-ai/dsh-client-ui-primitives'
import type { AgentsKey } from './locales.ts'
import css from './hero.module.css'

/** One mode option the chip offers. */
export interface HeroModeOption {
  /** Shipped preset id (standard / ptc / minimal / cordis). */
  readonly id: string
  /** Localized display name. */
  readonly name: string
  /** Localized one-line description. */
  readonly description: string
}

/** Seat snapshot. */
export interface HeroSeatState {
  /** The offered modes, roster order. */
  readonly options: readonly HeroModeOption[]
  /** The id bound to the current session, empty when none. */
  readonly current: string
  /** A wire call is in flight. */
  readonly busy: boolean
}

/** Define-dialog snapshot. */
export interface HeroDefineState {
  /** The capability palette, absent until first load. */
  readonly groups: readonly { readonly id: string; readonly defaultOn: boolean; readonly plugin?: boolean }[]
  /** Whether the palette has loaded. */
  readonly loaded: boolean
  /** A refused compose/suggest, shown above the actions. */
  readonly error: string | null
  /** Whether a call is in flight. */
  readonly busy: boolean
}

/** Business face the hero chip's slot registration injects. */
export interface HeroChipInjected {
  hooks: {
    /** Seat snapshot bound by the renderer as useHeroSeat. */
    heroSeat: SnapshotStore<HeroSeatState>
    /** Define-dialog snapshot bound as useHeroDefine. */
    heroDefine: SnapshotStore<HeroDefineState>
  }
  /** Load the roster and reflect the current binding. */
  load: (sessionId: string | undefined) => Promise<void>
  /** Stage and apply one mode pick on the named session. */
  select: (sessionId: string, id: string) => Promise<string | undefined>
  /** Open the Define dialog (the composing agent is derived from the session). */
  defineTarget: (sessionId: string | undefined) => string
  loadDefine: () => Promise<void>
  suggestDefine: (description: string) => Promise<readonly string[]>
  composeDefine: (agentPreset: string, groups: readonly string[]) => Promise<string>
}

/** Full component props. */
export type HeroChipProps =
  PropsRuntime<'conversation.hero.agentPreset'>
  & PropsLocale<'agents'>
  & InjectFace<HeroChipInjected>

/** Duration of a selection-refusal banner. */
const REFUSAL_HOLD_MS = 8000

/**
 * Render the mode chip for the current session.
 * @param props - runtime share, injected face, and localized copy.
 * @returns the chip, or null when no session is current.
 */
export function HeroChip({
  sessionId, load, select, defineTarget, loadDefine, suggestDefine, composeDefine,
  useHeroSeat, useHeroDefine, t,
}: HeroChipProps) {
  const state = useHeroSeat(snapshot => snapshot)
  const define = useHeroDefine(snapshot => snapshot)
  const [open, setOpen] = useState(false)
  const [defineOpen, setDefineOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [checked, setChecked] = useState<readonly string[]>([])
  const [checksTouched, setChecksTouched] = useState(false)
  const toastSeq = useRef(0)
  const [toast, setToast] = useState<{ seq: number; text: string } | null>(null)

  useEffect(() => {
    void load(sessionId)
  }, [load, sessionId])

  useEffect(() => {
    if (!defineOpen) return
    void loadDefine()
  }, [defineOpen, loadDefine])

  useEffect(() => {
    if (!defineOpen || checksTouched) return
    setChecked(define.groups.filter(group => group.defaultOn).map(group => group.id))
  }, [define.groups, defineOpen, checksTouched])

  const toggle = (id: string, on: boolean): void => {
    setChecksTouched(true)
    setChecked(current => on ? [...current, id] : current.filter(candidate => candidate !== id))
  }

  if (sessionId === undefined) return null

  const confirmDefine = (): void => {
    const agent = defineTarget(sessionId)
    if (agent === '') {
      setDefineOpen(false)
      return
    }
    void composeDefine(agent, checked).then((combinedId) => {
      if (combinedId === '') return
      setDefineOpen(false)
      setDescription('')
      setChecksTouched(false)
      void select(sessionId, combinedId)
    })
  }

  return (
    <>
      <Menu
        open={open}
        onClose={() => { setOpen(false) }}
        items={[
          ...state.options.map(option => ({
            id: option.id,
            label: (
              <span className={css.item}>
                <span className={css.itemName}>{option.name}</span>
                <span className={css.itemDesc}>{option.description}</span>
              </span>
            ),
          })),
          {
            id: '__define__',
            label: (
              <span className={css.item}>
                <span className={css.itemName}>{t('seat.define')}</span>
                <span className={css.itemDesc}>{t('seat.define.menuDesc')}</span>
              </span>
            ),
          },
        ]}
        selectedId={state.current}
        onSelect={(id) => {
          setOpen(false)
          if (id === '__define__') {
            setDefineOpen(true)
            return
          }
          void select(sessionId, id).then((refusal) => {
            if (refusal === undefined) return
            toastSeq.current += 1
            setToast({ seq: toastSeq.current, text: refusal })
          })
        }}
        align="start"
        portal
        className={css.menuAnchor}
        anchor={(
          <button
            type="button"
            className={css.seat}
            aria-haspopup="menu"
            aria-expanded={open}
            title={t('seat.hint')}
            disabled={state.busy}
            onClick={() => { setOpen(value => !value) }}
          >
            <IconAgentPresetOutlineRegular className={css.seatIcon} />
            <span className={css.seatLabel}>{
              state.options.find(option => option.id === state.current)?.name ?? state.current
            }</span>
            <IconChevronDownOutlineRegular className={css.chevron} />
          </button>
        )}
      />
      <Modal
        open={defineOpen}
        onClose={() => { setDefineOpen(false) }}
        closeLabel={t('cancel')}
        title={t('seat.define.title')}
        footer={(
          <>
            <Button variant="outline" disabled={define.busy} onClick={() => { setDefineOpen(false) }}>
              {t('cancel')}
            </Button>
            <Button variant="primary" disabled={define.busy || checked.length === 0} onClick={confirmDefine}>
              {t('seat.define.confirm')}
            </Button>
          </>
        )}
      >
        <div className={css.defineBody}>
          <p className={css.defineIntro}>{t('seat.define.intro')}</p>
          {define.error !== null && <div className={css.defineError} role="alert">{define.error}</div>}
          <label className={css.defineField}>
            <span className={css.defineLabel}>{t('seat.define.description')}</span>
            <textarea
              className={css.defineTextarea}
              value={description}
              placeholder={t('seat.define.description.placeholder')}
              rows={3}
              onChange={event => setDescription(event.target.value)}
            />
          </label>
          <Button
            variant="outline"
            disabled={define.busy || description.trim() === ''}
            onClick={() => {
              void suggestDefine(description).then((groups) => {
                setChecked(groups)
                setChecksTouched(false)
              })
            }}
          >
            {define.busy ? t('seat.define.suggesting') : t('seat.define.suggest')}
          </Button>
          <div className={css.defineGroups}>
            <span className={css.defineLabel}>{t('seat.define.groups')}</span>
            {define.groups.filter(group => group.plugin !== true).map(group => (
              <Checkbox
                key={group.id}
                label={t(`agents.defineGroup.${group.id}` as AgentsKey)}
                checked={checked.includes(group.id)}
                disabled={define.busy}
                onChange={on => toggle(group.id, on)}
              />
            ))}
            {define.groups.some(group => group.plugin === true) && (
              <span key="groups-plugin" className={css.defineLabel}>{t('seat.define.groupsPlugin')}</span>
            )}
            {define.groups.filter(group => group.plugin === true).map(group => (
              <Checkbox
                key={group.id}
                label={t(`agents.defineGroup.${group.id}` as AgentsKey)}
                checked={checked.includes(group.id)}
                disabled={define.busy}
                onChange={on => toggle(group.id, on)}
              />
            ))}
          </div>
        </div>
      </Modal>
      {toast !== null && (
        <Toast
          key={toast.seq}
          text={toast.text}
          holdMs={REFUSAL_HOLD_MS}
          anchor={document.querySelector<HTMLElement>('[data-composer-card]')}
          onDone={() => { setToast(null) }}
        />
      )}
    </>
  )
}
