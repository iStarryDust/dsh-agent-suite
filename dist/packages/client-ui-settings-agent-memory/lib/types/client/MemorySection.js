import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Agent-memory settings section: the four memory switches and the global
 * memory editor. Visual language mirrors the official settings sections
 * (ui-agent-preset AgentPresetSection): one column capped at 720px, an 18px
 * title over a tertiary intro, uppercase group heads, card rows built on the
 * settings-card tokens, and a mono editor styled like the composition viewer.
 */
import { useEffect, useState } from 'react';
import { Button, Switch } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './MemorySection.module.css';
/** One switch row: title, description, and the control. */
function SwitchRow({ title, description, checked, disabled, busy, failed, onChange, t, }) {
    return (_jsxs("li", { className: css.rowCard, children: [_jsxs("div", { className: css.rowText, children: [_jsx("span", { className: css.rowTitle, children: title }), _jsx("span", { className: css.rowDesc, children: description }), failed && _jsx("span", { className: css.error, role: "alert", children: t('writeFailed') })] }), _jsx(Switch, { checked: checked, disabled: disabled || busy, label: title, onChange: onChange })] }));
}
/**
 * Render the agent-memory settings section.
 * @param props - settings actions, snapshot hook, and localized copy.
 * @returns the section page.
 */
export function MemorySection({ useMemorySection, toggle, setDraft, saveGlobal, loadGlobal, t, }) {
    const state = useMemorySection(value => value);
    const [busyField, setBusyField] = useState(null);
    const [failedField, setFailedField] = useState(null);
    useEffect(() => { void loadGlobal(); }, [loadGlobal]);
    const disabled = state.status !== 'ready';
    const change = (field) => (next) => {
        setFailedField(null);
        setBusyField(field);
        void toggle(field, next)
            .catch(() => { setFailedField(field); })
            .finally(() => { setBusyField(null); });
    };
    const rows = [
        ['globalEnabled', t('globalEnabled.title'), t('globalEnabled.description')],
        ['agentEnabled', t('agentEnabled.title'), t('agentEnabled.description')],
        ['autoMemory', t('autoMemory.title'), t('autoMemory.description')],
        ['askMemory', t('askMemory.title'), t('askMemory.description')],
    ];
    const editor = state.editor;
    return (_jsxs("section", { className: css.section, children: [_jsx("h2", { className: css.title, children: t('nav') }), _jsx("p", { className: css.intro, children: t('intro') }), state.status === 'unavailable' && _jsx("p", { className: css.error, role: "alert", children: t('unavailable') }), _jsxs("section", { className: css.group, children: [_jsx("h3", { className: css.groupHead, children: t('switchesGroup') }), _jsx("ul", { className: css.rows, children: rows.map(([field, title, description]) => (_jsx(SwitchRow, { title: title, description: description, checked: state.switches[field], disabled: disabled, busy: busyField === field, failed: failedField === field, onChange: change(field), t: t }, field))) })] }), _jsxs("section", { className: css.group, children: [_jsx("h3", { className: css.groupHead, children: t('globalGroup') }), _jsx("p", { className: css.rowDesc, children: t('globalEditor.hint') }), _jsx("textarea", { className: css.editor, value: editor.globalText, placeholder: t('globalEditor.placeholder'), spellCheck: false, disabled: editor.saveState === 'saving', onChange: (event) => { setDraft(event.target.value); } }), _jsxs("div", { className: css.editorFooter, children: [_jsx(Button, { variant: "primary", disabled: editor.saveState === 'saving', onClick: () => { void saveGlobal(); }, children: editor.saveState === 'saving' ? t('globalEditor.saving') : t('globalEditor.save') }), editor.saveState === 'saved' && _jsx("span", { className: css.status, role: "status", children: t('globalEditor.saved') }), editor.saveState === 'failed' && _jsx("span", { className: css.error, role: "alert", children: editor.error ?? t('globalEditor.saveFailed') })] })] })] }));
}
//# sourceMappingURL=MemorySection.js.map