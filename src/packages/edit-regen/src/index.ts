/**
 * Standalone edit-regen session verbs. This host package backs the
 * edit-and-regenerate surface when the bundle is installed WITHOUT the agent
 * management suite: it carries the same three verbs the suite's authoring
 * namespace exposes there (authorized file-attachment reads, the rewrite
 * fork-boundary lookup, and durable session-shell cleanup), under its own
 * `editRegen` wire namespace. The client prefers the authoring namespace when
 * the suite is present and falls back to this one here.
 *
 * The boundary lookup uses the previous turn's own `turn/end` as the cut —
 * the same fixed semantics as the authoring copy (cutting at
 * "next turn/start minus one" would sweep inter-turn `agent/inbox/spliced`
 * events into the seed and replay them as injected user messages).
 *
 * @module @istarry/dsh-edit-regen
 */
import type { Context } from '@deepseek-ai/cordis'
import { RemoteError, Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { SessionId } from '@deepseek-ai/dsh-session'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import type { FileAttachmentRef } from '@deepseek-ai/dsh-attachment'
import { AttachmentError } from '@deepseek-ai/dsh-attachment'
// Type-only: pulls the session controller's error-code and lifecycle-event merges.
import type {} from '@deepseek-ai/dsh-api-session-controller'
import type { SessionObservation } from '@deepseek-ai/dsh-session-query'
import type {
  DiscardSessionRequest, ReadFileAttachmentRequest, ReadFileAttachmentValue,
  RewriteBoundaryRequest, RewriteBoundaryValue,
} from './types.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Standalone edit-regen session verbs (used when the suite is absent). */
    editRegen: EditRegen
  }
}

/** Largest file this verb reads back, in bytes (base64 inflates by 4/3). */
const MAX_READ_BYTES = 128 * 1024 * 1024

/** Host-side verbs over session files and session shells. */
export default class EditRegen extends TypertRemoteService {
  /** @param ctx - Host context carrying sessions, attachments, and the optional cleanup stores. */
  constructor(ctx: Context) {
    super(ctx, 'editRegen')
  }

  /**
   * Read one file attachment's exact stored bytes, authorizing against the
   * session's own event log.
   * @param request - Session and attachment identities used for authorization.
   * @returns the stored display name and base64 bytes.
   */
  @Remote('readFileAttachment')
  async readFileAttachment(request: ReadFileAttachmentRequest): Promise<ReadFileAttachmentValue> {
    const events = await this.sessionEvents(request.sessionId)
    const ref = referencedFile(events, request.attachmentId)
    if (ref === undefined) {
      throw new RemoteError(
        'session/attachment-invalid',
        'File is not referenced by this session.',
        { reason: 'ATTACHMENT_NOT_REFERENCED' },
      )
    }
    if (ref.bytes > MAX_READ_BYTES) {
      throw new RemoteError(
        'session/attachment-invalid',
        `File exceeds the read-back size limit (${String(MAX_READ_BYTES)} bytes).`,
        { reason: 'ATTACHMENT_TOO_LARGE' },
      )
    }
    try {
      const chunks: Uint8Array[] = []
      let total = 0
      for await (const chunk of this.ctx.attachments.readFileStream(ref)) {
        chunks.push(chunk)
        total += chunk.byteLength
      }
      const bytes = new Uint8Array(total)
      let offset = 0
      for (const chunk of chunks) {
        bytes.set(chunk, offset)
        offset += chunk.byteLength
      }
      return { name: ref.name, data: Buffer.from(bytes).toString('base64') }
    } catch (error) {
      if (error instanceof AttachmentError) {
        throw new RemoteError('session/attachment-invalid', error.message, { reason: error.code })
      }
      throw new RemoteError('gateway/internal', 'Unable to read file attachment.', {})
    }
  }

  /**
   * Locate the fork boundary for a rewrite anchored on one durable
   * `user/message` (see the class doc for the cut semantics).
   * @param request - session and the anchored message seq.
   * @returns the inclusive fork boundary, or null for the blank path.
   */
  @Remote('rewriteBoundary')
  async rewriteBoundary(request: RewriteBoundaryRequest): Promise<RewriteBoundaryValue> {
    const events = await this.sessionEvents(request.sessionId)
    let lastTurnEnd: number | undefined
    let openTurnStart: number | undefined
    for (const event of events) {
      if (event.seq >= request.seq) break
      if (event.type === 'turn/start') {
        openTurnStart = event.seq
      } else if (event.type === 'turn/end' && openTurnStart !== undefined) {
        lastTurnEnd = event.seq
        openTurnStart = undefined
      }
    }
    const atSeq = lastTurnEnd !== undefined
      ? lastTurnEnd
      : openTurnStart !== undefined
        ? (openTurnStart - 1 >= 1 ? openTurnStart - 1 : null)
        : (request.seq - 1 >= 1 ? request.seq - 1 : null)
    return { atSeq }
  }

  /**
   * Delete one chat durably: the session's log artifacts, its projection
   * cache row, and its workspace accounting. A running agent is refused; an
   * opened-but-idle agent is unpublished through the registry's internal
   * detach; on a runtime whose persistence lacks deletion the verb refuses
   * with a stable code and the client degrades gracefully.
   * @param request - Session to remove from storage.
   */
  @Remote('discardSession')
  async discardSession(request: DiscardSessionRequest): Promise<void> {
    const sessionId = request.sessionId
    const agents = this.ctx.get('agents') as
      | { get(id: string): { status: string } | undefined }
      | undefined
    const agent = agents?.get(sessionId)
    if (agent?.status === 'running') {
      throw new RemoteError('edit-regen/session-busy',
        `session "${sessionId}" is running; stop its conversation before deleting`,
        { sessionId, reason: 'running' })
    }
    if (agents?.get(sessionId) !== undefined && !detachIdleAgent(this.ctx, sessionId)) {
      throw new RemoteError('edit-regen/session-busy',
        `session "${sessionId}" is still open; close its conversation before deleting`,
        { sessionId, reason: 'open' })
    }
    const persistence = this.ctx.get('sessionPersistence') as
      | { remove?(id: string): Promise<boolean> }
      | undefined
    if (persistence?.remove === undefined) {
      throw new RemoteError('edit-regen/remove-unavailable',
        `this deployment's session storage does not support deletion`,
        { sessionId, reason: 'storage without deletion support' })
    }
    const removed = await persistence.remove(sessionId)
    if (!removed) {
      throw new RemoteError('edit-regen/session-not-found',
        `session "${sessionId}" not found`, { sessionId })
    }
    await (this.ctx.get('sessionProjectionCache') as
      | { forget?(id: string): Promise<void> }
      | undefined)?.forget?.(sessionId)
    await (this.ctx.get('workspaceRegistry') as
      | { forgetSession?(id: string): Promise<void> }
      | undefined)?.forgetSession?.(sessionId)
    this.ctx.emit('api-session/removed', SessionId(sessionId))
  }

  /**
   * The named session's events: the live agent's snapshot when attached, else
   * one cold query observation (no repair, resume, or publication).
   */
  private async sessionEvents(sessionId: string): Promise<readonly SessionEvent[]> {
    const id = SessionId(sessionId)
    const attached = (this.ctx as Context & {
      sessions?: { get(id: SessionId): { snapshotEvents(): readonly SessionEvent[] } | undefined }
    }).sessions?.get(id)
    if (attached !== undefined) {
      // oxlint-disable-next-line typescript/no-deprecated -- Existing Session history read; migration deferred.
      return attached.snapshotEvents()
    }
    const query = this.ctx.get('sessionQuery') as
      | { observeSession(id: SessionId, opts?: { projectionMode?: 'none'; signal?: AbortSignal }): Promise<SessionObservation> }
      | undefined
    if (query === undefined) {
      throw new RemoteError('gateway/internal',
        `session "${sessionId}" cannot be inspected: no session query service`, { sessionId })
    }
    using observation = await query.observeSession(id, { projectionMode: 'none' })
    return [...observation.events]
  }
}

/**
 * Unpublish one idle agent through the registry's internal detach path (see
 * the agent suite's identical helper; the internals shape is pinned by the
 * bundle's engines range).
 * @param ctx - host context carrying the agents service.
 * @param sessionId - the agent/session id to unpublish.
 * @returns whether the registry entry was detached.
 */
function detachIdleAgent(ctx: Context, sessionId: string): boolean {
  const registry = ctx.get('agents') as unknown as {
    store?: Map<string, unknown>
    detachEntered?: (entry: unknown) => void
  } | undefined
  const entry = registry?.store?.get(sessionId)
  if (entry === undefined || typeof registry?.detachEntered !== 'function') return false
  try {
    registry.detachEntered(entry)
    return true
  } catch {
    return false
  }
}

/**
 * Scan a session's events for a first-party `file` content block whose
 * attachment id matches (mirrors the official image scan).
 * @param events - the authorizing session's events.
 * @param attachmentId - requested file attachment id.
 * @returns the stored reference, or undefined when unreferenced.
 */
function referencedFile(
  events: readonly SessionEvent[],
  attachmentId: string,
): FileAttachmentRef | undefined {
  for (const event of events) {
    const found = fileInEvent(event, ref => String(ref.attachmentId) === attachmentId)
    if (found !== undefined) return found
  }
  return undefined
}

function fileInEvent(
  event: SessionEvent,
  match: (ref: FileAttachmentRef) => boolean,
): FileAttachmentRef | undefined {
  const data = event.data as {
    readonly content?: unknown
    readonly message?: { readonly content?: unknown }
    readonly inserted?: unknown
  }
  const type: string = event.type
  switch (type) {
    case 'user/message':
    case 'tool/ptc-dispatch':
      return fileBlockIn(data.content, match)
    case 'system/message':
    case 'developer/message':
    case 'tool/result':
    case 'team/message/queued':
      return fileBlockIn(data.message?.content, match)
    case 'agent/inbox/spliced': {
      const messages = data.inserted
      if (!Array.isArray(messages)) return undefined
      for (const message of messages as readonly unknown[]) {
        if (typeof message !== 'object' || message === null || Array.isArray(message)) continue
        const found = fileBlockIn((message as { readonly content?: unknown }).content, match)
        if (found !== undefined) return found
      }
      return undefined
    }
    default:
      return undefined
  }
}

function fileBlockIn(
  content: unknown,
  match: (ref: FileAttachmentRef) => boolean,
): FileAttachmentRef | undefined {
  if (!Array.isArray(content)) return undefined
  for (const value of content) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) continue
    const block = value as { readonly type?: unknown; readonly attachment?: unknown }
    if (block.type === 'file' && typeof block.attachment === 'object' && block.attachment !== null) {
      const ref = block.attachment as FileAttachmentRef
      if (match(ref)) return ref
    }
  }
  return undefined
}
