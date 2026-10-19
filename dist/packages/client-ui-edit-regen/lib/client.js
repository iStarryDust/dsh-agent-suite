window.__ModuleLoader__.load({
	id: "@istarry/dsh-client-ui-edit-regen",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:E:\Plugin\发布版\dsh-agent-suite\src\packages\client-ui-edit-regen\src\client\EditRegen.module.css.mjs
		const css = "._1AC-pa_userRow{flex-direction:column;align-items:flex-end;gap:6px;display:flex}._1AC-pa_userStack{min-width:0;max-width:min(calc(var(--dsh-chat-content-width,748px) * .702), 82%);flex-direction:column;align-items:flex-end;gap:8px;display:flex}._1AC-pa_bubble{background:var(--dsw-specific-bubble);border-radius:var(--dsw-radius-xl);max-width:100%;font-size:var(--dsh-content-font-size,14px);line-height:calc(22px + var(--dsh-content-font-delta,0px));color:var(--dsw-alias-label-primary);white-space:pre-wrap;word-break:break-word;padding:10px 16px}._1AC-pa_referenceSummary{color:var(--dsw-alias-label-tertiary);font-size:var(--dsh-content-font-size-secondary,13px);line-height:calc(18px + var(--dsh-content-font-delta-secondary,0px))}._1AC-pa_attachmentRow{flex-wrap:wrap;justify-content:flex-end;gap:8px;max-width:100%;display:flex}._1AC-pa_fileCard{border:.5px solid var(--dsw-alias-border-l2,#0000001f);border-radius:var(--dsw-radius-xl);background:var(--dsw-specific-input-major,transparent);box-sizing:border-box;flex:0 0 240px;align-items:center;gap:10px;width:240px;min-height:64px;padding:8px 12px;display:inline-flex}._1AC-pa_fileIcon{flex:none;width:28px;height:28px}._1AC-pa_fileContent{flex-direction:column;flex:1;min-width:0;display:flex}._1AC-pa_fileName{white-space:nowrap;text-overflow:ellipsis;color:var(--dsw-alias-label-primary);font-size:14px;font-weight:500;line-height:22px;overflow:hidden}._1AC-pa_fileMeta{white-space:nowrap;text-overflow:ellipsis;color:var(--dsw-alias-label-tertiary,#00000073);font-size:12px;line-height:15px;overflow:hidden}._1AC-pa_actions{height:calc(28px + var(--dsh-content-font-delta,0px));align-items:center;gap:8px;display:flex}._1AC-pa_timeStart{font-size:var(--dsh-content-font-size-secondary,13px);line-height:calc(24px + var(--dsh-content-font-delta,0px));color:var(--dsw-alias-label-tertiary);white-space:nowrap;padding-right:12px}._1AC-pa_action{width:calc(28px + var(--dsh-content-font-delta,0px));height:calc(28px + var(--dsh-content-font-delta,0px));border-radius:var(--dsw-radius-sm);color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;justify-content:center;align-items:center;padding:6px;display:inline-flex}._1AC-pa_action svg{width:calc(15px + var(--dsh-content-font-delta,0px));height:calc(15px + var(--dsh-content-font-delta,0px))}._1AC-pa_action:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}._1AC-pa_action[data-unavailable]{cursor:default;opacity:.4}._1AC-pa_action[data-unavailable]:hover{color:var(--dsw-alias-label-tertiary);background:0 0}._1AC-pa_editStack{flex-direction:column;align-items:flex-end;gap:8px;width:min(525px,82%);display:flex}._1AC-pa_editArea{box-sizing:border-box;border:1px solid var(--dsw-alias-border-subtle);background:var(--dsw-specific-bubble);width:100%;color:var(--dsw-alias-label-primary);font:inherit;font-size:var(--dsh-content-font-size,14px);line-height:calc(22px + var(--dsh-content-font-delta,0px));resize:vertical;border-radius:22px;padding:10px 16px}._1AC-pa_editArea:focus-visible{border-color:var(--dsw-alias-button-info-fill);outline:none}._1AC-pa_editArea:disabled{opacity:.6}._1AC-pa_editHint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}._1AC-pa_editFailure{color:var(--dsw-alias-state-error-primary);overflow-wrap:anywhere;font-size:12px;line-height:18px}._1AC-pa_editImageStrip{flex-wrap:wrap;justify-content:flex-end;gap:8px;display:flex}._1AC-pa_editImageChip{background:var(--dsw-alias-interactive-bg-hover);border-radius:12px;width:72px;height:72px;position:relative;overflow:hidden}._1AC-pa_editImageThumb{object-fit:cover;width:100%;height:100%;display:block}._1AC-pa_editImageRemove{background:color-mix(in srgb, var(--dsw-alias-label-primary) 72%, transparent);width:20px;height:20px;color:var(--dsw-specific-bubble);cursor:pointer;border:none;border-radius:10px;place-items:center;padding:0;display:inline-grid;position:absolute;top:4px;right:4px}._1AC-pa_editImageRemove:not(:disabled):hover{background:var(--dsw-alias-label-primary)}._1AC-pa_editImageRemove:disabled{opacity:.5;cursor:default}._1AC-pa_editFileStack{flex-wrap:wrap;justify-content:flex-end;gap:8px;display:flex}._1AC-pa_editFileChip{border:.5px solid var(--dsw-alias-border-l2,#0000001f);border-radius:var(--dsw-radius-lg);background:var(--dsw-specific-input-major,transparent);box-sizing:border-box;align-items:center;gap:8px;max-width:240px;min-height:40px;padding:6px 10px;display:inline-flex}._1AC-pa_editFileIcon{flex:none;width:22px;height:22px}._1AC-pa_editFileName{white-space:nowrap;text-overflow:ellipsis;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:18px;overflow:hidden}._1AC-pa_editFileMeta{color:var(--dsw-alias-label-tertiary,#00000073);flex:none;font-size:11px;line-height:15px}._1AC-pa_editRemoveInline{width:20px;height:20px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:10px;flex:none;place-items:center;padding:0;display:inline-grid}._1AC-pa_editRemoveInline:not(:disabled):hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}._1AC-pa_editRemoveInline:disabled{opacity:.5;cursor:default}._1AC-pa_editActions{align-items:center;gap:8px;display:flex}._1AC-pa_editActions button{height:32px;font:inherit;cursor:pointer;border:none;border-radius:16px;align-items:center;gap:6px;padding:0 14px;font-size:14px;line-height:20px;display:inline-flex}._1AC-pa_editActions button:disabled{cursor:default;opacity:.5}._1AC-pa_editAdd{width:32px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:16px;justify-content:center;align-items:center;display:inline-flex}._1AC-pa_editAdd:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}._1AC-pa_editAddIcon{font-size:16px;line-height:1}._1AC-pa_editInput{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}._1AC-pa_editCancel{color:var(--dsw-alias-label-secondary);background:0 0}._1AC-pa_editCancel:not(:disabled):hover{color:var(--dsw-alias-label-primary)}._1AC-pa_editConfirm{background:var(--dsw-alias-button-info-fill);color:var(--dsw-alias-button-info-label)}._1AC-pa_editConfirm:not(:disabled):hover{filter:brightness(1.08)}";
		const tagId = "@istarry/dsh-client-ui-edit-regen/EditRegen.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@istarry/dsh-client-ui-edit-regen";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var EditRegen_module_css_default = {
			"action": "_1AC-pa_action",
			"actions": "_1AC-pa_actions",
			"attachmentRow": "_1AC-pa_attachmentRow",
			"bubble": "_1AC-pa_bubble",
			"editActions": "_1AC-pa_editActions",
			"editAdd": "_1AC-pa_editAdd",
			"editAddIcon": "_1AC-pa_editAddIcon",
			"editArea": "_1AC-pa_editArea",
			"editCancel": "_1AC-pa_editCancel",
			"editConfirm": "_1AC-pa_editConfirm",
			"editFailure": "_1AC-pa_editFailure",
			"editFileChip": "_1AC-pa_editFileChip",
			"editFileIcon": "_1AC-pa_editFileIcon",
			"editFileMeta": "_1AC-pa_editFileMeta",
			"editFileName": "_1AC-pa_editFileName",
			"editFileStack": "_1AC-pa_editFileStack",
			"editHint": "_1AC-pa_editHint",
			"editImageChip": "_1AC-pa_editImageChip",
			"editImageRemove": "_1AC-pa_editImageRemove",
			"editImageStrip": "_1AC-pa_editImageStrip",
			"editImageThumb": "_1AC-pa_editImageThumb",
			"editInput": "_1AC-pa_editInput",
			"editRemoveInline": "_1AC-pa_editRemoveInline",
			"editStack": "_1AC-pa_editStack",
			"fileCard": "_1AC-pa_fileCard",
			"fileContent": "_1AC-pa_fileContent",
			"fileIcon": "_1AC-pa_fileIcon",
			"fileMeta": "_1AC-pa_fileMeta",
			"fileName": "_1AC-pa_fileName",
			"referenceSummary": "_1AC-pa_referenceSummary",
			"timeStart": "_1AC-pa_timeStart",
			"userRow": "_1AC-pa_userRow",
			"userStack": "_1AC-pa_userStack"
		};
		//#endregion
		//#region ../packages/client-ui-edit-regen/src/client/EditRegenView.tsx
		/**
		* The shadowed durable user-message renderer: the official bubble and icon
		* actions with one 编辑 entry added, swapping to an inline editor that
		* rewrites the session from that message onward. Editing is offered while
		* the agent is idle and the session is not a subagent; images and files in
		* the message stay individually removable and new ones attach.
		*/
		function contentParts(content) {
			const texts = [];
			const attachments = [];
			const rest = [];
			for (const block of content) {
				const b = block;
				if (b.type === "text" && typeof b.text === "string") texts.push(b.text);
				else if (b.type === "image" && b.attachment !== void 0) attachments.push({
					type: "image",
					image: { attachment: b.attachment }
				});
				else if (b.type === "file" && b.attachment !== void 0) attachments.push({
					type: "file",
					file: b.attachment
				});
				else rest.push(block);
			}
			return {
				text: texts.join(""),
				attachments,
				rest
			};
		}
		function pad2(n) {
			return String(n).padStart(2, "0");
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
			if (d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()) return clock;
			const params = {
				y: d.getFullYear(),
				m: d.getMonth() + 1,
				d: d.getDate()
			};
			return `${d.getFullYear() === n.getFullYear() ? t("clock.md", params) : t("clock.ymd", params)} ${clock}`;
		}
		/**
		* Component-local calendar-day tick: memoized rows keep stable props across
		* midnight, so the clock needs a seat that re-fires at the next local
		* midnight. Port of the official hook.
		*/
		function useCalendarDay() {
			const [day, setDay] = (0, react.useState)(() => startOfLocalDay(Date.now()));
			(0, react.useEffect)(() => {
				let timer;
				const arm = () => {
					const now = Date.now();
					setDay(startOfLocalDay(now));
					timer = setTimeout(arm, msUntilNextLocalMidnight(now));
				};
				timer = setTimeout(arm, msUntilNextLocalMidnight(Date.now()));
				return () => {
					clearTimeout(timer);
				};
			}, []);
			return day;
		}
		/** Copy / clock / edit actions under the user bubble. */
		function MessageActions({ text, time, onEdit, editUnavailable, editTitle, chatT, t }) {
			const day = useCalendarDay();
			const [copied, setCopied] = (0, react.useState)(false);
			const copyPending = (0, react.useRef)(false);
			const copyTimer = (0, react.useRef)(null);
			const copyEpoch = (0, react.useRef)(0);
			(0, react.useEffect)(() => () => {
				copyEpoch.current += 1;
				copyPending.current = false;
				if (copyTimer.current !== null) clearTimeout(copyTimer.current);
			}, []);
			const onCopy = () => {
				if (copied || copyPending.current) return;
				const epoch = copyEpoch.current;
				copyPending.current = true;
				(0, _deepseek_ai_dsh_client_ui_primitives.writeClipboard)(text).then((ok) => {
					if (epoch !== copyEpoch.current) return;
					copyPending.current = false;
					if (!ok) return;
					setCopied(true);
					copyTimer.current = window.setTimeout(() => {
						copyTimer.current = null;
						setCopied(false);
					}, 1e3);
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: EditRegen_module_css_default.actions,
				"data-clock": "start",
				children: [
					time !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: EditRegen_module_css_default.timeStart,
						children: formatMessageClock(time, chatT, day)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: copied ? t("copied") : t("copy"),
						side: "bottom",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: EditRegen_module_css_default.action,
							"aria-label": copied ? t("copied") : t("copy"),
							onClick: onCopy,
							children: copied ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutlineRegular, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutlineRegular, {})
						})
					}),
					onEdit !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: editUnavailable === true ? editTitle ?? "" : t("edit.action"),
						side: "bottom",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: EditRegen_module_css_default.action,
							"aria-label": t("edit.action"),
							"aria-disabled": editUnavailable || void 0,
							"data-unavailable": editUnavailable || void 0,
							onClick: editUnavailable === true ? void 0 : onEdit,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEditOutlineRegular, {})
						})
					})
				]
			});
		}
		/** Right-aligned durable user bubble with the official presentation. */
		function UserBubble({ node, renderMessageImages, openFile, openSkill, onEdit, editUnavailable, editTitle, chatT, t }) {
			const { text, attachments, rest } = contentParts(node.content);
			const truncated = (total) => chatT("json.truncated", { total });
			const compactImages = attachments.filter((a) => a.type === "image").length > 1;
			const showBubble = text !== "" || rest.length > 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: EditRegen_module_css_default.userRow,
				"data-time-hover-root": true,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: EditRegen_module_css_default.userStack,
					children: [
						attachments.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: EditRegen_module_css_default.attachmentRow,
							"data-message-attachments": true,
							children: attachments.map((attachment, index) => attachment.type === "image" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react.Fragment, { children: renderMessageImages({
								images: [attachment.image],
								align: "end",
								compact: compactImages
							}) }, `image:${index}`) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: EditRegen_module_css_default.fileCard,
								title: attachment.file.name,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.FileTypeIcon, {
									path: attachment.file.name,
									className: EditRegen_module_css_default.fileIcon
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: EditRegen_module_css_default.fileContent,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: EditRegen_module_css_default.fileName,
										children: attachment.file.name
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: EditRegen_module_css_default.fileMeta,
										children: [(0, _deepseek_ai_dsh_client_ui_primitives.fileExtension)(attachment.file.name).toUpperCase().slice(0, 8), (0, _deepseek_ai_dsh_client_ui_primitives.fileSizeText)(attachment.file.bytes)].filter(Boolean).join(" ")
									})]
								})]
							}, `file:${index}`))
						}),
						showBubble && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: EditRegen_module_css_default.bubble,
							children: [(0, _deepseek_ai_dsh_client_ui_primitives.projectUserText)(text, node.referenceLabels ?? [], node.skillNames ?? [], "skill", {
								openFile,
								openSkill
							}), rest.map((block, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.JsonBlock, {
								label: chatT("message.extraBlock"),
								payload: block,
								truncatedLabel: truncated
							}, i))]
						}),
						node.referenceLabels !== void 0 && node.referenceLabels.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: EditRegen_module_css_default.referenceSummary,
							children: chatT("message.referenceSummary", { labels: node.referenceLabels.join(chatT("message.referenceSeparator")) })
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MessageActions, {
					text,
					time: node.time,
					onEdit,
					editUnavailable,
					editTitle,
					chatT,
					t
				})]
			});
		}
		/** The kept image's authorized thumb: resolved once through the owner loader. */
		function KeptImageThumb({ image, loadImage }) {
			const [url, setUrl] = (0, react.useState)(void 0);
			const requested = (0, react.useRef)(false);
			(0, react.useEffect)(() => {
				if (requested.current) return;
				requested.current = true;
				loadImage(image).then(setUrl, () => {
					setUrl(void 0);
				});
			}, [image, loadImage]);
			return url === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: EditRegen_module_css_default.editImageThumb,
				"aria-hidden": true
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
				className: EditRegen_module_css_default.editImageThumb,
				src: url,
				alt: ""
			});
		}
		/**
		* The inline editor: the bubble swaps for an auto-sized textarea above a
		* managed attachment strip — every original image and file stays removable,
		* picked or dropped files append as drafts, and confirm hands the surviving
		* set to the rewrite orchestration. Failure keeps the editor open with the
		* reason; success unmounts with the session switch.
		*/
		function UserMessageEditor({ sessionId, node, loadImage, rewriteFrom, onCancel, chatT, t }) {
			const parts = (0, react.useMemo)(() => contentParts(node.content), [node.content]);
			const [draft, setDraft] = (0, react.useState)(parts.text);
			const [images, setImages] = (0, react.useState)(() => parts.attachments.flatMap((a) => a.type === "image" && "attachment" in a.image ? [a.image.attachment] : []));
			const [files, setFiles] = (0, react.useState)(() => parts.attachments.filter((a) => a.type === "file").map((a) => a.file));
			const [drafts, setDrafts] = (0, react.useState)([]);
			const [pending, setPending] = (0, react.useState)(false);
			const [failure, setFailure] = (0, react.useState)(null);
			const editorRef = (0, react.useRef)(null);
			const draftsRef = (0, react.useRef)([]);
			draftsRef.current = drafts;
			(0, react.useEffect)(() => () => {
				for (const draft of draftsRef.current) if (draft.previewUrl !== void 0) URL.revokeObjectURL(draft.previewUrl);
			}, []);
			(0, react.useEffect)(() => {
				const el = editorRef.current;
				if (el === null) return;
				el.focus();
				const end = el.value.length;
				el.setSelectionRange(end, end);
			}, []);
			const addFiles = (incoming) => {
				if (incoming.length === 0) return;
				const stamp = String(Date.now());
				setDrafts((current) => [...current, ...incoming.map((file, index) => ({
					key: `${stamp}-${String(index)}-${file.name}`,
					kind: file.type.startsWith("image/") ? "image" : "file",
					file,
					previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : void 0
				}))]);
			};
			const onPickFiles = (event) => {
				const picked = [...event.target.files ?? []];
				event.target.value = "";
				addFiles(picked);
			};
			const onDrop = (event) => {
				const dropped = [...event.dataTransfer.files];
				if (dropped.length === 0) return;
				event.preventDefault();
				addFiles(dropped);
			};
			const onDragOver = (event) => {
				if (event.dataTransfer.types.includes("Files")) event.preventDefault();
			};
			const removeDraft = (key) => {
				setDrafts((current) => current.filter((item) => {
					if (item.key !== key) return true;
					if (item.previewUrl !== void 0) URL.revokeObjectURL(item.previewUrl);
					return false;
				}));
			};
			const rows = Math.min(12, Math.max(2, draft.split("\n").length));
			const empty = draft.trim() === "" && images.length === 0 && files.length === 0 && drafts.length === 0;
			const confirm = () => {
				if (pending || empty) return;
				setPending(true);
				setFailure(null);
				const draftImageFiles = drafts.filter((item) => item.kind === "image").map((item) => ({ file: item.file }));
				const draftOtherFiles = drafts.filter((item) => item.kind === "file").map((item) => ({ file: item.file }));
				rewriteFrom(sessionId, node.seq, draft, images, files, draftImageFiles, draftOtherFiles).then(() => {}).catch((error) => {
					setPending(false);
					setFailure(error instanceof Error ? error.message : String(error));
				});
			};
			const onKeyDown = (event) => {
				if (event.key === "Escape" && !pending) {
					event.preventDefault();
					onCancel();
					return;
				}
				if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
					event.preventDefault();
					confirm();
				}
			};
			const draftImageList = drafts.filter((d) => d.kind === "image");
			const draftFileList = drafts.filter((d) => d.kind === "file");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: EditRegen_module_css_default.editStack,
				onDrop,
				onDragOver,
				children: [
					(images.length > 0 || draftImageList.length > 0) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: EditRegen_module_css_default.editImageStrip,
						children: [images.map((image) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: EditRegen_module_css_default.editImageChip,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(KeptImageThumb, {
								image,
								loadImage
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: EditRegen_module_css_default.editImageRemove,
								"aria-label": t("edit.image.remove"),
								disabled: pending,
								onClick: () => {
									setImages((current) => current.filter((item) => item !== image));
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineRegular, {})
							})]
						}, String(image.attachmentId))), draftImageList.map((draft) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: EditRegen_module_css_default.editImageChip,
							children: [draft.previewUrl === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: EditRegen_module_css_default.editImageThumb,
								"aria-hidden": true
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
								className: EditRegen_module_css_default.editImageThumb,
								src: draft.previewUrl,
								alt: ""
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: EditRegen_module_css_default.editImageRemove,
								"aria-label": t("edit.image.remove"),
								disabled: pending,
								onClick: () => {
									removeDraft(draft.key);
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineRegular, {})
							})]
						}, draft.key))]
					}),
					(files.length > 0 || draftFileList.length > 0) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: EditRegen_module_css_default.editFileStack,
						children: [files.map((file) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: EditRegen_module_css_default.editFileChip,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.FileTypeIcon, {
									path: file.name,
									className: EditRegen_module_css_default.editFileIcon
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: EditRegen_module_css_default.editFileName,
									title: file.name,
									children: file.name
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: EditRegen_module_css_default.editFileMeta,
									children: (0, _deepseek_ai_dsh_client_ui_primitives.fileSizeText)(file.bytes)
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: EditRegen_module_css_default.editRemoveInline,
									"aria-label": t("edit.file.remove"),
									disabled: pending,
									onClick: () => {
										setFiles((current) => current.filter((item) => item !== file));
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineRegular, {})
								})
							]
						}, String(file.attachmentId))), draftFileList.map((draft) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: EditRegen_module_css_default.editFileChip,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.FileTypeIcon, {
									path: draft.file.name,
									className: EditRegen_module_css_default.editFileIcon
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: EditRegen_module_css_default.editFileName,
									title: draft.file.name,
									children: draft.file.name
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: EditRegen_module_css_default.editFileMeta,
									children: (0, _deepseek_ai_dsh_client_ui_primitives.fileSizeText)(draft.file.size)
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: EditRegen_module_css_default.editRemoveInline,
									"aria-label": t("edit.file.remove"),
									disabled: pending,
									onClick: () => {
										removeDraft(draft.key);
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineRegular, {})
								})
							]
						}, draft.key))]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
						ref: editorRef,
						className: EditRegen_module_css_default.editArea,
						rows,
						value: draft,
						"aria-label": t("edit.action"),
						disabled: pending,
						onChange: (event) => {
							setDraft(event.target.value);
						},
						onKeyDown
					}),
					parts.rest.map((block, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.JsonBlock, {
						label: chatT("message.extraBlock"),
						payload: block,
						truncatedLabel: (total) => chatT("json.truncated", { total })
					}, i)),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: EditRegen_module_css_default.editHint,
						children: t("edit.hint")
					}),
					failure !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: EditRegen_module_css_default.editFailure,
						role: "alert",
						children: t("edit.failed", { reason: failure })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: EditRegen_module_css_default.editActions,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: EditRegen_module_css_default.editAdd,
								"aria-label": t("edit.file.add"),
								title: t("edit.file.add"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: EditRegen_module_css_default.editAddIcon,
									"aria-hidden": true,
									children: "＋"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "file",
									multiple: true,
									className: EditRegen_module_css_default.editInput,
									disabled: pending,
									onChange: onPickFiles
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: EditRegen_module_css_default.editCancel,
								disabled: pending,
								onClick: onCancel,
								children: t("edit.cancel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: EditRegen_module_css_default.editConfirm,
								disabled: pending || empty,
								onClick: confirm,
								children: t("edit.save")
							})
						]
					})
				]
			});
		}
		/**
		* The keyed user-message renderer: official bubble presentation, the icon
		* actions row with one added 编辑 entry, and the inline editor swap.
		* @param props - composed slot props.
		* @returns the message row.
		*/
		const UserMessageNodeView = (0, react.memo)(function UserMessageNodeView({ node, renderMessageImages, openFile, openSkill, loadImage, useSession, sessionId, rewriteFrom, chatT, t }) {
			const session = useSession((snapshot) => snapshot);
			const editingUnavailable = session.running || session.subagent !== null;
			const [editing, setEditing] = (0, react.useState)(false);
			return editing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: EditRegen_module_css_default.userRow,
				"data-time-hover-root": true,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UserMessageEditor, {
					sessionId,
					node: node.data,
					loadImage,
					rewriteFrom,
					onCancel: () => {
						setEditing(false);
					},
					chatT,
					t
				})
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UserBubble, {
				node: node.data,
				renderMessageImages,
				openFile,
				openSkill,
				onEdit: () => {
					setEditing(true);
				},
				editUnavailable: editingUnavailable,
				editTitle: session.running ? t("edit.unavailable.running") : t("edit.unavailable.subagent"),
				chatT,
				t
			});
		});
		//#endregion
		//#region ../packages/client-ui-edit-regen/src/client/actions.ts
		/** Largest draft file accepted for upload, in bytes. */
		const MAX_DRAFT_BYTES = 128 * 1024 * 1024;
		const IMAGE_MEDIA_TYPES = [
			"image/png",
			"image/jpeg",
			"image/webp",
			"image/gif"
		];
		/**
		* Build the rewrite actions over services resolved at apply time.
		* @param deps - the apply-time service references. Remote namespaces are
		* NOT read off `deps.remote`: property access on the remote service is
		* fiber-inject checked and throws "without inject" from detached event
		* continuations, so every namespace soft-resolves through `deps.ctx.get`
		* at call time.
		* @param whenRemoteReady - settlement of the authoring namespace mount.
		* @returns the injected face handed to the shadowed user-message renderer.
		*/
		function createEditActions(deps, whenRemoteReady) {
			const editRegen = () => deps.ctx.get("remote.agentPresetAuthoring");
			const fileUploads = () => deps.ctx.get("remote.fileUploads");
			const bytesToBase64 = (bytes) => {
				let binary = "";
				const chunk = 32768;
				for (let offset = 0; offset < bytes.length; offset += chunk) binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk));
				return btoa(binary);
			};
			const fileBytes = async (file) => new Uint8Array(await file.arrayBuffer());
			const uploadDraftFile = async (childId, file) => {
				if (file.size > MAX_DRAFT_BYTES) throw new Error(`"${file.name}" exceeds the upload size limit`);
				const upload = fileUploads();
				if (upload === void 0) throw new Error("file attachments cannot be resent: the upload channel is unavailable");
				const staged = await upload.upload(childId, {
					data: bytesToBase64(await fileBytes(file)),
					...file.name === "" ? {} : { name: file.name }
				});
				if (!staged.ok) throw new Error(staged.error.message);
				return {
					type: "file",
					receiptId: staged.value.receiptId
				};
			};
			/** The workspace holding one session, for the blank-session reuse path. */
			const workspaceOf = (sessionId) => {
				return deps.workspaces.list.getSnapshot().items.find((item) => item.sessionIds.includes(sessionId))?.workspaceId;
			};
			/** Carry the source session's durable model selection into the child. */
			const modelCarryOver = async (sessionId, childId) => {
				try {
					const projection = (deps.sessions.binding(sessionId)?.session)?.projections.faceOf("modelSelection").getSnapshot();
					const selection = projection?.next ?? projection?.lastUsed;
					if (selection === void 0 || selection === null) return;
					const sessionRemote = deps.ctx.get("remote.session");
					if (sessionRemote === void 0) return;
					const selected = await sessionRemote.selectModel({
						sessionId: childId,
						provider: selection.provider,
						model: selection.model,
						...selection.reasoningEffort === void 0 ? {} : { reasoningEffort: selection.reasoningEffort }
					});
					if (!selected.ok) throw new Error(selected.error.message);
				} catch (reason) {
					console.warn("edit-regen: model carry-over failed:", reason);
				}
			};
			/** Bind a reused-or-created blank session to the source session's preset. */
			const carryPresetOver = async (sessionId, childId) => {
				const values = deps.sessions.list.getSnapshot().projectionsBySession[sessionId]?.values;
				const preset = typeof values?.agentPreset === "string" ? values.agentPreset : void 0;
				if (preset === void 0) return;
				try {
					await whenRemoteReady;
					await deps.ctx.get("remote.agentPresets")?.select(childId, preset);
				} catch (reason) {
					console.warn("edit-regen: preset carry-over failed:", reason);
				}
			};
			/** Best-effort shell cleanup after a rejected prompt on the forked child. */
			const discardShell = async (childId) => {
				try {
					await whenRemoteReady;
					const remote = editRegen();
					if (remote === void 0) {
						console.warn("edit-regen: the empty child session is kept (no editRegen remote)");
						return;
					}
					const discarded = await remote.deleteSession({ sessionId: childId });
					if (!discarded.ok) console.warn("edit-regen: shell cleanup refused:", discarded.error.message);
				} catch (reason) {
					console.warn("edit-regen: shell cleanup failed:", reason);
				}
			};
			const rewriteFrom = async (sessionId, seq, text, keptImages, keptFiles, draftImages, draftFiles) => {
				await whenRemoteReady;
				const face = deps.sessions.binding(sessionId)?.session;
				if (face === void 0) throw new Error(`session "${sessionId}" is not locally addressable`);
				if (face.getSnapshot().running) throw new Error("the agent is running");
				const keptImageParts = await Promise.all(keptImages.map(async (ref) => {
					const result = await face.readAttachment(ref.attachmentId);
					if (!result.ok) throw new Error(result.error.message);
					return {
						type: "image",
						mediaType: result.value.attachment.mediaType,
						data: bytesToBase64(result.value.data)
					};
				}));
				const draftImageParts = await Promise.all(draftImages.map(async (draft) => {
					if (draft.file.size > MAX_DRAFT_BYTES) throw new Error(`"${draft.file.name}" exceeds the upload size limit`);
					return {
						type: "image",
						mediaType: IMAGE_MEDIA_TYPES.includes(draft.file.type) ? draft.file.type : "image/png",
						data: bytesToBase64(await fileBytes(draft.file)),
						...draft.file.name === "" ? {} : { name: draft.file.name }
					};
				}));
				const remote = editRegen();
				if (remote === void 0) throw new Error("the editRegen remote is unavailable");
				const boundary = await remote.rewriteBoundary({
					sessionId,
					seq
				});
				if (!boundary.ok) throw new Error(boundary.error.message);
				let childId;
				let forked;
				if (boundary.value.atSeq === null) {
					const create = {};
					const workspaceId = workspaceOf(sessionId);
					if (workspaceId !== void 0) create.workspaceId = workspaceId;
					childId = await deps.sessions.create(create);
					forked = false;
					await carryPresetOver(sessionId, childId);
				} else {
					childId = await deps.sessions.fork({
						sessionId,
						atSeq: boundary.value.atSeq,
						increaseTitle: true
					});
					forked = true;
				}
				const fileParts = [];
				if (keptFiles.length > 0) {
					const upload = fileUploads();
					if (upload === void 0) throw new Error("file attachments cannot be resent: the upload channel is unavailable");
					for (const ref of keptFiles) {
						const read = await remote.readFileAttachment({
							sessionId,
							attachmentId: String(ref.attachmentId)
						});
						if (!read.ok) throw new Error(read.error.message);
						const staged = await upload.upload(childId, {
							data: read.value.data,
							name: read.value.name
						});
						if (!staged.ok) throw new Error(staged.error.message);
						fileParts.push({
							type: "file",
							receiptId: staged.value.receiptId
						});
					}
				}
				for (const draft of draftFiles) fileParts.push(await uploadDraftFile(childId, draft.file));
				await modelCarryOver(sessionId, childId);
				const reference = deps.sessions.retain(childId, { source: "editRegen" });
				try {
					const child = reference.binding.session;
					const parts = [
						{
							type: "text",
							text
						},
						...keptImageParts,
						...draftImageParts,
						...fileParts
					];
					let prompt;
					try {
						prompt = await child.prompt(parts, "queue");
					} catch (reason) {
						if (forked) await discardShell(childId);
						throw reason;
					}
					if (!prompt.ok) {
						if (forked) await discardShell(childId);
						throw new Error(prompt.error.message);
					}
					deps.uiWorkspace.openSession(childId);
				} finally {
					reference.release();
				}
			};
			return { rewriteFrom };
		}
		//#endregion
		//#region ../packages/client-ui-edit-regen/src/client/locales.ts
		/** `editregen` namespace dictionaries: the inline editor and its actions. */
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"edit.action": "编辑这条消息",
			"edit.unavailable.running": "智能体运行中，暂不能编辑",
			"edit.unavailable.subagent": "子智能体会话不能编辑",
			"edit.hint": "将从此条消息重新生成，它之后的内容不会保留",
			"edit.cancel": "取消",
			"edit.save": "重新生成",
			"edit.failed": "修改失败：{reason}",
			"edit.image.add": "添加图片",
			"edit.image.remove": "移除这张图片",
			"edit.file.add": "添加文件",
			"edit.file.remove": "移除这个文件",
			"copy": "复制",
			"copied": "已复制"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"edit.action": "Edit this message",
			"edit.unavailable.running": "Unavailable while the agent is running",
			"edit.unavailable.subagent": "Subagent sessions cannot be edited",
			"edit.hint": "Regenerates from this message; later content will not be kept",
			"edit.cancel": "Cancel",
			"edit.save": "Regenerate",
			"edit.failed": "Edit failed: {reason}",
			"edit.image.add": "Add images",
			"edit.image.remove": "Remove this image",
			"edit.file.add": "Add files",
			"edit.file.remove": "Remove this file",
			"copy": "Copy",
			"copied": "Copied"
		};
		//#endregion
		//#region ../packages/client-ui-edit-regen/src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "editregen";
		/** Lower priority than ui-chat's own registration (default 0): lowest renders. */
		const USER_SHADOW_PRIORITY = -20;
		/** Required services (cordis fiber inject). The session-side verbs ride the
		* authoring remote namespace (`remote.agentPresetAuthoring`), whose mount is
		* owned by the agent-suite host half — the compound soft access resolves it
		* without a fiber-injected key. */
		const inject = [
			"slots",
			"locale",
			"sessions",
			"workspaces",
			"uiWorkspace",
			"remote"
		];
		/**
		* Mount the edit-and-regenerate surface.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-edit-regen: dictionaries");
			const actions = createEditActions({
				ctx,
				sessions: ctx.sessions,
				workspaces: ctx.workspaces,
				uiWorkspace: ctx.uiWorkspace,
				remote: ctx.remote
			}, Promise.resolve());
			const chatT = ctx.locale.bind("chat");
			ctx.slots.inject("conversation.chat.node", () => ctx.slots.register({
				name: "conversation.chat.node",
				key: "user",
				priority: USER_SHADOW_PRIORITY,
				locale: NS,
				inject: (_sessionId) => ({
					rewriteFrom: actions.rewriteFrom,
					chatT
				})
			}, UserMessageNodeView));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map