/**
 * The edit-and-regenerate client plugin: one shadowed keyed Chat renderer
 * (the durable user message) that adds an inline 编辑 editor, plus the
 * `editregen` dictionary. The rewrite orchestration forks the session at the
 * edited message's turn boundary, re-stages surviving attachments against
 * the child, resends, and opens the child — the session-side verbs live in
 * the agent-suite's authoring remote namespace (file reads, boundary lookup,
 * and the existing deleteSession for shell cleanup).
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type EditRegenKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The inline editor and its actions. */
        editregen: EditRegenKey;
    }
}
/** Required services (cordis fiber inject). The session-side verbs ride the
 * authoring remote namespace (`remote.agentPresetAuthoring`), whose mount is
 * owned by the agent-suite host half — the compound soft access resolves it
 * without a fiber-injected key. */
export declare const inject: string[];
/**
 * Mount the edit-and-regenerate surface.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map