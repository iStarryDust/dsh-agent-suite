---
description: "dsh 网页客户端的助理记忆设置页：四个记忆开关与全局记忆文档编辑器。"
kind: "package-reference"
---

# @istarry/dsh-client-ui-settings-agent-memory

[English](README.md) | 中文

## 概述

在侧边栏打开 **设置** 并选择 **助理记忆**，决定对话携带哪些长期记忆。四个开关 —— 全局记忆、Agent 记忆、自动记录、记录前询问 —— 与 `agent-memory` 宿主插件的配置项一一对应；页面内的编辑器负责读写共享的全局记忆文档。

## 目录

- [使用本包](#使用本包)
- [理解实现](#理解实现)
- [延伸阅读](#延伸阅读)
- [Model Experience](#model-experience)
- [已知限制与后续工作](#已知限制与后续工作)
- [Dev Note](#dev-note)

-----

<a id="使用本包"></a>
## 使用本包

**助理记忆** 设置页按主机当前状态列出四个开关；拨动开关立即通过共享设置表单写入，被拒绝时在该行提示。全局记忆编辑器暂存文本、按需保存；启用后的每个对话都会读取已保存的文档。

-----

<a id="理解实现"></a>
## 理解实现

<details>
<summary>实现细节 —— 点击展开</summary>

宿主半是一个空的 `apply`，仅让本包持有 Loader 行，供客户端模块系统分发浏览器半。浏览器半通过 `ctx.configForms.get` 绑定 `agent-memory` 命名空间并渲染开关；全局文档经由 `agentMemory` Remote 命名空间读写，通过上下文的软解析获得，页面可在命名空间挂载前或未挂载时加载。页面把 `MemorySection` 注册进设置外壳的 `settings.section` 插槽。

</details>

-----

<a id="延伸阅读"></a>
## 延伸阅读

- [ui-settings](../ui-settings/README.zh.md) —— 设置外壳与本页注册进入的 section 插槽。
- [agent-memory](../../preset/agent-memory/README.zh.md) —— 本页所编辑开关与记忆库的宿主插件。

-----

<a id="model-experience"></a>
## Model Experience

无。本包是浏览器侧设置界面，不注册任何模型界面。

#### KV Cache effect

无。本包既不组装也不发送提供商请求。

## 已知限制与后续工作

<a id="已知限制与后续工作"></a>

- **Agent 文档在别处编辑** —— 每个 Agent 自己的记忆由 agent 浏览器的助理记忆界面编辑，不在本页。

<a id="dev-note"></a>
### Dev Note

<details>
<summary>维护者工作上下文 —— 点击展开</summary>

无。

</details>
