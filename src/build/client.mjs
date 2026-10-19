/**
 * Client-bundle preset for the agent suite: the same artifact contract the
 * harness's own `packages/client/tsdown.client.ts` emits, with none of the
 * monorepo machinery (no project references, no input-isolation gate, no tsc
 * map chaining — this tree has no tsc output to chain).
 *
 * The artifact is one CJS factory:
 *
 * ```js
 * window.__ModuleLoader__.load({ id, factory: (require) => { … return module.exports }) })
 * ```
 *
 * Consequences that must not drift:
 * 1. Every specifier the shell shares through the module table stays a
 *    `require()`; everything else is inlined. A require the table cannot answer
 *    is a guaranteed runtime throw, so the external set is the package's own
 *    `dsh.client` request list plus {@link PLATFORM_MODULES}.
 * 2. CSS modules are compiled here by lightningcss (`[hash]_[local]`) and the
 *    class map is what the components read; the stylesheet is injected as a
 *    tagged `<style data-plugin-css>` at factory execution.
 * 3. The hash namespace is `[hash]`-of-FILENAME in lightningcss, so the filename
 *    handed to the compiler is SYNTHESIZED from the package name and the file's
 *    path inside the package — never the absolute build path. That is what makes
 *    the artifact reproducible on another machine or another checkout root.
 */
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { basename, dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PLATFORM_MODULES } from './platform.mjs'

// The compiler lives in `tooling/` (see README: the bundle itself must not carry
// a workspace manifest), so it is resolved from there rather than from this file.
const suiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const toolingRequire = createRequire(resolve(suiteRoot, 'tooling', 'package.json'))
const { transform } = toolingRequire('lightningcss')

/**
 * Specifiers the shell seeds into the frozen module table (mirror of the
 * harness's `packages/client/web/src/platform.ts`). These are the only
 * `require()` targets a bundle may emit beyond its own request list.
 */
export { PLATFORM_MODULES } from './platform.mjs'

/** Virtual-id wrapper keeping module CSS away from tsdown's own css pipeline. */
const CSS_VIRTUAL_PREFIX = '\0dsh-css:'
const GLOBAL_CSS_VIRTUAL_PREFIX = '\0dsh-global-css:'
const INLINE_CSS_VIRTUAL_PREFIX = '\0dsh-inline-css:'
const CSS_VIRTUAL_SUFFIX = '.mjs'
const INLINE_CSS_QUERY = '?inline'

/**
 * Emit one plugin-owned style injector plus the class map a CSS module exports.
 * @param id - package name stamped onto the tag (the shell attributes styles by it).
 * @param tagId - `${id}/${file basename}`, the tag's identity for idempotent injection.
 * @param css - compiled stylesheet text.
 * @param classMap - hashed local name → emitted class name.
 * @returns module source.
 */
function styleInjectionModule(id, tagId, css, classMap) {
  const source = [
    `const css = ${JSON.stringify(css)};`,
    `const tagId = ${JSON.stringify(tagId)};`,
    'if (typeof document !== \'undefined\' && document.querySelector(\'style[data-plugin-css=\' + JSON.stringify(tagId) + \']\') === null) {',
    '  const tag = document.createElement(\'style\');',
    `  tag.dataset.plugin = ${JSON.stringify(id)};`,
    '  tag.dataset.pluginCss = tagId;',
    '  tag.textContent = css;',
    '  document.head.appendChild(tag);',
    '}',
  ]
  source.push(classMap === undefined ? 'export {};' : `export default ${JSON.stringify(classMap)};`)
  return source.join('\n')
}

/**
 * Resolve one stylesheet the way the emitted `lib/types` tree would have: an
 * import written in `src/` resolves against the source tree.
 * @param source - relative specifier as written in the source.
 * @param importer - absolute path of the importing file.
 * @returns absolute stylesheet path.
 */
function sourceAssetPath(source, importer) {
  return isAbsolute(source) ? source : resolve(dirname(importer), source)
}

/**
 * Build the client config for one package.
 * @param options - package identity, directories and the alias table.
 * @returns tsdown user config.
 */
export function clientConfig({ id, pkgDir, entry, alias, hashBase, outDir = 'lib' }) {
  const requested = new Set(PLATFORM_MODULES)
  const isRequested = (specifier) => requested.has(specifier)
  const syntheticName = (fileId) =>
    `${hashBase ?? id}/${relative(pkgDir, fileId).split(sep).join('/')}`

  return {
    name: `${id}/client`,
    entry: { client: entry },
    outDir,
    format: 'cjs',
    platform: 'browser',
    target: 'es2024',
    dts: false,
    sourcemap: true,
    clean: false,
    alias,
    // Requested module-table rows stay imports; everything else inlines. A
    // require() the table cannot answer throws at boot, so this rule is the
    // bundle's whole external contract.
    deps: {
      neverBundle: (specifier) => isRequested(specifier),
      alwaysBundle: (specifier) => !isRequested(specifier),
    },
    inputOptions: {
      resolve: {
        // Dual-mode libraries pick their static flavor from NODE_ENV; the
        // defines below bake the same value in, so the two cannot disagree.
        conditionNames: [
          (process.env.NODE_ENV ?? 'production') === 'development' ? 'development' : 'production',
          'browser', 'import', 'module', 'default',
        ],
      },
    },
    // Browser bundles inline node-idiom deps that read process.env.NODE_ENV
    // and probe import.meta.env; a CJS output cannot carry an import.meta, so
    // both are substituted here or the factory throws at boot.
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
      'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
      'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
    },
    plugins: [
      {
        name: 'suite-css-modules-inline',
        resolveId(source, importer) {
          if (!source.endsWith('.module.css')) return null
          const abs = importer !== undefined ? sourceAssetPath(source, importer) : source
          return CSS_VIRTUAL_PREFIX + abs + CSS_VIRTUAL_SUFFIX
        },
        async load(virtualId) {
          if (!virtualId.startsWith(CSS_VIRTUAL_PREFIX)) return null
          const fileId = virtualId.slice(CSS_VIRTUAL_PREFIX.length, -CSS_VIRTUAL_SUFFIX.length)
          // The virtual id hides the physical stylesheet from the watch graph.
          this.addWatchFile(fileId)
          const source = await readFile(fileId)
          const { code, exports: cssExports } = transform({
            filename: syntheticName(fileId),
            code: source,
            cssModules: { pattern: '[hash]_[local]' },
            minify: true,
          })
          const classMap = {}
          const entries = Object.entries(cssExports ?? {})
            .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
          for (const [local, exp] of entries) classMap[local] = exp.name
          return styleInjectionModule(id, `${id}/${basename(fileId)}`, code.toString(), classMap)
        },
      },
      {
        name: 'suite-css-text-inline',
        resolveId(source, importer) {
          if (!source.endsWith(`.css${INLINE_CSS_QUERY}`)) return null
          const stylesheet = source.slice(0, -INLINE_CSS_QUERY.length)
          const abs = importer !== undefined ? sourceAssetPath(stylesheet, importer) : stylesheet
          return INLINE_CSS_VIRTUAL_PREFIX + abs + CSS_VIRTUAL_SUFFIX
        },
        async load(virtualId) {
          if (!virtualId.startsWith(INLINE_CSS_VIRTUAL_PREFIX)) return null
          const fileId = virtualId.slice(INLINE_CSS_VIRTUAL_PREFIX.length, -CSS_VIRTUAL_SUFFIX.length)
          this.addWatchFile(fileId)
          const source = await readFile(fileId)
          const { code } = transform({ filename: syntheticName(fileId), code: source, minify: true })
          return `export default ${JSON.stringify(code.toString())};`
        },
      },
      {
        name: 'suite-css-global-inline',
        resolveId(source, importer) {
          if (!source.endsWith('.css') || source.endsWith('.module.css') || source.endsWith(INLINE_CSS_QUERY)) return null
          const abs = importer !== undefined ? sourceAssetPath(source, importer) : source
          return GLOBAL_CSS_VIRTUAL_PREFIX + abs + CSS_VIRTUAL_SUFFIX
        },
        async load(virtualId) {
          if (!virtualId.startsWith(GLOBAL_CSS_VIRTUAL_PREFIX)) return null
          const fileId = virtualId.slice(GLOBAL_CSS_VIRTUAL_PREFIX.length, -CSS_VIRTUAL_SUFFIX.length)
          this.addWatchFile(fileId)
          const source = await readFile(fileId)
          const { code } = transform({ filename: syntheticName(fileId), code: source, minify: true })
          return styleInjectionModule(id, `${id}/${basename(fileId)}`, code.toString())
        },
      },
    ],
    outputOptions: {
      entryFileNames: 'client.js',
      chunkFileNames: 'client.[name].js',
      sourcemapExcludeSources: false,
      banner: (chunk) => `window.__ModuleLoader__.load({ id: ${JSON.stringify(id)}, `
        + `${chunk.isEntry ? '' : `chunk: ${JSON.stringify(chunk.fileName)}, `}factory: (require) => {`,
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
  }
}
