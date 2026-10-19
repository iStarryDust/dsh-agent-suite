/**
 * The session-side projection this package owns: `agentOwner`, the authored
 * agent a session's chat belongs to.
 *
 * Sessions compose onto a combined preset id (`<agentId>-<modeId>`), but
 * ownership is an agent-level fact. Deriving it host-side — once, at the
 * moment the selection event folds, with the same split the authoring root
 * reads — gives every client an exact key to filter chat history by, instead
 * of each surface re-deriving it from id prefixes.
 *
 * @module @istarry/dsh-agent-preset-authoring/session
 */

import { z } from 'zod'
import type { ProjectionDefinition } from '@deepseek-ai/dsh-session-projection'
import type {} from '@deepseek-ai/dsh-session/types'
import { combinedPartsOf } from './storage.ts'

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionStateMap {
    /** The owning user-agent id of the session's chat, or null. */
    agentOwner: string | null
  }

  interface SessionProjectionMap {
    /** The owning user-agent id of the session's chat, or null. */
    agentOwner: string | null
  }
}

const agentOwnerSchema = z.union([z.string(), z.null()])

/**
 * Derive the owning agent id from a preset id: a combined
 * `<agentId>-<modeId>` id resolves to `<agentId>`, a bare shipped mode or
 * plain session resolves to null (no authored agent owns it).
 * @param presetId - the preset id a session selected, when one is known.
 * @returns the owning agent id, or null.
 */
function ownerOf(presetId: string | null | undefined): string | null {
  if (typeof presetId !== 'string') return null
  return combinedPartsOf(presetId)?.agentId ?? null
}

/** The `agentOwner` projection: session chat ownership as one exact key. */
export const agentOwnerProjectionDefinition = {
  key: 'agentOwner',
  stateSchema: agentOwnerSchema,
  init: header => ownerOf(header.agentPreset),
  apply: (state, event) => {
    if (event.type !== 'agent-preset/selected') return state
    return ownerOf(event.data.agentPreset)
  },
  wire: { viewSchema: agentOwnerSchema, view: state => state },
  stateVersion: 1,
} satisfies ProjectionDefinition<'agentOwner', string | null>
