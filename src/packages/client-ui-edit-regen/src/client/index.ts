/**
 * The edit-and-regenerate client plugin: one shadowed keyed Chat renderer
 * (the durable user message) that adds an inline 编辑 editor, plus the
 * `editregen` dictionary. The rewrite orchestration forks the session at the
 * edited message's turn boundary, re-stages surviving attachments against
 * the child, resends, and opens the child — the session-side verbs live in
 * the agent-suite's authoring remote namespace (file reads, boundary lookup,
 * and the existing deleteSession for shell cleanup).
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the client merges this program consumes.
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { SessionId } from '@deepseek-ai/dsh-session'
import { UserMessageNodeView } from './EditRegenView.tsx'
import type { UserViewInjected } from './EditRegenView.tsx'
import { createEditActions } from './actions.ts'
import { en, zh, type EditRegenKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The inline editor and its actions. */
    editregen: EditRegenKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'editregen'

/** Lower priority than ui-chat's own registration (default 0): lowest renders. */
const USER_SHADOW_PRIORITY = -20

/** Required services (cordis fiber inject). The session-side verbs ride the
 * authoring remote namespace (`remote.agentPresetAuthoring`), whose mount is
 * owned by the agent-suite host half — the compound soft access resolves it
 * without a fiber-injected key. */
export const inject = [
  'slots', 'locale', 'sessions', 'workspaces', 'uiWorkspace', 'remote',
]

/**
 * Mount the edit-and-regenerate surface.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-edit-regen: dictionaries')

  // Resolve every service ONCE here, while the plugin fiber's injections are
  // staged: closures that re-read ctx at call time break with "without
  // inject" when a reinstall retires the staged state after setup.
  const actions = createEditActions({
    ctx,
    sessions: ctx.sessions,
    workspaces: ctx.workspaces,
    uiWorkspace: ctx.uiWorkspace,
    remote: ctx.remote,
  }, Promise.resolve())

  // The official chat dictionary serves the bubble's shared chrome copy
  // (clock templates, JSON blocks, reference summary); this plugin's own
  // dictionary covers the editor and its actions.
  const chatT = ctx.locale.bind('chat')

  // The official contract: reusing the `user` key replaces that node
  // renderer. The shadow carries the official bubble presentation plus the
  // edit entry, so any official upgrade to the other keys still applies.
  ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
    name: 'conversation.chat.node',
    key: 'user',
    priority: USER_SHADOW_PRIORITY,
    locale: NS,
    inject: (_sessionId: SessionId): UserViewInjected => ({ rewriteFrom: actions.rewriteFrom, chatT })
  }, UserMessageNodeView))
}
