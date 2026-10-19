import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * The hero mode chip, shadowing the official agent-preset seat at a lower
 * slot priority (lowest renders), plus the Define-mode dialog.
 *
 * The chip offers the deployment's SHIPPED modes only — authored agents and
 * their combined compositions belong to the agent browser. A pick on a
 * session owned by an authored agent re-composes THAT agent's combined
 * preset for the picked mode (so the chat stays in its agent's history); a
 * pick on a plain blank session stages the mode id itself. When no session
 * is current the chip renders nothing: the deployment default applies until
 * a session exists to bind.
 */
import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, IconAgentPresetOutlineRegular, IconChevronDownOutlineRegular, Menu, Modal, Toast } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './hero.module.css';
/** Duration of a selection-refusal banner. */
const REFUSAL_HOLD_MS = 8000;
/**
 * Render the mode chip for the current session.
 * @param props - runtime share, injected face, and localized copy.
 * @returns the chip, or null when no session is current.
 */
export function HeroChip({ sessionId, load, select, defineTarget, loadDefine, suggestDefine, composeDefine, useHeroSeat, useHeroDefine, t, }) {
    const state = useHeroSeat(snapshot => snapshot);
    const define = useHeroDefine(snapshot => snapshot);
    const [open, setOpen] = useState(false);
    const [defineOpen, setDefineOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [checked, setChecked] = useState([]);
    const [checksTouched, setChecksTouched] = useState(false);
    const toastSeq = useRef(0);
    const [toast, setToast] = useState(null);
    useEffect(() => {
        void load(sessionId);
    }, [load, sessionId]);
    useEffect(() => {
        if (!defineOpen)
            return;
        void loadDefine();
    }, [defineOpen, loadDefine]);
    useEffect(() => {
        if (!defineOpen || checksTouched)
            return;
        setChecked(define.groups.filter(group => group.defaultOn).map(group => group.id));
    }, [define.groups, defineOpen, checksTouched]);
    const toggle = (id, on) => {
        setChecksTouched(true);
        setChecked(current => on ? [...current, id] : current.filter(candidate => candidate !== id));
    };
    if (sessionId === undefined)
        return null;
    const confirmDefine = () => {
        const agent = defineTarget(sessionId);
        if (agent === '') {
            setDefineOpen(false);
            return;
        }
        void composeDefine(agent, checked).then((combinedId) => {
            if (combinedId === '')
                return;
            setDefineOpen(false);
            setDescription('');
            setChecksTouched(false);
            void select(sessionId, combinedId);
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx(Menu, { open: open, onClose: () => { setOpen(false); }, items: [
                    ...state.options.map(option => ({
                        id: option.id,
                        label: (_jsxs("span", { className: css.item, children: [_jsx("span", { className: css.itemName, children: option.name }), _jsx("span", { className: css.itemDesc, children: option.description })] })),
                    })),
                    {
                        id: '__define__',
                        label: (_jsxs("span", { className: css.item, children: [_jsx("span", { className: css.itemName, children: t('seat.define') }), _jsx("span", { className: css.itemDesc, children: t('seat.define.menuDesc') })] })),
                    },
                ], selectedId: state.current, onSelect: (id) => {
                    setOpen(false);
                    if (id === '__define__') {
                        setDefineOpen(true);
                        return;
                    }
                    void select(sessionId, id).then((refusal) => {
                        if (refusal === undefined)
                            return;
                        toastSeq.current += 1;
                        setToast({ seq: toastSeq.current, text: refusal });
                    });
                }, align: "start", portal: true, className: css.menuAnchor, anchor: (_jsxs("button", { type: "button", className: css.seat, "aria-haspopup": "menu", "aria-expanded": open, title: t('seat.hint'), disabled: state.busy, onClick: () => { setOpen(value => !value); }, children: [_jsx(IconAgentPresetOutlineRegular, { className: css.seatIcon }), _jsx("span", { className: css.seatLabel, children: state.options.find(option => option.id === state.current)?.name ?? state.current }), _jsx(IconChevronDownOutlineRegular, { className: css.chevron })] })) }), _jsx(Modal, { open: defineOpen, onClose: () => { setDefineOpen(false); }, closeLabel: t('cancel'), title: t('seat.define.title'), footer: (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", disabled: define.busy, onClick: () => { setDefineOpen(false); }, children: t('cancel') }), _jsx(Button, { variant: "primary", disabled: define.busy || checked.length === 0, onClick: confirmDefine, children: t('seat.define.confirm') })] })), children: _jsxs("div", { className: css.defineBody, children: [_jsx("p", { className: css.defineIntro, children: t('seat.define.intro') }), define.error !== null && _jsx("div", { className: css.defineError, role: "alert", children: define.error }), _jsxs("label", { className: css.defineField, children: [_jsx("span", { className: css.defineLabel, children: t('seat.define.description') }), _jsx("textarea", { className: css.defineTextarea, value: description, placeholder: t('seat.define.description.placeholder'), rows: 3, onChange: event => setDescription(event.target.value) })] }), _jsx(Button, { variant: "outline", disabled: define.busy || description.trim() === '', onClick: () => {
                                void suggestDefine(description).then((groups) => {
                                    setChecked(groups);
                                    setChecksTouched(false);
                                });
                            }, children: define.busy ? t('seat.define.suggesting') : t('seat.define.suggest') }), _jsxs("div", { className: css.defineGroups, children: [_jsx("span", { className: css.defineLabel, children: t('seat.define.groups') }), define.groups.filter(group => group.plugin !== true).map(group => (_jsx(Checkbox, { label: t(`agents.defineGroup.${group.id}`), checked: checked.includes(group.id), disabled: define.busy, onChange: on => toggle(group.id, on) }, group.id))), define.groups.some(group => group.plugin === true) && (_jsx("span", { className: css.defineLabel, children: t('seat.define.groupsPlugin') }, "groups-plugin")), define.groups.filter(group => group.plugin === true).map(group => (_jsx(Checkbox, { label: t(`agents.defineGroup.${group.id}`), checked: checked.includes(group.id), disabled: define.busy, onChange: on => toggle(group.id, on) }, group.id)))] })] }) }), toast !== null && (_jsx(Toast, { text: toast.text, holdMs: REFUSAL_HOLD_MS, anchor: document.querySelector('[data-composer-card]'), onDone: () => { setToast(null); } }, toast.seq))] }));
}
//# sourceMappingURL=hero.js.map