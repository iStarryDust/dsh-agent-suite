---
description: "The agent-memory settings page of the dsh web client: the four memory switches and the global memory document editor."
kind: "package-reference"
---

# @istarry/dsh-client-ui-settings-agent-memory

English | [中文](README.zh.md)

## Summary

Open **Settings** in the sidebar and select **Agent memory** to choose what long-term memory a conversation carries. The four switches — global memory, agent memory, automatic notes, and ask-before-remembering — mirror the `agent-memory` host plugin's configuration section, and the page's editor reads and writes the shared global memory document.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

The **Agent memory** settings page lists the four switches with their current host state; a toggle writes immediately through the shared settings form, and a refusal surfaces on the row. The global memory editor stages its text and saves on demand; every enabled conversation reads the saved document.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The Host half is an empty `apply`, present only so the package holds a Loader row the client module system serves the browser half for. The browser half binds the `agent-memory` namespace through `ctx.configForms.get` and renders the switches from the form's snapshot; the global document rides the `agentMemory` Remote namespace, resolved through the context's soft lookup so the page loads before or without the namespace. The page registers `MemorySection` into the settings shell's `settings.section` slot.

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

- [ui-settings](../ui-settings/README.md) — the settings shell and the section slot the page registers into.
- [agent-memory](../../preset/agent-memory/README.md) — the host plugin whose switches and stores the page edits.

-----

<a id="model-experience"></a>
## Model Experience

None, as the package is a browser-side settings surface that registers no model surface.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- **Agent documents stay in the browser** — each agent's own memory is edited from the agent browser's assistant-memory surface, not from this page.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
