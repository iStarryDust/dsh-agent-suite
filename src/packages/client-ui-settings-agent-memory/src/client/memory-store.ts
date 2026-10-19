/**
 * Agent-memory settings page store: the four memory switches over the
 * `agent-memory` settings namespace (through the shared configuration form,
 * so writes ride the same revision fencing as every other settings surface)
 * and the global memory document over the `agentMemory` Remote namespace.
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@istarry/dsh-agent-memory/remote'
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'

/** The four memory switches; the shape mirrors the host plugin's Config. */
export interface MemorySwitches {
  /** Inject the global memory store into the system prompt. */
  globalEnabled: boolean
  /** Inject the calling agent's memory store into the system prompt. */
  agentEnabled: boolean
  /** Let the model write facts to the agent store on its own judgment. */
  autoMemory: boolean
  /** Ask the human before the memory_add tool writes. */
  askMemory: boolean
}

/** One accepted switch section; malformed durable values read as all-off. */
export function decodeMemorySwitches(section: unknown): MemorySwitches {
  const source = typeof section === 'object' && section !== null && !Array.isArray(section)
    ? section as Record<string, unknown>
    : {}
  return {
    globalEnabled: source.globalEnabled === true,
    agentEnabled: source.agentEnabled === true,
    autoMemory: source.autoMemory === true,
    askMemory: source.askMemory === true,
  }
}

/** Global-memory editor transient state. */
export interface MemoryEditorState {
  /** The global document draft in the editor. */
  globalText: string
  /** Save lifecycle of the global editor. */
  saveState: 'idle' | 'saving' | 'saved' | 'failed'
  /** Load or save failure text, when the document could not be served. */
  error: string | null
}

/** Page snapshot rendered by the section. */
export interface MemorySectionState {
  /** Switch transport state; `unavailable` renders the controls disabled. */
  status: 'loading' | 'ready' | 'unavailable'
  /** The four switches as the Host holds them. */
  switches: MemorySwitches
  /** The global-memory editor. */
  editor: MemoryEditorState
}

/** One settings-page controller (one per browser page). */
export class MemorySettingsController {
  /** Snapshot the section renderer subscribes to. */
  readonly store: SnapshotStore<MemorySectionState> = createSnapshotStore<MemorySectionState>({
    status: 'loading',
    switches: decodeMemorySwitches(undefined),
    editor: { globalText: '', saveState: 'idle', error: null },
  })

  private readonly unsubscribe: () => void

  /**
   * @param form - the shared configuration form for the `agent-memory`
   * namespace (switch state and ordered writes).
   * @param resolveMemory - resolves the `agentMemory` Remote namespace at
   * CALL time: the namespace mounts asynchronously after this plugin's own
   * apply, so an apply-time capture would freeze a pre-mount undefined.
   */
  constructor(
    private readonly form: ConfigForm<MemorySwitches>,
    private readonly resolveMemory: () => Pick<ClientContext['remote']['agentMemory'], 'readGlobal' | 'writeGlobal'> | undefined,
  ) {
    this.unsubscribe = form.subscribe(() => { this.deriveSwitches() })
    this.deriveSwitches()
  }

  /** Release the form subscription. */
  dispose(): void {
    this.unsubscribe()
  }

  /** Toggle one switch through the shared configuration form. */
  async toggle(field: keyof MemorySwitches, next: boolean): Promise<void> {
    await this.form.set(field, next)
  }

  /** Update the global-memory editor draft (client-side only until save). */
  setDraft(text: string): void {
    const snapshot = this.store.getSnapshot()
    this.store.set({ ...snapshot, editor: { ...snapshot.editor, globalText: text, saveState: 'idle' } })
  }

  /** Save the global document through the Remote namespace. */
  async saveGlobal(): Promise<void> {
    const namespace = this.resolveMemory()
    if (namespace === undefined) {
      this.failEditor('agentMemory namespace is not mounted')
      return
    }
    const { globalText } = this.store.getSnapshot().editor
    this.store.set({ ...this.store.getSnapshot(), editor: { ...this.store.getSnapshot().editor, saveState: 'saving', error: null } })
    try {
      const written = await namespace.writeGlobal(globalText)
      if (!written.ok) throw new Error(written.error.message)
      this.store.set({ ...this.store.getSnapshot(), editor: { ...this.store.getSnapshot().editor, saveState: 'saved' } })
    } catch (error) {
      this.failEditor(error instanceof Error ? error.message : String(error))
    }
  }

  /** Load the global document into the editor. */
  async loadGlobal(): Promise<void> {
    const namespace = this.resolveMemory()
    if (namespace === undefined) {
      this.failEditor('agentMemory namespace is not mounted')
      return
    }
    try {
      const read = await namespace.readGlobal()
      if (!read.ok) throw new Error(read.error.message)
      this.store.set({ ...this.store.getSnapshot(), editor: { ...this.store.getSnapshot().editor, globalText: read.value, saveState: 'idle', error: null } })
    } catch (error) {
      this.failEditor(error instanceof Error ? error.message : String(error))
    }
  }

  private failEditor(message: string): void {
    this.store.set({ ...this.store.getSnapshot(), editor: { ...this.store.getSnapshot().editor, saveState: 'failed', error: message } })
  }

  private deriveSwitches(): void {
    const snapshot = this.form.getSnapshot()
    this.store.set({
      ...this.store.getSnapshot(),
      status: snapshot.status === 'ready' ? 'ready' : snapshot.status === 'loading' ? 'loading' : 'unavailable',
      switches: snapshot.value === undefined ? decodeMemorySwitches(undefined) : decodeMemorySwitches(snapshot.value),
    })
  }
}
