import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The shadowed durable user-message renderer: the official bubble and icon
 * actions with one 编辑 entry added, swapping to an inline editor that
 * rewrites the session from that message onward. Editing is offered while
 * the agent is idle and the session is not a subagent; images and files in
 * the message stay individually removable and new ones attach.
 */
import { Fragment, memo, useEffect, useMemo, useRef, useState, } from 'react';
import { IconCheckOutlineRegular, IconCloseOutlineRegular, IconCopyOutlineRegular, IconEditOutlineRegular, FileTypeIcon, JsonBlock, Tooltip, projectUserText, writeClipboard, fileExtension, fileSizeText, } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './EditRegen.module.css';
function contentParts(content) {
    const texts = [];
    const attachments = [];
    const rest = [];
    for (const block of content) {
        const b = block;
        if (b.type === 'text' && typeof b.text === 'string')
            texts.push(b.text);
        else if (b.type === 'image' && b.attachment !== undefined) {
            attachments.push({ type: 'image', image: { attachment: b.attachment } });
        }
        else if (b.type === 'file' && b.attachment !== undefined) {
            attachments.push({ type: 'file', file: b.attachment });
        }
        else
            rest.push(block);
    }
    return { text: texts.join(''), attachments, rest };
}
function pad2(n) {
    return String(n).padStart(2, '0');
}
function startOfLocalDay(ms) {
    const d = new Date(ms);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
function msUntilNextLocalMidnight(ms) {
    const next = new Date(ms);
    next.setHours(24, 0, 0, 0);
    return Math.max(next.getTime() - ms, 1);
}
/**
 * Compact local timestamp for the actions row: same calendar day → `HH:mm`;
 * earlier this year → the localized month-day template + clock; other years →
 * the full date template + clock. Port of the official message chrome.
 */
function formatMessageClock(time, t, now = Date.now()) {
    const d = new Date(time);
    const n = new Date(now);
    const clock = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    if (d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()) {
        return clock;
    }
    const params = { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
    const md = d.getFullYear() === n.getFullYear() ? t('clock.md', params) : t('clock.ymd', params);
    return `${md} ${clock}`;
}
/**
 * Component-local calendar-day tick: memoized rows keep stable props across
 * midnight, so the clock needs a seat that re-fires at the next local
 * midnight. Port of the official hook.
 */
function useCalendarDay() {
    const [day, setDay] = useState(() => startOfLocalDay(Date.now()));
    useEffect(() => {
        let timer;
        const arm = () => {
            const now = Date.now();
            setDay(startOfLocalDay(now));
            timer = setTimeout(arm, msUntilNextLocalMidnight(now));
        };
        timer = setTimeout(arm, msUntilNextLocalMidnight(Date.now()));
        return () => { clearTimeout(timer); };
    }, []);
    return day;
}
/** Copy / clock / edit actions under the user bubble. */
function MessageActions({ text, time, onEdit, editUnavailable, editTitle, chatT, t, }) {
    const day = useCalendarDay();
    const [copied, setCopied] = useState(false);
    const copyPending = useRef(false);
    const copyTimer = useRef(null);
    const copyEpoch = useRef(0);
    useEffect(() => () => {
        copyEpoch.current += 1;
        copyPending.current = false;
        if (copyTimer.current !== null)
            clearTimeout(copyTimer.current);
    }, []);
    const onCopy = () => {
        if (copied || copyPending.current)
            return;
        const epoch = copyEpoch.current;
        copyPending.current = true;
        void writeClipboard(text).then((ok) => {
            if (epoch !== copyEpoch.current)
                return;
            copyPending.current = false;
            if (!ok)
                return;
            setCopied(true);
            copyTimer.current = window.setTimeout(() => {
                copyTimer.current = null;
                setCopied(false);
            }, 1000);
        });
    };
    return (_jsxs("div", { className: css.actions, "data-clock": "start", children: [time !== undefined && (_jsx("span", { className: css.timeStart, children: formatMessageClock(time, chatT, day) })), _jsx(Tooltip, { label: copied ? t('copied') : t('copy'), side: "bottom", children: _jsx("button", { type: "button", className: css.action, "aria-label": copied ? t('copied') : t('copy'), onClick: onCopy, children: copied ? _jsx(IconCheckOutlineRegular, {}) : _jsx(IconCopyOutlineRegular, {}) }) }), onEdit !== undefined && (_jsx(Tooltip, { label: editUnavailable === true ? (editTitle ?? '') : t('edit.action'), side: "bottom", children: _jsx("button", { type: "button", className: css.action, "aria-label": t('edit.action'), "aria-disabled": editUnavailable || undefined, "data-unavailable": editUnavailable || undefined, onClick: editUnavailable === true ? undefined : onEdit, children: _jsx(IconEditOutlineRegular, {}) }) }))] }));
}
/** Right-aligned durable user bubble with the official presentation. */
function UserBubble({ node, renderMessageImages, openFile, openSkill, onEdit, editUnavailable, editTitle, chatT, t, }) {
    const { text, attachments, rest } = contentParts(node.content);
    const truncated = (total) => chatT('json.truncated', { total });
    const compactImages = attachments.filter(a => a.type === 'image').length > 1;
    const showBubble = text !== '' || rest.length > 0;
    return (_jsxs("div", { className: css.userRow, "data-time-hover-root": true, children: [_jsxs("div", { className: css.userStack, children: [attachments.length > 0 && (_jsx("div", { className: css.attachmentRow, "data-message-attachments": true, children: attachments.map((attachment, index) => attachment.type === 'image'
                            ? (_jsx(Fragment, { children: renderMessageImages({
                                    images: [attachment.image],
                                    align: 'end',
                                    compact: compactImages,
                                }) }, `image:${index}`))
                            : (_jsxs("span", { className: css.fileCard, title: attachment.file.name, children: [_jsx(FileTypeIcon, { path: attachment.file.name, className: css.fileIcon }), _jsxs("span", { className: css.fileContent, children: [_jsx("span", { className: css.fileName, children: attachment.file.name }), _jsx("span", { className: css.fileMeta, children: [fileExtension(attachment.file.name).toUpperCase().slice(0, 8), fileSizeText(attachment.file.bytes)]
                                                    .filter(Boolean).join(' ') })] })] }, `file:${index}`))) })), showBubble && _jsxs("div", { className: css.bubble, children: [projectUserText(text, node.referenceLabels ?? [], node.skillNames ?? [], 'skill', { openFile, openSkill }), rest.map((block, i) => _jsx(JsonBlock, { label: chatT('message.extraBlock'), payload: block, truncatedLabel: truncated }, i))] }), node.referenceLabels !== undefined && node.referenceLabels.length > 0 && (_jsx("div", { className: css.referenceSummary, children: chatT('message.referenceSummary', { labels: node.referenceLabels.join(chatT('message.referenceSeparator')) }) }))] }), _jsx(MessageActions, { text: text, time: node.time, onEdit: onEdit, editUnavailable: editUnavailable, editTitle: editTitle, chatT: chatT, t: t })] }));
}
/** The kept image's authorized thumb: resolved once through the owner loader. */
function KeptImageThumb({ image, loadImage, }) {
    const [url, setUrl] = useState(undefined);
    const requested = useRef(false);
    useEffect(() => {
        if (requested.current)
            return;
        requested.current = true;
        void loadImage(image).then(setUrl, () => { setUrl(undefined); });
    }, [image, loadImage]);
    return url === undefined
        ? _jsx("div", { className: css.editImageThumb, "aria-hidden": true })
        : _jsx("img", { className: css.editImageThumb, src: url, alt: "" });
}
/**
 * The inline editor: the bubble swaps for an auto-sized textarea above a
 * managed attachment strip — every original image and file stays removable,
 * picked or dropped files append as drafts, and confirm hands the surviving
 * set to the rewrite orchestration. Failure keeps the editor open with the
 * reason; success unmounts with the session switch.
 */
function UserMessageEditor({ sessionId, node, loadImage, rewriteFrom, onCancel, chatT, t, }) {
    const parts = useMemo(() => contentParts(node.content), [node.content]);
    const [draft, setDraft] = useState(parts.text);
    const [images, setImages] = useState(() => parts.attachments.flatMap((a) => a.type === 'image' && 'attachment' in a.image ? [a.image.attachment] : []));
    const [files, setFiles] = useState(() => parts.attachments.filter((a) => a.type === 'file')
        .map(a => a.file));
    const [drafts, setDrafts] = useState([]);
    const [pending, setPending] = useState(false);
    const [failure, setFailure] = useState(null);
    const editorRef = useRef(null);
    // Draft object URLs die with the editor, whether the user cancels, the
    // submit succeeds, or the tree unmounts underneath.
    const draftsRef = useRef([]);
    draftsRef.current = drafts;
    useEffect(() => () => {
        for (const draft of draftsRef.current) {
            if (draft.previewUrl !== undefined)
                URL.revokeObjectURL(draft.previewUrl);
        }
    }, []);
    // Focus with the caret at the end on open: the common edit touches the tail.
    useEffect(() => {
        const el = editorRef.current;
        if (el === null)
            return;
        el.focus();
        const end = el.value.length;
        el.setSelectionRange(end, end);
    }, []);
    const addFiles = (incoming) => {
        if (incoming.length === 0)
            return;
        const stamp = String(Date.now());
        setDrafts(current => [...current, ...incoming.map((file, index) => ({
                key: `${stamp}-${String(index)}-${file.name}`,
                kind: file.type.startsWith('image/') ? 'image' : 'file',
                file,
                previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
            }))]);
    };
    const onPickFiles = (event) => {
        const picked = [...event.target.files ?? []];
        event.target.value = '';
        addFiles(picked);
    };
    const onDrop = (event) => {
        const dropped = [...event.dataTransfer.files];
        if (dropped.length === 0)
            return;
        event.preventDefault();
        addFiles(dropped);
    };
    const onDragOver = (event) => {
        if (event.dataTransfer.types.includes('Files'))
            event.preventDefault();
    };
    const removeDraft = (key) => {
        setDrafts(current => current.filter((item) => {
            if (item.key !== key)
                return true;
            if (item.previewUrl !== undefined)
                URL.revokeObjectURL(item.previewUrl);
            return false;
        }));
    };
    const rows = Math.min(12, Math.max(2, draft.split('\n').length));
    const empty = draft.trim() === '' && images.length === 0 && files.length === 0 && drafts.length === 0;
    const confirm = () => {
        if (pending || empty)
            return;
        setPending(true);
        setFailure(null);
        const draftImageFiles = drafts
            .filter(item => item.kind === 'image')
            .map(item => ({ file: item.file }));
        const draftOtherFiles = drafts
            .filter(item => item.kind === 'file')
            .map(item => ({ file: item.file }));
        rewriteFrom(sessionId, node.seq, draft, images, files, draftImageFiles, draftOtherFiles)
            .then(() => {
            // Success flips the view to the forked child; this subtree unmounts.
        })
            .catch((error) => {
            setPending(false);
            setFailure(error instanceof Error ? error.message : String(error));
        });
    };
    const onKeyDown = (event) => {
        if (event.key === 'Escape' && !pending) {
            event.preventDefault();
            onCancel();
            return;
        }
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            confirm();
        }
    };
    const draftImageList = drafts.filter(d => d.kind === 'image');
    const draftFileList = drafts.filter(d => d.kind === 'file');
    return (_jsxs("div", { className: css.editStack, onDrop: onDrop, onDragOver: onDragOver, children: [(images.length > 0 || draftImageList.length > 0) && (_jsxs("div", { className: css.editImageStrip, children: [images.map(image => (_jsxs("div", { className: css.editImageChip, children: [_jsx(KeptImageThumb, { image: image, loadImage: loadImage }), _jsx("button", { type: "button", className: css.editImageRemove, "aria-label": t('edit.image.remove'), disabled: pending, onClick: () => { setImages(current => current.filter(item => item !== image)); }, children: _jsx(IconCloseOutlineRegular, {}) })] }, String(image.attachmentId)))), draftImageList.map(draft => (_jsxs("div", { className: css.editImageChip, children: [draft.previewUrl === undefined
                                ? _jsx("div", { className: css.editImageThumb, "aria-hidden": true })
                                : _jsx("img", { className: css.editImageThumb, src: draft.previewUrl, alt: "" }), _jsx("button", { type: "button", className: css.editImageRemove, "aria-label": t('edit.image.remove'), disabled: pending, onClick: () => { removeDraft(draft.key); }, children: _jsx(IconCloseOutlineRegular, {}) })] }, draft.key)))] })), (files.length > 0 || draftFileList.length > 0) && (_jsxs("div", { className: css.editFileStack, children: [files.map(file => (_jsxs("span", { className: css.editFileChip, children: [_jsx(FileTypeIcon, { path: file.name, className: css.editFileIcon }), _jsx("span", { className: css.editFileName, title: file.name, children: file.name }), _jsx("span", { className: css.editFileMeta, children: fileSizeText(file.bytes) }), _jsx("button", { type: "button", className: css.editRemoveInline, "aria-label": t('edit.file.remove'), disabled: pending, onClick: () => { setFiles(current => current.filter(item => item !== file)); }, children: _jsx(IconCloseOutlineRegular, {}) })] }, String(file.attachmentId)))), draftFileList.map(draft => (_jsxs("span", { className: css.editFileChip, children: [_jsx(FileTypeIcon, { path: draft.file.name, className: css.editFileIcon }), _jsx("span", { className: css.editFileName, title: draft.file.name, children: draft.file.name }), _jsx("span", { className: css.editFileMeta, children: fileSizeText(draft.file.size) }), _jsx("button", { type: "button", className: css.editRemoveInline, "aria-label": t('edit.file.remove'), disabled: pending, onClick: () => { removeDraft(draft.key); }, children: _jsx(IconCloseOutlineRegular, {}) })] }, draft.key)))] })), _jsx("textarea", { ref: editorRef, className: css.editArea, rows: rows, value: draft, "aria-label": t('edit.action'), disabled: pending, onChange: (event) => { setDraft(event.target.value); }, onKeyDown: onKeyDown }), parts.rest.map((block, i) => (_jsx(JsonBlock, { label: chatT('message.extraBlock'), payload: block, truncatedLabel: total => chatT('json.truncated', { total }) }, i))), _jsx("div", { className: css.editHint, children: t('edit.hint') }), failure !== null && _jsx("div", { className: css.editFailure, role: "alert", children: t('edit.failed', { reason: failure }) }), _jsxs("div", { className: css.editActions, children: [_jsxs("label", { className: css.editAdd, "aria-label": t('edit.file.add'), title: t('edit.file.add'), children: [_jsx("span", { className: css.editAddIcon, "aria-hidden": true, children: "\uFF0B" }), _jsx("input", { type: "file", multiple: true, className: css.editInput, disabled: pending, onChange: onPickFiles })] }), _jsx("button", { type: "button", className: css.editCancel, disabled: pending, onClick: onCancel, children: t('edit.cancel') }), _jsx("button", { type: "button", className: css.editConfirm, disabled: pending || empty, onClick: confirm, children: t('edit.save') })] })] }));
}
/**
 * The keyed user-message renderer: official bubble presentation, the icon
 * actions row with one added 编辑 entry, and the inline editor swap.
 * @param props - composed slot props.
 * @returns the message row.
 */
export const UserMessageNodeView = memo(function UserMessageNodeView({ node, renderMessageImages, openFile, openSkill, loadImage, useSession, sessionId, rewriteFrom, chatT, t, }) {
    const session = useSession(snapshot => snapshot);
    const editingUnavailable = session.running || session.subagent !== null;
    const [editing, setEditing] = useState(false);
    return editing
        ? (_jsx("div", { className: css.userRow, "data-time-hover-root": true, children: _jsx(UserMessageEditor, { sessionId: sessionId, node: node.data, loadImage: loadImage, rewriteFrom: rewriteFrom, onCancel: () => { setEditing(false); }, chatT: chatT, t: t }) }))
        : (_jsx(UserBubble, { node: node.data, renderMessageImages: renderMessageImages, openFile: openFile, openSkill: openSkill, onEdit: () => { setEditing(true); }, editUnavailable: editingUnavailable, editTitle: session.running ? t('edit.unavailable.running') : t('edit.unavailable.subagent'), chatT: chatT, t: t }));
});
//# sourceMappingURL=EditRegenView.js.map