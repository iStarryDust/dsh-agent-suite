/**
 * The gated main-region surfaces, rendered into the hero holes while the
 * agent browser is outside an agent page: the workspace chip, the mode chip,
 * and the composer each step aside so a fresh page reads as the bare brand
 * hero. The composer gate takes over the composer seat, so it re-renders the
 * official hero chrome itself (the whale mark and the headline, copied from
 * the conversation skeleton's EmptyHero with the same tokens) — the official
 * HeroShell rides the composer fallback, which the gate replaces.
 * @module @deepseek-ai/dsh-client-ui-agents/client/BlankScreen
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** Props of the workspace-chip gate (the hero hole's runtime share plus locale). */
export type BlankScreenProps = PropsRuntime<'conversation.hero.workspace'> & PropsLocale<'agents'>;
/**
 * Render the empty workspace-chip occupant.
 * @returns an empty region where the workspace picker would sit.
 */
export declare function BlankScreen(_props: BlankScreenProps): import("react").JSX.Element;
/** Props of the mode-chip gate. */
export type ModeChipGateProps = PropsRuntime<'conversation.hero.agentPreset'> & PropsLocale<'agents'>;
/**
 * Render the empty mode-chip occupant, replacing the staged mode pick while
 * no agent page needs it.
 * @returns an empty region.
 */
export declare function ModeChipGate(_props: ModeChipGateProps): import("react").JSX.Element;
/** Injected hero copy, bound to the conversation namespace by the registrant. */
export interface ComposerGateInjected {
    /** The conversation headline (hero.headline). */
    heroText: (key: 'hero.headline' | 'hero.preview') => string;
}
/** Props of the composer gate: one chain electee carrying the hero chrome. */
export type ComposerGateProps = PropsRuntime<'conversation.composer'> & PropsLocale<'agents'> & InjectFace<ComposerGateInjected>;
/**
 * Render the composer gate: the gate's chain entry claims the composer seat
 * while the browser is outside an agent page, and this occupant re-renders
 * the hero chrome (fish mark, headline, preview badge) so the region keeps
 * its brand moment without the composer. The official composer returns when
 * the entry retires on the agent page.
 * @returns the centered hero element tree.
 */
export declare function ComposerGate({ heroText }: ComposerGateProps): import("react").JSX.Element;
//# sourceMappingURL=BlankScreen.d.ts.map