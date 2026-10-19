import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * The create / profile form for one agent.
 *
 * Both modes share the identity fields (name, description, language,
 * persona); the edit mode prefills from the agent's stored profile and puts
 * the delete action left of the confirm button.
 */
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import css from './AgentForm.module.css';
/** Render the create / profile form. */
export function AgentForm({ mode, initial, busy, error, t, onSubmit, onCancel, onDelete, }) {
    const [name, setName] = useState('');
    const [language, setLanguage] = useState('');
    const [description, setDescription] = useState('');
    const [persona, setPersona] = useState('');
    const [touched, setTouched] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    // Prefill when the profile arrives.
    useEffect(() => {
        if (initial === null)
            return;
        setName(initial.name);
        setLanguage(initial.language);
        setDescription(initial.description);
        setPersona(initial.persona);
    }, [initial]);
    const invalid = (value) => touched && value.trim() === '';
    const valid = name.trim() !== '' && language.trim() !== '' && persona.trim() !== '';
    const submit = () => {
        setTouched(true);
        if (!valid)
            return;
        onSubmit({
            name: name.trim(),
            language: language.trim(),
            description: description.trim(),
            persona: persona.trim(),
        });
    };
    return (_jsxs("div", { className: css.root, children: [_jsxs("div", { className: css.header, children: [_jsxs("button", { type: "button", className: css.back, onClick: onCancel, disabled: busy, children: ["\u2190 ", t('agents.back')] }), _jsx("span", { className: css.title, children: mode === 'create' ? t('form.title.create') : t('form.title.edit') })] }), _jsxs("div", { className: css.fields, children: [_jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('form.name') }), _jsx("input", { className: clsx(css.input, invalid(name) && css.invalid), value: name, onChange: (event) => { setName(event.target.value); }, placeholder: t('form.name.placeholder'), disabled: busy, autoFocus: true }), invalid(name) && _jsx("span", { className: css.fieldError, children: t('error.required') })] }), _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('form.description') }), _jsx("input", { className: css.input, value: description, onChange: (event) => { setDescription(event.target.value); }, placeholder: t('form.description.placeholder'), disabled: busy })] }), _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('form.language') }), _jsx("input", { className: clsx(css.input, invalid(language) && css.invalid), value: language, onChange: (event) => { setLanguage(event.target.value); }, placeholder: t('form.language.placeholder'), disabled: busy }), invalid(language) && _jsx("span", { className: css.fieldError, children: t('error.required') })] }), _jsxs("label", { className: css.field, children: [_jsx("span", { className: css.label, children: t('form.persona') }), _jsx("textarea", { className: clsx(css.textarea, invalid(persona) && css.invalid), value: persona, onChange: (event) => { setPersona(event.target.value); }, placeholder: t('form.persona.placeholder'), disabled: busy, rows: 6 }), invalid(persona) && _jsx("span", { className: css.fieldError, children: t('error.required') })] })] }), error !== null && _jsx("div", { className: css.error, children: error }), _jsxs("div", { className: css.actions, children: [mode === 'edit' && onDelete !== undefined && (_jsx("button", { type: "button", className: css.delete, onClick: () => {
                            if (!confirmDelete) {
                                setConfirmDelete(true);
                                return;
                            }
                            onDelete();
                        }, disabled: busy, children: confirmDelete ? t('form.delete.confirm') : t('form.delete') })), _jsx("span", { className: css.actionsSpacer }), _jsx("button", { type: "button", className: css.cancel, onClick: onCancel, disabled: busy, children: t('form.cancel') }), _jsx("button", { type: "button", className: css.submit, onClick: submit, disabled: busy, children: t('form.submit') })] })] }));
}
//# sourceMappingURL=AgentForm.js.map