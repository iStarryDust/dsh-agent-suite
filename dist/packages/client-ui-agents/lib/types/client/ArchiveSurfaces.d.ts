/**
 * The `shell.overlay` entries for the agent browser's archive flow: the
 * stop-and-archive confirmation dialog and the row-action toast. They live in
 * the frame-wide layer so they outlive the row menu that raised them (and the
 * sidebar collapse that may follow). The pending request and the notice on
 * display are plugin stores written by the archive wrapper in apply().
 */
import { type ReactNode } from 'react';
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { SessionActivity } from '@deepseek-ai/dsh-api-workspace-controller/client';
import type { AgentViewState } from './view.ts';
/** A refusal's pending confirmation: the session and the work that must stop. */
export interface ArchiveConfirmRequest {
    readonly sessionId: string;
    readonly displayTitle: string;
    readonly activity: readonly SessionActivity[];
}
/** One row-action notice on display. */
export interface RowToastState {
    readonly kind: 'archived' | 'stoppedAndArchived';
    readonly sessionId: string;
}
/** Confirm-dialog share: the pending request, its settlement, and the hop. */
export interface ArchiveConfirmInjected {
    hooks: {
        /** The pending stop-and-archive request, or none. */
        request: SnapshotStore<ArchiveConfirmRequest | null>;
    };
    /** Take the dialog down without archiving. */
    settle: () => void;
    /** Ask the Host to stop the listed work, then archive. */
    stopAndArchive: (sessionId: string) => Promise<void>;
}
/** Full props of the archive confirm dialog. */
export type ArchiveConfirmProps = PropsRuntime<'shell.overlay'> & PropsLocale<'agents'> & InjectFace<ArchiveConfirmInjected>;
/**
 * The `shell.overlay` entry: nothing while no confirmation is pending,
 * otherwise one dialog per request (keyed by the session). Confirming asks
 * the Host to stop the listed work and archive; cancelling leaves the
 * session running and visible.
 */
export declare function ArchiveConfirmDialog({ useRequest, settle, stopAndArchive, t }: ArchiveConfirmProps): ReactNode;
/** Row-toast share: the notice, its dismissal, and the two archived actions. */
export interface RowToastInjected {
    hooks: {
        /** The notice on display, or none. */
        toast: SnapshotStore<RowToastState | null>;
        /** The viewing store, for the show-archived action's visibility. */
        view: SnapshotStore<AgentViewState>;
    };
    /** Take the notice down. */
    dismiss: () => void;
    /** Restore the archived session the notice reports. */
    undoArchive: (sessionId: string) => void;
    /** Switch the viewing store's archived filter so archived rows appear. */
    showArchived: () => void;
}
/** Full props of the row-action toast. */
export type RowToastProps = PropsRuntime<'shell.overlay'> & PropsLocale<'agents'> & InjectFace<RowToastInjected>;
/**
 * Render the current notice: the archived and stopped-and-archived notices
 * with their undo action — plus the show-archived action while archived rows
 * are hidden — on a 6 s hold.
 */
export declare function RowActionToast({ useToast, useView, dismiss, undoArchive, showArchived, t }: RowToastProps): ReactNode;
//# sourceMappingURL=ArchiveSurfaces.d.ts.map