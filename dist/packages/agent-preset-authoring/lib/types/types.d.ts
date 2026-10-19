/** Client-safe payloads and wire-failure vocabulary owned by agent identity authoring. */
/** The editable identity fields one authored agent carries. */
export interface AuthoredIdentity {
    /** Display name shown in the roster and the session header. */
    readonly name: string;
    /** The language the agent should use when talking to the user. */
    readonly language: string;
    /** The author's own persona instructions. */
    readonly persona: string;
    /** The author's own one-line description of the agent. */
    readonly description: string;
}
/** One preset authored under the harness home, as a client reads it. */
export interface AuthoredPresetRow {
    /** Stable identifier: `<agentId>` for an agent, `<agentId>-<modeId>` combined. */
    readonly id: string;
    /** The owning agent's id; equals {@link id} for a bare agent. */
    readonly agentId: string;
    /** The chat-time mode id a combined preset carries, absent on a bare agent. */
    readonly modeId?: string;
    /** Display name; falls back to the id. */
    readonly name?: string;
    /** One sentence on what the agent is for, when its author wrote one. */
    readonly description?: string;
    /** The reply language captured by the authoring form. */
    readonly language?: string;
    /** The persona text captured by the authoring form. */
    readonly persona?: string;
    /** Why the preset cannot compose a session; absent when it can. */
    readonly broken?: string;
}
/** The authored roster currently on disk and registered. */
export interface AuthoredPresetRoster {
    /** Every authored preset, bare agents and combined modes alike. */
    readonly presets: readonly AuthoredPresetRow[];
}
/** One authored preset's identity, prefilled from its files. */
export interface AuthoredPresetDocument extends AuthoredIdentity {
    /** The preset the identity belongs to. */
    readonly agentPreset: string;
}
/** Creation request: copy a base composition and fold an identity into it. */
export interface CreateAuthoredPresetRequest extends AuthoredIdentity {
    /** Base preset whose composition the new preset starts from. */
    readonly from: string;
    /** The new preset id; becomes its directory name. */
    readonly agentPreset: string;
}
/** Update request: rewrite one authored preset's identity files. */
export interface UpdateAuthoredPresetRequest extends AuthoredIdentity {
    /** The preset to rewrite. */
    readonly agentPreset: string;
}
/** Removal request addressed by preset id. */
export interface RemoveAuthoredPresetRequest {
    /** The authored preset to delete. */
    readonly agentPreset: string;
}
/** One capability group of the Define-mode palette, as a client reads it. */
export interface EnvironmentGroupRow {
    /** Stable group id the client keys its dictionary on. */
    readonly id: string;
    /** Whether the group is part of the default conversation baseline. */
    readonly defaultOn: boolean;
    /** Whether the client renders the group in the separate 插件能力 category. */
    readonly plugin?: boolean;
}
/** Environment composition request: one agent's on-demand capability set. */
export interface ComposeEnvironmentRequest {
    /** The owning agent's authored preset id. */
    readonly agentPreset: string;
    /**
     * The environment mode id; omitted or empty generates a fresh
     * `env-<slug>` so every dialog completion composes a new variant.
     */
    readonly modeId?: string;
    /** The capability group ids the environment keeps. */
    readonly groups: readonly string[];
}
/** The composed environment: its combined roster id and mode id. */
export interface ComposeEnvironmentValue {
    /** The combined preset id (`<agentId>-<modeId>`). */
    readonly agentPreset: string;
    /** The environment mode id (`env-<slug>`). */
    readonly modeId: string;
}
/** Suggestion request: a task description for capability inference. */
export interface SuggestEnvironmentRequest {
    /** The user's task description. */
    readonly description: string;
}
/** The inferred capability selection. */
export interface SuggestEnvironmentValue {
    /** The suggested group ids, defaults first. */
    readonly groups: readonly string[];
}
/** Request for one session-referenced file attachment's bytes (the edit-and-regenerate resend). */
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
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface RemoteErrorDetailsMap {
        /** No authored preset supplies the requested identity. */
        'agent-preset-authoring/not-found': {
            readonly agentPreset: string;
        };
        /** The id is unusable, its base composition is unreadable, or its files cannot be written. */
        'agent-preset-authoring/invalid': {
            readonly agentPreset: string;
            readonly reason: string;
        };
        /** A directory already occupies the id; authoring never overwrites. */
        'agent-preset-authoring/exists': {
            readonly agentPreset: string;
        };
        /** The session named for deletion is still live in the Host registry. */
        'agent-preset-authoring/session-busy': {
            readonly sessionId: string;
            readonly reason: string;
        };
        /** The session named for deletion is absent from storage. */
        'agent-preset-authoring/session-not-found': {
            readonly sessionId: string;
        };
        /** This deployment's session storage implements no deletion. */
        'agent-preset-authoring/remove-unavailable': {
            readonly sessionId: string;
            readonly reason: string;
        };
    }
}
//# sourceMappingURL=types.d.ts.map