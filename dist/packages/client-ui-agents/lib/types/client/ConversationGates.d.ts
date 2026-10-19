/**
 * The gated main region: while the agent browser is outside an agent page,
 * one shadow occupant replaces the official conversation shell (header,
 * transcript, and composer) with the bare brand hero — the whale mark and
 * the headline, copied from the conversation skeleton's EmptyHero with the
 * same tokens. The official shell returns when the occupant retires on an
 * agent page.
 * @module @deepseek-ai/dsh-client-ui-agents/client/ConversationGates
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** Injected hero copy, bound to the conversation namespace by the registrant. */
export interface ConversationGateInjected {
    /** The conversation headline (hero.headline). */
    heroText: (key: 'hero.headline' | 'hero.preview') => string;
}
/** Props of the conversation-region gate. */
export type ConversationGateProps = PropsRuntime<'main.conversation'> & PropsLocale<'agents'> & InjectFace<ConversationGateInjected>;
/**
 * Render the bare brand hero over the whole conversation region while the
 * browser is outside an agent page. Replacing the official shell (rather
 * than blanking its holes) keeps a still-open session's header, transcript,
 * and composer from showing through behind the hero.
 * @returns the centered hero element tree.
 */
export declare function ConversationGate({ heroText }: ConversationGateProps): import("react").JSX.Element;
//# sourceMappingURL=ConversationGates.d.ts.map