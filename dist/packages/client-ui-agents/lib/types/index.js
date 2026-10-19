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
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
/** The index-injection global the client brand fallback reads. */
const BRAND_VERSION_GLOBAL = '__DSH_BRAND_VERSION__';
/** Longest upward manifest walk from the entry script, in hops. */
const MAX_MANIFEST_HOPS = 8;
/**
 * Resolve the running harness version: the nearest package.json above the
 * entry script whose name is a dsh workspace package, plus the short Git
 * commit when the checkout carries one.
 * @returns the formatted version, or undefined when nothing legible is found.
 */
function brandVersionOf() {
    let entry;
    try {
        entry = process.argv[1];
    }
    catch {
        return undefined;
    }
    if (typeof entry !== 'string' || entry === '')
        return undefined;
    let dir = dirname(entry);
    for (let hop = 0; hop < MAX_MANIFEST_HOPS; hop += 1) {
        const manifestPath = join(dir, 'package.json');
        try {
            if (existsSync(manifestPath)) {
                const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
                const name = typeof manifest?.name === 'string' ? manifest.name : '';
                let version = typeof manifest?.version === 'string' ? manifest.version : '';
                if (name.startsWith('@deepseek-ai/dsh') && /^\d+\.\d+\.\d+/.test(version)) {
                    try {
                        version += `-${execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
                            cwd: dir,
                            stdio: ['ignore', 'pipe', 'ignore'],
                            timeout: 3000,
                        }).toString().trim()}`;
                    }
                    catch {
                        // A checkout without Git metadata carries the bare version.
                    }
                    return version;
                }
            }
        }
        catch {
            // Unreadable manifests are skipped; the walk continues.
        }
        const parent = dirname(dir);
        if (parent === dir)
            return undefined;
        dir = parent;
    }
    return undefined;
}
/** Register the version row and nothing else. */
export function apply(ctx) {
    const version = brandVersionOf();
    if (version === undefined)
        return;
    ctx.on('webserver/index-inject', (table) => {
        table.push({
            kind: 'global',
            name: BRAND_VERSION_GLOBAL,
            value: version,
        });
    });
}
//# sourceMappingURL=index.js.map