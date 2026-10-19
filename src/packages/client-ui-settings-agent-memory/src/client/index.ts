/**
 * Agent-memory settings page, browser half: registers the 助理记忆 section
 * once the settings shell's section slot is on the ledger. The four switches
 * ride the shared configuration form for the host plugin's `agent-memory`
 * namespace, and the global memory document rides the `agentMemory` Remote
 * namespace (soft-resolved: the page renders before or without the
 * namespace).
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the ctx.remote merge (the agentMemory namespace).
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the agentMemory namespace into TypertRemoteMap.
import type {} from '@istarry/dsh-agent-memory/remote'
// Type-only: pulls the settings shell's SlotMap merge (the 'settings.section'
// entry) and the configForms service.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the SlotRegistry service merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { MemorySection } from './MemorySection.tsx'
import type { MemorySectionInjected } from './MemorySection.tsx'
import { MemorySettingsController } from './memory-store.ts'
import type { MemorySwitches } from './memory-store.ts'
import { en, zh, type AgentMemoryKey } from './locales.ts'

export type { MemorySectionInjected, MemorySectionProps } from './MemorySection.tsx'
export { MemorySettingsController, decodeMemorySwitches } from './memory-store.ts'
export type { MemorySectionState, MemorySwitches } from './memory-store.ts'
export type { AgentMemoryKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The agent-memory settings page copy. */
    'settings.agentMemory': AgentMemoryKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'settings.agentMemory'

/** The host plugin entry whose configuration section holds the switches. */
const AGENT_MEMORY_ENTRY = 'agent-memory'

/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale', 'configForms']

/**
 * Register the agent-memory section and its dictionaries.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-settings-agent-memory: dictionaries')

  const form = ctx.configForms.get<MemorySwitches>(AGENT_MEMORY_ENTRY)
  // The namespace is soft-resolved by its OWN dotted service name, and
  // resolved at CALL time: the namespace mounts asynchronously after this
  // plugin's apply, so an apply-time capture would freeze a pre-mount
  // undefined.
  const controller = new MemorySettingsController(form, () =>
    ctx.get('remote.agentMemory') as ClientContext['remote']['agentMemory'] | undefined)
  ctx.effect(() => () => { controller.dispose() }, 'ui-settings-agent-memory: form subscription')

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'agent-memory',
    // After the preset roster: presets shape what an agent is; memory shapes
    // what it remembers.
    order: 25,
    label: () => t('nav'),
    locale: NS,
    inject: (): MemorySectionInjected => ({
      hooks: { memorySection: controller.store },
      toggle: (field, next) => controller.toggle(field, next),
      setDraft: (text) => { controller.setDraft(text) },
      saveGlobal: () => controller.saveGlobal(),
      loadGlobal: () => controller.loadGlobal(),
    }),
  }, MemorySection))
}
