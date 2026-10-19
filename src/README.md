---
description: "The agent suite as one installable bundle: identity authoring, per-agent long-term memory, the hero mode chip, and edit-and-regenerate for user messages."
---

# @istarry/dsh-agent-suite

One installable bundle carrying the agent-management feature set plus message edit-and-regenerate. Install it through the official **Plugins → Add plugin** flow (an npm package name, a GitHub repository URL, or a local directory path) and five plugin rows mount together:

- **agent-preset-authoring** — agents as one directory each under the harness home's `.agent-presets` root: `preset.yml` (identity) + `agent.cordis.yml` (the agent's own composition) + `compositions.yml` (every chat-time mode composition as one entry). Also owns the `agentOwner` session projection, the chat-deletion remote, the Define-mode capability palette (core + plugin categories), and the session verbs the re-edit surface rides on.
- **agent-memory** — global and per-agent long-term memory under the harness home, injected by the four switches on the **Agent memory** settings page; every model step re-reads the store, so edits apply from the next message, and collaborating subagents inherit the owning agent's store.
- **client-ui-agents** — the sidebar's agent browser and the hero mode chip (shadowing the official preset seat; offers the shipped modes only and composes the owning agent's combined preset on every pick).
- **client-ui-settings-agent-memory** — the memory settings page.
- **client-ui-edit-regen** — the 编辑 action on the user's own chat bubbles: edit the text of any past message and regenerate from there; kept and new images ride along, files are re-uploaded through the session's own channel, and the child session inherits the source model and preset. Later content is not kept — that is the point.

## Source

This directory **is the source tree** (not a vendored snapshot): edit `packages/*/src`, run
`node build.mjs` (see [`源码与构建说明.md`](./源码与构建说明.md) for the pipeline, the
dependency boundary, and one-command rollback), then restart dsh. No copy is kept anywhere
else — the harness checkout this bundle was originally forked from is no longer needed to
change or rebuild it.
