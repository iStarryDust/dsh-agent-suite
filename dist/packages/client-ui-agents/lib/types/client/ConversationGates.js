import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The gated main region: while the agent browser is outside an agent page,
 * one shadow occupant replaces the official conversation shell (header,
 * transcript, and composer) with the bare brand hero — the whale mark and
 * the headline, copied from the conversation skeleton's EmptyHero with the
 * same tokens. The official shell returns when the occupant retires on an
 * agent page.
 * @module @deepseek-ai/dsh-client-ui-agents/client/ConversationGates
 */
import { FISH_LOGO_PATH, FISH_LOGO_VIEWBOX } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './AgentBrowser.module.css';
/**
 * Render the bare brand hero over the whole conversation region while the
 * browser is outside an agent page. Replacing the official shell (rather
 * than blanking its holes) keeps a still-open session's header, transcript,
 * and composer from showing through behind the hero.
 * @returns the centered hero element tree.
 */
export function ConversationGate({ heroText }) {
    return (_jsx("div", { className: css.heroGate, children: _jsx("div", { className: css.heroGateStack, children: _jsxs("div", { className: css.heroGateHeadline, children: [_jsx("svg", { className: css.heroGateFish, width: 34, height: (34 * FISH_LOGO_VIEWBOX.height) / FISH_LOGO_VIEWBOX.width, viewBox: `0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`, fill: "none", "aria-hidden": "true", children: _jsx("path", { d: FISH_LOGO_PATH, fill: "currentColor" }) }), _jsxs("span", { className: css.heroGateTitleGroup, children: [_jsx("span", { children: heroText('hero.headline') }), _jsx("span", { className: css.heroGateBadge, children: heroText('hero.preview') })] })] }) }) }));
}
//# sourceMappingURL=ConversationGates.js.map