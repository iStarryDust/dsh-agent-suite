window.__ModuleLoader__.load({
	id: "@istarry/dsh-client-ui-settings-agent-memory",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		//#region \0dsh-css:E:\Plugin\发布版\dsh-agent-suite\src\packages\client-ui-settings-agent-memory\src\client\MemorySection.module.css.mjs
		const css = "._czGXW_section{max-width:720px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:12px;display:flex}._czGXW_title{margin:0;font-size:18px;font-weight:600}._czGXW_intro{color:var(--dsw-alias-label-tertiary);margin:0;font-size:13px}._czGXW_group{flex-direction:column;gap:10px;display:flex}._czGXW_group+._czGXW_group{margin-top:8px}._czGXW_groupHead{letter-spacing:.06em;text-transform:uppercase;color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;font-weight:600}._czGXW_rows{flex-direction:column;gap:12px;margin:0;padding:0;list-style:none;display:flex}._czGXW_rowCard{border:.5px solid var(--dsw-alias-settings-card-stroke);border-radius:var(--dsw-radius-xl);background:var(--dsw-alias-settings-card-fill);justify-content:space-between;align-items:flex-start;gap:24px;padding:14px 16px;transition:background .16s;display:flex}._czGXW_rowCard:hover{background:var(--dsw-alias-interactive-bg-hover)}._czGXW_rowText{flex-direction:column;gap:3px;min-width:0;display:flex}._czGXW_rowTitle{font-size:15px;font-weight:600;line-height:1.4}._czGXW_rowDesc{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:1.55}._czGXW_error{color:var(--dsw-alias-state-error-primary);margin:0;font-size:12px}._czGXW_editor{box-sizing:border-box;resize:vertical;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-2);width:100%;min-height:180px;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-mono,ui-monospace, SFMono-Regular, Menlo, monospace);white-space:pre;tab-size:2;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);margin:0;padding:12px;font-size:12.5px;line-height:1.6}._czGXW_editor:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-1px}._czGXW_editorFooter{align-items:center;gap:10px;display:flex}._czGXW_status{color:var(--dsw-alias-label-tertiary);font-size:12px}";
		const tagId = "@istarry/dsh-client-ui-settings-agent-memory/MemorySection.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@istarry/dsh-client-ui-settings-agent-memory";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var MemorySection_module_css_default = {
			"editor": "_czGXW_editor",
			"editorFooter": "_czGXW_editorFooter",
			"error": "_czGXW_error",
			"group": "_czGXW_group",
			"groupHead": "_czGXW_groupHead",
			"intro": "_czGXW_intro",
			"rowCard": "_czGXW_rowCard",
			"rowDesc": "_czGXW_rowDesc",
			"rowText": "_czGXW_rowText",
			"rowTitle": "_czGXW_rowTitle",
			"rows": "_czGXW_rows",
			"section": "_czGXW_section",
			"status": "_czGXW_status",
			"title": "_czGXW_title"
		};
		//#endregion
		//#region ../packages/client-ui-settings-agent-memory/src/client/MemorySection.tsx
		/**
		* Agent-memory settings section: the four memory switches and the global
		* memory editor. Visual language mirrors the official settings sections
		* (ui-agent-preset AgentPresetSection): one column capped at 720px, an 18px
		* title over a tertiary intro, uppercase group heads, card rows built on the
		* settings-card tokens, and a mono editor styled like the composition viewer.
		*/
		/** One switch row: title, description, and the control. */
		function SwitchRow({ title, description, checked, disabled, busy, failed, onChange, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: MemorySection_module_css_default.rowCard,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: MemorySection_module_css_default.rowText,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: MemorySection_module_css_default.rowTitle,
							children: title
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: MemorySection_module_css_default.rowDesc,
							children: description
						}),
						failed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: MemorySection_module_css_default.error,
							role: "alert",
							children: t("writeFailed")
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Switch, {
					checked,
					disabled: disabled || busy,
					label: title,
					onChange
				})]
			});
		}
		/**
		* Render the agent-memory settings section.
		* @param props - settings actions, snapshot hook, and localized copy.
		* @returns the section page.
		*/
		function MemorySection({ useMemorySection, toggle, setDraft, saveGlobal, loadGlobal, t }) {
			const state = useMemorySection((value) => value);
			const [busyField, setBusyField] = (0, react.useState)(null);
			const [failedField, setFailedField] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				loadGlobal();
			}, [loadGlobal]);
			const disabled = state.status !== "ready";
			const change = (field) => (next) => {
				setFailedField(null);
				setBusyField(field);
				toggle(field, next).catch(() => {
					setFailedField(field);
				}).finally(() => {
					setBusyField(null);
				});
			};
			const rows = [
				[
					"globalEnabled",
					t("globalEnabled.title"),
					t("globalEnabled.description")
				],
				[
					"agentEnabled",
					t("agentEnabled.title"),
					t("agentEnabled.description")
				],
				[
					"autoMemory",
					t("autoMemory.title"),
					t("autoMemory.description")
				],
				[
					"askMemory",
					t("askMemory.title"),
					t("askMemory.description")
				]
			];
			const editor = state.editor;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: MemorySection_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						className: MemorySection_module_css_default.title,
						children: t("nav")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: MemorySection_module_css_default.intro,
						children: t("intro")
					}),
					state.status === "unavailable" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: MemorySection_module_css_default.error,
						role: "alert",
						children: t("unavailable")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: MemorySection_module_css_default.group,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							className: MemorySection_module_css_default.groupHead,
							children: t("switchesGroup")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
							className: MemorySection_module_css_default.rows,
							children: rows.map(([field, title, description]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SwitchRow, {
								title,
								description,
								checked: state.switches[field],
								disabled,
								busy: busyField === field,
								failed: failedField === field,
								onChange: change(field),
								t
							}, field))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: MemorySection_module_css_default.group,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
								className: MemorySection_module_css_default.groupHead,
								children: t("globalGroup")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: MemorySection_module_css_default.rowDesc,
								children: t("globalEditor.hint")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
								className: MemorySection_module_css_default.editor,
								value: editor.globalText,
								placeholder: t("globalEditor.placeholder"),
								spellCheck: false,
								disabled: editor.saveState === "saving",
								onChange: (event) => {
									setDraft(event.target.value);
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: MemorySection_module_css_default.editorFooter,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "primary",
										disabled: editor.saveState === "saving",
										onClick: () => {
											saveGlobal();
										},
										children: editor.saveState === "saving" ? t("globalEditor.saving") : t("globalEditor.save")
									}),
									editor.saveState === "saved" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MemorySection_module_css_default.status,
										role: "status",
										children: t("globalEditor.saved")
									}),
									editor.saveState === "failed" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MemorySection_module_css_default.error,
										role: "alert",
										children: editor.error ?? t("globalEditor.saveFailed")
									})
								]
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region ../packages/client-ui-settings-agent-memory/src/client/memory-store.ts
		/** One accepted switch section; malformed durable values read as all-off. */
		function decodeMemorySwitches(section) {
			const source = typeof section === "object" && section !== null && !Array.isArray(section) ? section : {};
			return {
				globalEnabled: source.globalEnabled === true,
				agentEnabled: source.agentEnabled === true,
				autoMemory: source.autoMemory === true,
				askMemory: source.askMemory === true
			};
		}
		/** One settings-page controller (one per browser page). */
		var MemorySettingsController = class {
			form;
			resolveMemory;
			/** Snapshot the section renderer subscribes to. */
			store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({
				status: "loading",
				switches: decodeMemorySwitches(void 0),
				editor: {
					globalText: "",
					saveState: "idle",
					error: null
				}
			});
			unsubscribe;
			/**
			* @param form - the shared configuration form for the `agent-memory`
			* namespace (switch state and ordered writes).
			* @param resolveMemory - resolves the `agentMemory` Remote namespace at
			* CALL time: the namespace mounts asynchronously after this plugin's own
			* apply, so an apply-time capture would freeze a pre-mount undefined.
			*/
			constructor(form, resolveMemory) {
				this.form = form;
				this.resolveMemory = resolveMemory;
				this.unsubscribe = form.subscribe(() => {
					this.deriveSwitches();
				});
				this.deriveSwitches();
			}
			/** Release the form subscription. */
			dispose() {
				this.unsubscribe();
			}
			/** Toggle one switch through the shared configuration form. */
			async toggle(field, next) {
				await this.form.set(field, next);
			}
			/** Update the global-memory editor draft (client-side only until save). */
			setDraft(text) {
				const snapshot = this.store.getSnapshot();
				this.store.set({
					...snapshot,
					editor: {
						...snapshot.editor,
						globalText: text,
						saveState: "idle"
					}
				});
			}
			/** Save the global document through the Remote namespace. */
			async saveGlobal() {
				const namespace = this.resolveMemory();
				if (namespace === void 0) {
					this.failEditor("agentMemory namespace is not mounted");
					return;
				}
				const { globalText } = this.store.getSnapshot().editor;
				this.store.set({
					...this.store.getSnapshot(),
					editor: {
						...this.store.getSnapshot().editor,
						saveState: "saving",
						error: null
					}
				});
				try {
					const written = await namespace.writeGlobal(globalText);
					if (!written.ok) throw new Error(written.error.message);
					this.store.set({
						...this.store.getSnapshot(),
						editor: {
							...this.store.getSnapshot().editor,
							saveState: "saved"
						}
					});
				} catch (error) {
					this.failEditor(error instanceof Error ? error.message : String(error));
				}
			}
			/** Load the global document into the editor. */
			async loadGlobal() {
				const namespace = this.resolveMemory();
				if (namespace === void 0) {
					this.failEditor("agentMemory namespace is not mounted");
					return;
				}
				try {
					const read = await namespace.readGlobal();
					if (!read.ok) throw new Error(read.error.message);
					this.store.set({
						...this.store.getSnapshot(),
						editor: {
							...this.store.getSnapshot().editor,
							globalText: read.value,
							saveState: "idle",
							error: null
						}
					});
				} catch (error) {
					this.failEditor(error instanceof Error ? error.message : String(error));
				}
			}
			failEditor(message) {
				this.store.set({
					...this.store.getSnapshot(),
					editor: {
						...this.store.getSnapshot().editor,
						saveState: "failed",
						error: message
					}
				});
			}
			deriveSwitches() {
				const snapshot = this.form.getSnapshot();
				this.store.set({
					...this.store.getSnapshot(),
					status: snapshot.status === "ready" ? "ready" : snapshot.status === "loading" ? "loading" : "unavailable",
					switches: snapshot.value === void 0 ? decodeMemorySwitches(void 0) : decodeMemorySwitches(snapshot.value)
				});
			}
		};
		//#endregion
		//#region ../packages/client-ui-settings-agent-memory/src/client/locales.ts
		/** English copy. */
		const en = {
			nav: "Agent memory",
			intro: "Long-term memory survives sessions. Enable the stores the system prompt should carry, and let the agent take notes on its own when allowed.",
			switchesGroup: "Memory switches",
			globalGroup: "Global memory document",
			"globalEnabled.title": "Global memory",
			"globalEnabled.description": "Inject the shared memory store into every conversation's system prompt.",
			"agentEnabled.title": "Agent memory",
			"agentEnabled.description": "Inject the current agent's own memory store into its conversations.",
			"autoMemory.title": "Automatic notes",
			"autoMemory.description": "Let the agent call the memory_add tool and write remembered facts on its own judgment.",
			"askMemory.title": "Ask before remembering",
			"askMemory.description": "The same tool call asks first; only an approved decision writes.",
			"globalEditor.hint": "One memory entry per line; every enabled conversation reads it.",
			"globalEditor.placeholder": "Write durable facts every agent should know…",
			"globalEditor.save": "Save",
			"globalEditor.saving": "Saving…",
			"globalEditor.saved": "Saved",
			"globalEditor.saveFailed": "Save failed",
			unavailable: "Memory settings are unavailable on this connection.",
			writeFailed: "The Host refused the switch change."
		};
		/** Chinese copy. */
		const zh = {
			nav: "助理记忆",
			intro: "长期记忆跨会话保留。选择要注入系统提示词的记忆库，并按需允许 Agent 自主记录。",
			switchesGroup: "记忆开关",
			globalGroup: "全局记忆文档",
			"globalEnabled.title": "全局记忆",
			"globalEnabled.description": "把共享记忆库注入每个对话的系统提示词。",
			"agentEnabled.title": "Agent 记忆",
			"agentEnabled.description": "把当前 Agent 自己的记忆库注入其对话。",
			"autoMemory.title": "自动记录",
			"autoMemory.description": "允许 Agent 调用 memory_add 工具，按自身判断写入要记的事实。",
			"askMemory.title": "记录前询问",
			"askMemory.description": "同样的工具调用会先征求你的同意，批准后才写入。",
			"globalEditor.hint": "每行一条记忆；启用后每个对话都会读取。",
			"globalEditor.placeholder": "写下希望所有 Agent 都记住的持久事实…",
			"globalEditor.save": "保存",
			"globalEditor.saving": "保存中…",
			"globalEditor.saved": "已保存",
			"globalEditor.saveFailed": "保存失败",
			unavailable: "当前连接不提供记忆设置。",
			writeFailed: "主机拒绝了此次开关修改。"
		};
		//#endregion
		//#region ../packages/client-ui-settings-agent-memory/src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "settings.agentMemory";
		/** The host plugin entry whose configuration section holds the switches. */
		const AGENT_MEMORY_ENTRY = "agent-memory";
		/** Required services (cordis fiber inject). */
		const inject = [
			"slots",
			"locale",
			"configForms"
		];
		/**
		* Register the agent-memory section and its dictionaries.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			const t = ctx.locale.bind(NS);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-settings-agent-memory: dictionaries");
			const controller = new MemorySettingsController(ctx.configForms.get(AGENT_MEMORY_ENTRY), () => ctx.get("remote.agentMemory"));
			ctx.effect(() => () => {
				controller.dispose();
			}, "ui-settings-agent-memory: form subscription");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "agent-memory",
				order: 25,
				label: () => t("nav"),
				locale: NS,
				inject: () => ({
					hooks: { memorySection: controller.store },
					toggle: (field, next) => controller.toggle(field, next),
					setDraft: (text) => {
						controller.setDraft(text);
					},
					saveGlobal: () => controller.saveGlobal(),
					loadGlobal: () => controller.loadGlobal()
				})
			}, MemorySection));
		}
		//#endregion
		exports.MemorySettingsController = MemorySettingsController;
		exports.apply = apply;
		exports.decodeMemorySwitches = decodeMemorySwitches;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map