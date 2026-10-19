/**
 * Host half of the agent identity browser. The browser itself is a pure
 * Client plugin (see `./client`). This entry publishes one page global: the
 * official brand badge inlines the harness version at web-build time, which
 * no client plugin can read, so the host resolves the running install's
 * version once and hands it to the page through a `webserver/index-inject`
 * global row. Every step is guarded — an exotic launch shape simply leaves
 * the client's brand badge title-only.
 * @module @deepseek-ai/dsh-client-ui-agents
 */
import type { Context } from '@deepseek-ai/cordis';
/** Register the version row and nothing else. */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map