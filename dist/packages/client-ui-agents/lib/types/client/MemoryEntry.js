import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The per-message memory entry, browser half: the memory button seated in the
 * assistant-actions strip beside the official feedback pair. It opens the
 * session's message-selection dialog; the checked messages go to the host
 * remember path, which condenses them into the agent's own long-term memory
 * store. Nothing is written until the human checks messages and submits.
 * @module @deepseek-ai/dsh-client-ui-agents/client/MemoryEntry
 */
import { useMemo, useState } from 'react';
import { Button, IconAgentPresetOutlineRegular, Modal, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './MemoryEntry.module.css';
/** Minimal extractor over a settled assistant node's blocks. */
function assistantText(blocks) {
    return blocks.flatMap(block => block.kind === 'text' ? [block.text] : []).join('');
}
/** Pull the text blocks out of a user node's content array. */
function contentText(content) {
    return content.flatMap(block => block.type === 'text' && typeof block.text === 'string' ? [block.text] : []).join('');
}
/** Condense a long message to a short preview line. */
function preview(text, limit = 120) {
    const trimmed = text.replace(/\s+/g, ' ').trim();
    return trimmed.length <= limit ? trimmed : `${trimmed.slice(0, limit)}…`;
}
/**
 * Build the selectable candidate list from the session chat snapshot. User
 * (and admitted steering) nodes carry durable content blocks; assistant nodes
 * render under the `assistant-step` kind with settled text blocks. Running
 * replies, tool rows, commands, and context snapshots carry no durable prose
 * and are skipped. The list reads in timeline order.
 */
function candidatesOf(snapshot) {
    if (snapshot === undefined)
        return [];
    const list = [];
    for (const node of snapshot.nodes.values()) {
        if (node.visibility === 'hidden')
            continue;
        if (node.kind === 'user' || node.kind === 'steering') {
            const data = node.data;
            const text = contentText(data.content ?? []);
            if (text.trim() === '')
                continue;
            list.push({ key: node.id, anchorSeq: node.anchorSeq, side: 'user', preview: preview(text), text });
        }
        else if (node.kind === 'assistant-step') {
            const data = node.data;
            if (data.status === 'running')
                continue;
            const text = assistantText(data.blocks ?? []);
            if (text.trim() === '')
                continue;
            list.push({ key: node.id, anchorSeq: node.anchorSeq, side: 'assistant', preview: preview(text), text });
        }
    }
    return list.sort((left, right) => left.anchorSeq - right.anchorSeq);
}
/** Map a fail-closed remember outcome to the dialog's copy. */
function outcomeText(outcome, t) {
    if (outcome === 'not an agent chat')
        return t('memoryEntry.notAgent');
    if (outcome === 'session not open')
        return t('memoryEntry.notOpen');
    return outcome !== undefined && outcome !== '' ? outcome : t('memoryEntry.failed');
}
/**
 * The strip button and its transient saved note. The dialog is local state:
 * only one instance exists per message row, and nothing outside it needs the
 * selection.
 * @param props - the injected remember verb and the runtime session kit.
 * @returns the memory icon button with any transient inline copy.
 */
export function MemoryActions({ useChat, remember, t }) {
    const [open, setOpen] = useState(false);
    const [note, setNote] = useState(null);
    return (_jsxs(_Fragment, { children: [_jsx(Tooltip, { label: t('memoryEntry.action'), side: "bottom", children: _jsx("button", { type: "button", className: css.action, "aria-label": t('memoryEntry.action'), onClick: () => { setNote(null); setOpen(true); }, children: _jsx(IconAgentPresetOutlineRegular, {}) }) }), note !== null && _jsx("span", { className: css.note, role: "status", children: note }), open && (_jsx(MemoryDialog, { useChat: useChat, remember: remember, onClose: (saved) => {
                    setOpen(false);
                    if (saved)
                        setNote(t('memoryEntry.saved'));
                }, t: t }))] }));
}
/**
 * The memory-selection dialog: the official modal shell over the current
 * session's selectable messages (a condensed preview per row). The human
 * checks the ones worth keeping, and the checked text goes to the injected
 * remember verb.
 */
export function MemoryDialog({ useChat, remember, onClose, t }) {
    const snapshot = useChat(snapshot => snapshot);
    const candidates = useMemo(() => candidatesOf(snapshot), [snapshot]);
    const [checked, setChecked] = useState(new Set());
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const toggle = (key) => {
        const next = new Set(checked);
        if (next.has(key))
            next.delete(key);
        else
            next.add(key);
        setChecked(next);
    };
    const submit = async () => {
        const rows = candidates.filter(item => checked.has(item.key));
        const text = rows
            .map(item => (item.side === 'user' ? t('memoryEntry.side.user') : t('memoryEntry.side.assistant')) + '：' + item.text)
            .join('\n\n');
        if (text.trim() === '' || busy)
            return;
        setBusy(true);
        setError(null);
        try {
            const result = await remember(text);
            if (result.saved) {
                onClose(true);
                return;
            }
            setError(outcomeText(result.outcome, t));
        }
        catch (caught) {
            setError(caught instanceof Error ? caught.message : t('memoryEntry.failed'));
        }
        finally {
            setBusy(false);
        }
    };
    return (_jsx(Modal, { open: true, onClose: () => { if (!busy)
            onClose(false); }, closeLabel: t('memoryEntry.cancel'), title: t('memoryEntry.title'), description: t('memoryEntry.subtitle'), footer: (_jsxs(_Fragment, { children: [error !== null && _jsx("span", { className: css.dialogError, role: "alert", children: error }), _jsx(Button, { variant: "outline", disabled: busy, onClick: () => { onClose(false); }, children: t('memoryEntry.cancel') }), _jsx(Button, { variant: "primary", disabled: busy || checked.size === 0, onClick: () => { void submit(); }, children: busy ? t('memoryEntry.submitting') : t('memoryEntry.submit') })] })), children: _jsxs("div", { className: css.dialogList, children: [candidates.length === 0 && (_jsx("div", { className: css.dialogEmpty, children: t('memoryEntry.empty') })), candidates.map((item) => {
                    const active = checked.has(item.key);
                    return (_jsxs("label", { className: active ? css.dialogRowChecked : css.dialogRow, children: [_jsx("input", { type: "checkbox", checked: active, onChange: () => { toggle(item.key); }, className: css.dialogCheck }), _jsx("span", { className: css.dialogSideTag, children: item.side === 'user' ? t('memoryEntry.side.user') : t('memoryEntry.side.assistant') }), _jsx("span", { className: css.dialogPreview, children: item.preview })] }, item.key));
                })] }) }));
}
//# sourceMappingURL=MemoryEntry.js.map