# vendor/harness — 构建期需要、但本套件不自产的 4 个 harness 模块

本目录**不是**本套件的源码，是**构建输入**：客户端 bundle 必须把这几样内联进去
（它们是 harness 官方划定的 "inline-safe wire layer"，官方 `tsdown.client.ts`
的 `INLINE_SAFE` / `GENERATED_REMOTE` 白名单里就有它们）。放进这里之后，
构建不再需要 harness 源码树。

| 本目录文件 | harness 里的出处 | 为什么必须内联 |
|---|---|---|
| `agent-memory/remote.js`（+`.d.ts`） | `packages/preset/agent-memory/lib/typert.remote-client.js` | 本套件「助理记忆」Remote 命名空间的**生成代码**，由客户端包 `import agentMemoryRemote from '@istarry/dsh-agent-memory/remote'` 后 `ctx.remote.$mount(…)` |
| `agent-preset-authoring/remote.js`（+`.d.ts`） | `packages/preset/agent-preset-authoring/lib/typert.remote-client.js` | 同上（作者态 Remote：文件读、分叉边界、删会话） |
| `preset-registry/display.ts` | `packages/preset/agent-preset-registry/src/display.ts` | `presetDisplayText()`：出厂预设的中文/英文名字表，纯函数、零导入 |
| `workspace-controller/default-workspace.ts` | `packages/api/workspace-controller/src/default-workspace.ts` | `DEFAULT_WORKSPACE_DIRECTORY` 常量，纯函数、零导入 |

`build/client.mjs` 用 alias 把这四个包名指向这里：

```
@istarry/dsh-agent-memory/remote              → vendor/harness/agent-memory/remote.js
@istarry/dsh-agent-preset-authoring/remote    → vendor/harness/agent-preset-authoring/remote.js
@deepseek-ai/dsh-agent-preset-registry/display    → vendor/harness/preset-registry/display.ts
@deepseek-ai/dsh-api-workspace-controller/default-workspace → vendor/harness/workspace-controller/default-workspace.ts
```

## 什么时候需要更新这几个文件

只有当 **Remote 的方法签名变了**（`packages/*/src/index.ts` 里 `TypertRemoteService` 的
方法增删改）才需要重新生成 `typert.remote-client.js`。生成器是 harness 的
`packages/typert/generator`（`WorkspaceTypertGenerator.generate([包名], ['host'])`），
必须在 harness 源码树里跑：

```bash
cd <harness>/packages/preset/agent-memory
node ../../node_modules/typescript/bin/tsc -b tsconfig.json   # 先出 lib/types
node ../../node_modules/.bin/tsdown                            # 再生成 lib/typert.*
cp lib/typert.remote-client.{js,d.ts} <本目录>/vendor/harness/agent-memory/
```

后两个 `.ts`（display / default-workspace）是纯函数，只有官方改了文案或行为时才需要重抄。
抄完记一笔 `src/CHANGELOG-build-inputs.md`（若存在），别让下一个人不知道这几个文件的年龄。
