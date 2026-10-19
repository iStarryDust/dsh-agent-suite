import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { FISH_LOGO_PATH, FISH_LOGO_VIEWBOX } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './AgentBrowser.module.css';
/**
 * Render the empty workspace-chip occupant.
 * @returns an empty region where the workspace picker would sit.
 */
export function BlankScreen(_props) {
    return _jsx("div", { className: css.blankScreen });
}
/**
 * Render the empty mode-chip occupant, replacing the staged mode pick while
 * no agent page needs it.
 * @returns an empty region.
 */
export function ModeChipGate(_props) {
    return _jsx("div", { className: css.blankScreen });
}
/**
 * Render the composer gate: the gate's chain entry claims the composer seat
 * while the browser is outside an agent page, and this occupant re-renders
 * the hero chrome (fish mark, headline, preview badge) so the region keeps
 * its brand moment without the composer. The official composer returns when
 * the entry retires on the agent page.
 * @returns the centered hero element tree.
 */
export function ComposerGate({ heroText }) {
    return (_jsx("div", { className: css.heroGate, children: _jsx("div", { className: css.heroGateStack, children: _jsxs("div", { className: css.heroGateHeadline, children: [_jsx("svg", { className: css.heroGateFish, width: 34, height: (34 * FISH_LOGO_VIEWBOX.height) / FISH_LOGO_VIEWBOX.width, viewBox: `0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`, fill: "none", "aria-hidden": "true", children: _jsx("path", { d: FISH_LOGO_PATH, fill: "currentColor" }) }), _jsxs("span", { className: css.heroGateTitleGroup, children: [_jsx("span", { children: heroText('hero.headline') }), _jsx("span", { className: css.heroGateBadge, children: heroText('hero.preview') })] })] }) }) }));
}
//# sourceMappingURL=BlankScreen.js.map