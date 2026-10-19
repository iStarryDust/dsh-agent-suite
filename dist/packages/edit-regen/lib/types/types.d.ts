/** Wire request and value types of the edit-regen session verbs. */
/** Request for one session-referenced file attachment's bytes. */
export interface ReadFileAttachmentRequest {
    /** Session the file must be referenced by (the authorization scope). */
    readonly sessionId: string;
    /** Opaque durable file attachment id found in that session's log. */
    readonly attachmentId: string;
}
/** Value of an authorized file read: display name plus base64 bytes. */
export interface ReadFileAttachmentValue {
    /** Stored display name of the file. */
    readonly name: string;
    /** Exact stored bytes, base64-encoded. */
    readonly data: string;
}
/** Request for the fork boundary that excludes one message's turn. */
export interface RewriteBoundaryRequest {
    /** Session whose log positions the cut. */
    readonly sessionId: string;
    /** The `user/message` event seq the rewrite anchors on. */
    readonly seq: number;
}
/** Value of a boundary lookup: the inclusive fork prefix boundary. */
export interface RewriteBoundaryValue {
    /**
     * The event seq to fork at (the prefix keeps everything through it,
     * excluding the message's turn), or null when nothing precedes the
     * message and the caller reuses or creates a blank session.
     */
    readonly atSeq: number | null;
}
/** Request to delete one session's durable shell (log, cache row, workspace row). */
export interface DiscardSessionRequest {
    /** Session to remove from storage. */
    readonly sessionId: string;
}
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface RemoteErrorDetailsMap {
        /** The session named for deletion is still live in the Host registry. */
        'edit-regen/session-busy': {
            readonly sessionId: string;
            readonly reason: string;
        };
        /** The session named for deletion is absent from storage. */
        'edit-regen/session-not-found': {
            readonly sessionId: string;
        };
        /** This deployment's session storage implements no deletion. */
        'edit-regen/remove-unavailable': {
            readonly sessionId: string;
            readonly reason: string;
        };
    }
}
//# sourceMappingURL=types.d.ts.map