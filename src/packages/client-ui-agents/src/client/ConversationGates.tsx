/**
 * The gated main region: while the agent browser is outside an agent page,
 * one shadow occupant replaces the official conversation shell (header,
 * transcript, and composer) with the bare brand hero — the whale mark and
 * the headline, copied from the conversation skeleton's EmptyHero with the
 * same tokens. The official shell returns when the occupant retires on an
 * agent page.
 * @module @istarry/dsh-client-ui-agents/client/ConversationGates
 */

import { FISH_LOGO_PATH, FISH_LOGO_VIEWBOX } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the ui-conversation SlotMap merge ('main.conversation').
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import css from './AgentBrowser.module.css'

/** Injected hero copy, bound to the conversation namespace by the registrant. */
export interface ConversationGateInjected {
  /** The conversation headline (hero.headline). */
  heroText: (key: 'hero.headline' | 'hero.preview') => string
}

/** Props of the conversation-region gate. */
export type ConversationGateProps =
  PropsRuntime<'main.conversation'>
  & PropsLocale<'agents'>
  & InjectFace<ConversationGateInjected>

/**
 * Render the bare brand hero over the whole conversation region while the
 * browser is outside an agent page. Replacing the official shell (rather
 * than blanking its holes) keeps a still-open session's header, transcript,
 * and composer from showing through behind the hero.
 * @returns the centered hero element tree.
 */
export function ConversationGate({ heroText }: ConversationGateProps) {
  return (
    <div className={css.heroGate}>
      <div className={css.heroGateStack}>
        <div className={css.heroGateHeadline}>
          <svg
            className={css.heroGateFish}
            width={34}
            height={(34 * FISH_LOGO_VIEWBOX.height) / FISH_LOGO_VIEWBOX.width}
            viewBox={`0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`}
            fill="none"
            aria-hidden="true"
          >
            <path d={FISH_LOGO_PATH} fill="currentColor" />
          </svg>
          <span className={css.heroGateTitleGroup}>
            <span>{heroText('hero.headline')}</span>
            <span className={css.heroGateBadge}>{heroText('hero.preview')}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
