/**
 * tsdown entry the orchestrator (`build.mjs`) loads once per package, with the
 * package directory as cwd. Nothing here is package-specific: identity, face and
 * output directory all arrive through the environment, so one file serves every
 * package and no per-package build config can drift.
 *
 * Environment:
 * - `SUITE_FACE`      `host` | `client` | `both` (default `both`)
 * - `SUITE_OUT`       output directory, absolute (default `lib` under the package)
 * - `SUITE_HASH_BASE` optional CSS-hash namespace override, used only to check the
 *                     pipeline against artifacts built inside the harness tree
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { clientConfig } from './client.mjs'
import { hostConfig } from './host.mjs'

const pkgDir = process.cwd()
const manifest = JSON.parse(readFileSync(resolve(pkgDir, 'package.json'), 'utf8'))
const id = manifest.name
const face = process.env.SUITE_FACE ?? 'both'
const outDir = process.env.SUITE_OUT ?? 'lib'

/** The harness modules this bundle must inline, aliased to the vendored copies. */
const suiteRoot = resolve(pkgDir, '..', '..')
const vendored = (relativePath) => resolve(suiteRoot, 'vendor', 'harness', relativePath)
const alias = {
  '@istarry/dsh-agent-memory/remote': vendored('agent-memory/remote.js'),
  '@istarry/dsh-agent-preset-authoring/remote': vendored('agent-preset-authoring/remote.js'),
  '@deepseek-ai/dsh-agent-preset-registry/display': vendored('preset-registry/display.ts'),
  '@deepseek-ai/dsh-api-workspace-controller/default-workspace': vendored('workspace-controller/default-workspace.ts'),
}

const configs = []
if (face !== 'client') {
  // The Host half is bundled from tsc's emit, never from TypeScript sources:
  // rolldown cannot lower the standard decorators these plugins use, and tsc's
  // output is what the harness itself bundles.
  const emitted = process.env.SUITE_TSC_OUT
  if (emitted === undefined) throw new Error('build: SUITE_TSC_OUT is required for the host half')
  configs.push(hostConfig({ id, pkgDir, entry: resolve(emitted, 'index.js'), outDir }))
}
if (face !== 'host' && existsSync(resolve(pkgDir, 'src/client/index.ts'))) {
  configs.push(clientConfig({
    id,
    pkgDir,
    entry: resolve(pkgDir, 'src', 'client', 'index.ts'),
    alias,
    hashBase: process.env.SUITE_HASH_BASE,
    outDir,
  }))
}

if (configs.length === 0) throw new Error(`build: ${id} has no ${face} half in ${dirname(pkgDir)}`)

export default () => configs
