# dsh-agent-suite

DeepSeek Harness 的 **Agent 管理** 与 **消息编辑重发** 插件，一个包带五个功能行。

安装后在侧栏出现 Agent 浏览器：可以创建、编辑、归档 Agent，每个 Agent 有独立的身份、长期记忆和模式组合；
用户自己的消息气泡上多一个「编辑」动作，改完从那条消息重新生成。

## 安装

```bash
dsh plugin --profile desktop add @istarry/dsh-agent-suite
```

或者打开 **插件 → 添加插件**，填包名 `@istarry/dsh-agent-suite`。

要求 DeepSeek Harness `0.2.x`（peer 依赖 `@deepseek-ai/cordis ^4.0.1`）。

## 功能

| 包 | 作用 |
|---|---|
| `agent-preset-authoring` | Agent 即目录：`.agent-presets/<id>/` 下放 `preset.yml`（身份）、`agent.cordis.yml`（该 Agent 的组装）、`compositions.yml`（各个聊天模式）。同时提供 `agentOwner` 会话投影、Define 模式的能力面板、以及重编辑依赖的会话动作。 |
| `agent-memory` | 全局与单个 Agent 的长期记忆，由设置页的四个开关控制注入。每个模型步骤都重读存储，所以改完从下一条消息就生效；协作的子 Agent 继承所属 Agent 的存储。 |
| `client-ui-agents` | 侧栏的 Agent 浏览器 + 首页的模式胶囊（覆盖官方的预设座位）。 |
| `client-ui-settings-agent-memory` | 记忆设置页。 |
| `client-ui-edit-regen` | 用户消息气泡上的「编辑」：改文字后从那里重新生成，保留的图片随行、文件走会话自己的通道重传。 |

## 仓库结构

```
src/    源码树（唯一真相，只改这里）
├── build.mjs            构建入口
├── build/               构建配置（host / client / platform / tsdown-pkg）
├── tooling/             构建工具链（独立安装）
├── vendor/harness/      4 个必须内联的 harness 模块（构建输入）
└── packages/<6 个包>/src/

dist/   构建产物（npm 发布从这里发；dsh 运行时也读这里）
```

## 构建

```bash
cd src/tooling && pnpm install     # 首次
cd .. && node build.mjs            # 全量构建 + 部署到 ../dist
node build.mjs client-ui-agents    # 只构建名字含该片段的包

node ../fix-typert.mjs             # ← 见下
```

**`typert.host.js` / `typert.remote-client.js` 是预生成文件**（由 `@deepseek-ai/dsh-typert-generator`
生成，构建不会重造），里面硬编码了包名。如果改过包名，构建后必须跑 `fix-typert.mjs`，
否则启动时报 `TYPERT manifest names package ... must be owned by the package that exports it`。

## 许可

MIT，见 [LICENSE](dist/LICENSE)。
