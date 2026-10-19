#!/usr/bin/env node
/**
 * One entry point for building and shipping the agent suite from THIS tree.
 *
 *   node build.mjs                 # 全部包：构建 → 部署到 ../agent-suite（自动备份）
 *   node build.mjs ui-edit-regen   # 只构建名字里含该片段的一个包
 *   node build.mjs --compare       # 只构建 + 与已部署产物逐字节比对，不写盘
 *   node build.mjs --staging       # 只构建到 src/.build/，不部署
 *   node build.mjs --rollback      # 用最近一次部署备份还原 ../agent-suite
 *   node build.mjs --hash-base <p> # CSS 类名哈希改用 <p>/<包名>/… 命名空间（只用于与
 *                                  # harness 内旧产物做逐字节对照）
 *
 * 输出目录固定是 `src/.build/<包目录>/lib/`（不污染 packages/*），部署再从那里拷。
 */
import { createHash } from 'node:crypto'
import {
  copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmSync, statSync, symlinkSync, writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { isBuiltin } from 'node:module'
import { PLATFORM_MODULES } from './build/platform.mjs'

const suiteRoot = dirname(fileURLToPath(import.meta.url))
const bundleRoot = resolve(suiteRoot, '..', 'dist')
const buildRoot = join(suiteRoot, '.build')
const backupRoot = join(bundleRoot, '.build-backup')
const toolingRoot = join(suiteRoot, 'tooling')

/**
 * Packages the tree needs at build time but does not own: the client bundles
 * inline `clsx`, and the editor/`tsc` wants the ambient types. Each one is
 * junctioned into `src/node_modules` so rolldown and TypeScript resolve it by
 * ordinary Node rules — no per-package copying, no path aliases for libraries.
 */
const BUILD_RUNTIME_MODULES = ['clsx', 'zod', '@types/node', '@types/react', '@types/react-dom']

/** Files the build owns inside a package's `lib/`: everything else there (typert.*, types/) is input, not output. */
const ARTIFACT = /^(?:index\.js|client\.js|client\.js\.map|client\..+\.js|client\..+\.js\.map)$/

/** Root manifest fields that belong to authoring, not to the shipped bundle. */
const AUTHORING_ONLY = ['devDependencies', 'scripts']

/**
 * 发布清单的协议转换：`workspace:` / `file:` 只对构建树有意义，进了发布包就会让安装方
 * 直接失败（pnpm 会把 file: 解析到安装项目根下）。部署时统一换成真实 semver。
 */
const OFFICIAL_RANGE = '^0.1.7-rc.2 || ^0.2.0-rc.2 || ^0.2.1-rc.2'
const KNOWN_RANGES = {
  '@deepseek-ai/cordis': '^4.0.1',
  '@deepseek-ai/schemastery': '^3.18.1',
}
const DEP_FIELDS = ['peerDependencies', 'dependencies', 'devDependencies']

const argv = process.argv.slice(2)
const flags = new Set(argv.filter(arg => arg.startsWith('--')))
const positional = argv.filter(arg => !arg.startsWith('--'))
const hashBaseIndex = argv.indexOf('--hash-base')
const hashBase = hashBaseIndex >= 0 ? argv[hashBaseIndex + 1] : undefined
if (hashBaseIndex >= 0) positional.splice(positional.indexOf(hashBase), 1)

if (flags.has('--rollback')) rollback()

ensureToolchain()

const staging = flags.has('--staging') || flags.has('--compare')
const compareOnly = flags.has('--compare')
const syncManifests = !flags.has('--no-manifests')

const packages = readdirSync(join(suiteRoot, 'packages'), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => {
    const dir = entry.name
    const pkgDir = join(suiteRoot, 'packages', dir)
    const manifestPath = join(pkgDir, 'package.json')
    if (!existsSync(manifestPath) || !existsSync(join(pkgDir, 'src', 'index.ts'))) return undefined
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const client = existsSync(join(pkgDir, 'src', 'client', 'index.ts'))
    return { dir, pkgDir, id: manifest.name, client }
  })
  .filter(Boolean)
  .filter(pkg => positional.length === 0
    || positional.some(fragment => pkg.dir.includes(fragment) || pkg.id.includes(fragment)))

if (packages.length === 0) {
  console.error(`没有匹配的包：${positional.join(', ') || '(全部)'}`)
  process.exit(1)
}

rmSync(buildRoot, { recursive: true, force: true })
const stamp = new Date().toISOString().replace(/[:.]/gu, '-')
const results = []

for (const pkg of packages) {
  const outDir = join(buildRoot, pkg.dir, 'lib')
  const emitDir = join(buildRoot, pkg.dir, 'tsc')
  mkdirSync(outDir, { recursive: true })
  console.log(`\n▸ ${pkg.id}  (${pkg.client ? '宿主 + 浏览器' : '宿主'})`)
  emitHost(pkg, emitDir)
  const run = spawnSync(process.execPath, [
    join(toolingRoot, 'node_modules', 'tsdown', 'dist', 'run.mjs'),
    '--config', join(suiteRoot, 'build', 'tsdown-pkg.mjs'),
    '--log-level', 'warn',
  ], {
    cwd: pkg.pkgDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      SUITE_FACE: 'both',
      SUITE_OUT: outDir,
      SUITE_TSC_OUT: emitDir,
      ...(hashBase === undefined ? {} : { SUITE_HASH_BASE: hashBase }),
    },
  })
  if (run.status !== 0) {
    console.error(`✗ ${pkg.id} 构建失败（exit ${String(run.status)}）`)
    process.exit(run.status ?? 1)
  }
  results.push({ ...pkg, outDir })
}

report(results)
if (!validate(results)) process.exit(1)

if (compareOnly) {
  process.exit(compareEach(results) ? 0 : 1)
}
if (staging) {
  console.log(`\n构建产物留在 ${buildRoot}（未部署）`)
  process.exit(0)
}

deploy(results)
if (syncManifests) syncBundledManifests()

/* ────────────────────────────── 以下为内部实现 ────────────────────────────── */

/**
 * Fail early with an actionable message when `tooling/` was never installed, and
 * junction the build-time libraries rolldown must resolve from this tree.
 */
function ensureToolchain() {
  if (!existsSync(join(toolingRoot, 'node_modules', 'tsdown', 'dist', 'run.mjs'))) {
    console.error('缺少构建工具链：先执行 `cd tooling && pnpm install`（npm 也可，只是本机 npm 装不动）。')
    process.exit(1)
  }
  const linkDir = join(suiteRoot, 'node_modules')
  mkdirSync(linkDir, { recursive: true })
  for (const name of BUILD_RUNTIME_MODULES) {
    const link = join(linkDir, ...name.split('/'))
    if (existsSync(link)) continue
    const physical = toolingPackageDir(name)
    if (physical === undefined) {
      console.error(`工具链缺少 ${name}：把它加进 tooling/package.json 后重装。`)
      process.exit(1)
    }
    mkdirSync(dirname(link), { recursive: true })
    // Junction the PHYSICAL directory: tooling/node_modules/<name> is itself a
    // pnpm symlink, and a junction to a symlink resolves to nothing on Windows.
    symlinkSync(realpathSync(physical), link, 'junction')
    console.log(`⊕ node_modules/${name} → tooling（仅供构建期解析）`)
  }
}

/**
 * Locate one installed package inside the tooling install. pnpm's isolated
 * layout does not reliably materialize a top-level link (scoped `@types` end up
 * as an empty directory), so the virtual store is consulted as well.
 * @param name - package name, scopes allowed.
 * @returns the physical package directory, or undefined when not installed.
 */
function toolingPackageDir(name) {
  const direct = join(toolingRoot, 'node_modules', ...name.split('/'))
  if (existsSync(join(direct, 'package.json'))) return realpathSync(direct)
  const virtualStore = join(toolingRoot, 'node_modules', '.pnpm')
  if (!existsSync(virtualStore)) return undefined
  const prefix = `${name.replace('/', '+')}@`
  const entry = readdirSync(virtualStore).find(candidate => candidate.startsWith(prefix))
  if (entry === undefined) return undefined
  const nested = join(virtualStore, entry, 'node_modules', ...name.split('/'))
  return existsSync(nested) ? nested : undefined
}

/**
 * Emit the Host half's JavaScript with `tsc` before bundling.
 *
 * This step is not optional: the Host halves use STANDARD decorators
 * (`@Remote('…')` from the typert protocol) and `using` declarations, and
 * rolldown only knows legacy decorators — feeding it TypeScript sources would
 * leave raw `@decorator` syntax in the bundle, which no Node parses. tsc lowers
 * them to the very same `__esDecorate`/`__runInitializers` helpers the harness
 * ships. `--noCheck` keeps it a pure code transform: the harness packages this
 * tree imports have no types here, and the build must not depend on them.
 * @param pkg - package being built.
 * @param emitDir - directory for the emitted JavaScript.
 */
function emitHost(pkg, emitDir) {
  rmSync(emitDir, { recursive: true, force: true })
  const run = spawnSync(process.execPath, [
    join(toolingRoot, 'node_modules', 'typescript', 'bin', 'tsc'),
    '--project', join(pkg.pkgDir, 'tsconfig.json'),
    '--outDir', emitDir,
    '--rootDir', 'src',
    '--noEmit', 'false',
    '--noCheck',
    // Sources import their neighbours as `./x.ts`; the emit must name `./x.js`.
    '--rewriteRelativeImportExtensions',
    '--declaration', 'false',
    '--sourceMap', 'false',
  ], { cwd: pkg.pkgDir, encoding: 'utf8' })
  const output = `${run.stdout ?? ''}${run.stderr ?? ''}`.trim()
  if (run.status !== 0 || /error TS\d+/u.test(output)) {
    console.error(output === '' ? `tsc 退出码 ${String(run.status)}` : output)
    console.error(`✗ ${pkg.id} 的宿主半端 tsc 预编译失败`)
    process.exit(1)
  }
}

/**
 * Print one line per emitted artifact.
 * @param rows - built packages with their output directory.
 */
function report(rows) {
  for (const row of rows) {
    console.log(`  ${row.dir}:`)
    for (const file of readdirSync(row.outDir).sort()) {
      if (!ARTIFACT.test(file)) continue
      const full = join(row.outDir, file)
      console.log(`    ${String(statSync(full).size).padStart(8)}  ${hash(full)}  ${file}`)
    }
  }
}

/**
 * Assert the two runtime contracts the artifacts must satisfy:
 * 1. a Host bundle may only import specifiers the deployed install can resolve;
 * 2. a Client bundle may only `require()` module-table rows.
 * Both failures are the kind that only surface as a blank page or a dead
 * plugin after deployment, so they are checked here instead.
 * @param rows - built packages.
 * @returns true when every artifact passes.
 */
function validate(rows) {
  const table = new Set(PLATFORM_MODULES)
  let ok = true
  for (const row of rows) {
    // Parse check first: a bundle carrying syntax the runtime cannot read is a
    // dead plugin, and that is exactly what an unlowered `@decorator` or a
    // missing `using` transform looks like.
    for (const [file, extension] of [['index.js', 'mjs'], ['client.js', 'cjs']]) {
      const artifact = join(row.outDir, file)
      if (!existsSync(artifact)) continue
      const probe = join(row.outDir, `.syntax-check.${extension}`)
      copyFileSync(artifact, probe)
      const check = spawnSync(process.execPath, ['--check', probe], { encoding: 'utf8' })
      rmSync(probe, { force: true })
      if (check.status === 0) continue
      console.error(`  ✗ ${row.dir}/lib/${file} 无法被 Node 解析：${(check.stderr ?? '').trim().split('\n')[0]}`)
      ok = false
    }
    const hostFile = join(row.outDir, 'index.js')
    if (existsSync(hostFile)) {
      for (const specifier of bareSpecifiers(readFileSync(hostFile, 'utf8'), /from\s+"([^".][^"]*)"/gu)) {
        if (isBuiltin(specifier)) continue
        if (!existsSync(join(bundleRoot, 'node_modules', ...packageNameOf(specifier).split('/')))) {
          console.error(`  ✗ ${row.dir}/lib/index.js 依赖 ${specifier}，但 agent-suite 的 node_modules 里没有它`)
          ok = false
        }
      }
    }
    const clientFile = join(row.outDir, 'client.js')
    if (existsSync(clientFile)) {
      for (const specifier of bareSpecifiers(readFileSync(clientFile, 'utf8'), /require\("([^".][^"]*)"\)/gu)) {
        if (!table.has(specifier)) {
          console.error(`  ✗ ${row.dir}/lib/client.js require("${specifier}") 不在模块表里——运行时会抛错`)
          ok = false
        }
      }
    }
  }
  if (ok) console.log('✓ 依赖校验通过（宿主只引用已安装包，浏览器只 require 模块表条目）')
  return ok
}

/**
 * Every distinct match of the first capture group of `pattern`.
 * @param source - file contents.
 * @param pattern - global regex with one capture group.
 * @returns distinct specifiers, in first-seen order.
 */
function bareSpecifiers(source, pattern) {
  const found = new Set()
  for (const match of source.matchAll(pattern)) found.add(match[1])
  return [...found]
}

/**
 * Package portion of a specifier: `@scope/name/sub` → `@scope/name`.
 * @param specifier - import specifier.
 * @returns the package name.
 */
function packageNameOf(specifier) {
  const parts = specifier.split('/')
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

/**
 * Compare every emitted artifact with its deployed counterpart.
 * @param rows - built packages.
 * @returns true when all artifacts match byte for byte.
 */
function compareEach(rows) {
  let ok = true
  for (const row of rows) {
    for (const file of readdirSync(row.outDir)) {
      if (!ARTIFACT.test(file)) continue
      const built = join(row.outDir, file)
      const shipped = join(bundleRoot, 'packages', row.dir, 'lib', file)
      const same = existsSync(shipped) && hash(built) === hash(shipped)
      if (!same) ok = false
      console.log(`${same ? '  =' : '  ≠'} ${row.dir}/lib/${file}${existsSync(shipped) ? '' : '（已部署侧缺失）'}`)
    }
  }
  return ok
}

/**
 * Copy artifacts into the bundle and mirror them into the bundle's node_modules
 * copy (the runtime resolves the nested install, not `packages/`).
 * @param rows - built packages.
 */
function deploy(rows) {
  for (const row of rows) {
    const targets = [join(bundleRoot, 'packages', row.dir, 'lib')]
    const installed = join(bundleRoot, 'node_modules', ...row.id.split('/'), 'lib')
    if (existsSync(dirname(installed))) targets.push(installed)
    for (const file of readdirSync(row.outDir)) {
      if (!ARTIFACT.test(file)) continue
      const source = join(row.outDir, file)
      for (const target of targets) {
        const destination = join(target, file)
        if (existsSync(destination)) {
          const backup = join(backupRoot, stamp, target.slice(bundleRoot.length + 1).replaceAll('\\', '/'))
          mkdirSync(backup, { recursive: true })
          copyFileSync(destination, join(backup, file))
        }
        mkdirSync(target, { recursive: true })
        // Unlink first: a pnpm-installed copy may share an inode with `packages/`.
        rmSync(destination, { force: true })
        copyFileSync(source, destination)
        console.log(`  ⇢ ${destination.slice(bundleRoot.length + 1)}`)
      }
    }
  }
  console.log(`\n部署完成。备份：${backupRoot}\\${stamp}`)
}

/** 就地把一个清单里的构建期协议换成发布期 semver。 */
function publishSpec(name, spec, selfVersion) {
  const value = String(spec)
  if (value.startsWith('workspace:')) return KNOWN_RANGES[name] ?? OFFICIAL_RANGE
  if (value.startsWith('file:')) return `^${selfVersion}`
  return value
}

/** 就地把一个清单里的构建期协议换成发布期 semver。 */
function publishableManifest(manifest, fallbackVersion) {
  if (manifest.version === undefined && fallbackVersion !== undefined) manifest.version = fallbackVersion
  const version = manifest.version
  for (const field of DEP_FIELDS) {
    const block = manifest[field]
    if (block === undefined) continue
    for (const [name, spec] of Object.entries(block)) block[name] = publishSpec(name, spec, version)
  }
  return manifest
}

/** Mirror the authoring manifests into the bundle, minus fields that only belong to this tree. */
function syncBundledManifests() {
  const root = JSON.parse(readFileSync(join(suiteRoot, 'package.json'), 'utf8'))
  for (const field of AUTHORING_ONLY) delete root[field]
  writeFileSync(join(bundleRoot, 'package.json'), `${JSON.stringify(publishableManifest(root), null, 2)}\n`)
  for (const file of ['cordis.patch.yml', 'icon.svg', 'README.md', 'LICENSE']) {
    if (existsSync(join(suiteRoot, file))) copyFileSync(join(suiteRoot, file), join(bundleRoot, file))
  }
  const localeDir = join(suiteRoot, 'locale')
  if (existsSync(localeDir)) {
    mkdirSync(join(bundleRoot, 'locale'), { recursive: true })
    for (const file of readdirSync(localeDir)) {
      copyFileSync(join(localeDir, file), join(bundleRoot, 'locale', file))
    }
  }
  for (const dir of readdirSync(join(suiteRoot, 'packages'))) {
    const pkgDir = join(suiteRoot, 'packages', dir)
    const manifest = join(pkgDir, 'package.json')
    if (!existsSync(manifest)) continue
    const sub = JSON.parse(readFileSync(manifest, 'utf8'))
    writeFileSync(
      join(bundleRoot, 'packages', dir, 'package.json'),
      `${JSON.stringify(publishableManifest(sub, root.version), null, 2)}\n`,
    )
    // 发布清单里声明了 LICENSE / README，文件本身也得跟着进产物
    for (const file of ['LICENSE', 'README.md']) {
      if (existsSync(join(pkgDir, file))) copyFileSync(join(pkgDir, file), join(bundleRoot, 'packages', dir, file))
    }
  }
  console.log('清单已同步：bundle package.json（去 scripts/devDependencies，协议转 semver）/ cordis.patch.yml / icon.svg / locale / 各包 package.json')
}

/** Restore the newest deployment backup. */
function rollback() {
  if (!existsSync(backupRoot)) {
    console.error('没有备份目录，无可回滚。')
    process.exit(1)
  }
  const stamps = readdirSync(backupRoot).filter(name => statSync(join(backupRoot, name)).isDirectory()).sort()
  const latest = stamps.at(-1)
  if (latest === undefined) {
    console.error('备份目录为空。')
    process.exit(1)
  }
  const root = join(backupRoot, latest)
  let restored = 0
  for (const relativeDir of walkDirectories(root)) {
    for (const file of readdirSync(join(root, relativeDir))) {
      const destination = join(bundleRoot, relativeDir, file)
      mkdirSync(dirname(destination), { recursive: true })
      rmSync(destination, { force: true })
      copyFileSync(join(root, relativeDir, file), destination)
      restored += 1
      console.log(`  ⇠ ${relativeDir}/${file}`)
    }
  }
  console.log(`已从 ${latest} 还原 ${String(restored)} 个文件。`)
  process.exit(0)
}

/**
 * List every directory under `root` (relative paths), including `root` itself as ''.
 * @param root - directory to walk.
 * @returns relative directory paths.
 */
function walkDirectories(root) {
  const found = ['']
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const relative = entry.name
    found.push(relative)
    for (const nested of readdirSync(join(root, relative), { withFileTypes: true })) {
      if (nested.isDirectory()) found.push(`${relative}/${nested.name}`)
    }
  }
  return found.filter(relative => readdirSync(join(root, relative)).some(file => !statSync(join(root, relative, file)).isDirectory()))
}

/**
 * Short content hash for the report.
 * @param file - absolute path.
 * @returns first 8 hex characters of the sha256.
 */
function hash(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 8)
}
