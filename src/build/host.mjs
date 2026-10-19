/**
 * Host-half preset for the agent suite: one ESM file per package (`lib/index.js`)
 * with the package's own production sections left as imports.
 *
 * The Host half runs from a real install, so a declared dependency is on disk
 * next to the built package and must stay an `import` (duplicating, say,
 * `@deepseek-ai/dsh-agent` into a plugin bundle would give the process a second
 * copy of a service class). Everything else — the ambient wire layers this tree
 * owns — inlines. Node builtins are neither side's business; tsdown keeps them.
 */
import { readFileSync } from 'node:fs'
import { isBuiltin } from 'node:module'
import { join } from 'node:path'

/**
 * Build the host config for one package.
 * @param options - package identity, directories and the host entry.
 * @returns tsdown user config.
 */
export function hostConfig({ id, pkgDir, entry, outDir = 'lib' }) {
  const manifest = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))
  const names = new Set([
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.peerDependencies ?? {}),
    ...Object.keys(manifest.optionalDependencies ?? {}),
  ])
  const patterns = [...names].sort().map(name => new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/|$)`))
  const isProduction = (specifier) => patterns.some(pattern => pattern.test(specifier))

  return {
    name: `${id}/host`,
    entry: { index: entry },
    outDir,
    format: ['esm'],
    platform: 'node',
    target: 'es2024',
    fixedExtension: false,
    dts: false,
    clean: false,
    // No sourcemap: the Host half ships as one readable bundle, exactly like the
    // harness's own node halves.
    sourcemap: false,
    deps: {
      neverBundle: (specifier) => isProduction(specifier),
      alwaysBundle: (specifier) => !isBuiltin(specifier) && !isProduction(specifier),
    },
    outputOptions: {
      entryFileNames: 'index.js',
    },
  }
}
