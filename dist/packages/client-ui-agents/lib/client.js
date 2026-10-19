window.__ModuleLoader__.load({
	id: "@istarry/dsh-client-ui-agents",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region ../tooling/node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
				throw new Error("cached value already set");
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) {
				const descriptors = Object.getOwnPropertyDescriptors(def);
				Object.assign(mergedDescriptors, descriptors);
			}
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = {
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		};
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const boolean$1 = /^(?:true|false)$/i;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
				else bag.exclusiveMaximum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
				else bag.exclusiveMinimum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
							payload.issues.push({
								code: "invalid_format",
								format: "url",
								note: "Invalid URL format",
								input: payload.value,
								inst,
								continue: !def.abort
							});
							return;
						}
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			def.pattern ?? (def.pattern = nanoid);
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = boolean$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Boolean(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "boolean") return payload;
				payload.issues.push({
					expected: "boolean",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodVoid = /*@__PURE__*/ $constructor("$ZodVoid", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (typeof input === "undefined") return payload;
				payload.issues.push({
					expected: "void",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$2 = isObject;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
			};
			let fastpass;
			const isObject$1 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
			$ZodType.init(inst, def);
			if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
			const values = new Set(def.values);
			inst._zod.values = values;
			inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (values.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values: def.values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _boolean(Class, params) {
			return new Class({
				type: "boolean",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _void$1(Class, params) {
			return new Class({
				type: "void",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/to-json-schema.js
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
			else result.definitions = defs;
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region ../tooling/node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) if (legacy) {
				json.minimum = exclusiveMinimum;
				json.exclusiveMinimum = true;
			} else json.exclusiveMinimum = exclusiveMinimum;
			else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) if (legacy) {
				json.maximum = exclusiveMaximum;
				json.exclusiveMaximum = true;
			} else json.exclusiveMaximum = exclusiveMaximum;
			else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") json.multipleOf = multipleOf;
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const voidProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Void cannot be represented in JSON Schema");
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const literalProcessor = (schema, ctx, json, _params) => {
			const def = schema._zod.def;
			const vals = [];
			for (const val of def.values) if (val === void 0) {
				if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
			} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
			else vals.push(Number(val));
			else vals.push(val);
			if (vals.length === 0) {} else if (vals.length === 1) {
				const val = vals[0];
				json.type = val === null ? "null" : typeof val;
				if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
				else json.const = val;
			} else {
				if (vals.every((v) => typeof v === "number")) json.type = "number";
				if (vals.every((v) => typeof v === "string")) json.type = "string";
				if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
				if (vals.every((v) => v === null)) json.type = "null";
				json.enum = vals;
			}
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region ../tooling/node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region ../tooling/node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region ../tooling/node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region ../tooling/node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
				check(...chks) {
					const def = this.def;
					return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
						check: ch,
						def: { check: "custom" },
						onattach: []
					} } : ch)] }), { parent: true });
				},
				with(...chks) {
					return this.check(...chks);
				},
				clone(def, params) {
					return clone(this, def, params);
				},
				brand() {
					return this;
				},
				register(reg, meta) {
					reg.add(this, meta);
					return this;
				},
				refine(check, params) {
					return this.check(refine(check, params));
				},
				superRefine(refinement, params) {
					return this.check(superRefine(refinement, params));
				},
				overwrite(fn) {
					return this.check(/* @__PURE__ */ _overwrite(fn));
				},
				optional() {
					return optional(this);
				},
				exactOptional() {
					return exactOptional(this);
				},
				nullable() {
					return nullable(this);
				},
				nullish() {
					return optional(nullable(this));
				},
				nonoptional(params) {
					return nonoptional(this, params);
				},
				array() {
					return array(this);
				},
				or(arg) {
					return union([this, arg]);
				},
				and(arg) {
					return intersection(this, arg);
				},
				transform(tx) {
					return pipe(this, transform(tx));
				},
				default(d) {
					return _default(this, d);
				},
				prefault(d) {
					return prefault(this, d);
				},
				catch(params) {
					return _catch(this, params);
				},
				pipe(target) {
					return pipe(this, target);
				},
				readonly() {
					return readonly(this);
				},
				describe(description) {
					const cl = this.clone();
					globalRegistry.add(cl, { description });
					return cl;
				},
				meta(...args) {
					if (args.length === 0) return globalRegistry.get(this);
					const cl = this.clone();
					globalRegistry.add(cl, args[0]);
					return cl;
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
			_installLazyMethods(inst, "_ZodString", {
				regex(...args) {
					return this.check(/* @__PURE__ */ _regex(...args));
				},
				includes(...args) {
					return this.check(/* @__PURE__ */ _includes(...args));
				},
				startsWith(...args) {
					return this.check(/* @__PURE__ */ _startsWith(...args));
				},
				endsWith(...args) {
					return this.check(/* @__PURE__ */ _endsWith(...args));
				},
				min(...args) {
					return this.check(/* @__PURE__ */ _minLength(...args));
				},
				max(...args) {
					return this.check(/* @__PURE__ */ _maxLength(...args));
				},
				length(...args) {
					return this.check(/* @__PURE__ */ _length(...args));
				},
				nonempty(...args) {
					return this.check(/* @__PURE__ */ _minLength(1, ...args));
				},
				lowercase(params) {
					return this.check(/* @__PURE__ */ _lowercase(params));
				},
				uppercase(params) {
					return this.check(/* @__PURE__ */ _uppercase(params));
				},
				trim() {
					return this.check(/* @__PURE__ */ _trim());
				},
				normalize(...args) {
					return this.check(/* @__PURE__ */ _normalize(...args));
				},
				toLowerCase() {
					return this.check(/* @__PURE__ */ _toLowerCase());
				},
				toUpperCase() {
					return this.check(/* @__PURE__ */ _toUpperCase());
				},
				slugify() {
					return this.check(/* @__PURE__ */ _slugify());
				}
			});
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			_installLazyMethods(inst, "ZodNumber", {
				gt(value, params) {
					return this.check(/* @__PURE__ */ _gt(value, params));
				},
				gte(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				min(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				lt(value, params) {
					return this.check(/* @__PURE__ */ _lt(value, params));
				},
				lte(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				max(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				int(params) {
					return this.check(int(params));
				},
				safe(params) {
					return this.check(int(params));
				},
				positive(params) {
					return this.check(/* @__PURE__ */ _gt(0, params));
				},
				nonnegative(params) {
					return this.check(/* @__PURE__ */ _gte(0, params));
				},
				negative(params) {
					return this.check(/* @__PURE__ */ _lt(0, params));
				},
				nonpositive(params) {
					return this.check(/* @__PURE__ */ _lte(0, params));
				},
				multipleOf(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				step(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				finite() {
					return this;
				}
			});
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
			$ZodBoolean.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
		});
		function boolean(params) {
			return /* @__PURE__ */ _boolean(ZodBoolean, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodVoid = /*@__PURE__*/ $constructor("ZodVoid", (inst, def) => {
			$ZodVoid.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => voidProcessor(inst, ctx, json, params);
		});
		function _void(params) {
			return /* @__PURE__ */ _void$1(ZodVoid, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
				min(n, params) {
					return this.check(/* @__PURE__ */ _minLength(n, params));
				},
				nonempty(params) {
					return this.check(/* @__PURE__ */ _minLength(1, params));
				},
				max(n, params) {
					return this.check(/* @__PURE__ */ _maxLength(n, params));
				},
				length(n, params) {
					return this.check(/* @__PURE__ */ _length(n, params));
				},
				unwrap() {
					return this.element;
				}
			});
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
				keyof() {
					return _enum(Object.keys(this._zod.def.shape));
				},
				catchall(catchall) {
					return this.clone({
						...this._zod.def,
						catchall
					});
				},
				passthrough() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				loose() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				strict() {
					return this.clone({
						...this._zod.def,
						catchall: never()
					});
				},
				strip() {
					return this.clone({
						...this._zod.def,
						catchall: void 0
					});
				},
				extend(incoming) {
					return extend(this, incoming);
				},
				safeExtend(incoming) {
					return safeExtend(this, incoming);
				},
				merge(other) {
					return merge(this, other);
				},
				pick(mask) {
					return pick(this, mask);
				},
				omit(mask) {
					return omit(this, mask);
				},
				partial(...args) {
					return partial(ZodOptional, this, args[0]);
				},
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			};
			return new ZodObject(def);
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
			return new ZodEnum({
				type: "enum",
				entries,
				...normalizeParams(params)
			});
		}
		const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
			$ZodLiteral.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
			inst.values = new Set(def.values);
			Object.defineProperty(inst, "value", { get() {
				if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
				return def.values[0];
			} });
		});
		function literal(value, params) {
			return new ZodLiteral({
				type: "literal",
				values: Array.isArray(value) ? value : [value],
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region ../vendor/harness/agent-preset-authoring/remote.js
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_composeEnvironment_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_composeEnvironment_parameter_0$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_composeEnvironment_parameter_0$schema$value ??= object({
			"agentPreset": string().readonly(),
			"modeId": string().readonly().optional(),
			"groups": array(string()).readonly()
		});
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_composeEnvironment_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_composeEnvironment_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_composeEnvironment_result$schema$value ??= object({
			"agentPreset": string().readonly(),
			"modeId": string().readonly()
		});
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_create_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_create_parameter_0$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_create_parameter_0$schema$value ??= object({
			"from": string().readonly(),
			"agentPreset": string().readonly(),
			"name": string().readonly(),
			"language": string().readonly(),
			"persona": string().readonly(),
			"description": string().readonly()
		});
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_create_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_create_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_create_result$schema$value ??= object({
			"agentPreset": string().readonly(),
			"name": string().readonly(),
			"language": string().readonly(),
			"persona": string().readonly(),
			"description": string().readonly()
		});
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_delete_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_delete_parameter_0$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_delete_parameter_0$schema$value ??= object({ "agentPreset": string().readonly() });
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_delete_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_delete_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_delete_result$schema$value ??= _void();
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_deleteSession_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_deleteSession_parameter_0$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_deleteSession_parameter_0$schema$value ??= string();
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_deleteSession_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_deleteSession_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_deleteSession_result$schema$value ??= _void();
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_environmentGroups_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_environmentGroups_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_environmentGroups_result$schema$value ??= object({ "groups": array(object({
			"id": string().readonly(),
			"defaultOn": boolean().readonly(),
			"plugin": boolean().readonly().optional()
		})).readonly() });
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_list_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_list_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_list_result$schema$value ??= object({ "presets": array(object({
			"id": string().readonly(),
			"agentId": string().readonly(),
			"modeId": string().readonly().optional(),
			"name": string().readonly().optional(),
			"description": string().readonly().optional(),
			"language": string().readonly().optional(),
			"persona": string().readonly().optional(),
			"broken": string().readonly().optional()
		})).readonly() });
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_read_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_read_parameter_0$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_read_parameter_0$schema$value ??= string();
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_read_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_read_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_read_result$schema$value ??= object({
			"agentPreset": string().readonly(),
			"name": string().readonly(),
			"language": string().readonly(),
			"persona": string().readonly(),
			"description": string().readonly()
		});
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_readFileAttachment_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_readFileAttachment_parameter_0$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_readFileAttachment_parameter_0$schema$value ??= object({
			"sessionId": string().readonly(),
			"attachmentId": string().readonly()
		});
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_readFileAttachment_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_readFileAttachment_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_readFileAttachment_result$schema$value ??= object({
			"name": string().readonly(),
			"data": string().readonly()
		});
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_rewriteBoundary_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_rewriteBoundary_parameter_0$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_rewriteBoundary_parameter_0$schema$value ??= object({
			"sessionId": string().readonly(),
			"seq": number().readonly()
		});
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_rewriteBoundary_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_rewriteBoundary_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_rewriteBoundary_result$schema$value ??= object({ "atSeq": union([literal(null), number()]).readonly() });
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_suggestEnvironment_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_suggestEnvironment_parameter_0$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_suggestEnvironment_parameter_0$schema$value ??= object({ "description": string().readonly() });
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_suggestEnvironment_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_suggestEnvironment_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_suggestEnvironment_result$schema$value ??= object({ "groups": array(string()).readonly() });
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_update_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_update_parameter_0$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_update_parameter_0$schema$value ??= object({
			"agentPreset": string().readonly(),
			"name": string().readonly(),
			"language": string().readonly(),
			"persona": string().readonly(),
			"description": string().readonly()
		});
		let _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_update_result$schema$value;
		const _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_update_result$schema = () => _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_update_result$schema$value ??= object({
			"agentPreset": string().readonly(),
			"name": string().readonly(),
			"language": string().readonly(),
			"persona": string().readonly(),
			"description": string().readonly()
		});
		const TYPERT_REMOTE$1 = {
			package: "@istarry/dsh-agent-preset-authoring",
			descriptors: [
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/composeEnvironment",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "composeEnvironment",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-preset-authoring/types#ComposeEnvironmentRequest",
							create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_composeEnvironment_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring/types#ComposeEnvironmentValue",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_composeEnvironment_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 602,
						"column": 9
					}
				},
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/create",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "create",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-preset-authoring/types#CreateAuthoredPresetRequest",
							create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_create_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring/types#AuthoredPresetDocument",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_create_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 363,
						"column": 9
					}
				},
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/delete",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "delete",
					implementation: "remove",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-preset-authoring/types#RemoveAuthoredPresetRequest",
							create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_delete_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/delete:result",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_delete_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 493,
						"column": 9
					}
				},
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/deleteSession",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "deleteSession",
					invocation: { kind: "direct" },
					parameters: [{
						name: "sessionId",
						wire: "sessionId",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/deleteSession:sessionId",
							create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_deleteSession_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/deleteSession:result",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_deleteSession_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 666,
						"column": 7
					}
				},
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/environmentGroups",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "environmentGroups",
					invocation: { kind: "direct" },
					parameters: [],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/environmentGroups:result",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_environmentGroups_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 587,
						"column": 3
					}
				},
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/list",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "list",
					implementation: "roster",
					invocation: { kind: "direct" },
					parameters: [],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring/types#AuthoredPresetRoster",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_list_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 320,
						"column": 9
					}
				},
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/read",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "read",
					implementation: "document",
					invocation: { kind: "direct" },
					parameters: [{
						name: "agentPreset",
						wire: "agentPreset",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/read:agentPreset",
							create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_read_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring/types#AuthoredPresetDocument",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_read_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 344,
						"column": 9
					}
				},
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/readFileAttachment",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "readFileAttachment",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-preset-authoring/types#ReadFileAttachmentRequest",
							create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_readFileAttachment_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring/types#ReadFileAttachmentValue",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_readFileAttachment_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 712,
						"column": 9
					}
				},
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/rewriteBoundary",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "rewriteBoundary",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-preset-authoring/types#RewriteBoundaryRequest",
							create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_rewriteBoundary_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring/types#RewriteBoundaryValue",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_rewriteBoundary_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 768,
						"column": 9
					}
				},
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/suggestEnvironment",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "suggestEnvironment",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-preset-authoring/types#SuggestEnvironmentRequest",
							create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_suggestEnvironment_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring/types#SuggestEnvironmentValue",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_suggestEnvironment_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 653,
						"column": 3
					}
				},
				{
					id: "@istarry/dsh-agent-preset-authoring#agentPresetAuthoring/update",
					service: "agentPresetAuthoring",
					namespace: "agentPresetAuthoring",
					method: "update",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-preset-authoring/types#UpdateAuthoredPresetRequest",
							create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_update_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-preset-authoring/types#AuthoredPresetDocument",
						create: _deepseek_ai_dsh_agent_preset_authoring_agentPresetAuthoring_update_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-preset-authoring/src/index.ts",
						"line": 421,
						"column": 9
					}
				}
			]
		};
		//#endregion
		//#region ../vendor/harness/agent-memory/remote.js
		let _deepseek_ai_dsh_agent_memory_agentMemory_purgeAgent_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_purgeAgent_parameter_0$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_purgeAgent_parameter_0$schema$value ??= string();
		let _deepseek_ai_dsh_agent_memory_agentMemory_purgeAgent_result$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_purgeAgent_result$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_purgeAgent_result$schema$value ??= _void();
		let _deepseek_ai_dsh_agent_memory_agentMemory_readAgent_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_readAgent_parameter_0$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_readAgent_parameter_0$schema$value ??= string();
		let _deepseek_ai_dsh_agent_memory_agentMemory_readAgent_result$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_readAgent_result$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_readAgent_result$schema$value ??= string();
		let _deepseek_ai_dsh_agent_memory_agentMemory_readGlobal_result$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_readGlobal_result$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_readGlobal_result$schema$value ??= string();
		let _deepseek_ai_dsh_agent_memory_agentMemory_remember_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_remember_parameter_0$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_remember_parameter_0$schema$value ??= string();
		let _deepseek_ai_dsh_agent_memory_agentMemory_remember_parameter_1$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_remember_parameter_1$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_remember_parameter_1$schema$value ??= string();
		let _deepseek_ai_dsh_agent_memory_agentMemory_remember_result$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_remember_result$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_remember_result$schema$value ??= object({
			"saved": boolean().readonly(),
			"agentId": string().readonly().optional(),
			"outcome": string().readonly().optional(),
			"entries": array(string()).readonly().optional()
		});
		let _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_parameter_0$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_parameter_0$schema$value ??= string();
		let _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_parameter_1$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_parameter_1$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_parameter_1$schema$value ??= string();
		let _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_result$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_result$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_result$schema$value ??= _void();
		let _deepseek_ai_dsh_agent_memory_agentMemory_writeGlobal_parameter_0$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_writeGlobal_parameter_0$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_writeGlobal_parameter_0$schema$value ??= string();
		let _deepseek_ai_dsh_agent_memory_agentMemory_writeGlobal_result$schema$value;
		const _deepseek_ai_dsh_agent_memory_agentMemory_writeGlobal_result$schema = () => _deepseek_ai_dsh_agent_memory_agentMemory_writeGlobal_result$schema$value ??= _void();
		const TYPERT_REMOTE = {
			package: "@istarry/dsh-agent-memory",
			descriptors: [
				{
					id: "@istarry/dsh-agent-memory#agentMemory/purgeAgent",
					service: "agentMemory",
					namespace: "agentMemory",
					method: "purgeAgent",
					invocation: { kind: "direct" },
					parameters: [{
						name: "agentId",
						wire: "agentId",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-memory#agentMemory/purgeAgent:agentId",
							create: _deepseek_ai_dsh_agent_memory_agentMemory_purgeAgent_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-memory#agentMemory/purgeAgent:result",
						create: _deepseek_ai_dsh_agent_memory_agentMemory_purgeAgent_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-memory/src/index.ts",
						"line": 325,
						"column": 3
					}
				},
				{
					id: "@istarry/dsh-agent-memory#agentMemory/readAgent",
					service: "agentMemory",
					namespace: "agentMemory",
					method: "readAgent",
					invocation: { kind: "direct" },
					parameters: [{
						name: "agentId",
						wire: "agentId",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-memory#agentMemory/readAgent:agentId",
							create: _deepseek_ai_dsh_agent_memory_agentMemory_readAgent_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-memory#agentMemory/readAgent:result",
						create: _deepseek_ai_dsh_agent_memory_agentMemory_readAgent_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-memory/src/index.ts",
						"line": 313,
						"column": 3
					}
				},
				{
					id: "@istarry/dsh-agent-memory#agentMemory/readGlobal",
					service: "agentMemory",
					namespace: "agentMemory",
					method: "readGlobal",
					invocation: { kind: "direct" },
					parameters: [],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-memory#agentMemory/readGlobal:result",
						create: _deepseek_ai_dsh_agent_memory_agentMemory_readGlobal_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-memory/src/index.ts",
						"line": 301,
						"column": 3
					}
				},
				{
					id: "@istarry/dsh-agent-memory#agentMemory/remember",
					service: "agentMemory",
					namespace: "agentMemory",
					method: "remember",
					invocation: { kind: "direct" },
					parameters: [{
						name: "sessionId",
						wire: "sessionId",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-memory#agentMemory/remember:sessionId",
							create: _deepseek_ai_dsh_agent_memory_agentMemory_remember_parameter_0$schema
						}
					}, {
						name: "text",
						wire: "text",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-memory#agentMemory/remember:text",
							create: _deepseek_ai_dsh_agent_memory_agentMemory_remember_parameter_1$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-memory/types#RememberValue",
						create: _deepseek_ai_dsh_agent_memory_agentMemory_remember_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-memory/src/index.ts",
						"line": 347,
						"column": 9
					}
				},
				{
					id: "@istarry/dsh-agent-memory#agentMemory/writeAgent",
					service: "agentMemory",
					namespace: "agentMemory",
					method: "writeAgent",
					invocation: { kind: "direct" },
					parameters: [{
						name: "agentId",
						wire: "agentId",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-memory#agentMemory/writeAgent:agentId",
							create: _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_parameter_0$schema
						}
					}, {
						name: "text",
						wire: "text",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-memory#agentMemory/writeAgent:text",
							create: _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_parameter_1$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-memory#agentMemory/writeAgent:result",
						create: _deepseek_ai_dsh_agent_memory_agentMemory_writeAgent_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-memory/src/index.ts",
						"line": 319,
						"column": 3
					}
				},
				{
					id: "@istarry/dsh-agent-memory#agentMemory/writeGlobal",
					service: "agentMemory",
					namespace: "agentMemory",
					method: "writeGlobal",
					invocation: { kind: "direct" },
					parameters: [{
						name: "text",
						wire: "text",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@istarry/dsh-agent-memory#agentMemory/writeGlobal:text",
							create: _deepseek_ai_dsh_agent_memory_agentMemory_writeGlobal_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@istarry/dsh-agent-memory#agentMemory/writeGlobal:result",
						create: _deepseek_ai_dsh_agent_memory_agentMemory_writeGlobal_result$schema
					},
					sourceLocation: {
						"file": "packages/preset/agent-memory/src/index.ts",
						"line": 307,
						"column": 3
					}
				}
			]
		};
		//#endregion
		//#region ../vendor/harness/preset-registry/display.ts
		const BUILT_IN_PRESET_KEYS = {
			standard: {
				name: "presetStandardName",
				description: "presetStandardDescription"
			},
			ptc: {
				name: "presetPtcName",
				description: "presetPtcDescription"
			},
			minimal: {
				name: "presetMinimalName",
				description: "presetMinimalDescription"
			},
			cordis: {
				name: "presetCordisName",
				description: "presetCordisDescription"
			}
		};
		/**
		* Whether a roster row is one of the shipped presets whose copy the dictionaries carry.
		* A shipped preset publishes no `name`; a declaration that names itself owns its copy.
		* @param preset - roster row.
		* @returns true for a shipped preset id without a published name.
		*/
		function isBuiltInPreset(preset) {
			return preset.name === void 0 && BUILT_IN_PRESET_KEYS[preset.id] !== void 0;
		}
		/**
		* Resolve preset display copy without making user-authored metadata translatable.
		* @param preset - roster row whose copy is being rendered.
		* @param t - active locale lookup covering {@link BuiltInPresetCopyKey}.
		* @returns localized copy for a known shipped preset, otherwise declaration metadata.
		*/
		function presetDisplayText(preset, t) {
			const keys = isBuiltInPreset(preset) ? BUILT_IN_PRESET_KEYS[preset.id] : void 0;
			if (keys !== void 0) return {
				name: t(keys.name),
				description: t(keys.description)
			};
			return {
				name: preset.name ?? preset.id,
				...preset.description === void 0 ? {} : { description: preset.description }
			};
		}
		//#endregion
		//#region ../tooling/node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region \0dsh-css:E:\Plugin\发布版\dsh-agent-suite\src\packages\client-ui-agents\src\client\AgentForm.module.css.mjs
		const css$3 = ".aTlw4a_root{box-sizing:border-box;flex-direction:column;flex:1;min-height:0;padding:4px;display:flex;overflow-y:auto}.aTlw4a_header{flex:none;align-items:center;gap:8px;height:32px;margin-bottom:8px;display:flex}.aTlw4a_back{cursor:pointer;color:var(--dsw-alias-label-secondary);background:0 0;border:none;border-radius:8px;flex:none;padding:4px 8px;font-size:13px}.aTlw4a_back:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.aTlw4a_title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:600}.aTlw4a_fields{flex-direction:column;gap:12px;display:flex}.aTlw4a_field{flex-direction:column;gap:4px;display:flex}.aTlw4a_label{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:500}.aTlw4a_input,.aTlw4a_textarea{box-sizing:border-box;border:1px solid var(--dsw-alias-border-default);background:var(--dsw-alias-surface-default);width:100%;color:var(--dsw-alias-label-primary);border-radius:8px;outline:none;padding:8px 10px;font-family:inherit;font-size:13px}.aTlw4a_textarea{resize:vertical;min-height:96px;line-height:1.5}.aTlw4a_input:focus,.aTlw4a_textarea:focus{border-color:var(--dsw-alias-accent)}.aTlw4a_input:disabled,.aTlw4a_textarea:disabled{opacity:.6}.aTlw4a_input.aTlw4a_invalid,.aTlw4a_textarea.aTlw4a_invalid{border-color:var(--dsw-alias-danger)}.aTlw4a_fieldError{color:var(--dsw-alias-danger);font-size:12px}.aTlw4a_error{background:var(--dsw-alias-danger-bg);color:var(--dsw-alias-danger);border-radius:8px;margin-top:12px;padding:8px 10px;font-size:12px;line-height:1.4}.aTlw4a_actions{border-top:1px solid var(--dsw-alias-divider-default);flex:none;align-items:center;gap:8px;margin-top:16px;padding-top:12px;display:flex}.aTlw4a_actionsSpacer{flex:1}.aTlw4a_cancel,.aTlw4a_submit,.aTlw4a_delete{cursor:pointer;border:none;border-radius:8px;flex:none;padding:7px 16px;font-size:13px;font-weight:500}.aTlw4a_cancel{color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-default);background:0 0}.aTlw4a_cancel:hover{color:var(--dsw-alias-label-primary)}.aTlw4a_submit{background:var(--dsw-alias-accent);color:var(--dsw-alias-on-accent)}.aTlw4a_submit:hover{filter:brightness(1.06)}.aTlw4a_submit:disabled,.aTlw4a_cancel:disabled,.aTlw4a_delete:disabled,.aTlw4a_back:disabled{opacity:.55;cursor:default}.aTlw4a_delete{color:var(--dsw-alias-danger);border:1px solid var(--dsw-alias-danger);background:0 0}.aTlw4a_delete:hover{background:var(--dsw-alias-danger-bg)}";
		const tagId$3 = "@istarry/dsh-client-ui-agents/AgentForm.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@istarry/dsh-client-ui-agents";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var AgentForm_module_css_default = {
			"actions": "aTlw4a_actions",
			"actionsSpacer": "aTlw4a_actionsSpacer",
			"back": "aTlw4a_back",
			"cancel": "aTlw4a_cancel",
			"delete": "aTlw4a_delete",
			"error": "aTlw4a_error",
			"field": "aTlw4a_field",
			"fieldError": "aTlw4a_fieldError",
			"fields": "aTlw4a_fields",
			"header": "aTlw4a_header",
			"input": "aTlw4a_input",
			"invalid": "aTlw4a_invalid",
			"label": "aTlw4a_label",
			"root": "aTlw4a_root",
			"submit": "aTlw4a_submit",
			"textarea": "aTlw4a_textarea",
			"title": "aTlw4a_title"
		};
		//#endregion
		//#region ../packages/client-ui-agents/src/client/AgentForm.tsx
		/**
		* The create / profile form for one agent.
		*
		* Both modes share the identity fields (name, description, language,
		* persona); the edit mode prefills from the agent's stored profile and puts
		* the delete action left of the confirm button.
		*/
		/** Render the create / profile form. */
		function AgentForm({ mode, initial, busy, error, t, onSubmit, onCancel, onDelete }) {
			const [name, setName] = (0, react.useState)("");
			const [language, setLanguage] = (0, react.useState)("");
			const [description, setDescription] = (0, react.useState)("");
			const [persona, setPersona] = (0, react.useState)("");
			const [touched, setTouched] = (0, react.useState)(false);
			const [confirmDelete, setConfirmDelete] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				if (initial === null) return;
				setName(initial.name);
				setLanguage(initial.language);
				setDescription(initial.description);
				setPersona(initial.persona);
			}, [initial]);
			const invalid = (value) => touched && value.trim() === "";
			const valid = name.trim() !== "" && language.trim() !== "" && persona.trim() !== "";
			const submit = () => {
				setTouched(true);
				if (!valid) return;
				onSubmit({
					name: name.trim(),
					language: language.trim(),
					description: description.trim(),
					persona: persona.trim()
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: AgentForm_module_css_default.root,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AgentForm_module_css_default.header,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: AgentForm_module_css_default.back,
							onClick: onCancel,
							disabled: busy,
							children: ["← ", t("agents.back")]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: AgentForm_module_css_default.title,
							children: mode === "create" ? t("form.title.create") : t("form.title.edit")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AgentForm_module_css_default.fields,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: AgentForm_module_css_default.field,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: AgentForm_module_css_default.label,
										children: t("form.name")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										className: clsx(AgentForm_module_css_default.input, invalid(name) && AgentForm_module_css_default.invalid),
										value: name,
										onChange: (event) => {
											setName(event.target.value);
										},
										placeholder: t("form.name.placeholder"),
										disabled: busy,
										autoFocus: true
									}),
									invalid(name) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: AgentForm_module_css_default.fieldError,
										children: t("error.required")
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: AgentForm_module_css_default.field,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: AgentForm_module_css_default.label,
									children: t("form.description")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									className: AgentForm_module_css_default.input,
									value: description,
									onChange: (event) => {
										setDescription(event.target.value);
									},
									placeholder: t("form.description.placeholder"),
									disabled: busy
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: AgentForm_module_css_default.field,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: AgentForm_module_css_default.label,
										children: t("form.language")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										className: clsx(AgentForm_module_css_default.input, invalid(language) && AgentForm_module_css_default.invalid),
										value: language,
										onChange: (event) => {
											setLanguage(event.target.value);
										},
										placeholder: t("form.language.placeholder"),
										disabled: busy
									}),
									invalid(language) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: AgentForm_module_css_default.fieldError,
										children: t("error.required")
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: AgentForm_module_css_default.field,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: AgentForm_module_css_default.label,
										children: t("form.persona")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
										className: clsx(AgentForm_module_css_default.textarea, invalid(persona) && AgentForm_module_css_default.invalid),
										value: persona,
										onChange: (event) => {
											setPersona(event.target.value);
										},
										placeholder: t("form.persona.placeholder"),
										disabled: busy,
										rows: 6
									}),
									invalid(persona) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: AgentForm_module_css_default.fieldError,
										children: t("error.required")
									})
								]
							})
						]
					}),
					error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: AgentForm_module_css_default.error,
						children: error
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AgentForm_module_css_default.actions,
						children: [
							mode === "edit" && onDelete !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: AgentForm_module_css_default.delete,
								onClick: () => {
									if (!confirmDelete) {
										setConfirmDelete(true);
										return;
									}
									onDelete();
								},
								disabled: busy,
								children: confirmDelete ? t("form.delete.confirm") : t("form.delete")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: AgentForm_module_css_default.actionsSpacer }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: AgentForm_module_css_default.cancel,
								onClick: onCancel,
								disabled: busy,
								children: t("form.cancel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: AgentForm_module_css_default.submit,
								onClick: submit,
								disabled: busy,
								children: t("form.submit")
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region ../packages/client-ui-agents/src/client/stores.ts
		const INITIAL = {
			status: "idle",
			error: null,
			agents: [],
			bases: [],
			selected: "",
			view: "roster",
			profile: null,
			busy: false,
			collapsed: false,
			memoryText: "",
			memoryState: "idle"
		};
		/**
		* A combined preset id ends with the mode id: `<agentId>-<modeId>`. The mode
		* id is a shipped mode (`standard` / `ptc` / `minimal` / `cordis`) or a
		* per-agent `env-…` environment composition, so the environment combos never
		* read as regular roster agents. The spellings match the authoring service's
		* combined split.
		*/
		const COMBINED_PRESET_RE = /-(standard|ptc|minimal|cordis|env-[a-z0-9-]+)$/;
		/** The mode id a combined preset id carries, when it is one. */
		function modeIdOf(combinedId) {
			return COMBINED_PRESET_RE.exec(combinedId)?.[1];
		}
		/** Present one failure off a Remote result or thrown error. */
		function failureOf(error) {
			if (typeof error === "object" && error !== null && "message" in error) return String(error.message);
			return String(error);
		}
		/** Present one roster row as a view entry. */
		function entryOf(preset) {
			return {
				id: preset.id,
				name: preset.name ?? preset.id,
				...preset.description === void 0 ? {} : { description: preset.description }
			};
		}
		/**
		* Owns the agent browser's state and its wire calls.
		*/
		var AgentBrowserController = class {
			ctx;
			sessions;
			launch;
			/** Snapshot the renderer subscribes to. */
			store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(INITIAL);
			/** The agent a chat-start is about to open for (the hero's mode pick maps to it). */
			pending;
			/** Disposer of the active conversation shadow, absent while not shadowing. */
			shadowDisposer;
			/** The conversation shadow factory, bound once the slot declaration is up. */
			shadowFactory;
			constructor(ctx, sessions, launch) {
				this.ctx = ctx;
				this.sessions = sessions;
				this.launch = launch;
			}
			/**
			* Resolved once this suite's Remote namespaces finished mounting; assigned
			* by the plugin body before any load can run. Roster reads wait on it so a
			* cold boot never races the asynchronous `$mount`.
			*/
			whenRemoteReady = Promise.resolve();
			/**
			* Resolve one typed Remote namespace through the context's soft lookup.
			*
			* The namespace services live under dotted service names provided by fibers
			* outside this plugin's ancestor chain. Reading them MUST go through
			* `ctx.get('<namespace>')` directly: even after `ctx.get('remote')`, a
			* further `.namespace` property hop re-enters the context proxy, whose
			* inject snapshot this fiber does not satisfy — the soft service lookup is
			* the only path that bypasses it.
			*/
			namespace(name) {
				const namespace = this.ctx.get(`remote.${name}`);
				if (namespace === void 0) throw new Error(`ui-agents: Remote namespace "${name}" is not mounted yet`);
				return namespace;
			}
			/** The authored-identity Remote namespace (roster, compositions, deletion). */
			get agentPresetAuthoring() {
				return this.namespace("agentPresetAuthoring");
			}
			/** The preset registry namespace (session binding). */
			get agentPresets() {
				return this.namespace("agentPresets");
			}
			/** The memory namespace (per-agent stores). */
			get agentMemory() {
				return this.namespace("agentMemory");
			}
			/** Tear down the conversation gate. */
			dispose() {
				this.shadowDisposer?.();
				this.shadowDisposer = void 0;
				this.shadowFactory = void 0;
			}
			/**
			* Subscribe to session-catalog changes; returns the disposer. The hero
			* seat tracks its session's live binding through this.
			*/
			subscribeCatalog(listener) {
				return this.sessions.list.subscribe(listener);
			}
			set(patch) {
				this.store.set({
					...this.store.getSnapshot(),
					...patch
				});
				this.updateConversationShadow();
			}
			/**
			* Bind the conversation-region gate: `factory` creates one shadow occupant
			* for the `main.conversation` slot and returns its disposer. Called once
			* the slot declaration is on the ledger; the gate then tracks the view.
			* @param factory - creates the shadow occupant for the conversation region.
			*/
			bindConversationShadow(factory) {
				this.shadowFactory = factory;
				this.updateConversationShadow();
			}
			/** Reconcile the conversation shadow with the current view. */
			updateConversationShadow() {
				const factory = this.shadowFactory;
				if (factory === void 0) return;
				const want = this.store.getSnapshot().view !== "agent";
				if (want && this.shadowDisposer === void 0) this.shadowDisposer = factory();
				else if (!want && this.shadowDisposer !== void 0) {
					this.shadowDisposer();
					this.shadowDisposer = void 0;
				}
			}
			/** The agent a pending chat-start belongs to, for the hero's mode pick. */
			pendingAgent() {
				return this.pending;
			}
			/** Clear the pending chat context once the session has bound its preset. */
			consumePendingAgent() {
				this.pending = void 0;
			}
			/** Map a combined preset id back to its mode id, when it is one. */
			modeIdFor(combinedId) {
				return modeIdOf(combinedId);
			}
			/**
			* The projection values one session carries, read straight off the catalog
			* snapshot (the hero chip's binding display and ownership derivation).
			* @param sessionId - the session to inspect.
			* @returns the projection values, or undefined when absent.
			*/
			sessionProjectionsOf(sessionId) {
				return this.sessions.list.getSnapshot().projectionsBySession[sessionId]?.values;
			}
			/**
			* Resolve once the roster has loaded, so the hero chip's first render sees
			* the shipped modes rather than an empty option list.
			*/
			async ready() {
				if (this.store.getSnapshot().status === "idle") await this.load();
			}
			/**
			* Load the roster: the user's agents plus the chat-time mode options.
			* @returns once the snapshot reflects the host.
			*/
			async load() {
				if (this.store.getSnapshot().status === "loading") return;
				this.set({
					status: "loading",
					error: null
				});
				try {
					await this.whenRemoteReady;
					const [roster, system] = await Promise.all([this.agentPresetAuthoring.list(), this.agentPresets.list()]);
					if (!roster.ok) {
						this.set({
							status: "error",
							error: roster.error.message
						});
						return;
					}
					if (!system.ok) {
						this.set({
							status: "error",
							error: system.error.message
						});
						return;
					}
					const agents = roster.value.presets.filter((preset) => preset.modeId === void 0 && preset.broken === void 0).map(entryOf);
					const authoredIds = new Set(roster.value.presets.map((preset) => preset.id));
					const bases = system.value.presets.filter((preset) => preset.broken === void 0 && !authoredIds.has(preset.id)).map(entryOf);
					const snapshot = this.store.getSnapshot();
					const selectionGone = snapshot.selected !== "" && !agents.some((agent) => agent.id === snapshot.selected);
					this.set({
						status: "ready",
						error: null,
						agents,
						bases,
						selected: selectionGone ? "" : snapshot.selected,
						view: selectionGone && snapshot.view === "agent" ? "roster" : snapshot.view
					});
				} catch (error) {
					this.set({
						status: "error",
						error: failureOf(error)
					});
				}
			}
			/** Toggle the roster list's collapsed state. */
			toggleCollapsed() {
				this.set({ collapsed: !this.store.getSnapshot().collapsed });
			}
			/** Leave a form surface: edit returns to the agent page, create to the roster. */
			back() {
				const view = this.store.getSnapshot().view;
				this.set({ view: view === "edit" ? "agent" : "roster" });
			}
			/** Open one agent's page: chat history on the left, the agent's most recent chat (when one exists) on the right. */
			selectAgent(id) {
				this.set({
					view: "agent",
					selected: id,
					profile: null,
					error: null
				});
				const session = this.agentSessions()[0];
				if (session !== void 0) this.launch.openSession(session.id);
			}
			/**
			* The selected agent's chat history — the one shared ownership read (the
			* roster rows and the auto-opened latest chat both go through
			* {@link agentSessionsOf}).
			*/
			agentSessions() {
				const selected = this.store.getSnapshot().selected;
				if (selected === "") return [];
				return agentSessionsOf(this.sessions.list.getSnapshot(), selected, new Set(this.sessions.archived.getSnapshot()), new Set(this.sessions.pinned.getSnapshot()));
			}
			/** Open one chat from the agent's history. */
			openSession(sessionId) {
				this.launch.openSession(sessionId);
			}
			/** Open the create form (only reachable from the roster page). */
			openCreate() {
				this.set({
					view: "create",
					profile: null,
					error: null
				});
			}
			/**
			* Open one agent's profile panel, prefilled from the host. The view stays
			* on the agent page — profile editing is a main-area panel now, and moving
			* the view would flip the brand back to the roster look and swap the
			* sidebar's chat history away.
			* @param id - the agent to edit.
			*/
			async openProfile(id) {
				this.set({
					selected: id,
					profile: null,
					error: null
				});
				const document = await this.agentPresetAuthoring.read(id);
				if (!document.ok) {
					this.set({ error: document.error.message });
					return;
				}
				this.set({ profile: {
					name: document.value.name,
					language: document.value.language,
					description: document.value.description,
					persona: document.value.persona
				} });
			}
			/**
			* Open one agent's memory panel, prefilled from the store. Like
			* {@link openProfile}, the view stays on the agent page.
			* @param id - the agent whose memory to edit.
			*/
			async openMemory(id) {
				this.set({
					selected: id,
					memoryText: "",
					memoryState: "idle",
					error: null
				});
				const text = await this.agentMemory.readAgent(id);
				if (!text.ok) {
					this.set({ error: text.error.message });
					return;
				}
				this.set({
					memoryText: text.value,
					memoryState: "idle"
				});
			}
			/** Update the memory editor draft. */
			setMemoryText(text) {
				this.set({
					memoryText: text,
					memoryState: "idle"
				});
			}
			/**
			* Save the memory editor draft to this agent's store.
			* @returns the failure message, or undefined on success.
			*/
			async saveMemory() {
				const { selected, memoryText } = this.store.getSnapshot();
				if (selected === "") return "no-selected-agent";
				this.set({
					busy: true,
					memoryState: "saving",
					error: null
				});
				const written = await this.agentMemory.writeAgent(selected, memoryText);
				if (!written.ok) {
					const message = written.error.message;
					this.set({
						busy: false,
						memoryState: "failed",
						error: message
					});
					return message;
				}
				this.set({
					busy: false,
					memoryState: "saved"
				});
			}
			/** Return from the memory editor to the agent page. */
			backFromMemory() {
				this.set({
					view: "agent",
					memoryState: "idle"
				});
			}
			/**
			* Create an agent (identity only — no base mode) and open its page.
			* @param input - the form fields.
			* @returns the failure message, or undefined on success.
			*/
			async create(input) {
				const name = input.name.trim();
				if (name === "") return "empty-name";
				const id = deriveId(name);
				this.set({
					busy: true,
					error: null
				});
				await this.healDeadDrafts();
				const created = await this.agentPresetAuthoring.create({
					from: "minimal",
					agentPreset: id,
					name,
					language: input.language,
					persona: input.persona,
					description: input.description
				});
				if (!created.ok) {
					const message = created.error.message;
					this.set({
						busy: false,
						error: message
					});
					return message;
				}
				await this.load();
				this.set({
					busy: false,
					view: "agent",
					selected: id
				});
				const chatFailure = await this.startChat(id);
				if (chatFailure !== void 0) return chatFailure;
			}
			/**
			* Save a profile edit, propagating the identity to the agent's combined
			* presets, and return to the agent page.
			* @param id - the agent to update.
			* @param input - the form fields.
			* @returns the failure message, or undefined on success.
			*/
			async saveEdit(id, input) {
				this.set({
					busy: true,
					error: null
				});
				const updated = await this.agentPresetAuthoring.update({
					agentPreset: id,
					name: input.name,
					language: input.language,
					persona: input.persona,
					description: input.description
				});
				if (!updated.ok) {
					const message = updated.error.message;
					this.set({
						busy: false,
						error: message
					});
					return message;
				}
				const roster = await this.agentPresetAuthoring.list();
				if (roster.ok) for (const preset of roster.value.presets) {
					if (preset.agentId !== id) continue;
					await this.agentPresetAuthoring.update({
						agentPreset: preset.id,
						name: input.name,
						language: input.language,
						persona: input.persona,
						description: input.description
					});
				}
				await this.load();
				this.set({
					busy: false,
					view: "agent",
					selected: id,
					error: null
				});
			}
			/**
			* Delete an authored agent: its preset directory, its combined presets, and
			* every chat it owned (the host side detaches idle agents first). Returns to
			* the roster because the page it was showing no longer exists.
			* @param id - the agent to delete.
			* @returns the failure message, or undefined on success.
			*/
			async deleteAgent(id) {
				this.set({
					busy: true,
					error: null
				});
				const removed = await this.agentPresetAuthoring.delete({ agentPreset: id });
				if (!removed.ok) {
					const message = removed.error.message;
					this.set({
						busy: false,
						error: message
					});
					return message;
				}
				await this.load();
				this.set({
					busy: false,
					view: "roster",
					selected: "",
					profile: null,
					error: null
				});
			}
			/**
			* Rebind every blank session whose bound preset no longer exists back to
			* the deployment default. A blank left pointing at a deleted combined
			* preset breaks the official session-creation flow (it composes the
			* stored preset before reusing the blank), so the heal runs before any
			* new chat launch.
			*/
			async healDeadDrafts() {
				const roster = await this.agentPresets.list();
				if (!roster.ok) return;
				const known = new Set(roster.value.presets.map((preset) => preset.id));
				const state = this.sessions.list.getSnapshot();
				for (const [sessionId, summary] of Object.entries(state.byId)) {
					if (summary.blank !== true) continue;
					const values = state.projectionsBySession[sessionId]?.values;
					const preset = typeof values?.agentPreset === "string" ? values.agentPreset : void 0;
					if (preset === void 0 || known.has(preset)) continue;
					try {
						await this.agentPresets.select(sessionId, "standard");
					} catch (error) {
						console.warn(`heal: dead-preset draft "${sessionId}" was not rebound:`, error);
					}
				}
			}
			/**
			* Delete an agent with its whole local footprint: its combined presets,
			* its chat sessions (each through the durable delete; a running session is
			* skipped and logged), and its long-term memory store — then return to the
			* roster.
			* @param id - the agent to remove.
			* @returns the failure message, or undefined on success.
			*/
			async remove(id) {
				this.set({
					busy: true,
					error: null
				});
				const roster = await this.agentPresetAuthoring.list();
				const owned = ownedSessionIds(this.sessions.list.getSnapshot(), id);
				for (const sessionId of owned) try {
					await this.agentPresets.select(sessionId, "standard");
				} catch (error) {
					console.warn(`agent "${id}": chat "${sessionId}" was not unbound:`, error);
				}
				if (roster.ok) for (const preset of roster.value.presets) {
					if (preset.agentId !== id || preset.id === id) continue;
					const removed = await this.agentPresetAuthoring.delete({ agentPreset: preset.id });
					if (!removed.ok) {
						const message = removed.error.message;
						this.set({
							busy: false,
							error: message
						});
						return message;
					}
				}
				const removed = await this.agentPresetAuthoring.delete({ agentPreset: id });
				if (!removed.ok) {
					const message = removed.error.message;
					this.set({
						busy: false,
						error: message
					});
					return message;
				}
				for (const sessionId of owned) try {
					const failure = await this.removeSession(sessionId);
					if (failure !== void 0) console.warn(`agent "${id}": chat "${sessionId}" was not deleted: ${failure}`);
				} catch (error) {
					console.warn(`agent "${id}": chat "${sessionId}" was not deleted:`, error);
				}
				try {
					const purged = await this.agentMemory.purgeAgent(id);
					if (!purged.ok) console.warn(`agent "${id}": memory purge refused:`, purged.error.message);
				} catch (error) {
					console.warn(`agent "${id}": memory purge failed:`, error);
				}
				await this.load();
				this.set({
					busy: false,
					view: "roster",
					selected: "",
					error: null
				});
			}
			/**
			* Start a new chat with one agent: compose the agent's default combined
			* preset FIRST so the launch binds the created session to it directly — the
			* hero's staging runs on roster load and misses a chat started right after a
			* create, which would otherwise leave the session on the deployment
			* default. The hero's mode pick can still swap the composition while the
			* session is blank. The agent is also recorded as the pending chat context.
			*
			* A composition failure is surfaced, never swallowed: starting the session
			* anyway would silently bind it to the deployment default and hide it from
			* this agent's chat history.
			* @param id - the agent to chat with.
			* @returns a failure message when the combined preset could not be
			* composed (the chat was NOT started), or undefined on success.
			*/
			async startChat(id) {
				this.pending = id;
				await this.healDeadDrafts();
				const composed = await this.ensureCombined(id, "standard");
				if (composed === void 0) {
					this.pending = void 0;
					this.set({
						error: "chat.startFailed",
						busy: false
					});
					return "chat.startFailed";
				}
				this.launch.launchWithPreset(composed);
			}
			/**
			* Ensure the combined preset for the pending agent + mode exists.
			* The hero chip stages and applies it; this only makes it available.
			* @param modeId - the mode the user picked.
			* @returns the combined preset id, or undefined when composition fails.
			*/
			async composeForPendingAgent(modeId) {
				const agentId = this.pending;
				if (agentId === void 0) return void 0;
				return await this.ensureCombined(agentId, modeId);
			}
			/**
			* Ensure the combined preset for one agent + mode exists — the same path a
			* pending chat start takes, exposed so a later mode pick on a blank
			* agent-owned session re-composes for the SAME agent.
			* @param agentId - the agent whose chat the composition belongs to.
			* @param modeId - the mode the user picked.
			* @returns the combined preset id, or undefined when composition fails.
			*/
			async composeForAgent(agentId, modeId) {
				return await this.ensureCombined(agentId, modeId);
			}
			/**
			* Ensure the combined preset `<agentId>-<modeId>` exists: a deterministic
			* copy of the mode's composition with the agent's persona folded in.
			* @param agentId - the agent preset id.
			* @param modeId - the mode preset id (standard / ptc / minimal / cordis).
			* @returns the combined preset id, or undefined when it cannot be composed.
			*/
			async ensureCombined(agentId, modeId) {
				const comboId = `${agentId}-${modeId}`;
				const roster = await this.agentPresetAuthoring.list();
				if (roster.ok && roster.value.presets.some((preset) => preset.id === comboId)) return comboId;
				const read = await this.agentPresetAuthoring.read(agentId);
				if (!read.ok) return void 0;
				const modeName = this.store.getSnapshot().bases.find((base) => base.id === modeId)?.name ?? modeId;
				return (await this.agentPresetAuthoring.create({
					from: modeId,
					agentPreset: comboId,
					name: `${read.value.name}（${modeName}）`,
					language: read.value.language,
					persona: read.value.persona,
					description: read.value.description
				})).ok ? comboId : void 0;
			}
			/** Rename one chat's durable title. */
			async renameSession(sessionId, title) {
				await this.sessions.rename(sessionId, title);
			}
			/** Archive one chat. */
			async archiveSession(sessionId) {
				await this.sessions.archive(sessionId);
			}
			/**
			* Delete one chat durably through the authoring service's own deletion
			* remote: the session log, its projection cache row, and its workspace
			* accounting go together. The removal event folds into every client's
			* catalog through the official session-controller relay.
			* @param sessionId - the session to delete.
			* @returns a user-facing failure key or message, or undefined on success.
			*/
			async removeSession(sessionId) {
				const removed = await this.agentPresetAuthoring.deleteSession(sessionId);
				if (removed.ok) return void 0;
				return removed.error.code === "agent-preset-authoring/session-busy" ? "chat.deleteBusy" : removed.error.message;
			}
		};
		/**
		* The hero mode chip's controller: the shipped modes as options, the current
		* session's binding, Define-mode palette state, and the pick/apply path.
		* Mode picks ride the browser controller's composition machinery, so every
		* pick behaves identically to a chat start.
		*/
		var HeroSeatController = class {
			browser;
			modeText;
			/** Seat snapshot the renderer subscribes to. */
			store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({
				options: [],
				current: "",
				busy: false
			});
			/** Define-dialog snapshot the renderer subscribes to. */
			define = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({
				groups: [],
				loaded: false,
				error: null,
				busy: false
			});
			/** The session the seat mirrors; its binding is re-read on catalog changes. */
			seatSessionId;
			/** Disposer of the catalog subscription, present while a session is mirrored. */
			catalogUnsubscribe;
			constructor(browser, modeText) {
				this.browser = browser;
				this.modeText = modeText;
			}
			/** Release the catalog subscription. */
			dispose() {
				this.catalogUnsubscribe?.();
				this.catalogUnsubscribe = void 0;
				this.seatSessionId = void 0;
			}
			/**
			* Reflect the offered modes and the current session's binding. The binding
			* is re-read whenever the session catalog changes: a freshly started chat
			* binds its preset asynchronously (the launch selects the composition after
			* the blank session turns current), so the one-shot read at mount races
			* that bind and would leave the chip's label empty on the slow path.
			*/
			async load(sessionId) {
				await this.browser.ready();
				this.trackSession(sessionId);
				this.store.set({
					...this.store.getSnapshot(),
					options: this.browser.store.getSnapshot().bases.map((mode) => ({
						id: mode.id,
						...this.modeText(mode.id)
					}))
				});
				this.reflectBinding(sessionId);
			}
			/** Mirror one session; the catalog subscription keeps the binding live. */
			trackSession(sessionId) {
				this.seatSessionId = sessionId;
				if (this.catalogUnsubscribe === void 0 && sessionId !== void 0) this.catalogUnsubscribe = this.browser.subscribeCatalog(() => {
					this.reflectBinding(this.seatSessionId);
				});
			}
			/** Re-derive the chip's current mode from the session's live binding. */
			reflectBinding(sessionId) {
				const bound = sessionId === void 0 ? "" : this.boundPresetOf(sessionId);
				const current = bound === "" ? "" : this.browser.modeIdFor(bound) ?? bound;
				if (this.store.getSnapshot().current === current) return;
				this.store.set({
					...this.store.getSnapshot(),
					current
				});
			}
			/**
			* Stage and apply one mode pick on the named session. A session owned by
			* an authored agent re-composes THAT agent's combined preset for the mode;
			* a plain session binds the shipped mode id directly. An id that is ALREADY
			* combined (the Define dialog's composition) binds as-is — re-composing it
			* would nest the combined id into a second combined id.
			* @param sessionId - the session whose composition changes.
			* @param id - the picked mode id, or a composed combined id.
			* @returns a user-facing failure text, or undefined on success.
			*/
			async select(sessionId, id) {
				const owner = this.browser.pendingAgent() ?? this.ownerOfBoundPreset(this.boundPresetOf(sessionId));
				this.store.set({
					...this.store.getSnapshot(),
					busy: true
				});
				try {
					let target = id;
					if (owner !== void 0 && modeIdOf(id) === void 0) {
						const composed = this.browser.pendingAgent() !== void 0 ? await this.browser.composeForPendingAgent(id) : await this.browser.composeForAgent(owner, id);
						this.browser.consumePendingAgent();
						if (composed === void 0) return "chat.startFailed";
						target = composed;
					}
					this.browser.consumePendingAgent();
					const result = await this.agentPresets.select(sessionId, target);
					if (!result.ok) return result.error.message;
					this.store.set({
						...this.store.getSnapshot(),
						current: this.browser.modeIdFor(target) ?? target
					});
					return;
				} finally {
					this.store.set({
						...this.store.getSnapshot(),
						busy: false
					});
				}
			}
			/**
			* The agent a Define composition builds for: the pending chat's agent, or
			* the one owning the current session's bound combined preset.
			* @param sessionId - the current session, when one is current.
			* @returns the agent id, or an empty string for a plain session.
			*/
			defineTarget(sessionId) {
				return this.browser.pendingAgent() ?? this.ownerOfBoundPreset(sessionId === void 0 ? "" : this.boundPresetOf(sessionId)) ?? "";
			}
			/** Load the capability palette once per controller lifetime. */
			async loadDefine() {
				const before = this.define.getSnapshot();
				if (before.loaded || before.busy) return;
				this.define.set({
					...before,
					busy: true,
					error: null
				});
				const groups = await this.browser.agentPresetAuthoring.environmentGroups();
				if (!groups.ok) {
					this.define.set({
						...this.define.getSnapshot(),
						busy: false,
						error: groups.error.message
					});
					return;
				}
				this.define.set({
					groups: groups.value.groups,
					loaded: true,
					busy: false,
					error: null
				});
			}
			/** Infer a capability selection from a task description. */
			async suggestDefine(description) {
				const suggested = await this.browser.agentPresetAuthoring.suggestEnvironment({ description });
				return suggested.ok ? suggested.value.groups : [];
			}
			/** Compose one agent's environment and return its combined id, or ''. */
			async composeDefine(agentPreset, groups) {
				this.define.set({
					...this.define.getSnapshot(),
					busy: true,
					error: null
				});
				const composed = await this.browser.agentPresetAuthoring.composeEnvironment({
					agentPreset,
					groups
				});
				this.define.set({
					...this.define.getSnapshot(),
					busy: false
				});
				if (!composed.ok) {
					this.define.set({
						...this.define.getSnapshot(),
						error: composed.error.message
					});
					return "";
				}
				this.browser.consumePendingAgent();
				return composed.value.agentPreset;
			}
			/** The preset registry namespace (session binding), via the browser's soft lookup. */
			get agentPresets() {
				return this.browser.agentPresets;
			}
			/** The preset id bound to a session, read off its projection values. */
			boundPresetOf(sessionId) {
				const values = this.browser.sessionProjectionsOf(sessionId);
				return typeof values?.agentPreset === "string" ? values.agentPreset : "";
			}
			/** The authored agent owning a bound combined preset, when one is. */
			ownerOfBoundPreset(preset) {
				const modeId = this.browser.modeIdFor(preset);
				return modeId === void 0 ? void 0 : preset.slice(0, preset.length - modeId.length - 1);
			}
		};
		/**
		* One agent's own chats from a session-list snapshot: sessions whose recorded
		* ownership is the agent's (its combined presets included) — nothing else —
		* so every agent's history is exclusive to it. Ownership reads the host-side
		* `agentOwner` projection — one exact key — with the combined-id prefix as
		* the fallback for sessions whose projection row predates the key (a cold
		* session not yet re-folded). Archived sessions are excluded unless the
		* archive filter admits them; pinned sessions lead the list (the registry
		* global pin set), the rest read newest first by the session's last-activity
		* time. Subagent children are hidden, matching the workspace tree.
		* @param state - the sessions snapshot.
		* @param selected - the agent id.
		* @param archived - the registry-global archive set.
		* @param pinned - the registry-global pinned set.
		* @param archivedFilter - which side of the archive set the list shows.
		* @returns the agent's session rows, pinned first, then newest first.
		*/
		function agentSessionsOf(state, selected, archived, pinned, archivedFilter = "default") {
			const rows = [];
			for (const [id, summary] of Object.entries(state.byId)) {
				if (summary.origin === "subagent") continue;
				const isArchived = archived.has(id);
				if (archivedFilter === "default" ? isArchived : archivedFilter === "only" ? !isArchived : false) continue;
				const values = state.projectionsBySession[id]?.values;
				const owner = typeof values?.agentOwner === "string" ? values.agentOwner : void 0;
				const preset = typeof values?.agentPreset === "string" ? values.agentPreset : void 0;
				if (!(owner === selected || owner === void 0 && (preset === selected || (preset?.startsWith(`${selected}-`) ?? false)))) continue;
				const title = typeof values?.title === "string" ? values.title : void 0;
				const modeId = typeof preset === "string" ? modeIdOf(preset) : void 0;
				rows.push({
					id,
					title: title ?? id,
					current: false,
					updatedAt: summary.updatedAt,
					blank: summary.blank === true,
					...modeId === void 0 ? {} : { modeId }
				});
			}
			rows.sort((left, right) => {
				const pinOrder = Number(pinned.has(right.id)) - Number(pinned.has(left.id));
				return pinOrder !== 0 ? pinOrder : right.updatedAt - left.updatedAt;
			});
			return rows;
		}
		/**
		* Every session id owned by one agent, with no list filters: blanks,
		* archived, and pinned rows alike — the agent-delete purge enumerates the
		* agent's whole local footprint. Ownership reads the same projection as
		* {@link agentSessionsOf}.
		* @param state - the sessions snapshot.
		* @param agentId - the agent id.
		* @returns the owned session ids, list order.
		*/
		function ownedSessionIds(state, agentId) {
			const ids = [];
			for (const [id, summary] of Object.entries(state.byId)) {
				if (summary.origin === "subagent") continue;
				const values = state.projectionsBySession[id]?.values;
				const owner = typeof values?.agentOwner === "string" ? values.agentOwner : void 0;
				const preset = typeof values?.agentPreset === "string" ? values.agentPreset : void 0;
				if (owner === agentId || owner === void 0 && (preset === agentId || (preset?.startsWith(`${agentId}-`) ?? false))) ids.push(id);
			}
			return ids;
		}
		/**
		* Derive a stable preset id from a display name: lowercased, spaces and
		* punctuation to dashes, non-id characters dropped, with a timestamp suffix so
		* recreating a same-named agent never collides with its predecessor.
		* @param name - the display name.
		* @returns an id matching PRESET_ID (`^[a-z0-9][a-z0-9-]*$`).
		*/
		function deriveId(name) {
			const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
			return `${(base.length > 0 ? base : "agent").slice(0, 32)}-${Date.now().toString(36)}`;
		}
		//#endregion
		//#region ../packages/client-ui-agents/src/client/view.ts
		/**
		* The chat history's viewing store: grouping, ordering, the archived filter,
		* group expansion, and the saved manual order — persisted across reloads.
		* Module level exports the factory only (a module-level handle would pin the
		* store identity across plugin reloads); apply() receives the handle and
		* threads it into the browser through the injected face. The manual order
		* lives in per-agent accounts (`${agentId}/ws:${workspaceId}`, `ung`, or
		* `flat`), so two agents sharing a workspace never overwrite each other's
		* arrangement. The order reconciliation and the drag-order computation
		* follow the official workspace browser's semantics (pinned rows lead,
		* forks follow their source, archives trail; a drag can only reorder rows
		* of one account and one pinned block).
		*/
		/** Copy read-only projections into the persisted mutable representation. */
		function copyOrders(orders) {
			return Object.fromEntries(Object.entries(orders).map(([key, order]) => [key, [...order]]));
		}
		/** The stored key of one agent's account. */
		function accountKeyOf(agentId, account) {
			return `${agentId}/${account}`;
		}
		/**
		* Create the viewing store handle.
		* @returns the store and its write set.
		*/
		function createAgentViewStore() {
			const store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({
				groupBy: "flat",
				orderBy: "updated",
				archivedFilter: "default",
				groupExpansion: {},
				sessionOrderByAccount: {}
			}, { persist: { name: "dsh.agents.view.v1" } });
			return {
				store,
				actions: {
					setGroupBy: (mode) => {
						const current = store.getSnapshot();
						if (current.groupBy === mode) return;
						store.set({
							...current,
							groupBy: mode
						});
					},
					setOrderBy: (mode, initialOrders) => {
						const current = store.getSnapshot();
						if (current.orderBy === mode) return;
						store.set({
							...current,
							sessionOrderByAccount: mode === "manual" ? copyOrders(initialOrders) : {},
							orderBy: mode
						});
					},
					setArchivedFilter: (filter) => {
						const current = store.getSnapshot();
						if (current.archivedFilter === filter) return;
						store.set({
							...current,
							archivedFilter: filter
						});
					},
					setGroupExpanded: (key, expanded) => {
						const current = store.getSnapshot();
						if (current.groupExpansion[key] === expanded) return;
						store.set({
							...current,
							groupExpansion: {
								...current.groupExpansion,
								[key]: expanded
							}
						});
					},
					setSessionOrder: (fullKey, order, initialOrders) => {
						const current = store.getSnapshot();
						const saved = current.orderBy === "updated" ? copyOrders(initialOrders) : {
							...current.sessionOrderByAccount,
							...copyOrders(initialOrders)
						};
						saved[fullKey] = [...order];
						store.set({
							...current,
							sessionOrderByAccount: saved,
							orderBy: "manual"
						});
					},
					retainAgents: (agentIds, workspaceIds) => {
						const current = store.getSnapshot();
						const agents = new Set(agentIds);
						const spaces = new Set(workspaceIds);
						const keep = (key) => {
							const separator = key.indexOf("/");
							if (separator <= 0) return false;
							if (!agents.has(key.slice(0, separator))) return false;
							const account = key.slice(separator + 1);
							return !(account.startsWith("ws:") && !spaces.has(account.slice(3)));
						};
						const orders = Object.fromEntries(Object.entries(current.sessionOrderByAccount).filter(([key]) => keep(key)));
						const expansion = Object.fromEntries(Object.entries(current.groupExpansion).filter(([key]) => !(key.startsWith("ws:") && !spaces.has(key.slice(3)))));
						if (Object.keys(orders).length === Object.keys(current.sessionOrderByAccount).length && Object.keys(expansion).length === Object.keys(current.groupExpansion).length) return;
						store.set({
							...current,
							sessionOrderByAccount: orders,
							groupExpansion: expansion
						});
					}
				}
			};
		}
		/**
		* Project known members by current recency, identity as the tie-break.
		* Members without a summary are omitted until theirs arrives.
		*/
		function orderByRecency(sessionIds, summaries) {
			return sessionIds.flatMap((id) => {
				const summary = summaries[id];
				if (summary === void 0) return [];
				return [{
					id,
					rank: summary.updatedAt
				}];
			}).sort((a, b) => {
				if (a.rank !== b.rank) return b.rank - a.rank;
				return a.id < b.id ? -1 : 1;
			}).map((member) => member.id);
		}
		/**
		* Reconcile a saved manual order with current account membership: saved
		* relative positions hold, pinned rows lead, new members arrive by recency
		* (a fork directly after its source), and archives trail.
		* @param memberIds - the account's full membership.
		* @param savedOrder - the previously saved order.
		* @param summaries - current session metadata.
		* @param rowState - registry-global pin and archive membership.
		* @returns the reconciled order.
		*/
		function reconcileManualOrder(memberIds, savedOrder, summaries, rowState) {
			const members = new Map(memberIds.map((id) => [id, id]));
			const included = /* @__PURE__ */ new Set();
			const ordered = [];
			for (const key of savedOrder ?? []) {
				const id = members.get(key);
				if (id === void 0 || included.has(key)) continue;
				ordered.push(id);
				included.add(key);
			}
			const archived = new Set(rowState.archivedSessionIds);
			const pins = [];
			for (const sessionId of rowState.pinnedSessionIds) {
				const id = members.get(sessionId);
				if (id === void 0 || included.has(id) || archived.has(id) || summaries[id] === void 0) continue;
				pins.push(id);
				included.add(id);
			}
			const ordinary = [];
			const archives = [];
			for (const id of orderByRecency([...members.values()].filter((id) => !included.has(id)), summaries)) if (archived.has(id)) archives.push(id);
			else ordinary.push(id);
			const result = [
				...pins,
				...ordered,
				...ordinary,
				...archives
			];
			const pending = new Set(ordinary);
			const placeFork = (id) => {
				if (!pending.delete(id)) return;
				const parentId = summaries[id]?.parentId;
				if (parentId === void 0 || parentId === id || !result.includes(parentId)) return;
				placeFork(parentId);
				result.splice(result.indexOf(id), 1);
				result.splice(result.indexOf(parentId), 0, id);
			};
			for (const id of [...ordinary].reverse()) placeFork(id);
			return result;
		}
		/**
		* Apply a visible drop to the complete account order without disturbing
		* hidden members (archives, unrendered rows). A drop may only move one row
		* within its pinned block, and a blank draft is never the moved row.
		* @param order - the account's full membership in the displayed order.
		* @param rows - the rendered rows.
		* @param drag - the in-flight drag.
		* @param over - the row and half the pointer released on.
		* @returns the new full order, or undefined when the drop moves nothing.
		*/
		function sessionDragOrder(order, rows, drag, over) {
			const source = rows.find((row) => row.id === drag.sessionId);
			const target = rows.find((row) => row.id === over.id);
			if (source === void 0 || target === void 0 || source.blank || source.pinned !== drag.pinned || target.pinned !== drag.pinned || source.id === target.id || !order.includes(source.id)) return void 0;
			const section = rows.filter((row) => row.pinned === drag.pinned);
			const sourceIndex = section.findIndex((row) => row.id === source.id);
			if (section.filter((row) => row.id !== source.id).findIndex((row) => row.id === target.id) + (over.half === "after" ? 1 : 0) === sourceIndex) return void 0;
			const next = order.filter((id) => id !== source.id);
			const targetIndex = next.indexOf(target.id);
			if (targetIndex === -1) return void 0;
			next.splice(targetIndex + (over.half === "after" ? 1 : 0), 0, source.id);
			return next;
		}
		//#endregion
		//#region \0dsh-css:E:\Plugin\发布版\dsh-agent-suite\src\packages\client-ui-agents\src\client\AgentBrowser.module.css.mjs
		const css$2 = ".pyfisa_root{box-sizing:border-box;min-height:0;padding-right:var(--dsh-sidebar-inline-padding);flex-direction:column;flex:1;display:flex}.pyfisa_centered{min-height:0;color:var(--dsw-alias-label-tertiary);text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:8px;padding:16px;font-size:13px;display:flex}.pyfisa_error{color:var(--dsw-alias-danger);word-break:break-all;font-size:12px;line-height:1.4}.pyfisa_retry{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:8px;padding:6px 14px;font-size:13px}.pyfisa_selectedArea{border:1px solid var(--dsw-alias-border-default);background:var(--dsw-alias-surface-raised);border-radius:12px;flex-direction:column;flex:none;gap:6px;margin:2px 2px 8px;padding:10px 8px;display:flex}.pyfisa_selectedName{color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:600;overflow:hidden}.pyfisa_action{cursor:pointer;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);border:none;border-radius:8px;flex:1;padding:6px 8px;font-size:12px;font-weight:500}.pyfisa_action:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-active)}.pyfisa_sectionHeader{box-sizing:border-box;flex:none;align-items:center;height:36px;padding-left:4px;display:flex}.pyfisa_sectionLabel{color:var(--dsw-alias-label-tertiary);flex:none;margin-right:auto;font-size:12px;font-weight:600}.pyfisa_iconButton{border-radius:var(--dsw-radius-sm);width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;flex:none;justify-content:center;align-items:center;display:inline-flex}.pyfisa_iconButton:hover{background:var(--dsw-alias-interactive-bg-hover)}.pyfisa_headerActions{flex:none;align-items:center;gap:4px;display:flex}.pyfisa_viewOptionsMenu{min-width:200px}.pyfisa_searchSlot{box-sizing:border-box;min-width:0;max-width:28px;transition:max-width .18s var(--ds-ease-in-out);flex:1;align-items:center;margin-left:auto;display:flex}.pyfisa_searchSlotExpanded{max-width:100%}.pyfisa_search{box-sizing:border-box;border-radius:var(--dsw-radius-sm);cursor:text;width:100%;height:28px;color:var(--dsw-alias-label-secondary);transition:width .18s var(--ds-ease-in-out), padding .18s var(--ds-ease-in-out), border-color .18s var(--ds-ease-in-out), background-color .18s var(--ds-ease-in-out);background:0 0;border:none;flex:none;align-items:center;gap:0;margin:0;padding:0;display:flex;overflow:hidden}.pyfisa_searchExpanded{border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);width:calc(100% + 4px);height:30px;color:var(--dsw-alias-label-caption);background:0 0;margin-inline:-2px;padding:0 4px 0 0}.pyfisa_searchButton{border-radius:var(--dsw-radius-sm);cursor:pointer;width:28px;height:28px;color:inherit;background:0 0;border:none;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.pyfisa_searchButton:hover{background:var(--dsw-alias-interactive-bg-hover)}.pyfisa_searchExpanded .pyfisa_searchButton:hover{background:0 0}.pyfisa_searchInput{opacity:0;pointer-events:none;width:0;min-width:0;color:var(--dsw-alias-label-primary);transition:opacity .12s var(--ds-ease-in-out);background:0 0;border:none;outline:none;flex:1;font-size:13px;line-height:18px}.pyfisa_searchExpanded .pyfisa_searchInput{opacity:1;pointer-events:auto;margin-left:-2px}.pyfisa_searchInput::placeholder{color:var(--dsw-alias-label-tertiary)}.pyfisa_clearButton{border-radius:var(--dsw-radius-sm);cursor:pointer;width:22px;height:22px;color:var(--dsw-alias-label-tertiary);background:0 0;border:none;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.pyfisa_clearButton:hover{color:var(--dsw-alias-label-primary)}.pyfisa_empty{text-align:center;color:var(--dsw-alias-label-tertiary);padding:24px 12px;font-size:12px;line-height:1.6}.pyfisa_list{flex:1;min-height:0;margin:0;padding:0;list-style:none;overflow-y:auto}.pyfisa_row{box-sizing:border-box;cursor:pointer;text-align:left;background:0 0;border:none;border-radius:10px;flex-direction:column;align-items:flex-start;gap:2px;width:100%;padding:8px 10px;display:flex}.pyfisa_row:hover{background:var(--dsw-alias-interactive-bg-hover)}.pyfisa_rowName{color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap;max-width:100%;font-size:13px;font-weight:500;overflow:hidden}.pyfisa_rowDescription{color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;max-width:100%;font-size:11px;overflow:hidden}.pyfisa_chatRow{box-sizing:border-box;border-radius:var(--dsw-radius-md);height:32px;padding:0 8px;cursor:pointer;user-select:none;color:var(--dsw-alias-label-primary);align-items:center;gap:0;padding-inline-start:calc(8px + var(--dsh-workspace-indent,0px));display:flex;position:relative}.pyfisa_chatRow:hover,.pyfisa_chatRow.pyfisa_active,.pyfisa_chatRow.pyfisa_menuOpen{background:var(--dsw-alias-interactive-bg-hover)}.pyfisa_chatSlot,.pyfisa_scheduleMark{width:16px;height:20px;color:var(--dsw-alias-label-tertiary);flex:none;justify-content:center;align-items:center;display:inline-flex}.pyfisa_chatTitle{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;margin:0 6px 0 4px;font-size:14px;line-height:20px;overflow:hidden}.pyfisa_chatTime{color:var(--dsw-alias-label-tertiary);flex:none;font-size:10px;line-height:16px}.pyfisa_chatPinIndicator{width:16px;height:20px;color:var(--dsw-alias-label-caption);flex:none;justify-content:center;align-items:center;margin-left:6px;display:inline-flex}.pyfisa_chatRowActions{flex:none;align-items:center;gap:10px;display:none}.pyfisa_chatRow:hover .pyfisa_chatRowActions,.pyfisa_chatRow.pyfisa_menuOpen .pyfisa_chatRowActions{display:inline-flex}.pyfisa_chatRow:hover .pyfisa_chatTime,.pyfisa_chatRow.pyfisa_menuOpen .pyfisa_chatTime,.pyfisa_chatRow:hover .pyfisa_chatPinIndicator,.pyfisa_chatRow.pyfisa_menuOpen .pyfisa_chatPinIndicator{display:none}@media (hover:hover){.pyfisa_chatRow:hover .pyfisa_chatTitle,.pyfisa_chatRow.pyfisa_menuOpen .pyfisa_chatTitle{text-overflow:clip}}.pyfisa_chatRowAction{border-radius:var(--dsw-radius-xs);cursor:pointer;width:16px;height:16px;color:var(--dsw-alias-label-tertiary);background:0 0;border:none;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.pyfisa_chatRowAction:hover{color:var(--dsw-alias-label-primary)}.pyfisa_chatArchived .pyfisa_chatTitle{color:var(--dsw-alias-label-caption)}.pyfisa_chatRow.pyfisa_dropBefore,.pyfisa_chatRow.pyfisa_dropAfter{z-index:1}.pyfisa_chatRow.pyfisa_dropBefore:before,.pyfisa_chatRow.pyfisa_dropAfter:after{content:\"\";background:linear-gradient(55deg, transparent calc(50% - 1px), var(--dsw-alias-state-business-primary) calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px)) 0 0 / 5px 7px no-repeat, linear-gradient(125deg, transparent calc(50% - 1px), var(--dsw-alias-state-business-primary) calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px)) 0 5px / 5px 7px no-repeat, linear-gradient(var(--dsw-alias-state-business-primary) 0 0) 4px 5px / calc(100% - 4px) 2px no-repeat;pointer-events:none;height:12px;position:absolute;left:0;right:4px}.pyfisa_chatRow.pyfisa_dropBefore:before{top:-7px}.pyfisa_chatRow.pyfisa_dropAfter:after{bottom:-7px}.pyfisa_groupSection{position:relative}.pyfisa_groupSection+.pyfisa_groupSection{margin-top:4px}.pyfisa_groupSection>*+*{margin-top:2px}.pyfisa_groupHeader{box-sizing:border-box;border-radius:var(--dsw-radius-md);cursor:pointer;user-select:none;text-align:left;width:100%;height:34px;color:var(--dsw-alias-label-primary);background:0 0;border:none;align-items:center;gap:6px;padding:0 8px;display:flex}.pyfisa_groupHeader:hover{background:var(--dsw-alias-interactive-bg-hover)}.pyfisa_groupSlot{width:16px;height:20px;color:var(--dsw-alias-label-tertiary);flex:none;justify-content:center;align-items:center;display:inline-flex}.pyfisa_groupSlotActive{color:var(--dsw-alias-state-business-primary)}.pyfisa_groupChevron{color:var(--dsw-alias-label-caption);display:none}.pyfisa_groupHeader:hover .pyfisa_groupChevron{display:inline-flex}.pyfisa_groupHeader:hover .pyfisa_groupFolder{display:none}.pyfisa_groupArrow{transition:transform .15s var(--ds-ease-in-out)}.pyfisa_groupArrowOpen{transform:rotate(90deg)}@media (prefers-reduced-motion:reduce){.pyfisa_groupArrow{transition:none}}.pyfisa_groupTitle{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;font-size:14px;line-height:20px;overflow:hidden}.pyfisa_groupSection .pyfisa_groupRows{--dsh-workspace-indent:12px}.pyfisa_groupRows{margin:0;padding:0;list-style:none}.pyfisa_groupHeader{position:relative}.pyfisa_groupHeader.pyfisa_groupDropBefore,.pyfisa_groupHeader.pyfisa_groupDropAfter{z-index:1}.pyfisa_groupHeader.pyfisa_groupDropBefore:before,.pyfisa_groupHeader.pyfisa_groupDropAfter:after{content:\"\";background:linear-gradient(55deg, transparent calc(50% - 1px), var(--dsw-alias-state-business-primary) calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px)) 0 0 / 5px 7px no-repeat, linear-gradient(125deg, transparent calc(50% - 1px), var(--dsw-alias-state-business-primary) calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px)) 0 5px / 5px 7px no-repeat, linear-gradient(var(--dsw-alias-state-business-primary) 0 0) 4px 5px / calc(100% - 4px) 2px no-repeat;pointer-events:none;height:12px;position:absolute;left:0;right:4px}.pyfisa_groupHeader.pyfisa_groupDropBefore:before{top:-7px}.pyfisa_groupHeader.pyfisa_groupDropAfter:after{bottom:-7px}.pyfisa_chatBody{flex-direction:column;flex:1;justify-content:center;min-width:0;display:flex}.pyfisa_chatBody .pyfisa_chatTitle{margin:0}.pyfisa_chatSnippet{text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;overflow:hidden}.pyfisa_searchResults{flex-direction:column;gap:2px;display:flex}.pyfisa_searchStatus{color:var(--dsw-alias-label-tertiary);padding:6px 8px;font-size:12px;line-height:16px}.pyfisa_renameInput{box-sizing:border-box;border:1px solid var(--dsw-alias-border-default);background:var(--dsw-alias-surface-default);width:100%;color:var(--dsw-alias-label-primary);border-radius:8px;outline:none;padding:8px 10px;font-size:13px}.pyfisa_renameInput:focus{border-color:var(--dsw-alias-accent)}.pyfisa_dialogError{color:var(--dsw-alias-danger);word-break:break-all;margin-top:8px;font-size:12px;line-height:1.4}.pyfisa_deleteAction{color:var(--dsw-alias-danger)!important;border-color:var(--dsw-alias-danger)!important}.pyfisa_archiveActivity{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;margin:0;padding:0 0 0 18px;font-size:12px;line-height:1.5;display:flex}.pyfisa_deleteStatus{color:var(--dsw-alias-label-tertiary);margin-top:8px;font-size:12px}.pyfisa_collapsibleTitle{cursor:pointer;color:var(--dsw-alias-label-tertiary);background:0 0;border:none;border-radius:8px;align-items:center;gap:4px;padding:4px 6px;display:flex}.pyfisa_collapsibleTitle:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.pyfisa_chevron{transition:transform .12s var(--ds-ease-in-out);font-size:10px;line-height:1}.pyfisa_chevronClosed{transform:rotate(90deg)}.pyfisa_heroGate{flex:1;justify-content:center;align-items:center;min-width:0;min-height:0;padding:0 24px;display:flex}.pyfisa_memoryView{flex-direction:column;gap:10px;padding:12px 14px;display:flex}.pyfisa_memoryHeader{align-items:center;gap:10px;display:flex}.pyfisa_backLink{color:var(--dsw-alias-accent-2);cursor:pointer;background:0 0;border:none;padding:0;font-size:12px}.pyfisa_memoryTitle{color:var(--dsw-alias-fg-1);font-size:14px;font-weight:600}.pyfisa_memoryHint{color:var(--dsw-alias-fg-3);margin:0;font-size:12px;line-height:16px}.pyfisa_memoryTextarea{resize:vertical;width:100%;min-height:220px;font-family:var(--dsw-font-mono,ui-monospace, monospace);border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-1);color:var(--dsw-alias-fg-1);border-radius:8px;padding:10px 12px;font-size:12px;line-height:18px}.pyfisa_memoryFooter{align-items:center;gap:12px;display:flex}.pyfisa_memorySaved{color:var(--dsw-alias-success,#3fb984);font-size:12px}.pyfisa_primaryAction{box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-button-elevated-fill);width:100%;height:38px;color:var(--dsw-alias-label-primary);cursor:pointer;flex:none;justify-content:center;align-items:center;gap:6px;margin:0 2px 12px;padding:8px 12px;font-size:14px;font-weight:500;line-height:22px;display:flex}.pyfisa_primaryAction:hover{background:var(--dsw-alias-button-floating-hover)}.pyfisa_primaryAction>svg{flex:none}.pyfisa_actionRows{flex-direction:column;gap:8px;display:flex}.pyfisa_actionRows .pyfisa_primaryAction{margin:0}.pyfisa_heroGateStack{width:100%;max-width:var(--dsh-composer-card-max-width);flex-direction:column;align-items:stretch;gap:12px;display:flex;overflow:visible}.pyfisa_heroGateHeadline{color:var(--dsw-alias-label-primary);flex-wrap:wrap;justify-content:center;align-items:center;gap:12px 10px;font-size:26px;font-weight:500;line-height:32px;display:flex}.pyfisa_heroGateTitleGroup{flex-wrap:wrap;justify-content:center;align-items:center;gap:4px 7px;min-width:0;display:flex}.pyfisa_heroGateBadge{border:.5px solid var(--dsw-alias-interactive-bg-hover);background:var(--dsw-alias-state-business-tertiary);color:var(--dsw-alias-label-primary-bluish);font-family:var(--ds-font-family-code);white-space:nowrap;border-radius:999px;align-self:flex-start;margin-top:2px;padding:1px 7px 0;font-size:12px;font-weight:500;line-height:18px}.pyfisa_heroGateFish{color:var(--dsw-alias-label-primary);display:block;overflow:visible}.pyfisa_createPage{box-sizing:border-box;flex-direction:column;max-width:640px;height:100%;margin:0 auto;padding:32px 24px;display:flex;overflow-y:auto}nav[class*=panelList] button:has([data-agents-panel=newchat]),nav[class*=panelList] button:has([data-agents-panel=profile]),nav[class*=panelList] button:has([data-agents-panel=memory]),body[data-agents-view=agent] nav[class*=panelList] button:has([data-agents-panel=create]){display:none}body[data-agents-view=agent] nav[class*=panelList] button:has([data-agents-panel=newchat]),body[data-agents-view=agent] nav[class*=panelList] button:has([data-agents-panel=profile]),body[data-agents-view=agent] nav[class*=panelList] button:has([data-agents-panel=memory]){display:flex}.pyfisa_brandBack{width:24px;height:24px;color:inherit;cursor:pointer;border-radius:var(--dsw-radius-md);flex:none;justify-content:center;align-items:center;display:inline-flex}.pyfisa_brandBack:hover{background:var(--dsw-alias-interactive-bg-hover)}.pyfisa_brandSwap{display:inline-flex}.pyfisa_brandRailWhale{display:none}.pyfisa_brandSwap[data-rail=true] .pyfisa_brandRailWhale{display:inline-flex}.pyfisa_brandSwap[data-rail=true] .pyfisa_brandBack{display:none}.pyfisa_brandAgentName{text-overflow:ellipsis;white-space:nowrap;min-width:0;max-width:180px;overflow:hidden}.pyfisa_brandFallbackName{letter-spacing:0;white-space:nowrap;font-size:17px}.pyfisa_brandStack{white-space:nowrap;flex-direction:column;flex:none;justify-content:center;align-items:flex-start;gap:1px;height:24px;display:inline-flex}.pyfisa_brandStackTitle{letter-spacing:0;font-size:12px;line-height:13px}.pyfisa_brandStackVersion{height:10px;color:var(--dsw-alias-label-primary-inverted);background:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);white-space:nowrap;border-radius:2px;flex:none;align-items:center;padding:0 3px;font-size:6px;font-weight:500;line-height:10px;display:inline-flex}div:has(button [data-dsh-brand]:hover)>span[role=tooltip]{display:none!important}.pyfisa_rosterCreate{box-sizing:border-box;border-radius:var(--dsw-radius-md);min-height:36px;color:var(--dsw-alias-label-primary);cursor:pointer;font:inherit;text-align:left;background:0 0;border:none;flex:none;align-items:center;gap:8px;margin:0 2px 4px;padding:7px 8px;line-height:22px;display:flex}.pyfisa_rosterCreate:hover{background:var(--dsw-alias-interactive-bg-hover)}.pyfisa_rosterCreate>svg{flex:none}.pyfisa_rosterCreateRail{justify-content:center;gap:0;width:36px;height:36px;min-height:0;margin:0;padding:0}";
		const tagId$2 = "@istarry/dsh-client-ui-agents/AgentBrowser.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@istarry/dsh-client-ui-agents";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var AgentBrowser_module_css_default = {
			"action": "pyfisa_action",
			"actionRows": "pyfisa_actionRows",
			"active": "pyfisa_active",
			"archiveActivity": "pyfisa_archiveActivity",
			"backLink": "pyfisa_backLink",
			"brandAgentName": "pyfisa_brandAgentName",
			"brandBack": "pyfisa_brandBack",
			"brandFallbackName": "pyfisa_brandFallbackName",
			"brandRailWhale": "pyfisa_brandRailWhale",
			"brandStack": "pyfisa_brandStack",
			"brandStackTitle": "pyfisa_brandStackTitle",
			"brandStackVersion": "pyfisa_brandStackVersion",
			"brandSwap": "pyfisa_brandSwap",
			"centered": "pyfisa_centered",
			"chatArchived": "pyfisa_chatArchived",
			"chatBody": "pyfisa_chatBody",
			"chatPinIndicator": "pyfisa_chatPinIndicator",
			"chatRow": "pyfisa_chatRow",
			"chatRowAction": "pyfisa_chatRowAction",
			"chatRowActions": "pyfisa_chatRowActions",
			"chatSlot": "pyfisa_chatSlot",
			"chatSnippet": "pyfisa_chatSnippet",
			"chatTime": "pyfisa_chatTime",
			"chatTitle": "pyfisa_chatTitle",
			"chevron": "pyfisa_chevron",
			"chevronClosed": "pyfisa_chevronClosed",
			"clearButton": "pyfisa_clearButton",
			"collapsibleTitle": "pyfisa_collapsibleTitle",
			"createPage": "pyfisa_createPage",
			"deleteAction": "pyfisa_deleteAction",
			"deleteStatus": "pyfisa_deleteStatus",
			"dialogError": "pyfisa_dialogError",
			"dropAfter": "pyfisa_dropAfter",
			"dropBefore": "pyfisa_dropBefore",
			"empty": "pyfisa_empty",
			"error": "pyfisa_error",
			"groupArrow": "pyfisa_groupArrow",
			"groupArrowOpen": "pyfisa_groupArrowOpen",
			"groupChevron": "pyfisa_groupChevron",
			"groupDropAfter": "pyfisa_groupDropAfter",
			"groupDropBefore": "pyfisa_groupDropBefore",
			"groupFolder": "pyfisa_groupFolder",
			"groupHeader": "pyfisa_groupHeader",
			"groupRows": "pyfisa_groupRows",
			"groupSection": "pyfisa_groupSection",
			"groupSlot": "pyfisa_groupSlot",
			"groupSlotActive": "pyfisa_groupSlotActive",
			"groupTitle": "pyfisa_groupTitle",
			"headerActions": "pyfisa_headerActions",
			"heroGate": "pyfisa_heroGate",
			"heroGateBadge": "pyfisa_heroGateBadge",
			"heroGateFish": "pyfisa_heroGateFish",
			"heroGateHeadline": "pyfisa_heroGateHeadline",
			"heroGateStack": "pyfisa_heroGateStack",
			"heroGateTitleGroup": "pyfisa_heroGateTitleGroup",
			"iconButton": "pyfisa_iconButton",
			"list": "pyfisa_list",
			"memoryFooter": "pyfisa_memoryFooter",
			"memoryHeader": "pyfisa_memoryHeader",
			"memoryHint": "pyfisa_memoryHint",
			"memorySaved": "pyfisa_memorySaved",
			"memoryTextarea": "pyfisa_memoryTextarea",
			"memoryTitle": "pyfisa_memoryTitle",
			"memoryView": "pyfisa_memoryView",
			"menuOpen": "pyfisa_menuOpen",
			"primaryAction": "pyfisa_primaryAction",
			"renameInput": "pyfisa_renameInput",
			"retry": "pyfisa_retry",
			"root": "pyfisa_root",
			"rosterCreate": "pyfisa_rosterCreate",
			"rosterCreateRail": "pyfisa_rosterCreateRail",
			"row": "pyfisa_row",
			"rowDescription": "pyfisa_rowDescription",
			"rowName": "pyfisa_rowName",
			"scheduleMark": "pyfisa_scheduleMark",
			"search": "pyfisa_search",
			"searchButton": "pyfisa_searchButton",
			"searchExpanded": "pyfisa_searchExpanded",
			"searchInput": "pyfisa_searchInput",
			"searchResults": "pyfisa_searchResults",
			"searchSlot": "pyfisa_searchSlot",
			"searchSlotExpanded": "pyfisa_searchSlotExpanded",
			"searchStatus": "pyfisa_searchStatus",
			"sectionHeader": "pyfisa_sectionHeader",
			"sectionLabel": "pyfisa_sectionLabel",
			"selectedArea": "pyfisa_selectedArea",
			"selectedName": "pyfisa_selectedName",
			"viewOptionsMenu": "pyfisa_viewOptionsMenu"
		};
		//#endregion
		//#region ../packages/client-ui-agents/src/client/AgentBrowser.tsx
		/**
		* The sidebar's agent browsing region, three surfaces:
		*
		* - roster — the default page: the primary create control over a collapsible
		*   "My Agents" list, with the bare brand hero on the right.
		* - agent — inside one agent: its name and actions (new chat / profile /
		*   memory) above its chat history (sessions composed onto that agent), with
		*   the real conversation on the right.
		* - create / edit — the identity forms.
		*
		* Registered into the shell's `sidebar.workspaces` hole at a lower priority
		* than the workspace browser, so the agent surface shadows it.
		*/
		/** One list row's class pair, so the row can stay a single element. */
		function rowClass(active) {
			return clsx(AgentBrowser_module_css_default.row, active && AgentBrowser_module_css_default.active);
		}
		/**
		* Accept the native drag at document level while a row drag is active: the
		* hovered row still owns the insertion marker, and releasing outside the list
		* must not render as a rejected drop before dragend commits that last marker.
		*/
		function useNativeDragAcceptance(active) {
			(0, react.useEffect)(() => {
				if (!active) return;
				const acceptDrag = (event) => {
					event.preventDefault();
					if (event.dataTransfer !== null) event.dataTransfer.dropEffect = "move";
				};
				const acceptDrop = (event) => {
					event.preventDefault();
				};
				document.addEventListener("dragover", acceptDrag);
				document.addEventListener("drop", acceptDrop);
				return () => {
					document.removeEventListener("dragover", acceptDrag);
					document.removeEventListener("drop", acceptDrop);
				};
			}, [active]);
		}
		/** Pointer-position half of a row (insert line above or below). */
		function rowHalf(e) {
			const rect = e.currentTarget.getBoundingClientRect();
			return e.clientY < rect.top + rect.height / 2 ? "before" : "after";
		}
		/** Localized compact row time ("刚刚"/"5分钟" in zh), the official row metric. */
		function chatTimeLabel(updatedAt, now, t) {
			const { unit, n } = (0, _deepseek_ai_dsh_client_ui_primitives.relativeTime)(updatedAt, now);
			return unit === "now" ? t("chat.time.now") : t(`chat.time.${unit}`, { n });
		}
		/**
		* Read the running harness version the host half publishes through the
		* index-injection global (see the host entry): the official badge inlines
		* the version at web-build time, which a client plugin cannot reach.
		* @returns the formatted version, or undefined when the host wrote none.
		*/
		function localBuildVersionOf() {
			try {
				const value = globalThis.__DSH_BRAND_VERSION__;
				return typeof value === "string" && value !== "" ? value : void 0;
			} catch {
				return;
			}
		}
		/**
		* The official brand whale, re-rendered from the shared primitives path.
		* @param props - square edge and an optional class hook.
		* @returns the whale svg element.
		*/
		function BrandWhale({ size, className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				className,
				width: size,
				height: size * _deepseek_ai_dsh_client_ui_primitives.FISH_LOGO_VIEWBOX.height / _deepseek_ai_dsh_client_ui_primitives.FISH_LOGO_VIEWBOX.width,
				viewBox: `0 0 ${_deepseek_ai_dsh_client_ui_primitives.FISH_LOGO_VIEWBOX.width} ${_deepseek_ai_dsh_client_ui_primitives.FISH_LOGO_VIEWBOX.height}`,
				fill: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: _deepseek_ai_dsh_client_ui_primitives.FISH_LOGO_PATH,
					fill: "currentColor"
				})
			});
		}
		/**
		* Position flags for one brand-mark mount. `data-rail` selects whale over
		* chevron inside the collapsed rail's toggle; `data-dsh-brand` arms the
		* stylesheet rule that hides the enclosing New Session tooltip while the
		* repurposed brand content is hovered — the toggle's own tooltip must
		* survive, so the flag is stripped on toggle mounts.
		* @param node - the mounted brand wrapper, or null on detach.
		*/
		function brandSiteRef(node) {
			if (node === null) return;
			const host = node.closest("button");
			const inToggle = host !== null && /toggle/i.test(host.className);
			node.dataset.rail = inToggle ? "true" : "false";
			if (inToggle) delete node.dataset.dshBrand;
			else node.dataset.dshBrand = "1";
		}
		/**
		* Whether a click inside a brand mount should be swallowed: on the
		* expanded brand yes (the wrapper button would otherwise start a session),
		* inside the collapsed rail's toggle never (the click must still expand).
		* @param event - the React mouse event on a brand mount.
		*/
		function swallowBrandClick(event) {
			const host = event.currentTarget.closest("button");
			if (host === null || !/toggle/i.test(host.className)) event.stopPropagation();
		}
		/**
		* The `sidebar.brand.mark` occupant: on an agent's surface the whale gives
		* way to the small back control (whose click is stopped from reaching the
		* brand button underneath, which starts a session). The collapsed rail's
		* toggle reuses this same slot for its resting whale, and there the chevron
		* would read as a back control while the button expands — so the occupant
		* mounts both marks and the mount-site ref picks per site: inside the
		* toggle button the whale shows, in the expanded brand the chevron shows.
		* Everywhere off the agent surface it re-renders the official whale
		* fallback, because a registered occupant disables the owner's own
		* fallback path.
		* @param props - brand-mark geometry, the agents store hook, and back.
		* @returns the whale/back mark element.
		*/
		function AgentBrandMark({ size, useAgents, back, t }) {
			const state = useAgents((snapshot) => snapshot);
			if (state.view !== "agent" || state.selected === "") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: AgentBrowser_module_css_default.brandSwap,
				ref: brandSiteRef,
				onClick: swallowBrandClick,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BrandWhale, { size })
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: AgentBrowser_module_css_default.brandSwap,
				ref: brandSiteRef,
				onClick: swallowBrandClick,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BrandWhale, {
					size,
					className: AgentBrowser_module_css_default.brandRailWhale
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: AgentBrowser_module_css_default.brandBack,
					role: "button",
					title: t("agents.back"),
					onClick: (event) => {
						event.stopPropagation();
						back();
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutlineRegular, { size: 18 })
				})]
			});
		}
		/**
		* The `sidebar.brand.name` occupant: an agent's surface names the agent,
		* the roster re-renders the official local-build badge (title plus version
		* when the build metadata is reachable).
		* @param props - the agents store hook and the sidebar locale seat.
		* @returns the brand-name content.
		*/
		function AgentBrandName({ useAgents, brandText }) {
			const state = useAgents((snapshot) => snapshot);
			if (state.view === "agent" && state.selected !== "") {
				const name = state.agents.find((agent) => agent.id === state.selected)?.name ?? state.selected;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: AgentBrowser_module_css_default.brandAgentName,
					"data-dsh-brand": "1",
					title: name,
					onClick: swallowBrandClick,
					children: name
				});
			}
			const version = localBuildVersionOf();
			if (version === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: AgentBrowser_module_css_default.brandFallbackName,
				"data-dsh-brand": "1",
				onClick: swallowBrandClick,
				children: brandText("brand.localBuild")
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: AgentBrowser_module_css_default.brandStack,
				"data-dsh-brand": "1",
				onClick: swallowBrandClick,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: AgentBrowser_module_css_default.brandStackTitle,
					children: brandText("brand.localBuild")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: AgentBrowser_module_css_default.brandStackVersion,
					children: version
				})]
			});
		}
		/**
		* Seat one nav glyph behind the marker its row is addressed by.
		*
		* The sidebar's panel list is a flat button column whose official rows above
		* the suite's (plugins, skills, scheduled tasks) differ between deployments, so
		* a row cannot be identified by position. The marker travels with the glyph —
		* the click handler dispatches on it and the stylesheet hides/show rows by it.
		* `display: contents` keeps the wrapper out of the layout: the button's own
		* flex rules still see the glyph as their direct child.
		* @param props - row marker and the glyph to seat.
		* @returns the marked glyph.
		*/
		function MarkedPanelIcon({ mark, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				"data-agents-panel": mark,
				style: { display: "contents" },
				children
			});
		}
		/**
		* Render the create-agent glyph at the size the sidebar asks for.
		* @param props - the sidebar's icon share: the requested square edge.
		* @returns the icon element.
		*/
		function CreateAgentPanelIcon({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkedPanelIcon, {
				mark: "create",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutlineRegular, { size })
			});
		}
		/**
		* Nav glyphs for the per-agent action rows (new chat / profile / memory):
		* the same icons their former sidebar-surface buttons carried.
		* @param props - the sidebar's icon share: the requested square edge.
		* @returns the icon element.
		*/
		function NewChatPanelIcon({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkedPanelIcon, {
				mark: "newchat",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconNewChatOutlineMedium, { size })
			});
		}
		function ProfilePanelIcon({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkedPanelIcon, {
				mark: "profile",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEditOutlineRegular, { size })
			});
		}
		function MemoryPanelIcon({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkedPanelIcon, {
				mark: "memory",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDatabaseOutlineRegular, { size })
			});
		}
		/**
		* The 创建 Agent page as a genuine main-area panel, so its nav row is the
		* same control as 插件/技能 — the sidebar-embedded button could never sit
		* flush with the panel rows (its host region clips everything above its
		* box). Creating closes the panel and returns to the conversation; the
		* roster reloads through the shared controller either way.
		* @param props - the agents store hook, the create action, close, locale.
		* @returns the create form page.
		*/
		function CreateAgentPage({ useAgents, create, close, t }) {
			const state = useAgents((snapshot) => snapshot);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: AgentBrowser_module_css_default.createPage,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AgentForm, {
					mode: "create",
					initial: null,
					busy: state.busy,
					error: state.error,
					t,
					onSubmit: (input) => {
						Promise.resolve(create(input)).then(() => close());
					},
					onCancel: close,
					onDelete: void 0
				})
			});
		}
		/**
		* The 助理档案 page: a bare edit form on the panel's blank page — fields
		* and save only, no chrome. Data is prefilled by the controller's profile
		* loader, which the nav row fires before selecting the panel.
		* @param props - the agents store hook, save action, locale.
		* @returns the bare profile fields page.
		*/
		function ProfileMainPage({ useAgents, saveEdit, deleteAgent, t }) {
			const state = useAgents((snapshot) => snapshot);
			const profile = state.profile;
			const [name, setName] = (0, react.useState)("");
			const [language, setLanguage] = (0, react.useState)("");
			const [description, setDescription] = (0, react.useState)("");
			const [persona, setPersona] = (0, react.useState)("");
			/** 删除需要二次确认：第一次点击变成「确认删除」，再点才真正执行。 */
			const [confirmDelete, setConfirmDelete] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				if (profile === null || profile === void 0) return;
				setName(profile.name);
				setLanguage(profile.language);
				setDescription(profile.description);
				setPersona(profile.persona);
			}, [profile]);
			const save = () => {
				if (name.trim() === "" || persona.trim() === "") return;
				saveEdit(state.selected, {
					name: name.trim(),
					language: language.trim(),
					description: description.trim(),
					persona
				});
			};
			const remove = () => {
				if (!confirmDelete) {
					setConfirmDelete(true);
					return;
				}
				setConfirmDelete(false);
				deleteAgent(state.selected);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: AgentBrowser_module_css_default.createPage,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: AgentForm_module_css_default.fields,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: AgentForm_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentForm_module_css_default.label,
								children: t("form.name")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: AgentForm_module_css_default.input,
								value: name,
								onChange: (event) => {
									setName(event.target.value);
								},
								placeholder: t("form.name.placeholder"),
								disabled: state.busy
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: AgentForm_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentForm_module_css_default.label,
								children: t("form.description")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: AgentForm_module_css_default.input,
								value: description,
								onChange: (event) => {
									setDescription(event.target.value);
								},
								placeholder: t("form.description.placeholder"),
								disabled: state.busy
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: AgentForm_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentForm_module_css_default.label,
								children: t("form.language")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: AgentForm_module_css_default.input,
								value: language,
								onChange: (event) => {
									setLanguage(event.target.value);
								},
								placeholder: t("form.language.placeholder"),
								disabled: state.busy
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: AgentForm_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentForm_module_css_default.label,
								children: t("form.persona")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
								className: AgentForm_module_css_default.textarea,
								value: persona,
								onChange: (event) => {
									setPersona(event.target.value);
								},
								placeholder: t("form.persona.placeholder"),
								disabled: state.busy
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: AgentForm_module_css_default.actions,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: AgentForm_module_css_default.delete,
									disabled: state.busy,
									onClick: remove,
									children: confirmDelete ? t("form.delete.confirm") : t("form.delete")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: AgentForm_module_css_default.actionsSpacer }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: AgentForm_module_css_default.submit,
									disabled: state.busy,
									onClick: save,
									children: t("agents.memory.save")
								})
							]
						})
					]
				})
			});
		}
		/**
		* The 助理记忆 page: a bare editor on the panel's blank page — textarea and
		* save only, no chrome. Data is prefilled by the controller's memory
		* loader, which the nav row fires before selecting the panel.
		* @param props - the agents store hook, memory actions, locale.
		* @returns the bare memory editor page.
		*/
		function MemoryMainPage({ useAgents, setMemoryText, saveMemory, t }) {
			const state = useAgents((snapshot) => snapshot);
			const saving = state.memoryState === "saving";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: AgentBrowser_module_css_default.createPage,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
					className: AgentBrowser_module_css_default.memoryTextarea,
					value: state.memoryText,
					disabled: saving,
					onChange: (event) => {
						setMemoryText(event.target.value);
					},
					spellCheck: false
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: AgentBrowser_module_css_default.memoryFooter,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: AgentBrowser_module_css_default.action,
						disabled: saving,
						onClick: () => {
							saveMemory();
						},
						children: saving ? t("agents.memory.saving") : t("agents.memory.save")
					}), state.memoryState === "saved" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: AgentBrowser_module_css_default.memorySaved,
						children: t("agents.memory.saved")
					})]
				})]
			});
		}
		/**
		* Render the agent browsing region.
		* @param props - composed slot props.
		* @returns the agent surface for the current view.
		*/
		function AgentBrowser({ useAgents, useSessions, useArchived, usePinned, useWorkspaceProjection, useView, useScheduleCatalog, viewActions, load, modeName, selectAgent, back, openCreate: _openCreate, startChat: _startChat, openSession, openProfile: _openProfile, openMemory: _openMemory, setMemoryText: _setMemoryText, saveMemory: _saveMemory, backFromMemory: _backFromMemory, toggleCollapsed, create, saveEdit: _saveEdit, remove: _remove, renameSession, archiveSession, removeSession, pinSession, unpinSession, forkSession, unarchiveSession, searchSessions, searchResultLimit, insertWorkspaceBefore, addWorkspace, wide, expandSidebar: _expandSidebar, t }) {
			const state = useAgents((snapshot) => snapshot);
			const sessionSnapshot = useSessions((snapshot) => snapshot);
			const archivedSet = new Set(useArchived((snapshot) => snapshot));
			const pinnedSet = new Set(usePinned((snapshot) => snapshot));
			const projection = useWorkspaceProjection((snapshot) => snapshot);
			const scheduleCatalog = useScheduleCatalog((snapshot) => snapshot);
			const titleByWorkspace = new Map(projection.order.map((workspace) => [workspace.id, workspace.title]));
			const view = useView((snapshot) => snapshot);
			(0, react.useEffect)(() => {
				const inside = state.selected !== "" && (state.view === "agent" || state.view === "edit" || state.view === "memory");
				document.body.dataset.agentsView = inside ? "agent" : "roster";
			}, [state.view, state.selected]);
			const [searchExpanded, setSearchExpanded] = (0, react.useState)(false);
			const [chatCollapsed, setChatCollapsed] = (0, react.useState)(false);
			const [viewMenuOpen, setViewMenuOpen] = (0, react.useState)(false);
			const [query, setQuery] = (0, react.useState)("");
			const searchInput = (0, react.useRef)(null);
			const searchRoot = (0, react.useRef)(null);
			const ownedSessions = agentSessionsOf(sessionSnapshot, state.selected, archivedSet, pinnedSet, "show");
			const agentName = state.agents.find((agent) => agent.id === state.selected)?.name ?? state.selected;
			const wsTitleOf = (sessionId) => {
				const workspaceId = projection.bySession[sessionId];
				return workspaceId === void 0 ? void 0 : titleByWorkspace.get(workspaceId);
			};
			const titleOf = (session) => {
				if (!session.blank) return session.title;
				return [
					agentName,
					wsTitleOf(session.id),
					...session.modeId === void 0 ? [] : [modeName(session.modeId)]
				].filter((part) => part !== void 0 && part !== "").join(" · ");
			};
			const trimmedQuery = query.trim();
			const [drag, setDrag] = (0, react.useState)(null);
			const dropCommitted = (0, react.useRef)(false);
			useNativeDragAcceptance(drag !== null);
			const [remoteSearch, setRemoteSearch] = (0, react.useState)({
				query: "",
				status: "idle",
				items: [],
				hasMore: false
			});
			(0, react.useEffect)(() => {
				if (trimmedQuery === "") {
					setRemoteSearch({
						query: "",
						status: "idle",
						items: [],
						hasMore: false
					});
					return;
				}
				const controller = new AbortController();
				setRemoteSearch({
					query: trimmedQuery,
					status: "loading",
					items: [],
					hasMore: false
				});
				const timer = window.setTimeout(() => {
					searchSessions(trimmedQuery, controller.signal).then((result) => {
						if (controller.signal.aborted) return;
						setRemoteSearch({
							query: trimmedQuery,
							status: "ready",
							items: result.items,
							hasMore: result.hasMore
						});
					}).catch(() => {
						if (controller.signal.aborted) return;
						setRemoteSearch({
							query: trimmedQuery,
							status: "error",
							items: [],
							hasMore: false
						});
					});
				}, 250);
				return () => {
					window.clearTimeout(timer);
					controller.abort();
				};
			}, [trimmedQuery, searchSessions]);
			const [wsDrag, setWsDrag] = (0, react.useState)(null);
			const wsDropCommitted = (0, react.useRef)(false);
			useNativeDragAcceptance(wsDrag !== null);
			(0, react.useEffect)(() => {
				const onKeyDown = (event) => {
					if (!(event.ctrlKey || event.metaKey) || !event.altKey || event.shiftKey) return;
					if (event.code === "KeyK") {
						if (searchInput.current === null) return;
						event.preventDefault();
						setSearchExpanded(true);
						searchInput.current.focus({ preventScroll: true });
					} else if (event.code === "KeyO") {
						event.preventDefault();
						addWorkspace().catch((reason) => {
							console.warn("workspace add failed:", reason);
						});
					}
				};
				document.addEventListener("keydown", onKeyDown);
				return () => {
					document.removeEventListener("keydown", onKeyDown);
				};
			}, [addWorkspace]);
			const currentSessionId = Object.values(sessionSnapshot.byId).find((session) => (session.retainedBy.mainView ?? 0) > 0)?.id;
			(0, react.useEffect)(() => {
				if (view.groupBy !== "workspace" || currentSessionId === void 0) return;
				const workspaceId = projection.bySession[currentSessionId];
				const key = workspaceId !== void 0 && projection.order.some((ws) => ws.id === workspaceId) ? `ws:${workspaceId}` : "ung";
				if (view.groupExpansion[key] !== void 0) return;
				viewActions.setGroupExpanded(key, true);
			}, [
				view.groupBy,
				view.groupExpansion,
				projection,
				currentSessionId,
				viewActions
			]);
			(0, react.useEffect)(() => {
				if (state.status !== "ready" || projection.order.length === 0) return;
				viewActions.retainAgents(state.agents.map((agent) => agent.id), projection.order.map((workspace) => workspace.id));
			}, [
				state.status,
				state.agents,
				projection,
				viewActions
			]);
			(0, react.useEffect)(() => {
				load();
			}, [load]);
			const [menuOpenId, setMenuOpenId] = (0, react.useState)(null);
			const [renameTarget, setRenameTarget] = (0, react.useState)(null);
			const [renameDraft, setRenameDraft] = (0, react.useState)("");
			const [renaming, setRenaming] = (0, react.useState)(false);
			const [renameError, setRenameError] = (0, react.useState)(null);
			const composingRef = (0, react.useRef)(false);
			const renameTrimmed = renameDraft.trim();
			const renameBlocked = renaming || renameTrimmed === "" || renameTarget === null;
			const closeRename = () => {
				if (renaming) return;
				setRenameTarget(null);
				setRenameError(null);
			};
			const confirmRename = () => {
				if (renameBlocked || renameTarget === null) return;
				setRenaming(true);
				setRenameError(null);
				renameSession(renameTarget.sessionId, renameTrimmed).then(() => {
					setRenaming(false);
					setRenameTarget(null);
				}).catch((reason) => {
					setRenaming(false);
					setRenameError(reason instanceof Error ? reason.message : String(reason));
				});
			};
			const onRename = (sessionId, currentTitle) => {
				setRenameTarget({
					sessionId,
					currentTitle
				});
				setRenameDraft(currentTitle);
				setRenameError(null);
			};
			const [deleteTarget, setDeleteTarget] = (0, react.useState)(null);
			const [deleting, setDeleting] = (0, react.useState)(false);
			const [deleteError, setDeleteError] = (0, react.useState)(null);
			const closeDelete = () => {
				if (deleting) return;
				setDeleteTarget(null);
				setDeleteError(null);
			};
			const confirmDelete = () => {
				if (deleting || deleteTarget === null) return;
				setDeleting(true);
				setDeleteError(null);
				removeSession(deleteTarget.sessionId).then((failure) => {
					setDeleting(false);
					if (failure !== void 0) {
						setDeleteError(t(failure));
						return;
					}
					setDeleteTarget(null);
				}).catch((reason) => {
					setDeleting(false);
					setDeleteError(reason instanceof Error ? reason.message : String(reason));
				});
			};
			if (state.status === "loading" || state.status === "idle") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: AgentBrowser_module_css_default.centered,
				children: t("agents.loading")
			});
			if (state.status === "error") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: AgentBrowser_module_css_default.centered,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: AgentBrowser_module_css_default.error,
					children: state.error ?? t("error.loadFailed")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: AgentBrowser_module_css_default.retry,
					onClick: () => {
						load();
					},
					children: t("agents.retry")
				})]
			});
			if (state.view === "create") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AgentForm, {
				mode: "create",
				initial: null,
				busy: state.busy,
				error: state.error,
				t,
				onSubmit: (input) => {
					create(input);
				},
				onCancel: back,
				onDelete: void 0
			});
			if ((state.view === "agent" || state.view === "edit" || state.view === "memory") && state.selected !== "") {
				const selected = state.selected;
				state.agents.find((agent) => agent.id === selected)?.name;
				const accounts = /* @__PURE__ */ new Map();
				if (view.groupBy === "workspace") {
					for (const workspace of projection.order) accounts.set(`ws:${workspace.id}`, []);
					accounts.set("ung", []);
				}
				for (const entry of ownedSessions) {
					const key = view.groupBy !== "workspace" ? "flat" : (() => {
						const workspaceId = projection.bySession[entry.id];
						return workspaceId !== void 0 && accounts.has(`ws:${workspaceId}`) ? `ws:${workspaceId}` : "ung";
					})();
					const members = accounts.get(key);
					if (members === void 0) accounts.set(key, [entry]);
					else members.push(entry);
				}
				const fullKey = (account) => accountKeyOf(selected, account);
				const rowState = {
					pinnedSessionIds: [...pinnedSet],
					archivedSessionIds: [...archivedSet]
				};
				const orderedIdsOf = (account) => {
					const members = accounts.get(account) ?? [];
					if (view.orderBy === "updated") return members.map((entry) => entry.id);
					return reconcileManualOrder(members.map((entry) => entry.id), view.sessionOrderByAccount[fullKey(account)], sessionSnapshot.byId, rowState);
				};
				const visibleOf = (entry) => {
					if (view.archivedFilter === "show") return true;
					return view.archivedFilter === "only" ? archivedSet.has(entry.id) : !archivedSet.has(entry.id);
				};
				const rowsOf = (account) => {
					const byId = new Map((accounts.get(account) ?? []).map((entry) => [entry.id, entry]));
					return orderedIdsOf(account).flatMap((id) => {
						const entry = byId.get(id);
						return entry !== void 0 && visibleOf(entry) ? [entry] : [];
					});
				};
				const searchQ = trimmedQuery.toLowerCase();
				const searchView = (() => {
					if (trimmedQuery === "") return null;
					const merged = [];
					const seen = /* @__PURE__ */ new Set();
					for (const entry of ownedSessions) {
						if (entry.blank || !visibleOf(entry)) continue;
						if (titleOf(entry).toLowerCase().includes(searchQ) || (wsTitleOf(entry.id) ?? "").toLowerCase().includes(searchQ)) {
							merged.push({ entry });
							seen.add(entry.id);
						}
					}
					for (const item of remoteSearch.items) {
						if (seen.has(item.sessionId)) continue;
						const entry = ownedSessions.find((candidate) => candidate.id === item.sessionId);
						if (entry === void 0 || entry.blank || !visibleOf(entry)) continue;
						merged.push({
							entry,
							snippet: item.snippet
						});
						seen.add(item.sessionId);
					}
					return {
						rows: merged.slice(0, searchResultLimit),
						hasMore: remoteSearch.hasMore || merged.length > searchResultLimit,
						pending: remoteSearch.query !== trimmedQuery || remoteSearch.status === "loading"
					};
				})();
				const initialOrders = () => Object.fromEntries([...accounts.keys()].map((account) => [fullKey(account), orderedIdsOf(account)]));
				const currentAccount = view.groupBy !== "workspace" || currentSessionId === void 0 ? void 0 : (() => {
					const workspaceId = projection.bySession[currentSessionId];
					return workspaceId !== void 0 && accounts.has(`ws:${workspaceId}`) ? `ws:${workspaceId}` : "ung";
				})();
				const sections = view.groupBy === "workspace" ? [...projection.order.map((workspace) => ({
					key: `ws:${workspace.id}`,
					label: workspace.title,
					active: `ws:${workspace.id}` === currentAccount,
					rows: rowsOf(`ws:${workspace.id}`)
				})).filter((section) => section.rows.length > 0), ...rowsOf("ung").length > 0 ? [{
					key: "ung",
					label: t("chat.group.ungrouped"),
					active: currentAccount === "ung",
					rows: rowsOf("ung")
				}] : []] : [{
					key: "flat",
					label: "",
					active: false,
					rows: rowsOf("flat")
				}];
				const commitDrag = (activeDrag, over) => {
					if (dropCommitted.current) return;
					dropCommitted.current = true;
					setDrag(null);
					if (over.id === activeDrag.sessionId) return;
					const dragRows = rowsOf(activeDrag.account).map((entry) => ({
						id: entry.id,
						blank: entry.blank,
						pinned: pinnedSet.has(entry.id)
					}));
					const next = sessionDragOrder((accounts.get(activeDrag.account) ?? []).map((entry) => entry.id), dragRows, activeDrag, over);
					if (next !== void 0) viewActions.setSessionOrder(fullKey(activeDrag.account), next, initialOrders());
				};
				const commitWorkspaceDrag = (activeDrag, over) => {
					if (wsDropCommitted.current) return;
					wsDropCommitted.current = true;
					setWsDrag(null);
					const order = projection.order.map((workspace) => workspace.id);
					const rowIndex = order.indexOf(over.id);
					if (rowIndex === -1) return;
					const anchor = over.half === "before" ? over.id : order[rowIndex + 1];
					if (anchor === activeDrag.workspaceId) return;
					const sourceIndex = order.indexOf(activeDrag.workspaceId);
					const anchorIndex = anchor === void 0 ? order.length : order.indexOf(anchor);
					if (sourceIndex === -1 || anchorIndex === sourceIndex || anchorIndex === sourceIndex + 1) return;
					insertWorkspaceBefore(activeDrag.workspaceId, anchor).catch((reason) => {
						console.warn("workspace reorder rejected:", reason);
					});
				};
				const renderChatRow = (session, account, snippet) => {
					const isArchived = archivedSet.has(session.id);
					const isPinned = pinnedSet.has(session.id);
					const draggable = trimmedQuery === "" && !session.blank && !isArchived;
					const compatible = drag !== null && drag.account === account && drag.pinned === isPinned;
					const normalizeHalf = (half) => session.blank ? "after" : half;
					const marker = compatible && drag?.over?.id === session.id ? drag.over.half : null;
					return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						role: "treeitem",
						"aria-selected": session.current,
						className: clsx(AgentBrowser_module_css_default.chatRow, session.current && AgentBrowser_module_css_default.active, menuOpenId === session.id && AgentBrowser_module_css_default.menuOpen, isArchived && AgentBrowser_module_css_default.chatArchived, marker === "before" && AgentBrowser_module_css_default.dropBefore, marker === "after" && AgentBrowser_module_css_default.dropAfter),
						onClick: () => {
							openSession(session.id);
						},
						draggable,
						onDragStart: !draggable ? void 0 : (e) => {
							e.dataTransfer.effectAllowed = "move";
							e.dataTransfer.setData("text/plain", session.id);
							dropCommitted.current = false;
							setDrag({
								account,
								sessionId: session.id,
								pinned: isPinned,
								over: null
							});
						},
						onDragEnd: !draggable ? void 0 : () => {
							if (drag?.over !== null && drag?.over !== void 0) commitDrag(drag, drag.over);
							else setDrag(null);
							dropCommitted.current = false;
						},
						onDragOver: !compatible ? void 0 : (e) => {
							e.preventDefault();
							e.dataTransfer.dropEffect = "move";
							const half = normalizeHalf(rowHalf(e));
							setDrag((current) => current === null ? current : {
								...current,
								over: {
									id: session.id,
									half
								}
							});
						},
						onDrop: !compatible ? void 0 : (e) => {
							e.preventDefault();
							if (drag !== null) commitDrag(drag, {
								id: session.id,
								half: normalizeHalf(rowHalf(e))
							});
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentBrowser_module_css_default.chatSlot,
								children: !session.blank && !isArchived && scheduleCatalog.settled && scheduleCatalog.records.some((record) => record.sessionId === session.id && record.status === "active") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: AgentBrowser_module_css_default.scheduleMark,
									"data-session-schedule-mark": "",
									title: t("chat.schedule.mark"),
									onClick: (e) => {
										e.stopPropagation();
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconClockOutlineRegular, { size: 12 })
								})
							}),
							snippet === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentBrowser_module_css_default.chatTitle,
								children: titleOf(session)
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: AgentBrowser_module_css_default.chatBody,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: AgentBrowser_module_css_default.chatTitle,
									children: titleOf(session)
								}), snippet !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: AgentBrowser_module_css_default.chatSnippet,
									children: snippet
								})]
							}),
							!session.blank && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentBrowser_module_css_default.chatTime,
								children: chatTimeLabel(session.updatedAt, Date.now(), t)
							}),
							isPinned && !isArchived && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentBrowser_module_css_default.chatPinIndicator,
								role: "img",
								"aria-label": t("chat.actions.pin"),
								title: t("chat.actions.pin"),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPinFillRegular, { size: 14 })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: AgentBrowser_module_css_default.chatRowActions,
								onClick: (e) => {
									e.stopPropagation();
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
										open: menuOpenId === session.id,
										onClose: () => {
											setMenuOpenId(null);
										},
										items: [
											...isArchived ? [] : [{
												id: "pin",
												label: t(isPinned ? "chat.menu.unpinSession" : "chat.menu.pinSession"),
												icon: isPinned ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPinFillRegular, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPinOutlineRegular, {})
											}],
											{
												id: "rename",
												label: t("chat.menu.rename"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEditOutlineRegular, {}),
												shortcut: {
													keys: [
														"Ctrl",
														"Shift",
														"R"
													],
													aria: "Control+Shift+R"
												}
											},
											{
												id: "fork",
												label: t("chat.menu.fork"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconBranchOutlineRegular, {}),
												shortcut: {
													keys: [
														"Ctrl",
														"Shift",
														"F"
													],
													aria: "Control+Shift+F"
												}
											},
											{
												id: isArchived ? "unarchive" : "archive",
												label: t(isArchived ? "chat.menu.unarchive" : "chat.menu.archive"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconArchiveOutlineRegular, {}),
												...isArchived ? {} : { shortcut: {
													keys: [
														"Ctrl",
														"Alt",
														"A"
													],
													aria: "Control+Alt+A"
												} }
											},
											{
												type: "separator",
												id: "danger-separator"
											},
											{
												id: "delete",
												label: t("chat.menu.delete"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTrashOutlineRegular, {})
											}
										],
										onSelect: (id) => {
											setMenuOpenId(null);
											if (id === "pin") (isPinned ? unpinSession : pinSession)(session.id).catch((reason) => {
												console.warn("session pin rejected:", reason);
											});
											if (id === "rename") onRename(session.id, titleOf(session));
											if (id === "fork") forkSession(session.id).catch((reason) => {
												console.warn("session fork rejected:", reason);
											});
											if (id === "archive") archiveSession(session.id).catch((reason) => {
												console.warn("session archive rejected:", reason);
											});
											if (id === "unarchive") unarchiveSession(session.id).catch((reason) => {
												console.warn("session unarchive rejected:", reason);
											});
											if (id === "delete") {
												setDeleteTarget({
													sessionId: session.id,
													title: session.title
												});
												setDeleteError(null);
											}
										},
										portal: true,
										closeOnPointerLeave: true,
										anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: AgentBrowser_module_css_default.chatRowAction,
											"aria-label": t("chat.menu.rename"),
											onClick: (e) => {
												e.stopPropagation();
												setMenuOpenId((v) => v === session.id ? null : session.id);
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutlineMedium, {})
										})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: AgentBrowser_module_css_default.chatRowAction,
										"aria-label": t(isArchived ? "chat.actions.unarchive" : "chat.actions.archive"),
										onClick: (e) => {
											e.stopPropagation();
											(isArchived ? unarchiveSession : archiveSession)(session.id).catch((reason) => {
												console.warn("session archive toggle rejected:", reason);
											});
										},
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconArchiveOutlineRegular, { size: 14 })
									}),
									!isArchived && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: AgentBrowser_module_css_default.chatRowAction,
										"aria-label": t(isPinned ? "chat.actions.unpin" : "chat.actions.pin"),
										onClick: (e) => {
											e.stopPropagation();
											(isPinned ? unpinSession : pinSession)(session.id).catch((reason) => {
												console.warn("session pin rejected:", reason);
											});
										},
										children: isPinned ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPinFillRegular, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPinOutlineRegular, { size: 14 })
									})
								]
							})
						]
					});
				};
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: AgentBrowser_module_css_default.root,
					children: [
						state.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: AgentBrowser_module_css_default.error,
							role: "alert",
							children: t(state.error)
						}),
						wide && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: AgentBrowser_module_css_default.sectionHeader,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: AgentBrowser_module_css_default.collapsibleTitle,
									onClick: () => {
										setChatCollapsed((v) => !v);
									},
									"aria-expanded": !chatCollapsed,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: clsx(AgentBrowser_module_css_default.chevron, chatCollapsed && AgentBrowser_module_css_default.chevronClosed),
										children: "▸"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: AgentBrowser_module_css_default.sectionLabel,
										children: t("agents.chatHistory")
									})]
								}),
								!chatCollapsed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: clsx(AgentBrowser_module_css_default.searchSlot, searchExpanded && AgentBrowser_module_css_default.searchSlotExpanded),
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										ref: searchRoot,
										className: clsx(AgentBrowser_module_css_default.search, searchExpanded && AgentBrowser_module_css_default.searchExpanded),
										onClick: () => {
											setSearchExpanded(true);
											searchInput.current?.focus();
										},
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
												label: t("chat.search"),
												side: "bottom",
												delayMs: 500,
												disabled: searchExpanded,
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													className: AgentBrowser_module_css_default.searchButton,
													"aria-label": t("chat.search"),
													"aria-expanded": searchExpanded,
													onClick: (e) => {
														e.stopPropagation();
														setSearchExpanded(true);
														searchInput.current?.focus();
													},
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutlineRegular, { size: searchExpanded ? 11 : 14 })
												})
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												ref: searchInput,
												className: AgentBrowser_module_css_default.searchInput,
												type: "text",
												placeholder: t("chat.search.placeholder"),
												value: query,
												tabIndex: searchExpanded ? 0 : -1,
												onChange: (e) => {
													setQuery(e.target.value);
												},
												onKeyDown: (e) => {
													if (e.key !== "Escape") return;
													setQuery("");
													setSearchExpanded(false);
												}
											}),
											searchExpanded && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: AgentBrowser_module_css_default.clearButton,
												"aria-label": t("chat.search.clear"),
												onClick: (e) => {
													e.stopPropagation();
													setQuery("");
													setSearchExpanded(false);
												},
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseFillRegular, {})
											})
										]
									})
								}),
								!chatCollapsed && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: AgentBrowser_module_css_default.headerActions,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
										open: viewMenuOpen,
										onClose: () => {
											setViewMenuOpen(false);
										},
										items: [
											{
												type: "label",
												id: "group-by",
												text: t("chat.groupBy.label")
											},
											{
												id: "workspace",
												label: t("chat.groupBy.workspace"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFolderCloseRegular, {})
											},
											{
												id: "flat",
												label: t("chat.groupBy.flat"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFlatListOutlineRegular, {})
											},
											{
												type: "separator",
												id: "order-by-separator"
											},
											{
												type: "label",
												id: "order-by",
												text: t("chat.orderBy.label")
											},
											{
												id: "manual",
												label: t("chat.orderBy.manual"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronsUpDownOutlineRegular, {})
											},
											{
												id: "updated",
												label: t("chat.orderBy.updated"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconClockOutlineRegular, {})
											},
											{
												type: "separator",
												id: "archived-filter-separator"
											},
											{
												type: "label",
												id: "filter-by",
												text: t("chat.filterBy.label")
											},
											{
												id: "hide-archived",
												label: t("chat.viewOptions.hideArchived"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconArchiveOffOutlineRegular, {})
											},
											{
												id: "show-archived",
												label: t("chat.viewOptions.showArchived"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconQueueOutlineRegular, {})
											},
											{
												id: "only-archived",
												label: t("chat.viewOptions.onlyArchived"),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconArchiveCheckOutlineRegular, {})
											}
										],
										selectedIds: [
											view.groupBy,
											view.orderBy,
											{
												default: "hide-archived",
												show: "show-archived",
												only: "only-archived"
											}[view.archivedFilter]
										],
										onSelect: (id) => {
											if (id === "workspace" || id === "flat") viewActions.setGroupBy(id);
											else if (id === "manual" || id === "updated") viewActions.setOrderBy(id, initialOrders());
											else if (id === "hide-archived") viewActions.setArchivedFilter("default");
											else if (id === "show-archived") viewActions.setArchivedFilter("show");
											else if (id === "only-archived") viewActions.setArchivedFilter("only");
											setViewMenuOpen(false);
										},
										align: "end",
										dense: true,
										portal: true,
										listClassName: AgentBrowser_module_css_default.viewOptionsMenu,
										anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
											label: t("chat.viewOptions.label"),
											side: "bottom",
											delayMs: 500,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: AgentBrowser_module_css_default.iconButton,
												"aria-label": t("chat.viewOptions.label"),
												onClick: () => {
													setViewMenuOpen((v) => !v);
												},
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSlidersTwoOutlineRegular, {})
											})
										})
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
										label: t("chat.workspace.add"),
										side: "bottom",
										delayMs: 500,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: AgentBrowser_module_css_default.iconButton,
											"aria-label": t("chat.workspace.add"),
											onClick: () => {
												addWorkspace().catch((reason) => {
													console.warn("workspace add failed:", reason);
												});
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconProjectAddOutlineRegular, { size: 16 })
										})
									})]
								})
							]
						}),
						chatCollapsed || !wide ? void 0 : searchView !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: AgentBrowser_module_css_default.searchResults,
							role: "tree",
							"aria-label": t("chat.search"),
							children: [
								searchView.rows.map(({ entry, snippet }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: renderChatRow(entry, "flat", snippet) }, entry.id)),
								searchView.pending && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: AgentBrowser_module_css_default.searchStatus,
									role: "status",
									children: t("search.pending")
								}),
								!searchView.pending && searchView.rows.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: AgentBrowser_module_css_default.empty,
									children: t("search.noMatches")
								}),
								searchView.hasMore && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: AgentBrowser_module_css_default.searchStatus,
									children: t("search.hasMore", { n: searchResultLimit })
								})
							]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [sections.every((section) => section.rows.length === 0) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: AgentBrowser_module_css_default.empty,
							children: t(view.archivedFilter === "only" ? "chat.search.empty" : "agents.chatHistory.empty")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
							className: AgentBrowser_module_css_default.list,
							children: sections.map((section) => {
								const expanded = section.label === "" || (view.groupExpansion[section.key] ?? false);
								const workspaceId = section.key.startsWith("ws:") ? section.key.slice(3) : void 0;
								const wsCompatible = wsDrag !== null && workspaceId !== void 0 && wsDrag.workspaceId !== workspaceId;
								const wsMarker = workspaceId !== void 0 && wsDrag?.over?.id === workspaceId ? wsDrag.over.half : null;
								return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
									className: section.label === "" ? void 0 : AgentBrowser_module_css_default.groupSection,
									children: [section.label !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: clsx(AgentBrowser_module_css_default.groupHeader, wsMarker === "before" && AgentBrowser_module_css_default.groupDropBefore, wsMarker === "after" && AgentBrowser_module_css_default.groupDropAfter),
										"aria-expanded": expanded,
										draggable: workspaceId !== void 0 && trimmedQuery === "",
										onDragStart: workspaceId === void 0 ? void 0 : (e) => {
											e.dataTransfer.effectAllowed = "move";
											e.dataTransfer.setData("text/plain", workspaceId);
											wsDropCommitted.current = false;
											setWsDrag({
												workspaceId,
												over: null
											});
										},
										onDragEnd: workspaceId === void 0 ? void 0 : () => {
											if (wsDrag?.over !== null && wsDrag?.over !== void 0) commitWorkspaceDrag(wsDrag, wsDrag.over);
											else setWsDrag(null);
											wsDropCommitted.current = false;
										},
										onDragOver: !wsCompatible ? void 0 : (e) => {
											e.preventDefault();
											e.dataTransfer.dropEffect = "move";
											const half = rowHalf(e);
											setWsDrag((current) => current === null ? current : {
												...current,
												over: {
													id: workspaceId,
													half
												}
											});
										},
										onDrop: !wsCompatible ? void 0 : (e) => {
											e.preventDefault();
											if (wsDrag !== null) commitWorkspaceDrag(wsDrag, {
												id: workspaceId,
												half: rowHalf(e)
											});
										},
										onClick: () => {
											viewActions.setGroupExpanded(section.key, !expanded);
										},
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: clsx(AgentBrowser_module_css_default.groupSlot, section.active && AgentBrowser_module_css_default.groupSlotActive),
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: AgentBrowser_module_css_default.groupFolder,
												children: expanded ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFolderOpenRegular, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFolderCloseRegular, {})
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: AgentBrowser_module_css_default.groupChevron,
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTriangleRightFillRegular, { className: clsx(AgentBrowser_module_css_default.groupArrow, expanded && AgentBrowser_module_css_default.groupArrowOpen) })
											})]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: AgentBrowser_module_css_default.groupTitle,
											children: section.label
										})]
									}), expanded && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
										className: AgentBrowser_module_css_default.groupRows,
										children: section.rows.map((session) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: renderChatRow(session, section.key) }, session.id))
									})]
								}, section.key);
							})
						})] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
							open: renameTarget !== null,
							onClose: closeRename,
							closeLabel: t("close"),
							title: t("chat.rename.title"),
							footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								disabled: renaming,
								onClick: closeRename,
								children: t("cancel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "primary",
								disabled: renameBlocked,
								onClick: confirmRename,
								children: t("chat.menu.rename")
							})] }),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: AgentBrowser_module_css_default.renameInput,
								value: renameDraft,
								"aria-label": t("chat.rename.field"),
								autoFocus: true,
								disabled: renaming,
								onFocus: (e) => {
									e.target.select();
								},
								onChange: (e) => {
									setRenameDraft(e.target.value);
									setRenameError(null);
								},
								onCompositionStart: () => {
									composingRef.current = true;
								},
								onCompositionEnd: () => {
									composingRef.current = false;
								},
								onKeyDown: (e) => {
									if (e.key === "Enter" && !composingRef.current) {
										e.preventDefault();
										confirmRename();
									}
								}
							}), renameError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: AgentBrowser_module_css_default.dialogError,
								role: "alert",
								children: renameError
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
							open: deleteTarget !== null,
							onClose: closeDelete,
							closeLabel: t("close"),
							title: t("chat.delete.title"),
							...deleteTarget === null ? {} : { description: t("chat.delete.desc") },
							footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								disabled: deleting,
								onClick: closeDelete,
								children: t("cancel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								className: AgentBrowser_module_css_default.deleteAction,
								disabled: deleting,
								onClick: confirmDelete,
								children: t("chat.delete.confirm")
							})] }),
							children: deleteError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: AgentBrowser_module_css_default.dialogError,
								role: "alert",
								children: deleteError
							})
						})
					]
				});
			}
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: AgentBrowser_module_css_default.root,
				children: [
					wide && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: AgentBrowser_module_css_default.sectionHeader,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: AgentBrowser_module_css_default.collapsibleTitle,
							onClick: toggleCollapsed,
							"aria-expanded": !state.collapsed,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: clsx(AgentBrowser_module_css_default.chevron, state.collapsed && AgentBrowser_module_css_default.chevronClosed),
								children: "▸"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentBrowser_module_css_default.sectionLabel,
								children: t("agents.title")
							})]
						})
					}),
					wide && state.agents.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: AgentBrowser_module_css_default.empty,
						children: t("agents.empty")
					}),
					wide && !state.collapsed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: AgentBrowser_module_css_default.list,
						children: state.agents.map((agent) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: rowClass(agent.id === state.selected),
							onClick: () => {
								selectAgent(agent.id);
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentBrowser_module_css_default.rowName,
								children: agent.name
							}), agent.description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentBrowser_module_css_default.rowDescription,
								children: agent.description
							})]
						}) }, agent.id))
					})
				]
			});
		}
		//#endregion
		//#region ../packages/client-ui-agents/src/client/ArchiveSurfaces.tsx
		/**
		* The `shell.overlay` entries for the agent browser's archive flow: the
		* stop-and-archive confirmation dialog and the row-action toast. They live in
		* the frame-wide layer so they outlive the row menu that raised them (and the
		* sidebar collapse that may follow). The pending request and the notice on
		* display are plugin stores written by the archive wrapper in apply().
		*/
		/**
		* The `shell.overlay` entry: nothing while no confirmation is pending,
		* otherwise one dialog per request (keyed by the session). Confirming asks
		* the Host to stop the listed work and archive; cancelling leaves the
		* session running and visible.
		*/
		function ArchiveConfirmDialog({ useRequest, settle, stopAndArchive, t }) {
			const request = useRequest((pending) => pending);
			if (request === null) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ArchiveConfirmForm, {
				request,
				stopAndArchive,
				onSettle: settle,
				t
			}, request.sessionId);
		}
		/** One request's dialog: in-flight and error state die with it. */
		function ArchiveConfirmForm({ request, stopAndArchive, onSettle, t }) {
			const [archiving, setArchiving] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const close = () => {
				if (archiving) return;
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
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose: close,
				closeLabel: t("close"),
				title: t("archive.confirm.title"),
				description: t("archive.confirm.desc", { title: request.displayTitle }),
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "outline",
					disabled: archiving,
					onClick: close,
					children: t("cancel")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "outline",
					className: AgentBrowser_module_css_default.deleteAction,
					disabled: archiving,
					onClick: confirm,
					children: t("archive.confirm.action")
				})] }),
				children: [
					request.activity.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: AgentBrowser_module_css_default.archiveActivity,
						"aria-label": t("archive.confirm.activity"),
						children: request.activity.map((entry, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: activityLine(entry, t) }, `${entry.kind}-${String(index)}`))
					}),
					archiving && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: AgentBrowser_module_css_default.deleteStatus,
						role: "status",
						children: t("archive.confirm.pending")
					}),
					error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: AgentBrowser_module_css_default.dialogError,
						role: "alert",
						children: error
					})
				]
			});
		}
		/**
		* One family's line: its count and the items' labels (ids when a family
		* carries no label). A family this dictionary does not know falls through to
		* the generic line.
		*/
		function activityLine(entry, t) {
			const items = entry.items ?? [];
			const n = items.length;
			const names = items.map((item) => item.label ?? item.id).join(t("archive.confirm.listSeparator"));
			switch (entry.kind) {
				case "turn": return t("archive.confirm.turn");
				case "subagent": return t("archive.confirm.subagents", {
					n,
					names
				});
				case "job": return t("archive.confirm.jobs", {
					n,
					names
				});
				case "schedule": return t("archive.confirm.schedules", {
					n,
					names
				});
				default: return t("archive.confirm.other", {
					kind: entry.kind,
					n
				});
			}
		}
		/** Hold for the actionable archived notice: two buttons to react to. */
		const LONG_TOAST_HOLD_MS = 6e3;
		/**
		* Render the current notice: the archived and stopped-and-archived notices
		* with their undo action — plus the show-archived action while archived rows
		* are hidden — on a 6 s hold.
		*/
		function RowActionToast({ useToast, useView, dismiss, undoArchive, showArchived, t }) {
			const toast = useToast((current) => current);
			const view = useView((state) => state);
			if (toast === null) return null;
			const archivedRowsHidden = (view.archivedFilter ?? "default") === "default";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Toast, {
				text: t(toast.kind === "archived" ? "toast.archived" : "toast.stoppedAndArchived"),
				tone: "success",
				holdMs: LONG_TOAST_HOLD_MS,
				actions: [{
					label: t("toast.undo"),
					onClick: () => {
						dismiss();
						undoArchive(toast.sessionId);
					}
				}, ...archivedRowsHidden ? [{
					prefix: t("toast.or"),
					label: t("toast.showArchived"),
					onClick: () => {
						dismiss();
						showArchived();
					}
				}] : []],
				onDone: dismiss
			}, `toast-${toast.sessionId}`);
		}
		//#endregion
		//#region \0dsh-css:E:\Plugin\发布版\dsh-agent-suite\src\packages\client-ui-agents\src\client\hero.module.css.mjs
		const css$1 = ".ViqMTa_seat{color:inherit;cursor:pointer;background:0 0;border:none;border-radius:8px;align-items:center;gap:6px;padding:4px 6px;display:inline-flex}.ViqMTa_seat:hover{background:var(--dsh-hover,#8080801f)}.ViqMTa_seat:disabled{opacity:.5;cursor:default}.ViqMTa_seatIcon{opacity:.8}.ViqMTa_seatLabel{white-space:nowrap;font-size:12px}.ViqMTa_chevron{opacity:.55}.ViqMTa_menuAnchor{display:inline-flex}.ViqMTa_item{flex-direction:column;gap:2px;max-width:320px;display:flex}.ViqMTa_itemName{font-size:13px}.ViqMTa_itemDesc{opacity:.65;font-size:12px}.ViqMTa_defineBody{flex-direction:column;gap:12px;display:flex}.ViqMTa_defineIntro{margin:0;font-size:13px;line-height:1.5}.ViqMTa_defineError{color:var(--dsh-danger,#d33);font-size:12px}.ViqMTa_defineField{flex-direction:column;gap:4px;display:flex}.ViqMTa_defineLabel{opacity:.75;font-size:12px}.ViqMTa_defineTextarea{resize:vertical;width:100%;font-family:inherit;font-size:13px;line-height:1.5}.ViqMTa_defineGroups{flex-direction:column;gap:6px;display:flex}";
		const tagId$1 = "@istarry/dsh-client-ui-agents/hero.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@istarry/dsh-client-ui-agents";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var hero_module_css_default = {
			"chevron": "ViqMTa_chevron",
			"defineBody": "ViqMTa_defineBody",
			"defineError": "ViqMTa_defineError",
			"defineField": "ViqMTa_defineField",
			"defineGroups": "ViqMTa_defineGroups",
			"defineIntro": "ViqMTa_defineIntro",
			"defineLabel": "ViqMTa_defineLabel",
			"defineTextarea": "ViqMTa_defineTextarea",
			"item": "ViqMTa_item",
			"itemDesc": "ViqMTa_itemDesc",
			"itemName": "ViqMTa_itemName",
			"menuAnchor": "ViqMTa_menuAnchor",
			"seat": "ViqMTa_seat",
			"seatIcon": "ViqMTa_seatIcon",
			"seatLabel": "ViqMTa_seatLabel"
		};
		//#endregion
		//#region ../packages/client-ui-agents/src/client/hero.tsx
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
		/** Duration of a selection-refusal banner. */
		const REFUSAL_HOLD_MS = 8e3;
		/**
		* Render the mode chip for the current session.
		* @param props - runtime share, injected face, and localized copy.
		* @returns the chip, or null when no session is current.
		*/
		function HeroChip({ sessionId, load, select, defineTarget, loadDefine, suggestDefine, composeDefine, useHeroSeat, useHeroDefine, t }) {
			const state = useHeroSeat((snapshot) => snapshot);
			const define = useHeroDefine((snapshot) => snapshot);
			const [open, setOpen] = (0, react.useState)(false);
			const [defineOpen, setDefineOpen] = (0, react.useState)(false);
			const [description, setDescription] = (0, react.useState)("");
			const [checked, setChecked] = (0, react.useState)([]);
			const [checksTouched, setChecksTouched] = (0, react.useState)(false);
			const toastSeq = (0, react.useRef)(0);
			const [toast, setToast] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				load(sessionId);
			}, [load, sessionId]);
			(0, react.useEffect)(() => {
				if (!defineOpen) return;
				loadDefine();
			}, [defineOpen, loadDefine]);
			(0, react.useEffect)(() => {
				if (!defineOpen || checksTouched) return;
				setChecked(define.groups.filter((group) => group.defaultOn).map((group) => group.id));
			}, [
				define.groups,
				defineOpen,
				checksTouched
			]);
			const toggle = (id, on) => {
				setChecksTouched(true);
				setChecked((current) => on ? [...current, id] : current.filter((candidate) => candidate !== id));
			};
			if (sessionId === void 0) return null;
			const confirmDefine = () => {
				const agent = defineTarget(sessionId);
				if (agent === "") {
					setDefineOpen(false);
					return;
				}
				composeDefine(agent, checked).then((combinedId) => {
					if (combinedId === "") return;
					setDefineOpen(false);
					setDescription("");
					setChecksTouched(false);
					select(sessionId, combinedId);
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
					open,
					onClose: () => {
						setOpen(false);
					},
					items: [...state.options.map((option) => ({
						id: option.id,
						label: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: hero_module_css_default.item,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: hero_module_css_default.itemName,
								children: option.name
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: hero_module_css_default.itemDesc,
								children: option.description
							})]
						})
					})), {
						id: "__define__",
						label: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: hero_module_css_default.item,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: hero_module_css_default.itemName,
								children: t("seat.define")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: hero_module_css_default.itemDesc,
								children: t("seat.define.menuDesc")
							})]
						})
					}],
					selectedId: state.current,
					onSelect: (id) => {
						setOpen(false);
						if (id === "__define__") {
							setDefineOpen(true);
							return;
						}
						select(sessionId, id).then((refusal) => {
							if (refusal === void 0) return;
							toastSeq.current += 1;
							setToast({
								seq: toastSeq.current,
								text: refusal
							});
						});
					},
					align: "start",
					portal: true,
					className: hero_module_css_default.menuAnchor,
					anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: hero_module_css_default.seat,
						"aria-haspopup": "menu",
						"aria-expanded": open,
						title: t("seat.hint"),
						disabled: state.busy,
						onClick: () => {
							setOpen((value) => !value);
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconAgentPresetOutlineRegular, { className: hero_module_css_default.seatIcon }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: hero_module_css_default.seatLabel,
								children: state.options.find((option) => option.id === state.current)?.name ?? state.current
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { className: hero_module_css_default.chevron })
						]
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
					open: defineOpen,
					onClose: () => {
						setDefineOpen(false);
					},
					closeLabel: t("cancel"),
					title: t("seat.define.title"),
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						disabled: define.busy,
						onClick: () => {
							setDefineOpen(false);
						},
						children: t("cancel")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "primary",
						disabled: define.busy || checked.length === 0,
						onClick: confirmDefine,
						children: t("seat.define.confirm")
					})] }),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: hero_module_css_default.defineBody,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: hero_module_css_default.defineIntro,
								children: t("seat.define.intro")
							}),
							define.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: hero_module_css_default.defineError,
								role: "alert",
								children: define.error
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: hero_module_css_default.defineField,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: hero_module_css_default.defineLabel,
									children: t("seat.define.description")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
									className: hero_module_css_default.defineTextarea,
									value: description,
									placeholder: t("seat.define.description.placeholder"),
									rows: 3,
									onChange: (event) => setDescription(event.target.value)
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								disabled: define.busy || description.trim() === "",
								onClick: () => {
									suggestDefine(description).then((groups) => {
										setChecked(groups);
										setChecksTouched(false);
									});
								},
								children: define.busy ? t("seat.define.suggesting") : t("seat.define.suggest")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: hero_module_css_default.defineGroups,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: hero_module_css_default.defineLabel,
										children: t("seat.define.groups")
									}),
									define.groups.filter((group) => group.plugin !== true).map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Checkbox, {
										label: t(`agents.defineGroup.${group.id}`),
										checked: checked.includes(group.id),
										disabled: define.busy,
										onChange: (on) => toggle(group.id, on)
									}, group.id)),
									define.groups.some((group) => group.plugin === true) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: hero_module_css_default.defineLabel,
										children: t("seat.define.groupsPlugin")
									}, "groups-plugin"),
									define.groups.filter((group) => group.plugin === true).map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Checkbox, {
										label: t(`agents.defineGroup.${group.id}`),
										checked: checked.includes(group.id),
										disabled: define.busy,
										onChange: (on) => toggle(group.id, on)
									}, group.id))
								]
							})
						]
					})
				}),
				toast !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Toast, {
					text: toast.text,
					holdMs: REFUSAL_HOLD_MS,
					anchor: document.querySelector("[data-composer-card]"),
					onDone: () => {
						setToast(null);
					}
				}, toast.seq)
			] });
		}
		//#endregion
		//#region \0dsh-css:E:\Plugin\发布版\dsh-agent-suite\src\packages\client-ui-agents\src\client\MemoryEntry.module.css.mjs
		const css = ".uVr6Vq_action{width:calc(28px + var(--dsh-content-font-delta,0px));height:calc(28px + var(--dsh-content-font-delta,0px));border-radius:var(--dsw-radius-sm);color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;justify-content:center;align-items:center;padding:6px;display:inline-flex}.uVr6Vq_action svg{width:calc(15px + var(--dsh-content-font-delta,0px));height:calc(15px + var(--dsh-content-font-delta,0px))}.uVr6Vq_action:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}.uVr6Vq_note{color:var(--dsw-alias-label-tertiary);padding-left:4px;font-size:13px;line-height:20px}.uVr6Vq_dialogList{flex-direction:column;gap:6px;max-height:min(420px,56vh);padding:4px 2px;display:flex;overflow-y:auto}.uVr6Vq_dialogEmpty{color:var(--dsw-alias-label-tertiary);padding:16px 4px;font-size:13px}.uVr6Vq_dialogRow,.uVr6Vq_dialogRowChecked{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);cursor:pointer;border-radius:8px;align-items:flex-start;gap:10px;padding:10px 12px;display:flex}.uVr6Vq_dialogRowChecked{background:var(--dsw-alias-interactive-bg-hover)}.uVr6Vq_dialogCheck{accent-color:var(--dsw-alias-label-secondary);flex:none;margin-top:2px}.uVr6Vq_dialogSideTag{background:var(--dsw-alias-label-tertiary);color:var(--dsw-alias-label-primary-foreground);border-radius:6px;flex-shrink:0;padding:2px 8px;font-size:12px}.uVr6Vq_dialogPreview{word-break:break-word;color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}.uVr6Vq_dialogError{color:var(--dsw-alias-state-error-primary);align-self:center;margin-right:auto;font-size:12px}";
		const tagId = "@istarry/dsh-client-ui-agents/MemoryEntry.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@istarry/dsh-client-ui-agents";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var MemoryEntry_module_css_default = {
			"action": "uVr6Vq_action",
			"dialogCheck": "uVr6Vq_dialogCheck",
			"dialogEmpty": "uVr6Vq_dialogEmpty",
			"dialogError": "uVr6Vq_dialogError",
			"dialogList": "uVr6Vq_dialogList",
			"dialogPreview": "uVr6Vq_dialogPreview",
			"dialogRow": "uVr6Vq_dialogRow",
			"dialogRowChecked": "uVr6Vq_dialogRowChecked",
			"dialogSideTag": "uVr6Vq_dialogSideTag",
			"note": "uVr6Vq_note"
		};
		//#endregion
		//#region ../packages/client-ui-agents/src/client/MemoryEntry.tsx
		/**
		* The per-message memory entry, browser half: the memory button seated in the
		* assistant-actions strip beside the official feedback pair. It opens the
		* session's message-selection dialog; the checked messages go to the host
		* remember path, which condenses them into the agent's own long-term memory
		* store. Nothing is written until the human checks messages and submits.
		* @module @istarry/dsh-client-ui-agents/client/MemoryEntry
		*/
		/** Minimal extractor over a settled assistant node's blocks. */
		function assistantText(blocks) {
			return blocks.flatMap((block) => block.kind === "text" ? [block.text] : []).join("");
		}
		/** Pull the text blocks out of a user node's content array. */
		function contentText(content) {
			return content.flatMap((block) => block.type === "text" && typeof block.text === "string" ? [block.text] : []).join("");
		}
		/** Condense a long message to a short preview line. */
		function preview(text, limit = 120) {
			const trimmed = text.replace(/\s+/g, " ").trim();
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
			if (snapshot === void 0) return [];
			const list = [];
			for (const node of snapshot.nodes.values()) {
				if (node.visibility === "hidden") continue;
				if (node.kind === "user" || node.kind === "steering") {
					const data = node.data;
					const text = contentText(data.content ?? []);
					if (text.trim() === "") continue;
					list.push({
						key: node.id,
						anchorSeq: node.anchorSeq,
						side: "user",
						preview: preview(text),
						text
					});
				} else if (node.kind === "assistant-step") {
					const data = node.data;
					if (data.status === "running") continue;
					const text = assistantText(data.blocks ?? []);
					if (text.trim() === "") continue;
					list.push({
						key: node.id,
						anchorSeq: node.anchorSeq,
						side: "assistant",
						preview: preview(text),
						text
					});
				}
			}
			return list.sort((left, right) => left.anchorSeq - right.anchorSeq);
		}
		/** Map a fail-closed remember outcome to the dialog's copy. */
		function outcomeText(outcome, t) {
			if (outcome === "not an agent chat") return t("memoryEntry.notAgent");
			if (outcome === "session not open") return t("memoryEntry.notOpen");
			return outcome !== void 0 && outcome !== "" ? outcome : t("memoryEntry.failed");
		}
		/**
		* The strip button and its transient saved note. The dialog is local state:
		* only one instance exists per message row, and nothing outside it needs the
		* selection.
		* @param props - the injected remember verb and the runtime session kit.
		* @returns the memory icon button with any transient inline copy.
		*/
		function MemoryActions({ useChat, remember, t }) {
			const [open, setOpen] = (0, react.useState)(false);
			const [note, setNote] = (0, react.useState)(null);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
					label: t("memoryEntry.action"),
					side: "bottom",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: MemoryEntry_module_css_default.action,
						"aria-label": t("memoryEntry.action"),
						onClick: () => {
							setNote(null);
							setOpen(true);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconAgentPresetOutlineRegular, {})
					})
				}),
				note !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: MemoryEntry_module_css_default.note,
					role: "status",
					children: note
				}),
				open && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MemoryDialog, {
					useChat,
					remember,
					onClose: (saved) => {
						setOpen(false);
						if (saved) setNote(t("memoryEntry.saved"));
					},
					t
				})
			] });
		}
		/**
		* The memory-selection dialog: the official modal shell over the current
		* session's selectable messages (a condensed preview per row). The human
		* checks the ones worth keeping, and the checked text goes to the injected
		* remember verb.
		*/
		function MemoryDialog({ useChat, remember, onClose, t }) {
			const snapshot = useChat((snapshot) => snapshot);
			const candidates = (0, react.useMemo)(() => candidatesOf(snapshot), [snapshot]);
			const [checked, setChecked] = (0, react.useState)(/* @__PURE__ */ new Set());
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const toggle = (key) => {
				const next = new Set(checked);
				if (next.has(key)) next.delete(key);
				else next.add(key);
				setChecked(next);
			};
			const submit = async () => {
				const text = candidates.filter((item) => checked.has(item.key)).map((item) => (item.side === "user" ? t("memoryEntry.side.user") : t("memoryEntry.side.assistant")) + "：" + item.text).join("\n\n");
				if (text.trim() === "" || busy) return;
				setBusy(true);
				setError(null);
				try {
					const result = await remember(text);
					if (result.saved) {
						onClose(true);
						return;
					}
					setError(outcomeText(result.outcome, t));
				} catch (caught) {
					setError(caught instanceof Error ? caught.message : t("memoryEntry.failed"));
				} finally {
					setBusy(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose: () => {
					if (!busy) onClose(false);
				},
				closeLabel: t("memoryEntry.cancel"),
				title: t("memoryEntry.title"),
				description: t("memoryEntry.subtitle"),
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: MemoryEntry_module_css_default.dialogError,
						role: "alert",
						children: error
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						disabled: busy,
						onClick: () => {
							onClose(false);
						},
						children: t("memoryEntry.cancel")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "primary",
						disabled: busy || checked.size === 0,
						onClick: () => {
							submit();
						},
						children: busy ? t("memoryEntry.submitting") : t("memoryEntry.submit")
					})
				] }),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: MemoryEntry_module_css_default.dialogList,
					children: [candidates.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: MemoryEntry_module_css_default.dialogEmpty,
						children: t("memoryEntry.empty")
					}), candidates.map((item) => {
						const active = checked.has(item.key);
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: active ? MemoryEntry_module_css_default.dialogRowChecked : MemoryEntry_module_css_default.dialogRow,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: active,
									onChange: () => {
										toggle(item.key);
									},
									className: MemoryEntry_module_css_default.dialogCheck
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MemoryEntry_module_css_default.dialogSideTag,
									children: item.side === "user" ? t("memoryEntry.side.user") : t("memoryEntry.side.assistant")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MemoryEntry_module_css_default.dialogPreview,
									children: item.preview
								})
							]
						}, item.key);
					})]
				})
			});
		}
		//#endregion
		//#region ../packages/client-ui-agents/src/client/ConversationGates.tsx
		/**
		* The gated main region: while the agent browser is outside an agent page,
		* one shadow occupant replaces the official conversation shell (header,
		* transcript, and composer) with the bare brand hero — the whale mark and
		* the headline, copied from the conversation skeleton's EmptyHero with the
		* same tokens. The official shell returns when the occupant retires on an
		* agent page.
		* @module @istarry/dsh-client-ui-agents/client/ConversationGates
		*/
		/**
		* Render the bare brand hero over the whole conversation region while the
		* browser is outside an agent page. Replacing the official shell (rather
		* than blanking its holes) keeps a still-open session's header, transcript,
		* and composer from showing through behind the hero.
		* @returns the centered hero element tree.
		*/
		function ConversationGate({ heroText }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: AgentBrowser_module_css_default.heroGate,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: AgentBrowser_module_css_default.heroGateStack,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AgentBrowser_module_css_default.heroGateHeadline,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
							className: AgentBrowser_module_css_default.heroGateFish,
							width: 34,
							height: 34 * _deepseek_ai_dsh_client_ui_primitives.FISH_LOGO_VIEWBOX.height / _deepseek_ai_dsh_client_ui_primitives.FISH_LOGO_VIEWBOX.width,
							viewBox: `0 0 ${_deepseek_ai_dsh_client_ui_primitives.FISH_LOGO_VIEWBOX.width} ${_deepseek_ai_dsh_client_ui_primitives.FISH_LOGO_VIEWBOX.height}`,
							fill: "none",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: _deepseek_ai_dsh_client_ui_primitives.FISH_LOGO_PATH,
								fill: "currentColor"
							})
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: AgentBrowser_module_css_default.heroGateTitleGroup,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: heroText("hero.headline") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AgentBrowser_module_css_default.heroGateBadge,
								children: heroText("hero.preview")
							})]
						})]
					})
				})
			});
		}
		//#endregion
		//#region ../packages/client-ui-agents/src/client/ScheduleMark.ts
		/**
		* Create the shared reminder catalog source.
		* @param ctx - client context carrying the remote face and lifecycle events.
		* @returns the catalog observable, a manual re-read, and the disposer.
		*/
		function createScheduleCatalogSource(ctx) {
			const catalog = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({
				settled: false,
				records: []
			});
			const read = () => {
				const schedule = ctx.get("remote.schedule");
				if (schedule === void 0) return;
				schedule.catalog().then((result) => {
					if (!result.ok) return;
					const records = Array.isArray(result.value) ? result.value : [];
					catalog.set({
						settled: true,
						records: records.flatMap((record) => {
							const entry = record;
							return typeof entry.sessionId === "string" && typeof entry.status === "string" ? [{
								sessionId: entry.sessionId,
								status: entry.status
							}] : [];
						})
					});
				}).catch(() => {});
			};
			let offChanged = () => {};
			try {
				const disposer = ctx.remote.$on.call(ctx.remote, "schedule/changed", () => {
					read();
				});
				if (typeof disposer === "function") offChanged = disposer;
			} catch {}
			const offReset = ctx.on("connection/reset", () => {
				catalog.set({
					settled: false,
					records: []
				});
				read();
			});
			read();
			return {
				catalog,
				ensureRead: read,
				dispose: () => {
					offChanged();
					offReset();
				}
			};
		}
		//#endregion
		//#region ../packages/client-ui-agents/src/client/locales.ts
		/** `agents` namespace dictionaries: the sidebar's agent roster and forms. */
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"agents.title": "我的 Agent",
			"agents.create": "创建 Agent",
			"agents.empty": "还没有 Agent，点击上方\"创建 Agent\"开始",
			"agents.loading": "正在加载 Agent…",
			"agents.retry": "重试",
			"agents.newChat": "开启新对话",
			"agents.profile": "助理档案",
			"agents.memory": "助理记忆",
			"agents.memory.hint": "这个 Agent 独有的记忆；AI 会自动或经你确认后写入，也可以直接编辑后保存。格式：- [时间] 内容",
			"agents.memory.save": "保存",
			"agents.memory.saving": "保存中…",
			"agents.memory.saved": "已保存",
			"agents.memory.saveFailed": "保存失败",
			"agents.back": "返回",
			"agents.chatHistory": "聊天记录",
			"agents.chatHistory.empty": "还没有聊天记录，点击\"开启新对话\"开始",
			"form.title.create": "创建 Agent",
			"form.title.edit": "助理档案",
			"form.name": "名字",
			"form.name.placeholder": "给 Agent 起个名字",
			"form.description": "描述",
			"form.description.placeholder": "一句话介绍这个 Agent（可选）",
			"form.language": "使用语言",
			"form.language.placeholder": "例如：中文",
			"form.persona": "人格提示词（需填写agent名字）",
			"form.persona.placeholder": "描述这个 Agent 的名字、性格、擅长领域、说话方式…",
			"form.delete": "删除 Agent",
			"form.delete.confirm": "确认删除（不可恢复）",
			"form.submit": "确定",
			"form.cancel": "取消",
			"form.delete": "删除",
			"form.delete.confirm": "确定删除该 Agent 吗？它的全部聊天记录与长期记忆将一并删除，此操作无法恢复。",
			"error.required": "此项必填",
			"error.loadFailed": "加载失败，请重试",
			"chat.menu.rename": "重命名",
			"chat.menu.archive": "归档",
			"chat.menu.delete": "删除",
			"chat.rename.title": "重命名聊天记录",
			"chat.rename.field": "聊天记录名称",
			"chat.delete.title": "删除聊天记录",
			"chat.delete.desc": "将永久删除该聊天记录及其日志文件，此操作不可恢复。",
			"chat.delete.confirm": "删除",
			"chat.startFailed": "无法为这个 Agent 组合对话预设，请重试",
			"chat.deleteBusy": "会话仍在运行或打开中，请先关闭对话再删除",
			"chat.search": "搜索聊天记录",
			"chat.search.placeholder": "搜索聊天记录…",
			"chat.search.clear": "清除搜索",
			"chat.search.empty": "没有匹配的聊天记录",
			"chat.viewOptions.label": "视图选项",
			"chat.groupBy.label": "分组方式",
			"chat.groupBy.workspace": "按工作区",
			"chat.groupBy.flat": "平铺列表",
			"chat.group.ungrouped": "未分组",
			"chat.time.now": "刚刚",
			"chat.time.minutes": "{n}分钟",
			"chat.time.hours": "{n}小时",
			"chat.time.days": "{n}天",
			"chat.time.months": "{n}个月",
			"chat.time.years": "{n}年",
			"chat.orderBy.label": "排序方式",
			"chat.orderBy.manual": "手动排序",
			"chat.orderBy.updated": "最近活动",
			"chat.filterBy.label": "归档筛选",
			"chat.viewOptions.hideArchived": "隐藏归档",
			"chat.viewOptions.showArchived": "显示归档",
			"chat.viewOptions.onlyArchived": "只看归档",
			"chat.workspace.add": "添加工作区",
			"chat.schedule.mark": "有定时提醒",
			"workspace.default": "默认工作区",
			"chat.actions.pin": "置顶",
			"chat.actions.unpin": "取消置顶",
			"chat.actions.archive": "归档",
			"chat.actions.unarchive": "取消归档",
			"chat.menu.pinSession": "置顶会话",
			"chat.menu.unpinSession": "取消置顶",
			"chat.menu.fork": "分叉会话",
			"chat.menu.unarchive": "取消归档",
			"agents.defineGroup.shell": "终端",
			"agents.defineGroup.files": "文件读写",
			"agents.defineGroup.fileSearch": "文件检索",
			"agents.defineGroup.askUser": "向我提问",
			"agents.defineGroup.todo": "任务清单",
			"agents.defineGroup.jobs": "后台任务",
			"agents.defineGroup.skills": "技能",
			"agents.defineGroup.goals": "目标",
			"agents.defineGroup.web": "网页检索",
			"agents.defineGroup.browser": "内置浏览器",
			"agents.defineGroup.plan": "计划模式",
			"agents.defineGroup.compaction": "上下文压缩",
			"agents.defineGroup.subagents": "子代理与工作流",
			"seat.hint": "选择本次对话的模式",
			"seat.define": "定义模式",
			"seat.define.menuDesc": "为这次对话勾选需要的能力组合",
			"seat.define.title": "定义模式",
			"seat.define.intro": "勾选本次对话所需的能力；Agent 将基于你勾选的能力开始工作。",
			"seat.define.description": "描述任务",
			"seat.define.description.placeholder": "这次对话要做什么？点击「分析」可根据描述自动勾选。",
			"seat.define.groups": "基础能力",
			"seat.define.groupsPlugin": "插件能力",
			"seat.define.suggest": "分析",
			"seat.define.suggesting": "分析中…",
			"seat.define.confirm": "开始对话",
			"cancel": "取消",
			"close": "关闭",
			"memoryEntry.action": "记住",
			"memoryEntry.title": "分析记忆",
			"memoryEntry.subtitle": "勾选要分析的聊天记录，AI 将提炼其中稳定的信息，存入这个助理的长期记忆。",
			"memoryEntry.empty": "当前会话还没有可选的消息。",
			"memoryEntry.side.user": "用户",
			"memoryEntry.side.assistant": "助理",
			"memoryEntry.cancel": "取消",
			"memoryEntry.submit": "开始分析",
			"memoryEntry.submitting": "分析中…",
			"memoryEntry.saved": "已存入长期记忆，可在「助理记忆」中查看",
			"memoryEntry.notAgent": "这个会话不属于任何助理，没有可写入的记忆",
			"memoryEntry.notOpen": "助理未在运行：请先打开此对话并发送一条消息后再试",
			"memoryEntry.failed": "记忆分析失败",
			"archive.confirm.title": "停止并归档此会话？",
			"archive.confirm.desc": "“{title}”仍有正在进行的工作。归档会先停止这些工作；之后可在侧栏筛选“显示归档”中恢复会话，被停止的工作不会自动继续。",
			"archive.confirm.activity": "将被停止的工作",
			"archive.confirm.turn": "进行中的回合",
			"archive.confirm.subagents": "{n} 个运行中的子智能体：{names}",
			"archive.confirm.jobs": "{n} 个后台任务：{names}",
			"archive.confirm.schedules": "{n} 条定时提醒：{names}",
			"archive.confirm.other": "{n} 项其他工作（{kind}）",
			"archive.confirm.listSeparator": "、",
			"archive.confirm.action": "停止并归档",
			"archive.confirm.pending": "正在停止并归档…",
			"toast.archived": "会话已归档",
			"toast.stoppedAndArchived": "已停止并归档",
			"toast.undo": "撤销",
			"toast.or": "或",
			"toast.showArchived": "筛选归档会话",
			"search.pending": "正在搜索会话历史…",
			"search.noMatches": "无匹配会话",
			"search.hasMore": "仅显示前 {n} 条结果，请缩小范围。"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"agents.title": "My Agents",
			"agents.create": "Create Agent",
			"agents.empty": "No agents yet — click \"Create Agent\" above to start",
			"agents.loading": "Loading agents…",
			"agents.retry": "Retry",
			"agents.newChat": "New Chat",
			"agents.profile": "Agent Profile",
			"agents.memory": "Agent Memory",
			"agents.memory.hint": "This agent's own memory; the AI writes facts automatically or after your confirmation, or edit directly. Format: - [time] content",
			"agents.memory.save": "Save",
			"agents.memory.saving": "Saving…",
			"agents.memory.saved": "Saved",
			"agents.memory.saveFailed": "Save failed",
			"agents.back": "Back",
			"agents.chatHistory": "Chat History",
			"agents.chatHistory.empty": "No chats yet — start one with \"New Chat\"",
			"form.title.create": "Create Agent",
			"form.title.edit": "Agent Profile",
			"form.name": "Name",
			"form.name.placeholder": "Give the agent a name",
			"form.description": "Description",
			"form.description.placeholder": "One sentence about this agent (optional)",
			"form.language": "Language",
			"form.language.placeholder": "e.g. Chinese",
			"form.persona": "Persona (must include the agent name)",
			"form.persona.placeholder": "Describe the agent's name, personality, strengths, tone…",
			"form.delete": "Delete agent",
			"form.delete.confirm": "Confirm delete (cannot be undone)",
			"form.submit": "Confirm",
			"form.cancel": "Cancel",
			"form.delete": "Delete",
			"form.delete.confirm": "Delete this agent? All of its chats and long-term memory are deleted with it. This cannot be undone.",
			"error.required": "Required",
			"error.loadFailed": "Failed to load, please retry",
			"chat.menu.rename": "Rename",
			"chat.menu.archive": "Archive",
			"chat.menu.delete": "Delete",
			"chat.rename.title": "Rename Chat",
			"chat.rename.field": "Chat name",
			"chat.delete.title": "Delete Chat",
			"chat.delete.desc": "This permanently deletes the chat and its log files. This cannot be undone.",
			"chat.delete.confirm": "Delete",
			"chat.startFailed": "Could not compose a chat preset for this agent; please retry",
			"chat.deleteBusy": "The session is still running or open; close the conversation before deleting",
			"chat.search": "Search chats",
			"chat.search.placeholder": "Search chats…",
			"chat.search.clear": "Clear search",
			"chat.search.empty": "No chats match the search",
			"chat.viewOptions.label": "View options",
			"chat.groupBy.label": "Group by",
			"chat.groupBy.workspace": "Workspace",
			"chat.groupBy.flat": "Flat list",
			"chat.group.ungrouped": "Ungrouped",
			"chat.time.now": "now",
			"chat.time.minutes": "{n}min",
			"chat.time.hours": "{n}h",
			"chat.time.days": "{n}d",
			"chat.time.months": "{n}mo",
			"chat.time.years": "{n}y",
			"chat.orderBy.label": "Order by",
			"chat.orderBy.manual": "Manual",
			"chat.orderBy.updated": "Last activity",
			"chat.filterBy.label": "Archived filter",
			"chat.viewOptions.hideArchived": "Hide archived",
			"chat.viewOptions.showArchived": "Show archived",
			"chat.viewOptions.onlyArchived": "Only archived",
			"chat.workspace.add": "Add workspace",
			"chat.schedule.mark": "Has scheduled reminders",
			"workspace.default": "Default workspace",
			"chat.actions.pin": "Pin",
			"chat.actions.unpin": "Unpin",
			"chat.actions.archive": "Archive",
			"chat.actions.unarchive": "Unarchive",
			"chat.menu.pinSession": "Pin session",
			"chat.menu.unpinSession": "Unpin session",
			"chat.menu.fork": "Fork session",
			"chat.menu.unarchive": "Unarchive",
			"agents.defineGroup.shell": "Terminal",
			"agents.defineGroup.files": "Files",
			"agents.defineGroup.fileSearch": "File search",
			"agents.defineGroup.askUser": "Ask me",
			"agents.defineGroup.todo": "Todos",
			"agents.defineGroup.jobs": "Background jobs",
			"agents.defineGroup.skills": "Skills",
			"agents.defineGroup.goals": "Goals",
			"agents.defineGroup.web": "Web search",
			"agents.defineGroup.browser": "Built-in browser",
			"agents.defineGroup.plan": "Plan mode",
			"agents.defineGroup.compaction": "Compaction",
			"agents.defineGroup.subagents": "Subagents & workflows",
			"seat.hint": "Choose the mode for this conversation",
			"seat.define": "Define mode",
			"seat.define.menuDesc": "Pick the capabilities for this conversation",
			"seat.define.title": "Define mode",
			"seat.define.intro": "Check the capabilities this conversation needs; the agent starts from the abilities you check.",
			"seat.define.description": "Describe the task",
			"seat.define.description.placeholder": "What will this conversation do? \"Analyze\" infers the checks from the text.",
			"seat.define.groups": "Core capabilities",
			"seat.define.groupsPlugin": "Plugins",
			"seat.define.suggest": "Analyze",
			"seat.define.suggesting": "Analyzing…",
			"seat.define.confirm": "Start conversation",
			"cancel": "Cancel",
			"close": "Close",
			"memoryEntry.action": "Remember",
			"memoryEntry.title": "Analyze into memory",
			"memoryEntry.subtitle": "Check the messages to analyze; the agent condenses the stable facts into its own long-term memory.",
			"memoryEntry.empty": "No selectable messages in this conversation yet.",
			"memoryEntry.side.user": "User",
			"memoryEntry.side.assistant": "Assistant",
			"memoryEntry.cancel": "Cancel",
			"memoryEntry.submit": "Analyze",
			"memoryEntry.submitting": "Analyzing…",
			"memoryEntry.saved": "Saved to long-term memory; view it in the agent memory editor",
			"memoryEntry.notAgent": "This conversation belongs to no agent; there is no memory to write",
			"memoryEntry.notOpen": "The agent is not live; open this conversation and send a message first",
			"memoryEntry.failed": "Memory analysis failed",
			"archive.confirm.title": "Stop and archive this session?",
			"archive.confirm.desc": "\"{title}\" still has work in progress. Archiving stops that work first; the session can be restored later through the \"Show archived\" filter, and the stopped work does not resume.",
			"archive.confirm.activity": "Work that will be stopped",
			"archive.confirm.turn": "A turn in progress",
			"archive.confirm.subagents": "{n} running subagent(s): {names}",
			"archive.confirm.jobs": "{n} background job(s): {names}",
			"archive.confirm.schedules": "{n} scheduled reminder(s): {names}",
			"archive.confirm.other": "{n} other activity item(s) ({kind})",
			"archive.confirm.listSeparator": ", ",
			"archive.confirm.action": "Stop and archive",
			"archive.confirm.pending": "Stopping and archiving…",
			"toast.archived": "Session archived",
			"toast.stoppedAndArchived": "Stopped and archived",
			"toast.undo": "Undo",
			"toast.or": "or",
			"toast.showArchived": "show archived",
			"search.pending": "Searching session history…",
			"search.noMatches": "No matching sessions",
			"search.hasMore": "Only the first {n} results are shown; narrow the query."
		};
		//#endregion
		//#region ../packages/client-ui-agents/src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "agents";
		/** Lower priority than ui-workspace's registration (default 0): lowest renders. */
		const SIDEBAR_SHADOW_PRIORITY = -20;
		/** Lower priority than ui-conversation's own registration (default 0). */
		const CONVERSATION_SHADOW_PRIORITY = -30;
		/** Lower priority than the official agent-preset chip (default 0). */
		const HERO_SHADOW_PRIORITY = -20;
		/**
		* Global panel ids: each addresses a `main`-slot page by the same key. The
		* create page is the roster's control; profile and memory are per-agent
		* panels the nav rows select.
		*/
		const AGENTS_CREATE_PANEL = "agents-create";
		const AGENTS_PROFILE_PANEL = "agents-profile";
		const AGENTS_MEMORY_PANEL = "agents-memory";
		/** Required services (cordis fiber inject). */
		const inject = [
			"slots",
			"locale",
			"sessions",
			"workspaces",
			"uiWorkspace",
			"remote"
		];
		/**
		* Mount the agent suite's surfaces and services.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-agents: dictionaries");
			const agentT = ctx.locale.bind(NS);
			ctx.effect(() => {
				const style = document.createElement("style");
				style.textContent = "[class$=\"_newSession\"] { display: none !important; }";
				document.head.appendChild(style);
				return () => {
					style.remove();
				};
			}, "ui-agents: hide shell new-session button");
			const whenRemoteReady = Promise.all([ctx.remote.$mount(TYPERT_REMOTE$1), ctx.remote.$mount(TYPERT_REMOTE)]).then(() => void 0, () => void 0);
			let launchPreset;
			let launchDeadline = 0;
			let bindingWorker;
			let lastBoundWorkspace;
			const workspaceIdOf = (sessionId) => {
				return ctx.workspaces.list.getSnapshot().items.find((item) => item.sessionIds.includes(sessionId))?.workspaceId;
			};
			const launch = {
				openSession: (sessionId) => {
					ctx.uiWorkspace.openSession(sessionId);
				},
				launchWithPreset: (presetId) => {
					launchPreset = presetId;
					launchDeadline = Date.now() + 3e4;
					ctx.uiWorkspace.startSession(lastBoundWorkspace);
					if (bindingWorker !== void 0) return;
					bindingWorker = (async () => {
						await whenRemoteReady;
						const presets = ctx.get("remote.agentPresets");
						if (presets === void 0) return;
						const release = async (id) => {
							if (ctx.sessions.list.getSnapshot().byId[id]?.blank === true) await presets.select(id, "standard");
						};
						let bound;
						let boundPreset;
						while (Date.now() < launchDeadline) {
							const presetId = launchPreset;
							const displayed = Object.values(ctx.sessions.list.getSnapshot().byId).find((candidate) => candidate.blank && (candidate.retainedBy.mainView ?? 0) > 0);
							if (presetId === void 0 || displayed === void 0 || displayed.id === bound && boundPreset === presetId) {
								await new Promise((resolve) => setTimeout(resolve, 200));
								continue;
							}
							try {
								const old = bound;
								bound = void 0;
								if (old !== void 0 && old !== displayed.id) await release(old);
								await presets.select(displayed.id, presetId);
								bound = displayed.id;
								boundPreset = presetId;
								lastBoundWorkspace = workspaceIdOf(displayed.id) ?? lastBoundWorkspace;
							} catch (error) {
								ctx.logger.warn(`ui-agents: draft binding failed: ${String(error)}`);
							}
							await new Promise((resolve) => setTimeout(resolve, 400));
						}
					})().finally(() => {
						bindingWorker = void 0;
					});
				}
			};
			const archived = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(ctx.workspaces.list.getSnapshot().archivedSessionIds);
			const pinned = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(ctx.workspaces.list.getSnapshot().pinnedSessionIds);
			const workspaceProjectionOf = (snapshot) => {
				const order = [];
				const bySession = {};
				for (const item of snapshot.items) {
					const title = item.title === "default-workspace" ? agentT("workspace.default") : item.title;
					order.push({
						id: item.workspaceId,
						title
					});
					for (const sessionId of item.sessionIds) bySession[sessionId] = item.workspaceId;
				}
				return {
					order,
					bySession
				};
			};
			const workspaceProjection = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(workspaceProjectionOf(ctx.workspaces.list.getSnapshot()));
			const stopWorkspaceSets = ctx.workspaces.list.subscribe(() => {
				const snapshot = ctx.workspaces.list.getSnapshot();
				archived.set(snapshot.archivedSessionIds);
				pinned.set(snapshot.pinnedSessionIds);
				workspaceProjection.set(workspaceProjectionOf(snapshot));
			});
			const view = createAgentViewStore();
			const archiveRequest = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(null);
			const rowToast = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(null);
			const showToast = (toast) => {
				rowToast.set(toast);
			};
			const activeSessionRefusal = (reason) => {
				if (!(reason instanceof Error) || reason.name !== "WorkspaceArchiveError") return void 0;
				const refusal = reason.rpcError;
				return refusal?.code === "workspace/session-active" ? refusal.details?.activity : void 0;
			};
			const displayTitleOf = (sessionId) => ctx.sessions.list.getSnapshot().byId[sessionId]?.displayTitle ?? sessionId;
			const controller = new AgentBrowserController(ctx, {
				list: ctx.sessions.list,
				archived,
				pinned,
				rename: async (sessionId, title) => {
					const session = ctx.sessions.binding(sessionId)?.session;
					if (session === void 0) throw new Error(`unknown session "${sessionId}"`);
					const result = await session.rename(title);
					if (!result.ok) throw new Error(result.error.message);
				},
				archive: async (sessionId) => {
					try {
						await ctx.uiWorkspace.archiveSession(sessionId);
						showToast({
							kind: "archived",
							sessionId
						});
					} catch (reason) {
						const activity = activeSessionRefusal(reason);
						if (activity === void 0) throw reason;
						archiveRequest.set({
							sessionId,
							displayTitle: displayTitleOf(sessionId),
							activity
						});
					}
				}
			}, launch);
			const stopAndArchive = async (sessionId) => {
				await ctx.uiWorkspace.archiveSession(sessionId, { stopActivity: true });
				showToast({
					kind: "stoppedAndArchived",
					sessionId
				});
			};
			const scheduleCatalog = createScheduleCatalogSource(ctx);
			const closeMainPanel = () => {
				const layout = ctx.get("layout");
				if (layout !== void 0 && typeof layout.selectPanel === "function") layout.selectPanel(null);
			};
			controller.whenRemoteReady = whenRemoteReady;
			const modeText = ctx.locale.bind("settings.agentPreset");
			const hero = new HeroSeatController(controller, (id) => {
				const text = presetDisplayText({ id }, modeText);
				return {
					name: text.name,
					description: text.description ?? ""
				};
			});
			ctx.effect(() => () => {
				stopWorkspaceSets();
				controller.dispose();
				hero.dispose();
				scheduleCatalog.dispose();
			}, "ui-agents: lifecycle");
			ctx.provide("uiAgents", {
				pendingAgent: () => controller.pendingAgent(),
				composeForPendingAgent: (modeId) => controller.composeForPendingAgent(modeId),
				composeForAgent: (agentId, modeId) => controller.composeForAgent(agentId, modeId),
				modeIdFor: (combinedId) => controller.modeIdFor(combinedId),
				consumePendingAgent: () => {
					controller.consumePendingAgent();
				}
			});
			ctx.slots.inject("sidebar.workspaces", () => {
				const injected = () => ({
					hooks: {
						agents: controller.store,
						archived,
						pinned,
						workspaceProjection,
						view: view.store,
						scheduleCatalog: scheduleCatalog.catalog
					},
					viewActions: view.actions,
					load: () => {
						scheduleCatalog.ensureRead();
						return controller.load();
					},
					modeName: (modeId) => presetDisplayText({ id: modeId }, modeText).name,
					selectAgent: (id) => {
						closeMainPanel();
						controller.selectAgent(id);
					},
					back: () => {
						controller.back();
					},
					openCreate: () => {
						controller.openCreate();
					},
					startChat: (id) => {
						closeMainPanel();
						return controller.startChat(id);
					},
					openSession: (sessionId) => {
						closeMainPanel();
						controller.openSession(sessionId);
					},
					openProfile: (id) => controller.openProfile(id),
					openMemory: (id) => controller.openMemory(id),
					setMemoryText: (text) => {
						controller.setMemoryText(text);
					},
					saveMemory: () => controller.saveMemory(),
					backFromMemory: () => {
						controller.backFromMemory();
					},
					toggleCollapsed: () => {
						controller.toggleCollapsed();
					},
					create: (input) => controller.create(input),
					saveEdit: (id, input) => controller.saveEdit(id, input),
					deleteAgent: (id) => controller.deleteAgent(id),
					remove: (id) => controller.remove(id),
					renameSession: (sessionId, title) => controller.renameSession(sessionId, title),
					archiveSession: (sessionId) => controller.archiveSession(sessionId),
					removeSession: (sessionId) => controller.removeSession(sessionId),
					pinSession: (sessionId) => ctx.uiWorkspace.pinSession(sessionId),
					unpinSession: (sessionId) => ctx.uiWorkspace.unpinSession(sessionId),
					forkSession: (sessionId) => ctx.uiWorkspace.forkSession(sessionId),
					unarchiveSession: (sessionId) => ctx.uiWorkspace.unarchiveSession(sessionId),
					searchSessions: async (query, signal) => {
						const result = await ctx.sessions.search(query, signal);
						if (!result.ok) throw new Error(result.error.message);
						return result.value;
					},
					searchResultLimit: ctx.sessions.searchResultLimit,
					insertWorkspaceBefore: async (workspaceId, beforeWorkspaceId) => {
						await ctx.workspaces.insertBefore(workspaceId, ...beforeWorkspaceId === void 0 ? [] : [beforeWorkspaceId]);
					},
					addWorkspace: async () => {
						const picked = await ctx.uiWorkspace.pickDirectory();
						if (picked === null) return;
						await ctx.workspaces.create({ path: picked });
					}
				});
				return ctx.slots.register({
					name: "sidebar.workspaces",
					priority: SIDEBAR_SHADOW_PRIORITY,
					locale: NS,
					inject: injected
				}, AgentBrowser);
			});
			const brandText = ctx.locale.bind("sidebar");
			ctx.slots.inject("sidebar.brand.mark", () => ctx.slots.register({
				name: "sidebar.brand.mark",
				priority: -1,
				locale: NS,
				inject: () => ({
					hooks: { agents: controller.store },
					back: () => {
						controller.back();
					}
				})
			}, AgentBrandMark));
			ctx.slots.inject("sidebar.brand.name", () => ctx.slots.register({
				name: "sidebar.brand.name",
				priority: -1,
				locale: NS,
				inject: () => ({
					hooks: { agents: controller.store },
					brandText
				})
			}, AgentBrandName));
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: AGENTS_CREATE_PANEL,
				order: 20,
				label: () => agentT("agents.create"),
				locale: NS
			}, CreateAgentPanelIcon));
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: "agents-newchat",
				order: 21,
				label: () => agentT("agents.newChat"),
				locale: NS
			}, NewChatPanelIcon));
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: AGENTS_PROFILE_PANEL,
				order: 22,
				label: () => agentT("agents.profile"),
				locale: NS
			}, ProfilePanelIcon));
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: AGENTS_MEMORY_PANEL,
				order: 23,
				label: () => agentT("agents.memory"),
				locale: NS
			}, MemoryPanelIcon));
			ctx.slots.inject("main", () => ctx.slots.register({
				name: "main",
				key: AGENTS_CREATE_PANEL,
				locale: NS,
				inject: () => ({
					hooks: { agents: controller.store },
					create: (input) => controller.create(input),
					close: closeMainPanel
				})
			}, CreateAgentPage));
			ctx.slots.inject("main", () => ctx.slots.register({
				name: "main",
				key: AGENTS_PROFILE_PANEL,
				locale: NS,
				inject: () => ({
					hooks: { agents: controller.store },
					saveEdit: (id, input) => controller.saveEdit(id, input),
					deleteAgent: (id) => controller.deleteAgent(id)
				})
			}, ProfileMainPage));
			ctx.slots.inject("main", () => ctx.slots.register({
				name: "main",
				key: AGENTS_MEMORY_PANEL,
				locale: NS,
				inject: () => ({
					hooks: { agents: controller.store },
					setMemoryText: (text) => {
						controller.setMemoryText(text);
					},
					saveMemory: () => controller.saveMemory()
				})
			}, MemoryMainPage));
			ctx.effect(() => {
				const onNavClick = (event) => {
					const target = event.target;
					if (!(target instanceof Element)) return;
					const button = target.closest("button");
					if (button === null) return;
					const nav = button.closest("nav");
					if (nav === null || !/panellist/i.test(nav.className)) return;
					const mark = button.querySelector("[data-agents-panel]")?.getAttribute("data-agents-panel");
					if (mark === null || mark === void 0) return;
					event.stopPropagation();
					event.preventDefault();
					const state = controller.store.getSnapshot();
					const layout = ctx.get("layout");
					if (layout === void 0 || typeof layout.selectPanel !== "function") return;
					const active = layout.panelInfo !== void 0 && typeof layout.panelInfo.getSnapshot === "function" ? layout.panelInfo.getSnapshot().activePanelId : void 0;
					if (mark === "create") {
						layout.selectPanel(active === AGENTS_CREATE_PANEL ? null : AGENTS_CREATE_PANEL);
						return;
					}
					if (state.selected === "") return;
					if (mark === "newchat") {
						closeMainPanel();
						controller.startChat(state.selected);
						return;
					}
					const panel = mark === "profile" ? AGENTS_PROFILE_PANEL : AGENTS_MEMORY_PANEL;
					if (active === panel) {
						layout.selectPanel(null);
						return;
					}
					if (mark === "profile") controller.openProfile(state.selected);
					else controller.openMemory(state.selected);
					layout.selectPanel(panel);
				};
				document.addEventListener("click", onNavClick, true);
				return () => {
					document.removeEventListener("click", onNavClick, true);
				};
			}, "ui-agents: nav action rows");
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "agents-archive-confirm",
				locale: NS,
				inject: () => ({
					hooks: { request: archiveRequest },
					settle: () => {
						archiveRequest.set(null);
					},
					stopAndArchive
				})
			}, ArchiveConfirmDialog));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "agents-row-toast",
				locale: NS,
				inject: () => ({
					hooks: {
						toast: rowToast,
						view: view.store
					},
					dismiss: () => {
						rowToast.set(null);
					},
					undoArchive: (sessionId) => {
						ctx.uiWorkspace.unarchiveSession(sessionId).catch((reason) => {
							console.warn("session unarchive rejected:", reason);
						});
					},
					showArchived: () => {
						view.actions.setArchivedFilter("show");
					}
				})
			}, RowActionToast));
			ctx.slots.inject("conversation.hero.agentPreset", () => ctx.slots.register({
				name: "conversation.hero.agentPreset",
				priority: HERO_SHADOW_PRIORITY,
				locale: NS,
				inject: () => ({
					hooks: {
						heroSeat: hero.store,
						heroDefine: hero.define
					},
					load: (current) => hero.load(current),
					select: (current, id) => hero.select(current, id),
					defineTarget: (current) => hero.defineTarget(current),
					loadDefine: () => hero.loadDefine(),
					suggestDefine: (description) => hero.suggestDefine(description),
					composeDefine: (agentPreset, groups) => hero.composeDefine(agentPreset, groups)
				})
			}, HeroChip));
			ctx.slots.inject("conversation.chat.assistant-actions", () => ctx.slots.register({
				name: "conversation.chat.assistant-actions",
				id: "agent-memory",
				order: 12,
				locale: NS,
				inject: (sessionId) => ({ remember: async (text) => {
					await whenRemoteReady;
					const memory = ctx.get("remote.agentMemory");
					if (memory === void 0) throw new Error("agent memory remote is unavailable");
					const carried = await memory.remember(sessionId, text);
					if (!carried.ok) throw new Error(`agentMemory.remember failed: ${carried.error.message}`);
					return carried.value;
				} })
			}, MemoryActions));
			const heroText = ctx.locale.bind("conversation");
			controller.bindConversationShadow(() => ctx.slots.register({
				name: "main.conversation",
				priority: CONVERSATION_SHADOW_PRIORITY,
				locale: NS,
				inject: () => ({ heroText })
			}, ConversationGate));
			controller.load();
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map