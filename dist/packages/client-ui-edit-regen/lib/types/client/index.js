/**
 * The edit-and-regenerate client plugin: one shadowed keyed Chat renderer
 * (the durable user message) that adds an inline 编辑 editor, plus the
 * `editregen` dictionary. The rewrite orchestration forks the session at the
 * edited message's turn boundary, re-stages surviving attachments against
 * the child, resends, and opens the child — the session-side verbs live in
 * the agent-suite's authoring remote namespace (file reads, boundary lookup,
 * and the existing deleteSession for shell cleanup).
 */
import { UserMessageNodeView } from "./EditRegenView.js";
import { createEditActions } from "./actions.js";
import { en, zh } from "./locales.js";
/** Dictionary namespace owned by this plugin. */
const NS = 'editregen';
/** Lower priority than ui-chat's own registration (default 0): lowest renders. */
const USER_SHADOW_PRIORITY = -20;
/** Required services (cordis fiber inject). The session-side verbs ride the
 * authoring remote namespace (`remote.agentPresetAuthoring`), whose mount is
 * owned by the agent-suite host half — the compound soft access resolves it
 * without a fiber-injected key. */
export const inject = [
    'slots', 'locale', 'sessions', 'workspaces', 'uiWorkspace', 'remote',
];
/**
 * Mount the edit-and-regenerate surface.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-edit-regen: dictionaries');
    // Resolve every service ONCE here, while the plugin fiber's injections are
    // staged: closures that re-read ctx at call time break with "without
    // inject" when a reinstall retires the staged state after setup.
    const actions = createEditActions({
        ctx,
        sessions: ctx.sessions,
        workspaces: ctx.workspaces,
        uiWorkspace: ctx.uiWorkspace,
        remote: ctx.remote,
    }, Promise.resolve());
    // The official chat dictionary serves the bubble's shared chrome copy
    // (clock templates, JSON blocks, reference summary); this plugin's own
    // dictionary covers the editor and its actions.
    const chatT = ctx.locale.bind('chat');
    // The official contract: reusing the `user` key replaces that node
    // renderer. The shadow carries the official bubble presentation plus the
    // edit entry, so any official upgrade to the other keys still applies.
    ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
        name: 'conversation.chat.node',
        key: 'user',
        priority: USER_SHADOW_PRIORITY,
        locale: NS,
        inject: (_sessionId) => ({ rewriteFrom: actions.rewriteFrom, chatT })
    }, UserMessageNodeView));
}
//# sourceMappingURL=index.js.map