import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The `shell.overlay` entries for the agent browser's archive flow: the
 * stop-and-archive confirmation dialog and the row-action toast. They live in
 * the frame-wide layer so they outlive the row menu that raised them (and the
 * sidebar collapse that may follow). The pending request and the notice on
 * display are plugin stores written by the archive wrapper in apply().
 */
import { useState } from 'react';
import { Button, Modal, Toast } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './AgentBrowser.module.css';
/**
 * The `shell.overlay` entry: nothing while no confirmation is pending,
 * otherwise one dialog per request (keyed by the session). Confirming asks
 * the Host to stop the listed work and archive; cancelling leaves the
 * session running and visible.
 */
export function ArchiveConfirmDialog({ useRequest, settle, stopAndArchive, t }) {
    const request = useRequest(pending => pending);
    if (request === null)
        return null;
    return (_jsx(ArchiveConfirmForm, { request: request, stopAndArchive: stopAndArchive, onSettle: settle, t: t }, request.sessionId));
}
/** One request's dialog: in-flight and error state die with it. */
function ArchiveConfirmForm({ request, stopAndArchive, onSettle, t }) {
    const [archiving, setArchiving] = useState(false);
    const [error, setError] = useState(null);
    const close = () => {
        if (archiving)
            return;
        onSettle();
    };
    const confirm = () => {
        setArchiving(true);
        setError(null);
        stopAndArchive(request.sessionId).then(() => {
            setArchiving(false);
            onSettle();
        }).catch((reason) => {
            setArchiving(false);
            setError(reason instanceof Error ? reason.message : String(reason));
        });
    };
    return (_jsxs(Modal, { open: true, onClose: close, closeLabel: t('close'), title: t('archive.confirm.title'), description: t('archive.confirm.desc', { title: request.displayTitle }), footer: (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", disabled: archiving, onClick: close, children: t('cancel') }), _jsx(Button, { variant: "outline", className: css.deleteAction, disabled: archiving, onClick: confirm, children: t('archive.confirm.action') })] })), children: [request.activity.length > 0 && (_jsx("ul", { className: css.archiveActivity, "aria-label": t('archive.confirm.activity'), children: request.activity.map((entry, index) => (_jsx("li", { children: activityLine(entry, t) }, `${entry.kind}-${String(index)}`))) })), archiving && _jsx("div", { className: css.deleteStatus, role: "status", children: t('archive.confirm.pending') }), error !== null && _jsx("div", { className: css.dialogError, role: "alert", children: error })] }));
}
/**
 * One family's line: its count and the items' labels (ids when a family
 * carries no label). A family this dictionary does not know falls through to
 * the generic line.
 */
function activityLine(entry, t) {
    const items = entry.items ?? [];
    const n = items.length;
    const names = items.map(item => item.label ?? item.id).join(t('archive.confirm.listSeparator'));
    switch (entry.kind) {
        case 'turn': return t('archive.confirm.turn');
        case 'subagent': return t('archive.confirm.subagents', { n, names });
        case 'job': return t('archive.confirm.jobs', { n, names });
        case 'schedule': return t('archive.confirm.schedules', { n, names });
        default: return t('archive.confirm.other', { kind: entry.kind, n });
    }
}
/** Hold for the actionable archived notice: two buttons to react to. */
const LONG_TOAST_HOLD_MS = 6000;
/**
 * Render the current notice: the archived and stopped-and-archived notices
 * with their undo action — plus the show-archived action while archived rows
 * are hidden — on a 6 s hold.
 */
export function RowActionToast({ useToast, useView, dismiss, undoArchive, showArchived, t }) {
    const toast = useToast(current => current);
    const view = useView(state => state);
    if (toast === null)
        return null;
    const archivedRowsHidden = (view.archivedFilter ?? 'default') === 'default';
    return (_jsx(Toast, { text: t(toast.kind === 'archived' ? 'toast.archived' : 'toast.stoppedAndArchived'), tone: "success", holdMs: LONG_TOAST_HOLD_MS, actions: [
            { label: t('toast.undo'), onClick: () => { dismiss(); undoArchive(toast.sessionId); } },
            ...archivedRowsHidden
                ? [{ prefix: t('toast.or'), label: t('toast.showArchived'), onClick: () => { dismiss(); showArchived(); } }]
                : [],
        ], onDone: dismiss }, `toast-${toast.sessionId}`));
}
//# sourceMappingURL=ArchiveSurfaces.js.map