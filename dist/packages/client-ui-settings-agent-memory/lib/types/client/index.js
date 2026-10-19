/**
 * Agent-memory settings page, browser half: registers the 助理记忆 section
 * once the settings shell's section slot is on the ledger. The four switches
 * ride the shared configuration form for the host plugin's `agent-memory`
 * namespace, and the global memory document rides the `agentMemory` Remote
 * namespace (soft-resolved: the page renders before or without the
 * namespace).
 */
import { MemorySection } from "./MemorySection.js";
import { MemorySettingsController } from "./memory-store.js";
import { en, zh } from "./locales.js";
export { MemorySettingsController, decodeMemorySwitches } from "./memory-store.js";
/** Dictionary namespace owned by this plugin. */
const NS = 'settings.agentMemory';
/** The host plugin entry whose configuration section holds the switches. */
const AGENT_MEMORY_ENTRY = 'agent-memory';
/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale', 'configForms'];
/**
 * Register the agent-memory section and its dictionaries.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    const t = ctx.locale.bind(NS);
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-settings-agent-memory: dictionaries');
    const form = ctx.configForms.get(AGENT_MEMORY_ENTRY);
    // The namespace is soft-resolved by its OWN dotted service name, and
    // resolved at CALL time: the namespace mounts asynchronously after this
    // plugin's apply, so an apply-time capture would freeze a pre-mount
    // undefined.
    const controller = new MemorySettingsController(form, () => ctx.get('remote.agentMemory'));
    ctx.effect(() => () => { controller.dispose(); }, 'ui-settings-agent-memory: form subscription');
    ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'agent-memory',
        // After the preset roster: presets shape what an agent is; memory shapes
        // what it remembers.
        order: 25,
        label: () => t('nav'),
        locale: NS,
        inject: () => ({
            hooks: { memorySection: controller.store },
            toggle: (field, next) => controller.toggle(field, next),
            setDraft: (text) => { controller.setDraft(text); },
            saveGlobal: () => controller.saveGlobal(),
            loadGlobal: () => controller.loadGlobal(),
        }),
    }, MemorySection));
}
//# sourceMappingURL=index.js.map