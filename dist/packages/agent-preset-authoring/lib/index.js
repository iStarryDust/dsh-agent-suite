import { createRequire } from "node:module";
import { Context, Service } from "@deepseek-ai/cordis";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import z from "@deepseek-ai/schemastery";
import { dump, load } from "js-yaml";
import { entryListSchema } from "@deepseek-ai/cordis-plugin-include";
import { dshHomePath } from "@deepseek-ai/dsh-home-paths";
import "@deepseek-ai/dsh-scope";
import { AttachmentError } from "@deepseek-ai/dsh-attachment";
import { writeFileAtomic } from "@deepseek-ai/dsh-atomic-write";
import { z as z$1 } from "zod";
//#region ../node_modules/@deepseek-ai/dsh-typert-protocol/lib/index.js
/** The one Remote failure class shared by owners, the Gateway, and consumers. */
/**
* One Remote call failure: a real Error carrying its stable code and typed
* details. Owners throw it at the failure point; the Host Gateway encodes it
* onto the wire unchanged; the Client face rebuilds an instance for the
* `RemoteResult` error branch, so `throw result.error` keeps throw semantics.
* Discrimination is always by `code`, never by instanceof.
*/
var RemoteError = class extends Error {
	code;
	details;
	/** Structural marker: cross-realm/bundle identification never uses instanceof. */
	isDSHRemoteError = true;
	/**
	* @param code - stable failure code declared in {@link RemoteErrorDetailsMap}.
	* @param message - human diagnostic carried across the wire.
	* @param details - structured payload typed by the code.
	* @param options - standard Error options (`cause` survives in-process only).
	*/
	constructor(code, message, details, options) {
		super(message, options);
		this.code = code;
		this.details = details;
		this.name = "RemoteError";
	}
};
/**
* Remote decorators and explicit Gateway bindings backed by versioned
* descriptors carried on decorated class prototypes. Strict reflection
* remains a Typert compiler responsibility.
* @module @deepseek-ai/dsh-typert-protocol
*/
const TYPERT_REMOTE_SEGMENT_PATTERN = /^[A-Za-z0-9_$.-]+$/;
/**
* Test one generated Remote name against the Connection endpoint grammar.
* @param value - namespace, method, lookup, or Context segment.
* @returns whether the value can cross the shared RPC carrier unchanged.
*/
function isTypertRemoteSegment(value) {
	return value !== "." && value !== ".." && TYPERT_REMOTE_SEGMENT_PATTERN.test(value);
}
const REMOTE_METHOD_DESCRIPTOR = "@deepseek-ai/dsh-typert-protocol/remote-methods";
/**
* Bind one visible Service field to a Cordis key and Remote namespace. A
* service that owns a Cordis Context also gives its tree `ctx.invocation`,
* `undefined` outside a Remote call, so no `TypertRemoteService` is needed for
* a Host composition to read it.
* @param service - owning Service instance, normally `this`.
* @param serviceKey - exact Cordis service key.
* @param options - optional wire namespace.
* @returns a frozen, inspectable binding with no compiler-injected metadata.
*/
function bindTypertRemote(service, serviceKey, options = {}) {
	validateName("service key", serviceKey);
	const namespace = options.namespace ?? serviceKey;
	validateName("namespace", namespace);
	const ctx = Reflect.get(service, "ctx");
	if (Context.is(ctx)) provideInvocationAccessor(ctx);
	return Object.freeze({
		service,
		serviceKey,
		namespace
	});
}
/** Cordis Service base that exposes its registered name through Typert Gateway. */
var TypertRemoteService = class extends Service {
	/** Visible binding consumed by the Gateway's source-mode discovery. */
	typertRemote;
	/**
	* Register the Service and bind the same key to Typert Gateway.
	* @param ctx - owning Cordis Context.
	* @param serviceKey - exact Cordis service key and default wire namespace.
	* @param options - optional wire namespace.
	*/
	constructor(ctx, serviceKey, options = {}) {
		super(ctx, serviceKey);
		this.typertRemote = bindTypertRemote(this, this.name, options);
	}
};
/**
* Make `ctx.invocation` read as `undefined` outside a Remote call instead of the
* reflect service's "cannot get property" error; a call-derived Context shadows
* the accessor with its own property. The first Remote Service constructed in a
* tree registers it on the root, where it outlives any one Service.
*/
function provideInvocationAccessor(ctx) {
	if (Object.hasOwn(ctx.root.reflect.props, "invocation")) return;
	ctx.root.accessor("invocation", { get: () => void 0 });
}
function Remote(methodExportOrOptions, context) {
	if (typeof methodExportOrOptions === "string") {
		validateName("Remote export name", methodExportOrOptions);
		return remoteDecorator({ kind: "direct" }, { exportName: methodExportOrOptions });
	}
	if (typeof methodExportOrOptions === "object") return remoteDecorator({ kind: "direct" }, markerOptions(methodExportOrOptions, REMOTE_OPTION_KEYS, "Remote options require name, mode: \"stream\", or resources"));
	if (context === void 0) throw new TypeError("typert-protocol: Remote decorator context is missing");
	addMarkerInitializer(context, { kind: "direct" });
}
const REMOTE_OPTION_KEYS = /* @__PURE__ */ new Set([
	"name",
	"mode",
	"resources"
]);
/** Validate one decorator options object against its accepted keys and select the marker fields. */
function markerOptions(options, accepted, requirement) {
	const keys = Reflect.ownKeys(options);
	if (keys.length === 0 || keys.some((key) => typeof key !== "string" || !accepted.has(key)) || Object.hasOwn(options, "mode") && options.mode !== "stream") throw new TypeError(`typert-protocol: ${requirement}`);
	const { mode, name, resources } = options;
	if (name !== void 0) validateName("Remote export name", name);
	return {
		...mode === void 0 ? {} : { mode },
		...name === void 0 ? {} : { exportName: name },
		...resources === void 0 ? {} : { resources: resourceReaders(resources) }
	};
}
/** Freeze declared readers into the marker record; a misdeclared reader fails at decoration. */
function resourceReaders(resources) {
	const readers = {};
	for (const [kind, reader] of Object.entries(resources)) {
		if (typeof reader !== "function") throw new TypeError(`typert-protocol: Remote resource reader "${kind}" must be a function`);
		readers[kind] = reader;
	}
	if (Object.keys(readers).length === 0) throw new TypeError("typert-protocol: Remote resources require at least one reader");
	return Object.freeze(readers);
}
function remoteDecorator(invocation, options = {}) {
	return function(_method, context) {
		addMarkerInitializer(context, invocation, options);
	};
}
function readRemoteMethodDescriptor(prototype) {
	const property = Object.getOwnPropertyDescriptor(prototype, REMOTE_METHOD_DESCRIPTOR);
	if (property === void 0) return void 0;
	const descriptor = property.value;
	if (descriptor === null || typeof descriptor !== "object") throw new TypeError("typert-protocol: Remote method descriptor must be an object");
	const version = Reflect.get(descriptor, "version");
	if (version !== 1) throw new TypeError(`typert-protocol: unsupported Remote method descriptor version ${String(version)}`);
	const methods = Reflect.get(descriptor, "methods");
	if (!Array.isArray(methods)) throw new TypeError("typert-protocol: Remote method descriptor methods must be an array");
	return descriptor;
}
function addMarkerInitializer(context, invocation, options = {}) {
	if (context.private || context.static || typeof context.name !== "string") throw new TypeError("typert-protocol: Remote decorators require a public instance method with a string name");
	const method = context.name;
	context.addInitializer(function() {
		const prototype = Object.getPrototypeOf(this);
		if (prototype === null) throw new TypeError(`typert-protocol: cannot mark Remote method "${method}" on an object without a prototype`);
		mark(prototype, method, invocation, options);
	});
}
function mark(prototype, method, invocation, { mode, exportName, resources }) {
	const descriptor = readRemoteMethodDescriptor(prototype);
	const marker = Object.freeze({
		method,
		...exportName === void 0 || exportName === method ? {} : { exportName },
		...mode === void 0 ? {} : { mode },
		invocation: Object.freeze(invocation),
		...resources === void 0 ? {} : { resources }
	});
	const current = descriptor?.methods.find((candidate) => candidate.method === method);
	if (current !== void 0) {
		if (current.exportName === marker.exportName && current.mode === marker.mode && current.resources === marker.resources && sameInvocation(current.invocation, invocation)) return;
		throw new Error(`typert-protocol: Remote method "${method}" has conflicting invocation markers`);
	}
	Object.defineProperty(prototype, REMOTE_METHOD_DESCRIPTOR, {
		configurable: true,
		value: Object.freeze({
			version: 1,
			methods: Object.freeze([...descriptor?.methods ?? [], marker])
		})
	});
}
function sameInvocation(left, right) {
	if (left.kind === "direct") return right.kind === "direct";
	if (right.kind === "direct") return false;
	return left.context === right.context;
}
function validateName(subject, value) {
	if (!isTypertRemoteSegment(value)) throw new TypeError(`typert-protocol: ${subject} must contain only RPC endpoint segment characters`);
}
//#endregion
//#region ../node_modules/@deepseek-ai/dsh-brand/lib/index.js
/**
* Duplicate-install-safe nominal primitive helpers.
*
* A brand makes structurally identical strings or numbers non-interchangeable
* at the type level: a `SessionId` cannot be passed where a `ToolCallId` is
* expected, and an event sequence cannot be passed as a log offset. Comparison,
* logging, and serialization retain the underlying primitive behavior.
*
* This package owns no concrete domain value and keeps no runtime identity or mutable
* state, so independently installed copies produce interchangeable values.
*
* @module @deepseek-ai/dsh-brand
*/
/**
* Apply a compile-time string brand without changing the value.
* @param value - string admitted by the domain that owns the target brand.
* @returns the same string with the requested compile-time brand.
*/
function brandString(value) {
	return value;
}
//#endregion
//#region ../node_modules/@deepseek-ai/dsh-util-values/lib/index.js
/**
* Lazily scanned view of one JSON object's top-level fields, built from text
* that may still be streaming or from an already parsed object. Nothing is
* scanned until a reader asks; the view remembers every question it answered
* and reports changed answers when the owner refreshes for publication.
* Used for model tool-call arguments: a row reads the fields it
* cares about at whatever granularity it displays, at every stage of the call.
* @module @deepseek-ai/dsh-util-values/src/partial-json
*/
const SIMPLE_ESCAPES = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
const CONTENT_ESCAPE = /[\\\u0000-\u001f]/u;
function isWhitespace(c) {
	return c === " " || c === "\n" || c === "\r" || c === "	";
}
function isHex(c) {
	return c >= "0" && c <= "9" || c >= "a" && c <= "f" || c >= "A" && c <= "F";
}
(class PartialArguments {
	/** The view of a call with no arguments available. */
	static EMPTY = PartialArguments.fromObject({});
	/**
	* View finished argument text without scanning it until a reader asks.
	* @param text - the complete argument JSON text.
	* @returns a sealed view.
	*/
	static fromText(text) {
		const view = new PartialArguments();
		view.append(text);
		view.sealed = true;
		return view;
	}
	/**
	* View an already parsed argument payload, such as a PTC dispatch object.
	* @param value - the parsed argument value.
	* @returns a sealed view; a non-object payload has no fields.
	*/
	static fromObject(value) {
		const view = new PartialArguments();
		view.object = typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
		view.sealed = true;
		return view;
	}
	/**
	* The source: text so far or a parsed object, plus whether it can still grow.
	* These are the only enumerable fields, so two views over the same source
	* compare equal structurally however far each has been read.
	*/
	chunks = [];
	object;
	sealed = false;
	#ends = [];
	#size = 0;
	#consumed = 0;
	#mode = "root";
	#escape = false;
	#keyStart = 0;
	#keyEscaped = false;
	#key = "";
	#current = null;
	#nestedEnds = [];
	#nestedInString = false;
	#invalidAt;
	#invalidValue = false;
	#entries = /* @__PURE__ */ new Map();
	#order = [];
	#reads = /* @__PURE__ */ new Map();
	/** Whether this view rejects further appends; does not scan text or register reads. */
	get isSealed() {
		return this.sealed;
	}
	/** Whether indexing or a content read found invalid JSON; unread value contents are not validated. */
	get invalid() {
		this.scan();
		return this.#mode === "invalid" || this.#invalidValue;
	}
	/**
	* Retain streamed argument text without scanning or comparing observed answers.
	* @param fragment - the text following every fragment appended before.
	*/
	append(fragment) {
		if (this.sealed) throw new Error("PartialArguments: cannot append to a sealed view");
		if (fragment.length === 0) return;
		this.chunks.push(fragment);
		this.#size += fragment.length;
		this.#ends.push(this.#size);
	}
	/**
	* Reconcile a streamed prefix with authoritative complete text without joining the fragments.
	* @param text - the final argument text, which replaces missing or conflicting deltas.
	* @returns this view sealed with its caches retained when every character matches; otherwise a new sealed view.
	*/
	settle(text) {
		if (this.object !== void 0 || text.length !== this.#size) return PartialArguments.fromText(text);
		let offset = 0;
		for (const chunk of this.chunks) {
			if (!text.startsWith(chunk, offset)) return PartialArguments.fromText(text);
			offset += chunk.length;
		}
		this.chunks = text.length === 0 ? [] : [text];
		this.#ends = text.length === 0 ? [] : [text.length];
		this.sealed = true;
		return this;
	}
	/**
	* Compare observed answers and advance their publication baseline. Unread views remain unscanned.
	* @returns whether any observed answer changed since its first read or the preceding refresh.
	*/
	refresh() {
		if (this.#reads.size === 0) return false;
		this.scan();
		let changed = false;
		let completions = false;
		for (const read of this.#reads.values()) {
			if (read.completion) {
				completions = true;
				continue;
			}
			changed = this.refreshRead(read) || changed;
		}
		if (completions) {
			for (const read of this.#reads.values()) if (read.completion) changed = this.refreshRead(read) || changed;
		}
		if (this.sealed) this.#reads.clear();
		return changed;
	}
	refreshRead(read) {
		const now = read.answer();
		if (Object.is(now, read.last)) return false;
		read.last = now;
		return true;
	}
	/**
	* Check whether no further fields can arrive.
	* @returns whether the outer object closed, indexing failed, or the view is sealed; unread values are not validated.
	*/
	closed() {
		return this.remember("closed", "", () => this.closedNow());
	}
	/**
	* List discovered fields in first-appearance order.
	* @returns top-level keys seen so far, in first-appearance order.
	*/
	keys() {
		return this.remember("keys", "", () => this.keysNow(), (keys) => keys.length);
	}
	/**
	* Check whether a top-level field has appeared.
	* @param key - argument name.
	* @returns whether the field has appeared (a string opened or another value began).
	*/
	has(key) {
		return this.remember("has", key, () => this.hasNow(key));
	}
	/**
	* Check whether a field's closing delimiter has arrived, without validating its contents.
	* @param key - argument name.
	* @returns whether its delimiter arrived and no content reader has reported an error for this value.
	*/
	complete(key) {
		return this.remember("complete", key, () => this.completeNow(key));
	}
	/**
	* Read string length without materializing its text.
	* @param key - argument name.
	* @param options - change granularity for a streaming string.
	* @returns decoded UTF-16 length of the string field so far; undefined when absent or not a string.
	*/
	stringLength(key, options) {
		const step = Math.max(1, Math.floor(options?.step ?? 1));
		const offset = options?.offset ?? 0;
		return this.remember(`length:${step}:${offset}`, key, () => this.lengthNow(key), (length) => length === void 0 ? void 0 : Math.ceil((length + offset) / step));
	}
	/**
	* Check a string against a decoded UTF-16 length limit without materializing it.
	* @param key - argument name.
	* @param maxLength - decoded UTF-16 limit, floored to at least zero.
	* @returns whether the string is longer than the limit; false when absent or not a string.
	*/
	stringExceeds(key, maxLength) {
		const limit = Math.max(0, Math.floor(maxLength));
		return this.remember(`exceeds:${limit}`, key, () => (this.lengthNow(key, limit + 1) ?? 0) > limit);
	}
	/**
	* Read a decoded string, including a streaming prefix.
	* @param key - argument name.
	* @returns the string field's decoded text so far; undefined when absent or not a string.
	*/
	text(key) {
		return this.remember("text", key, () => this.textNow(key));
	}
	/**
	* Read at most the first decoded UTF-16 units of a string.
	* @param key - argument name.
	* @param maxLength - maximum decoded UTF-16 length, floored to at least one.
	* @returns the bounded string prefix; undefined when absent or not a string.
	*/
	textPrefix(key, maxLength) {
		const limit = Math.max(1, Math.floor(maxLength));
		return this.remember(`prefix:${limit}`, key, () => this.textPrefixNow(key, limit));
	}
	/**
	* Read a completed non-string argument.
	* @param key - argument name.
	* @returns the parsed non-string value once it closed; undefined while open, absent, or a string.
	*/
	value(key) {
		return this.remember("value", key, () => this.valueNow(key));
	}
	/** Answer a question and, on a streaming view, remember it for change detection. */
	remember(kind, key, read, comparison) {
		this.scan();
		const result = read();
		if (!this.sealed) {
			const id = `${kind}/${key}`;
			if (!this.#reads.has(id)) this.#reads.set(id, {
				completion: kind === "complete",
				answer: comparison === void 0 ? read : () => comparison(read()),
				last: comparison === void 0 ? result : comparison(result)
			});
		}
		return result;
	}
	closedNow() {
		return this.sealed || this.#mode === "closed" || this.#mode === "invalid";
	}
	keysNow() {
		return this.object === void 0 ? this.#order : Object.keys(this.object);
	}
	hasNow(key) {
		return this.object === void 0 ? this.#entries.has(key) : Object.hasOwn(this.object, key);
	}
	completeNow(key) {
		if (this.object !== void 0) return Object.hasOwn(this.object, key);
		const entry = this.#entries.get(key);
		return entry !== void 0 && entry.end >= 0 && (entry.kind === "string" ? entry.invalidAt === void 0 : !entry.invalid);
	}
	lengthNow(key, limit = Number.POSITIVE_INFINITY) {
		if (this.object !== void 0) {
			const field = Object.hasOwn(this.object, key) ? this.object[key] : void 0;
			return typeof field === "string" ? field.length : void 0;
		}
		const entry = this.#entries.get(key);
		if (entry?.kind !== "string") return void 0;
		if (entry.text !== void 0 && entry.text.at === entry.end) return entry.text.length;
		const read = entry.length ??= {
			at: entry.start,
			length: 0,
			text: ""
		};
		this.readString(entry, read, limit, false);
		return read.length;
	}
	textNow(key) {
		if (this.object !== void 0) {
			const field = Object.hasOwn(this.object, key) ? this.object[key] : void 0;
			return typeof field === "string" ? field : void 0;
		}
		const entry = this.#entries.get(key);
		if (entry?.kind !== "string") return void 0;
		if (entry.text === void 0 && entry.end >= 0 && entry.needsDecoding && entry.invalidAt === void 0) {
			let text;
			try {
				text = JSON.parse(`"${this.slice(entry.start, entry.end)}"`);
			} catch (_error) {}
			if (text !== void 0) entry.text = {
				at: entry.end,
				length: text.length,
				text
			};
		}
		const read = entry.text ??= {
			at: entry.start,
			length: 0,
			text: ""
		};
		this.readString(entry, read, Number.POSITIVE_INFINITY, true);
		return read.text;
	}
	textPrefixNow(key, maxLength) {
		if (this.object !== void 0) {
			const field = Object.hasOwn(this.object, key) ? this.object[key] : void 0;
			return typeof field === "string" ? field.slice(0, maxLength) : void 0;
		}
		const entry = this.#entries.get(key);
		if (entry?.kind !== "string") return void 0;
		const prefixes = entry.prefixes ??= /* @__PURE__ */ new Map();
		let read = prefixes.get(maxLength);
		if (read === void 0) {
			read = {
				at: entry.start,
				length: 0,
				text: ""
			};
			prefixes.set(maxLength, read);
		}
		this.readString(entry, read, maxLength, true);
		return read.text;
	}
	valueNow(key) {
		if (this.object !== void 0) {
			if (!Object.hasOwn(this.object, key)) return void 0;
			const field = this.object[key];
			return typeof field === "string" ? void 0 : field;
		}
		const entry = this.#entries.get(key);
		if (entry?.kind !== "value" || entry.end < 0 || entry.invalid) return void 0;
		if (entry.parsed === void 0) try {
			entry.parsed = JSON.parse(this.slice(entry.start, entry.end));
		} catch (_error) {
			entry.invalid = true;
			this.#invalidValue = true;
		}
		return entry.parsed;
	}
	chunkAt(at) {
		let low = 0;
		let high = this.#ends.length;
		while (low < high) {
			const mid = low + high >>> 1;
			if (this.#ends[mid] <= at) low = mid + 1;
			else high = mid;
		}
		return low;
	}
	/** Materialize only a requested range, never the cumulative source. */
	slice(start, end) {
		if (start >= end) return "";
		const first = this.chunkAt(start);
		const last = this.chunkAt(end - 1);
		const base = first === 0 ? 0 : this.#ends[first - 1];
		if (first === last) return this.chunks[first].slice(start - base, end - base);
		const parts = [this.chunks[first].slice(start - base)];
		for (let i = first + 1; i < last; i++) parts.push(this.chunks[i]);
		parts.push(this.chunks[last].slice(0, end - this.#ends[last - 1]));
		return parts.join("");
	}
	readString(entry, read, limit, materialize) {
		const end = Math.min(entry.end < 0 ? this.#consumed : entry.end, entry.invalidAt ?? Number.POSITIVE_INFINITY, this.#invalidAt ?? Number.POSITIVE_INFINITY);
		if (!entry.needsDecoding) {
			const length = Math.min(end - read.at, limit - read.length);
			if (length <= 0) return;
			if (materialize) read.text += this.slice(read.at, read.at + length);
			read.at += length;
			read.length += length;
			return;
		}
		let chunkIndex = this.chunkAt(read.at);
		while (read.at < end && read.length < limit) {
			const base = chunkIndex === 0 ? 0 : this.#ends[chunkIndex - 1];
			const chunk = this.chunks[chunkIndex];
			const remaining = chunk.slice(read.at - base, Math.min(chunk.length, end - base));
			const boundary = remaining.search(CONTENT_ESCAPE);
			const length = Math.min(boundary < 0 ? remaining.length : boundary, limit - read.length);
			if (length > 0) {
				if (materialize) read.text += remaining.slice(0, length);
				read.at += length;
				read.length += length;
				if (read.at === base + chunk.length) chunkIndex++;
				continue;
			}
			const type = remaining.length > 1 ? remaining[1] : read.at + 1 < end ? this.chunks[chunkIndex + 1][0] : void 0;
			let decoded;
			let width = 2;
			if (remaining[0] === "\\" && type === void 0 && entry.end < 0) return;
			if (remaining[0] === "\\" && type === "u") {
				const hex = this.slice(read.at + 2, Math.min(end, read.at + 6));
				let valid = true;
				for (let i = 0; i < hex.length; i++) if (!isHex(hex[i])) valid = false;
				if (valid) {
					if (hex.length < 4 && entry.end < 0) return;
					if (hex.length === 4) decoded = String.fromCharCode(Number.parseInt(hex, 16));
				}
				width = 6;
			} else if (remaining[0] === "\\" && type !== void 0) decoded = SIMPLE_ESCAPES[type];
			if (decoded === void 0) {
				entry.invalidAt = read.at;
				this.#invalidValue = true;
				return;
			}
			if (materialize) read.text += decoded;
			read.length++;
			read.at += width;
			while (chunkIndex < this.chunks.length && read.at >= this.#ends[chunkIndex]) chunkIndex++;
		}
	}
	/** Locate new field ranges without decoding or parsing their contents. */
	scan() {
		if (this.object !== void 0 || this.#consumed === this.#size) return;
		for (let i = this.chunkAt(this.#consumed); i < this.chunks.length && this.#invalidAt === void 0; i++) {
			const pending = this.chunks[i];
			const base = i === 0 ? 0 : this.#ends[i - 1];
			for (let index = this.#consumed - base; index < pending.length && this.#mode !== "invalid"; index++) {
				if (this.#mode === "string" || this.#mode === "nested" && this.#nestedInString) {
					const end = this.stringBoundary(pending, index);
					this.#consumed += end - index;
					index = end;
					if (index === pending.length) break;
				}
				this.step(pending[index], this.#consumed);
				this.#consumed++;
			}
		}
	}
	/** Only raw quotes and their preceding backslash runs can terminate a string. */
	stringBoundary(fragment, start) {
		let at = start;
		while (true) {
			const quote = fragment.indexOf("\"", at);
			const end = quote < 0 ? fragment.length : quote;
			if (this.#mode === "string") {
				const entry = this.#current;
				if (!entry.needsDecoding && CONTENT_ESCAPE.test(fragment.slice(at, end))) entry.needsDecoding = true;
			}
			let slashStart = end;
			while (slashStart > at && fragment[slashStart - 1] === "\\") slashStart--;
			const escaped = (end - slashStart) % 2 === 1 !== (slashStart === at && this.#escape);
			this.#escape = quote < 0 && escaped;
			if (quote < 0 || !escaped) return end;
			at = quote + 1;
		}
	}
	step(c, at) {
		switch (this.#mode) {
			case "root":
				if (isWhitespace(c)) return;
				if (c === "{") {
					this.#mode = "key-or-end";
					return;
				}
				this.fail();
				return;
			case "key-or-end":
				if (isWhitespace(c)) return;
				if (c === "}") {
					this.#mode = "closed";
					return;
				}
				if (c === "\"") {
					this.beginKey(at);
					return;
				}
				this.fail();
				return;
			case "key-only":
				if (isWhitespace(c)) return;
				if (c === "\"") {
					this.beginKey(at);
					return;
				}
				this.fail();
				return;
			case "key":
				this.stepKey(c, at);
				return;
			case "colon":
				if (isWhitespace(c)) return;
				if (c === ":") {
					this.#mode = "value";
					return;
				}
				this.fail();
				return;
			case "value":
				this.beginValue(c, at);
				return;
			case "string": {
				const entry = this.#current;
				entry.end = at;
				this.#current = null;
				this.#mode = "comma-or-end";
				return;
			}
			case "scalar":
				this.stepScalar(c, at);
				return;
			case "nested":
				this.stepNested(c, at);
				return;
			case "comma-or-end":
				if (isWhitespace(c)) return;
				if (c === ",") {
					this.#mode = "key-only";
					return;
				}
				if (c === "}") {
					this.#mode = "closed";
					return;
				}
				this.fail();
				return;
			case "closed":
				if (isWhitespace(c)) return;
				this.fail();
				return;
			/* v8 ignore next 2 -- scan() stops stepping once the view is invalid. */
			case "invalid": return;
			/* v8 ignore next 2 -- Every scanner mode has a handler above. */
			default: assertNever(this.#mode);
		}
	}
	fail() {
		this.#invalidAt = this.#consumed;
		this.#mode = "invalid";
		this.#current = null;
	}
	beginKey(at) {
		this.#mode = "key";
		this.#keyStart = at + 1;
		this.#keyEscaped = false;
		this.#escape = false;
	}
	stepKey(c, at) {
		if (c < " ") {
			this.fail();
			return;
		}
		if (this.#escape) {
			this.#escape = false;
			return;
		}
		if (c === "\\") {
			this.#escape = true;
			this.#keyEscaped = true;
			return;
		}
		if (c !== "\"") return;
		const raw = this.slice(this.#keyStart, at);
		if (this.#keyEscaped) try {
			this.#key = JSON.parse(`"${raw}"`);
		} catch (_error) {
			this.fail();
			return;
		}
		else this.#key = raw;
		this.#mode = "colon";
	}
	open(entry) {
		if (!this.#entries.has(this.#key)) this.#order.push(this.#key);
		this.#entries.set(this.#key, entry);
		this.#current = entry;
	}
	beginValue(c, at) {
		if (isWhitespace(c)) return;
		if (c === "\"") {
			this.open({
				kind: "string",
				start: at + 1,
				end: -1,
				needsDecoding: false,
				invalidAt: void 0,
				length: void 0,
				text: void 0,
				prefixes: void 0
			});
			this.#escape = false;
			this.#mode = "string";
			return;
		}
		if (c === "}" || c === "," || c === ":" || c === "]") {
			this.fail();
			return;
		}
		this.open({
			kind: "value",
			start: at,
			end: -1,
			parsed: void 0,
			invalid: false
		});
		if (c === "{" || c === "[") {
			this.#mode = "nested";
			this.#nestedEnds = [c === "{" ? "}" : "]"];
			this.#nestedInString = false;
			this.#escape = false;
			return;
		}
		this.#mode = "scalar";
	}
	stepScalar(c, at) {
		if (c !== "," && c !== "}" && !isWhitespace(c)) return;
		this.closeValue(at);
		this.#mode = c === "," ? "key-only" : c === "}" ? "closed" : "comma-or-end";
	}
	stepNested(c, at) {
		if (this.#nestedInString) {
			this.#nestedInString = false;
			return;
		}
		if (c === "\"") {
			this.#nestedInString = true;
			return;
		}
		if (c === "{" || c === "[") {
			this.#nestedEnds.push(c === "{" ? "}" : "]");
			return;
		}
		if (c === "}" || c === "]") {
			if (this.#nestedEnds.pop() !== c) {
				this.fail();
				return;
			}
			if (this.#nestedEnds.length === 0) {
				this.closeValue(at + 1);
				this.#mode = "comma-or-end";
			}
		}
	}
	closeValue(end) {
		const entry = this.#current;
		entry.end = end;
		this.#current = null;
	}
});
/** Duplicate-install-safe JSON and immutable-value helpers. @module @deepseek-ai/dsh-util-values */
/**
* Mark an unreachable closed-union branch.
* @param value - impossible value; an unhandled typed variant fails at the call site.
* @param context - optional switch-site label included in the failure message.
* @returns never; a runtime value that escaped its type always throws.
*/
function assertNever(value, context) {
	const rendered = JSON.stringify(value) ?? String(value);
	throw new Error(`unreachable variant${context ? ` in ${context}` : ""}: ${rendered}`);
}
/**
* Deep-freeze an object graph in place while leaving live AbortSignal objects mutable.
* @param value - value to freeze.
* @returns the same value after every reachable enumerable child is frozen.
*/
function deepFreeze(value) {
	const seen = /* @__PURE__ */ new WeakSet();
	const pending = [{
		kind: "visit",
		node: value
	}];
	while (pending.length > 0) {
		const task = pending.pop();
		/* v8 ignore next -- the loop condition guarantees one pending task. */
		if (task === void 0) continue;
		if (task.kind === "property") {
			pending.push({
				kind: "visit",
				node: task.source[task.key]
			});
			continue;
		}
		const node = task.node;
		if (node === null || typeof node !== "object") continue;
		if (node instanceof AbortSignal) continue;
		if (seen.has(node)) continue;
		seen.add(node);
		Object.freeze(node);
		const keys = Object.keys(node);
		for (let index = keys.length - 1; index >= 0; index--) {
			const key = keys[index];
			/* v8 ignore next -- the loop is bounded by the captured key count. */
			if (key === void 0) continue;
			pending.push({
				kind: "property",
				source: node,
				key
			});
		}
	}
	return value;
}
//#endregion
//#region ../node_modules/@deepseek-ai/dsh-timeout/lib/index.js
/** Largest delay Node schedules without clamping it to one millisecond. */
const MAX_TIMER_DELAY_MS = 2147483647;
//#endregion
//#region ../node_modules/@deepseek-ai/dsh-llm/lib/index.js
/**
* Detach and deep-freeze a message whose identity already exists.
* @param message - complete message, including its stable identity.
* @returns an immutable snapshot that preserves the identity.
*/
function freezeMessage(message) {
	return deepFreeze(structuredClone(message));
}
/**
* Harness error base with a stable machine-routable code and chained cause.
* Package errors extend it so tool results and replay can retain failure class.
* @module @deepseek-ai/dsh-llm/error
*/
/**
* Base class for all harness errors. Carries a `code` (stable, programmatic —
* e.g. `NO_ADAPTER`, `INVALID_ARGS`) distinct from the
* human-readable `message`, and supports `cause` chaining via the standard
* `ErrorOptions`. `name` defaults to the subclass constructor name.
*/
var HarnessError = class extends Error {
	/** Stable machine-routable failure class (e.g. `RATE_LIMIT`); route on this, never by parsing `message`. */
	code;
	constructor(message, code, options) {
		super(message, options);
		this.code = code;
		this.name = new.target.name;
	}
};
/**
* Canonical provider-neutral code for a response that completed normally but
* carried no content blocks at all. Providers occasionally emit a degenerate
* completion (a terminal stop with zero output); adapters classify it as this
* failure instead of yielding an empty assistant message, because an empty
* message silently ends the turn with nothing for the user or the loop to act
* on. The attempt produced nothing durable, so retry policy treats it as safe
* to repeat.
*/
const EMPTY_RESPONSE_CODE = "EMPTY_RESPONSE";
new RegExp(String.raw`(?:^|[^a-z0-9])context[\s_-](?:length|window)[\s_-]` + String.raw`(?:exceed(?:ed|s)?|overflow(?:ed)?|limit[\s_-]exceeded)(?:$|[^a-z0-9])`, "i");
new RegExp(String.raw`\b(?:request|prompt|input|messages?)\s+(?:is\s+|are\s+)?` + String.raw`too\s+(?:large|long)\s+for\s+(?:(?:this|the)\s+)?` + String.raw`(?:model(?:'s)?\s+)?context(?:\s+window)?\b`, "i");
new RegExp(String.raw`\b(?:input|prompt|request|messages?)\b.{0,40}` + String.raw`\b(?:exceed(?:s|ed)?|overflows?|is\s+larger\s+than)\b.{0,40}` + String.raw`\b(?:the\s+)?(?:model(?:'s)?\s+)?context(?:\s+(?:length|window))?\b`, "i");
/**
* Provider-owned request-retry policy configuration and resolution.
*
* Adapters expose one resolved policy per registered provider route; the
* optional dsh-llm-retry plugin executes it on the agent's failed-step extension point.
*
* @module @deepseek-ai/dsh-llm/retry-policy
*/
const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_INITIAL_DELAY_MS = 500;
const DEFAULT_MAX_DELAY_MS = 1e4;
const DEFAULT_JITTER_RATIO = .1;
const DEFAULT_RETRYABLE_CODES = Object.freeze([
	EMPTY_RESPONSE_CODE,
	"RATE_LIMIT",
	"SERVER",
	"TIMEOUT",
	"TRANSPORT"
]);
const backoffSchema = z.object({
	initialDelayMs: z.number().max(MAX_TIMER_DELAY_MS).default(DEFAULT_INITIAL_DELAY_MS),
	maxDelayMs: z.number().max(MAX_TIMER_DELAY_MS).default(DEFAULT_MAX_DELAY_MS),
	jitterRatio: z.number().min(0).max(1).default(DEFAULT_JITTER_RATIO)
});
const normalPolicySchema = z.object({
	mode: z.const("normal").required(),
	maxRetries: z.number().step(1).min(0).max(Number.MAX_SAFE_INTEGER).default(DEFAULT_MAX_RETRIES),
	retryableCodes: z.array(z.string()).default([...DEFAULT_RETRYABLE_CODES]),
	backoff: backoffSchema
});
const alwaysPolicySchema = z.object({
	mode: z.const("always").required(),
	backoff: backoffSchema
});
z.union([normalPolicySchema, alwaysPolicySchema]);
const NORMAL_POLICY_KEYS = /* @__PURE__ */ new Set([
	"mode",
	"maxRetries",
	"retryableCodes",
	"backoff"
]);
const ALWAYS_POLICY_KEYS = /* @__PURE__ */ new Set([
	"mode",
	"maxRetries",
	"retryableCodes",
	"backoff"
]);
const BACKOFF_KEYS = /* @__PURE__ */ new Set([
	"initialDelayMs",
	"maxDelayMs",
	"jitterRatio"
]);
function validateKeys(value, allowed, path) {
	for (const key of Object.keys(value)) if (!allowed.has(key)) throw new Error(`${path}: unknown key "${key}"`);
}
function resolveBackoff(config, path) {
	if (config !== void 0) validateKeys(config, BACKOFF_KEYS, path);
	const initialDelayMs = config?.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;
	const maxDelayMs = config?.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
	const jitterRatio = config?.jitterRatio ?? DEFAULT_JITTER_RATIO;
	if (!Number.isFinite(initialDelayMs) || initialDelayMs <= 0 || initialDelayMs > 2147483647) throw new Error(`${path}.initialDelayMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
	if (!Number.isFinite(maxDelayMs) || maxDelayMs <= 0 || maxDelayMs > 2147483647) throw new Error(`${path}.maxDelayMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
	if (initialDelayMs > maxDelayMs) throw new Error(`${path}.initialDelayMs must be less than or equal to maxDelayMs`);
	if (!Number.isFinite(jitterRatio) || jitterRatio < 0 || jitterRatio > 1) throw new Error(`${path}.jitterRatio must be between 0 and 1`);
	return Object.freeze({
		initialDelayMs,
		maxDelayMs,
		jitterRatio
	});
}
/**
* Validate, default, and detach one provider-owned retry policy.
* @param config - optional provider configuration; omission selects normal defaults.
* @param path - diagnostic path naming the provider config that owns the value.
* @returns an immutable policy safe to capture in provider registration state.
*/
function resolveRetryPolicy(config, path) {
	if (config === void 0) return Object.freeze({
		mode: "normal",
		maxRetries: DEFAULT_MAX_RETRIES,
		retryableCodes: DEFAULT_RETRYABLE_CODES,
		...resolveBackoff(void 0, `${path}.backoff`)
	});
	switch (config.mode) {
		case "normal": {
			validateKeys(config, NORMAL_POLICY_KEYS, path);
			const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
			const retryableCodes = config.retryableCodes ?? [...DEFAULT_RETRYABLE_CODES];
			if (!Number.isSafeInteger(maxRetries) || maxRetries < 0) throw new Error(`${path}.maxRetries must be a non-negative safe integer`);
			if (retryableCodes.length === 0) throw new Error(`${path}.retryableCodes must not be empty`);
			if (retryableCodes.some((code) => typeof code !== "string" || code.length === 0)) throw new Error(`${path}.retryableCodes must contain only non-empty strings`);
			if (new Set(retryableCodes).size !== retryableCodes.length) throw new Error(`${path}.retryableCodes must not contain duplicates`);
			return Object.freeze({
				mode: "normal",
				maxRetries,
				retryableCodes: Object.freeze([...retryableCodes]),
				...resolveBackoff(config.backoff, `${path}.backoff`)
			});
		}
		case "always":
			validateKeys(config, ALWAYS_POLICY_KEYS, path);
			return Object.freeze({
				mode: "always",
				...resolveBackoff(config.backoff, `${path}.backoff`)
			});
		default: throw new Error(`${path}.mode must be "normal" or "always"`);
	}
}
/**
* Field-wise equality over {@link LlmCallConfig} — the comparison a caller
* runs to decide whether a proposed configuration is a real change (worth a
* logged header snapshot) or the held one restated.
* @param a - one configuration.
* @param b - the other.
* @returns whether every field (including the `stop` list, element-wise) matches.
*/
function callConfigEquals(a, b) {
	if (a.provider !== b.provider || a.model !== b.model || a.reasoningEffort !== b.reasoningEffort || a.temperature !== b.temperature || a.maxTokens !== b.maxTokens) return false;
	if (a.stop === void 0 || b.stop === void 0) return a.stop === b.stop;
	return a.stop.length === b.stop.length && a.stop.every((s, i) => s === b.stop?.[i]);
}
/**
* Normalization for values thrown by a final LLM adapter boundary.
*
* @module @deepseek-ai/dsh-llm/adapter-failure
*/
/**
* Detach serializable provider facts from a value thrown by an adapter.
* @param value - arbitrary value thrown during adapter dispatch or iteration.
* @returns immutable provider-neutral facts suitable for a terminal finish chunk.
* @internal
*/
function normalizeLlmFailure(value) {
	const error = value instanceof Error ? value : new HarnessError(thrownMessage(value), "UNKNOWN", { cause: value });
	const carried = ownFailureSnapshot(error);
	if (carried !== void 0 && carried.code === ownErrorCode(error)) return carried;
	return Object.freeze({
		message: errorMessage(error),
		code: harnessErrorCode(error)
	});
}
/** Render a non-Error throw without letting hostile coercion escape normalization. */
function thrownMessage(value) {
	try {
		const message = String(value);
		return message.length > 0 ? message : "LLM adapter failed";
	} catch (_hostileThrownValue) {
		return "LLM adapter failed";
	}
}
/** Read a foreign error's own data-backed `code` without invoking accessors. */
function ownErrorCode(error) {
	try {
		const descriptor = Object.getOwnPropertyDescriptor(error, "code");
		return descriptor !== void 0 && "value" in descriptor ? descriptor.value : void 0;
	} catch (_sdkPropertyTrap) {
		return;
	}
}
/** Snapshot an own data property without invoking an SDK-defined accessor. */
function ownFailureSnapshot(error) {
	try {
		const descriptor = Object.getOwnPropertyDescriptor(error, "failure");
		return descriptor !== void 0 && "value" in descriptor ? failureSnapshot(descriptor.value) : void 0;
	} catch (_sdkPropertyTrap) {
		return;
	}
}
/** Validate and detach an arbitrary serializable failure payload. */
function failureSnapshot(value) {
	if (typeof value !== "object" || value === null) return void 0;
	try {
		const candidate = value;
		const message = candidate.message;
		const code = candidate.code;
		const status = candidate.status;
		const providerRetryAfterMs = candidate.providerRetryAfterMs;
		const requestId = candidate.requestId;
		const offloadImages = candidate.offloadImages;
		if (typeof message !== "string" || message.length === 0 || typeof code !== "string" || code.length === 0 || status !== void 0 && (!Number.isInteger(status) || status < 100 || status > 599) || providerRetryAfterMs !== void 0 && (!Number.isFinite(providerRetryAfterMs) || providerRetryAfterMs <= 0) || requestId !== void 0 && (typeof requestId !== "string" || requestId.length === 0) || offloadImages !== void 0 && (!Number.isSafeInteger(offloadImages) || offloadImages <= 0)) return void 0;
		return Object.freeze({
			message,
			code,
			...status === void 0 ? {} : { status },
			...providerRetryAfterMs === void 0 ? {} : { providerRetryAfterMs },
			...requestId === void 0 ? {} : { requestId },
			...offloadImages === void 0 ? {} : { offloadImages }
		});
	} catch (_sdkFailureGetter) {
		return;
	}
}
/** Read an SDK error message without letting an accessor replace the primary failure. */
function errorMessage(error) {
	try {
		const message = error.message;
		if (typeof message === "string" && message.length > 0) return message;
	} catch (_sdkMessageGetter) {}
	return "LLM adapter failed";
}
/** Trust only Harness-owned codes; third-party SDK codes are not our taxonomy. */
function harnessErrorCode(error) {
	return error instanceof HarnessError ? error.code : "UNKNOWN";
}
function quoted(value) {
	return JSON.stringify(value);
}
/**
* Stable text shown to a model that cannot accept one durable image reference.
* @param ref - durable normalized attachment omitted from the request.
* @returns deterministic text-only placeholder.
*/
function textOnlyImageText(ref) {
	return `[image omitted because this model accepts text only; attachment sha256:${String(ref.attachmentId).slice(7, 15)}]`;
}
/**
* True when typed model content contains an image block. This is the one image
* walk shared by every image policy (capability gating, text-only
* serialization, compaction survey), so a consumer cannot silently diverge.
* @param content - typed model content blocks.
* @returns whether any block is an image.
*/
function contentHasImage(content) {
	return content.some((block) => block.type === "image");
}
/**
* True when typed model content contains a file block.
* Reads current content on every call without retaining scan results.
* @param content - typed model content blocks.
* @returns whether any block is a file.
*/
function contentHasFile(content) {
	for (const block of content) if (block.type === "file") return true;
	return false;
}
/**
* Stable model-facing handle for one durable file reference: the address of
* the verbatim stored copy and the instruction to read it on demand. This is
* the only representation a provider ever receives for a file.
* @param ref - durable verbatim file reference.
* @param readonlyPath - execution-world path of the stored copy, when resolvable.
* @returns deterministic handle text naming the file, its size, and its address.
*/
function fileHandleText(ref, readonlyPath) {
	const digest = String(ref.attachmentId).slice(7, 15);
	const identity = `File ${quoted(ref.name)} (${ref.bytes} bytes, sha256:${digest})`;
	if (readonlyPath === void 0) return `[${identity} was uploaded, but the current execution environment cannot access a readable path. Report that limitation if its contents are needed; do not claim to have read it.]`;
	return `[${identity}: verbatim read-only copy saved at ${quoted(readonlyPath)}. Read that path with your file tools when its contents are needed; copy it to a writable location before modifying it. When delegating file work, include this saved path in the delegation prompt; only subagents sharing this execution environment can read it.]`;
}
/** Replace every file occurrence with handle text. */
function replaceFilesWithHandles(blocks, resolvePath) {
	let next;
	for (const [index, block] of blocks.entries()) {
		if (block.type === "file") {
			next ??= blocks.slice(0, index);
			next.push({
				type: "text",
				text: fileHandleText(block.attachment, resolvePath(block.attachment))
			});
			continue;
		}
		next?.push(block);
	}
	return next ?? blocks;
}
function projectFilesToText(messages, resolvePath) {
	if (!messages.some((message) => contentHasFile(message.content))) return messages;
	return messages.map((message) => {
		const content = replaceFilesWithHandles(message.content, resolvePath);
		return content === message.content ? message : {
			...message,
			content
		};
	});
}
/** Replace every image occurrence for a text-only model. */
function replaceImagesForTextModel(blocks) {
	let next;
	for (const [index, block] of blocks.entries()) {
		if (block.type === "image") {
			next ??= blocks.slice(0, index);
			next.push({
				type: "text",
				text: textOnlyImageText(block.attachment)
			});
			continue;
		}
		next?.push(block);
	}
	return next ?? blocks;
}
function projectImagesForTextModel(messages) {
	if (!messages.some((message) => contentHasImage(message.content))) return messages;
	return messages.map((message) => {
		const content = replaceImagesForTextModel(message.content);
		return content === message.content ? message : {
			...message,
			content
		};
	});
}
function withoutDeveloperMessages(messages) {
	const retained = messages.filter((message) => message.role !== "developer");
	return retained.length === messages.length ? messages : retained;
}
function toolDeclarations(tools, mode, history) {
	const declarations = new Map(history.tools.map((tool) => [tool.name, tool]));
	for (const update of history.updates) for (const tool of update.additions) if (!declarations.has(tool.name)) declarations.set(tool.name, {
		...tool,
		deferLoading: true
	});
	switch (mode) {
		case "in-history": return declarations;
		case "addition-only": {
			const activeNames = new Set(tools?.map((tool) => tool.name));
			for (const name of declarations.keys()) if (!activeNames.has(name)) declarations.delete(name);
			return declarations;
		}
		/* v8 ignore next 2 -- closed-union exhaustiveness guard */
		default: return assertNever(mode);
	}
}
/**
* Construct provider declarations from session-folded history without changing logged active tools.
* Unsupported routes and incomplete history use current declarations without developer updates.
* Explicitly deferred baseline tools become available only after their first retained addition.
* @param messages - complete request inputs, or the prefix selected for an auxiliary call.
* @param tools - currently active tool schemas.
* @param toolUpdate - the resolved route's update mode.
* @param history - immutable state folded from committed headers and developer messages.
* @returns provider declarations and the corresponding filtered history.
*/
function projectToolUpdates(messages, tools, toolUpdate, history) {
	if (toolUpdate === void 0) {
		let immediateTools = tools;
		if (tools?.some((tool) => tool.deferLoading === true)) immediateTools = tools.map(({ deferLoading: _loading, ...tool }) => tool);
		return {
			messages: withoutDeveloperMessages(messages),
			tools: immediateTools
		};
	}
	if (history === void 0) return {
		messages: withoutDeveloperMessages(messages),
		tools
	};
	const messageIds = new Set(messages.flatMap((message) => message.role === "developer" ? [message.id] : []));
	if (history.updates.some((update) => !messageIds.has(update.messageId))) return {
		messages: withoutDeveloperMessages(messages),
		tools
	};
	const declarations = toolDeclarations(tools, toolUpdate, history);
	const updateIds = new Set(history.updates.map((update) => update.messageId));
	const offered = new Set(history.tools.filter((tool) => !tool.deferLoading).map((tool) => tool.name));
	const projectedMessages = [];
	for (const message of messages) {
		if (message.role !== "developer") {
			projectedMessages.push(message);
			continue;
		}
		if (!updateIds.has(message.id)) continue;
		const content = message.content.filter((block) => {
			switch (block.type) {
				case "tool-addition":
					if (!declarations.has(block.toolName) || offered.has(block.toolName)) return false;
					offered.add(block.toolName);
					return true;
				case "tool-removal":
					if (toolUpdate !== "in-history") return false;
					return offered.delete(block.toolName);
				default: return true;
			}
		});
		if (content.length === 0) continue;
		if (content.length === message.content.length) projectedMessages.push(message);
		else projectedMessages.push({
			...message,
			content
		});
	}
	return {
		messages: projectedMessages.length === messages.length && projectedMessages.every((message, index) => message === messages[index]) ? messages : projectedMessages,
		tools: [...declarations.values()]
	};
}
/**
* Centralize the non-secret product identity every provider request sends as `User-Agent`, keeping
* adapters from drifting. See
* `docs/subsystems/llm-streaming.md#appidentity--app-attribution`.
*
* App-attribution vocabulary for provider requests.
* @module @deepseek-ai/dsh-llm/attribution
*/
const { version } = createRequire(import.meta.url)("../package.json");
/**
* LLM service: adapter registry with a waterfall-interceptable streaming call
* API. Exports the `LlmRuntime` default, the abstract `LlmAdapter` for
* provider backends, and `BlockAssembler` for chunk assembly.
*
* @module @deepseek-ai/dsh-llm
*/
var __runInitializers$1 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate$1 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
/**
* Typed error for LLM-related failures. Extends {@link HarnessError}, so the
* `code` string (e.g. `AUTH`, `RATE_LIMIT`, `NO_ADAPTER`) is shared taxonomy.
*/
var LlmError = class extends HarnessError {
	/** Serializable facts retained beside this live Error. */
	failure;
	/**
	* @param message - non-empty human-readable failure summary.
	* @param code - non-empty stable provider-neutral machine code.
	* @param options - optional cause and validated serializable provider facts.
	*/
	constructor(message, code, options) {
		if (typeof message !== "string" || message.length === 0) throw new Error("LlmError message must be a non-empty string");
		if (typeof code !== "string" || code.length === 0) throw new Error("LlmError code must be a non-empty string");
		if (options?.status !== void 0 && (!Number.isInteger(options.status) || options.status < 100 || options.status > 599)) throw new Error("LlmError status must be an integer from 100 through 599");
		if (options?.providerRetryAfterMs !== void 0 && (!Number.isFinite(options.providerRetryAfterMs) || options.providerRetryAfterMs <= 0)) throw new Error("LlmError providerRetryAfterMs must be a positive finite number");
		if (options?.requestId !== void 0 && (typeof options.requestId !== "string" || options.requestId.length === 0)) throw new Error("LlmError requestId must be a non-empty string");
		super(message, code, options);
		this.name = "LlmError";
		this.failure = Object.freeze({
			message,
			code,
			...options?.status === void 0 ? {} : { status: options.status },
			...options?.providerRetryAfterMs === void 0 ? {} : { providerRetryAfterMs: options.providerRetryAfterMs },
			...options?.requestId === void 0 ? {} : { requestId: options.requestId },
			...options?.offloadImages === void 0 ? {} : { offloadImages: options.offloadImages }
		});
	}
};
(() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _listProviders_decorators;
	let _listConfigurableProviders_decorators;
	let _remoteDiscoverModels_decorators;
	return class LlmRuntime extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_listProviders_decorators = [Remote];
			_listConfigurableProviders_decorators = [Remote];
			_remoteDiscoverModels_decorators = [Remote("discoverModels")];
			__esDecorate$1(this, null, _listProviders_decorators, {
				kind: "method",
				name: "listProviders",
				static: false,
				private: false,
				access: {
					has: (obj) => "listProviders" in obj,
					get: (obj) => obj.listProviders
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate$1(this, null, _listConfigurableProviders_decorators, {
				kind: "method",
				name: "listConfigurableProviders",
				static: false,
				private: false,
				access: {
					has: (obj) => "listConfigurableProviders" in obj,
					get: (obj) => obj.listConfigurableProviders
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate$1(this, null, _remoteDiscoverModels_decorators, {
				kind: "method",
				name: "remoteDiscoverModels",
				static: false,
				private: false,
				access: {
					has: (obj) => "remoteDiscoverModels" in obj,
					get: (obj) => obj.remoteDiscoverModels
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		adapters = (__runInitializers$1(this, _instanceExtraInitializers), /* @__PURE__ */ new Map());
		directory = /* @__PURE__ */ new Map();
		discoveries = /* @__PURE__ */ new Map();
		constructor(ctx) {
			super(ctx, "llm");
		}
		/** Notify topology observers without letting one broken listener veto the commit. */
		emitAdaptersUpdated() {
			for (const listener of this.ctx.events.dispatch("emit", ["llm/adapters-updated"])) try {
				const returned = listener();
				if (returned != null && typeof returned.then === "function") Promise.resolve(returned).then(void 0, (error) => {
					this.warnAdaptersListenerFailure(error);
				});
			} catch (error) {
				this.warnAdaptersListenerFailure(error);
			}
		}
		/** Contained-listener diagnostic shared by the sync and async failure paths. */
		warnAdaptersListenerFailure(error) {
			this.ctx.logger.warn("llm: an llm/adapters-updated listener failed");
			this.ctx.logger.warn(error);
		}
		/**
		* Register an adapter for the given provider routes. Throws `LlmError` with code
		* `DUPLICATE_ADAPTER` if any provider already has an adapter (all-or-nothing).
		* Disposed with the fiber.
		* @param providers - every provider route this adapter should serve.
		* @param adapter - the adapter that streams calls for those providers.
		* @returns the disposer, carrying {@link AdapterRegistrationHandle.replace}.
		*/
		registerAdapter(providers, adapter) {
			const owned = /* @__PURE__ */ new Set();
			let released = false;
			const dispose = this.ctx.effect(function* () {
				if (providers.length === 0) throw new LlmError("an adapter must register at least one provider", "INVALID_ADAPTER");
				this.commitRoutes(owned, this.prepareRoutes(providers, adapter, owned));
				yield () => {
					released = true;
					for (const provider of owned) this.adapters.delete(provider);
					owned.clear();
					this.emitAdaptersUpdated();
				};
			}.bind(this), "llm.registerAdapter()");
			const handle = (() => void dispose());
			handle.replace = (next) => {
				if (released) throw new LlmError("a disposed adapter registration cannot replace its routes", "REGISTRATION_DISPOSED");
				this.commitRoutes(owned, this.prepareRoutes(next, adapter, owned));
			};
			return handle;
		}
		/**
		* Validate one candidate route set for `adapter`, treating routes this
		* registration already holds as available. Nothing is mutated: a rejected
		* candidate leaves the registry exactly as it was.
		*/
		prepareRoutes(providers, adapter, owned) {
			const unique = /* @__PURE__ */ new Set();
			const registrations = [];
			for (const provider of providers) {
				if (provider.length === 0) throw new LlmError("adapter provider names must be non-empty", "INVALID_ADAPTER");
				if (unique.has(provider) || this.adapters.has(provider) && !owned.has(provider)) throw new LlmError(`an adapter for provider "${provider}" is already registered`, "DUPLICATE_ADAPTER");
				const info = adapter.providerInfo(provider);
				if (typeof info.id !== "string" || info.id !== provider || typeof info.name !== "string" || info.name.length === 0) throw new LlmError(`adapter metadata for provider "${provider}" must preserve its id and have a non-empty name`, "INVALID_ADAPTER");
				unique.add(provider);
				const retryPolicy = adapter.providerRetryPolicy(provider) ?? resolveRetryPolicy(void 0, `llm: provider "${provider}" retryPolicy`);
				registrations.push({
					adapter,
					provider: {
						id: info.id,
						name: info.name
					},
					retryPolicy
				});
			}
			return registrations;
		}
		/**
		* Swap this registration's routes for the prepared ones in one synchronous
		* section, so no observer can see the registry between the release and the
		* re-registration. The route set's one mutation point is also where
		* `llm/adapters-updated` is published, so a `replace` announces itself
		* exactly like a first registration.
		*/
		commitRoutes(owned, registrations) {
			for (const provider of owned) this.adapters.delete(provider);
			owned.clear();
			for (const registration of registrations) {
				this.adapters.set(registration.provider.id, registration);
				owned.add(registration.provider.id);
			}
			this.emitAdaptersUpdated();
		}
		/**
		* Describe provider routes with a registered adapter.
		* @returns detached provider metadata in registration order.
		*/
		listProviders() {
			return [...this.adapters.values()].map(({ provider }) => ({ ...provider }));
		}
		/**
		* Declare provider routes an adapter plugin can activate through
		* configuration. Registration is all-or-nothing: an empty list, invalid
		* entry, or a provider already declared by any registration throws
		* `LlmError` without registering the rest. Disposed with the fiber.
		* @param entries - every configurable provider this plugin owns.
		* @returns a handle that withdraws all of them, and can atomically replace them.
		*/
		registerConfigurableProviders(entries) {
			let held = [];
			let disposed = false;
			/**
			* Validate a candidate set in full against everything this registration
			* does not already hold, then publish it. Nothing is written until the
			* whole set passes, so a refused candidate leaves the current entries in
			* place — the property that makes `replace` a swap rather than a
			* delete-then-add that can strand the directory empty.
			*/
			const commit = (candidates) => {
				const detached = [];
				const own = new Set(held.map((entry) => entry.provider));
				for (const entry of candidates) {
					if (entry.provider.length === 0 || entry.displayName.length === 0 || entry.settingsNs.length === 0) throw new LlmError("configurable providers need a non-empty provider, displayName, and settingsNs", "INVALID_DIRECTORY");
					if (entry.settingsPath.some((segment) => segment.length === 0)) throw new LlmError(`configurable provider "${entry.provider}" has an empty settingsPath segment`, "INVALID_DIRECTORY");
					if (this.directory.has(entry.provider) && !own.has(entry.provider) || detached.some((seen) => seen.provider === entry.provider)) throw new LlmError(`configurable provider "${entry.provider}" is already declared`, "DUPLICATE_DIRECTORY");
					detached.push(detachDirectoryEntry(entry));
				}
				for (const entry of held) this.directory.delete(entry.provider);
				for (const entry of detached) this.directory.set(entry.provider, entry);
				held = detached;
				this.emitAdaptersUpdated();
			};
			const dispose = this.ctx.effect(function* () {
				if (entries.length === 0) throw new LlmError("a configurable-provider registration must declare at least one provider", "INVALID_DIRECTORY");
				commit(entries);
				yield () => {
					disposed = true;
					for (const entry of held) this.directory.delete(entry.provider);
					held = [];
					this.emitAdaptersUpdated();
				};
			}.bind(this), "llm.registerConfigurableProviders()");
			const handle = (() => void dispose());
			handle.replace = (next) => {
				if (disposed) throw new LlmError("this configurable-provider registration was disposed", "REGISTRATION_DISPOSED");
				commit(next);
			};
			return handle;
		}
		/**
		* List every declared configurable provider, registered or dormant.
		* @returns detached directory entries in declaration order.
		*/
		listConfigurableProviders() {
			return [...this.directory.values()].map(detachDirectoryEntry);
		}
		/**
		* Offer to interrogate provider endpoints on behalf of the settings
		* namespace this plugin owns. The namespace is the key because that is what
		* a configuration surface already holds from the configurable-provider
		* directory, and because a provider being *added* has no route to name yet.
		* Disposed with the fiber.
		* @param settingsNs - the namespace whose profiles this discovery serves.
		* @param discover - interrogates one endpoint and must honor the supplied signal.
		* @returns the disposer that withdraws the offer.
		*/
		registerModelDiscovery(settingsNs, discover) {
			const dispose = this.ctx.effect(function* () {
				if (settingsNs.length === 0) throw new LlmError("model discovery needs a non-empty settings namespace", "INVALID_DISCOVERY");
				if (this.discoveries.has(settingsNs)) throw new LlmError(`model discovery for "${settingsNs}" is already registered`, "DUPLICATE_DISCOVERY");
				this.discoveries.set(settingsNs, discover);
				yield () => {
					this.discoveries.delete(settingsNs);
				};
			}.bind(this), "llm.registerModelDiscovery()");
			return () => void dispose();
		}
		/**
		* Interrogate one provider endpoint for the models it advertises. The
		* request describes a draft, not a stored route, so nothing here reads or
		* writes settings or credentials — the caller owns both, and the reply is
		* candidate metadata a surface may offer for adoption.
		* @param settingsNs - namespace whose registered discovery serves this draft.
		* @param request - the endpoint, protocol, and one-shot credential to use.
		* @param signal - caller cancellation.
		* @returns the advertised models, deduplicated in endpoint order.
		*/
		async discoverModels(settingsNs, request, signal) {
			const discover = this.discoveries.get(settingsNs);
			if (discover === void 0) throw new LlmError(`no model discovery is registered for "${settingsNs}"`, "NO_DISCOVERY");
			if ((request.provider ?? "").length === 0 && (request.baseURL ?? "").length === 0) throw new LlmError("model discovery needs a provider route or a baseURL", "INVALID_DISCOVERY");
			const discovered = signal === void 0 ? await discover(request) : await discover(request, signal);
			const seen = /* @__PURE__ */ new Set();
			const models = [];
			for (const model of discovered) {
				if (typeof model.id !== "string" || model.id.length === 0 || seen.has(model.id)) continue;
				seen.add(model.id);
				models.push({
					id: model.id,
					...model.name === void 0 ? {} : { name: model.name },
					...model.contextWindow === void 0 ? {} : { contextWindow: model.contextWindow },
					...model.maxTokens === void 0 ? {} : { maxTokens: model.maxTokens },
					...model.inputModalities === void 0 ? {} : { inputModalities: [...model.inputModalities] }
				});
			}
			return models;
		}
		/**
		* Remote adapter for one draft provider interrogation.
		* @param settingsNs - namespace whose registered discovery serves this draft.
		* @param request - endpoint, protocol, and one-shot credential to use.
		* @param signal - caller cancellation supplied by the Remote carrier.
		* @returns advertised models in endpoint order.
		* @throws RemoteError with `llm/model-discovery-rejected` when discovery refuses or fails.
		*/
		async remoteDiscoverModels(settingsNs, request, signal) {
			try {
				return await this.discoverModels(settingsNs, request, signal);
			} catch (error) {
				throw new RemoteError("llm/model-discovery-rejected", error instanceof Error ? error.message : String(error), {
					settingsNs,
					...request.baseURL === void 0 ? {} : { baseURL: request.baseURL }
				}, { cause: error });
			}
		}
		/**
		* Resolve the retry policy captured when one provider route was registered.
		* @param provider - registered provider route to inspect.
		* @returns the provider-owned policy, with normal defaults already resolved.
		*/
		providerRetryPolicy(provider) {
			return this.registration(provider).retryPolicy;
		}
		/**
		* Resolve provider-side request-image pricing for one exact route, or
		* `undefined` when the provider is unregistered or declares none. Unknown
		* providers degrade to `undefined` rather than throwing because callers
		* price durable history whose route may no longer be mounted.
		* @param provider - provider route named by a request header.
		* @param model - exact model id named by the same header.
		* @returns the owning adapter's image pricing for the route, when declared.
		*/
		imageRequestPricing(provider, model) {
			return this.adapters.get(provider)?.adapter.imageRequestPricing(provider, model);
		}
		/**
		* Resolve the image projection for an exact registered model route.
		* @param provider - registered provider route.
		* @param model - exact model id.
		* @param image - normalized image reference.
		* @returns dimensions and byte target used by the adapter's request serializer.
		*/
		imageRequestTarget(provider, model, image) {
			return this.registration(provider).adapter.imageRequestTarget(provider, model, image);
		}
		/**
		* Resolve the exact text one durable file occurrence contributes to every
		* provider request in the current execution environment.
		* @param ref - durable verbatim file reference from model history.
		* @returns the same deterministic handle text used at adapter dispatch.
		*/
		fileRequestText(ref) {
			return fileHandleText(ref, this.fileReadPath(ref));
		}
		/** Detach typed adapter-owned modality metadata. */
		detachedModalities(modalities) {
			return modalities === void 0 ? void 0 : [...modalities];
		}
		/**
		* Discover models advertised by one registered provider. Catalog membership
		* does not constrain core routing. Catalog-driven entry points may restrict
		* selection and submission to the advertised models.
		* @param provider - registered provider route to inspect.
		* @returns detached model metadata in adapter-preferred order.
		*/
		async listModels(provider) {
			const models = await this.registration(provider).adapter.listModels(provider);
			const seen = /* @__PURE__ */ new Set();
			return models.map((model) => {
				if (typeof model.provider !== "string" || model.provider !== provider || typeof model.id !== "string" || model.id.length === 0 || typeof model.name !== "string" || model.name.length === 0 || model.description !== void 0 && typeof model.description !== "string" || seen.has(model.id)) throw new LlmError(`adapter returned invalid or duplicate model metadata for provider "${provider}"`, "INVALID_CATALOG");
				seen.add(model.id);
				const inputModalities = this.detachedModalities(model.inputModalities);
				return {
					provider: model.provider,
					id: model.id,
					name: model.name,
					...model.description === void 0 ? {} : { description: model.description },
					...inputModalities === void 0 ? {} : { inputModalities }
				};
			});
		}
		/**
		* Resolve and validate all metadata from the adapter that owns one exact
		* route. The result is detached from adapter-owned objects; catalog
		* membership remains advisory and does not control request routing.
		* @param provider - registered provider route to inspect.
		* @param model - exact model id passed to the adapter.
		* @param signal - optional cancellation for adapter-owned asynchronous lookup.
		* @returns exact model identity plus available context and reasoning metadata.
		*/
		async resolveModelInfo(provider, model, signal) {
			return this.resolveModelInfoFor(this.registration(provider), model, signal);
		}
		async resolveModelInfoFor(registration, model, signal) {
			const resolved = await registration.adapter.resolveModel(registration.provider.id, model, signal);
			return this.normalizeModelInfo(registration, model, resolved);
		}
		/** Validate and detach one adapter-returned exact model result. */
		normalizeModelInfo(registration, model, resolved) {
			const provider = registration.provider.id;
			if (typeof resolved.provider !== "string" || resolved.provider !== provider || typeof resolved.id !== "string" || resolved.id !== model || typeof resolved.name !== "string" || resolved.name.length === 0 || resolved.description !== void 0 && typeof resolved.description !== "string") throw new LlmError(`adapter returned invalid exact model metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_INFO");
			const context = resolved.context;
			if (context !== void 0 && (!Number.isInteger(context.contextWindow) || context.contextWindow <= 0)) throw new LlmError(`adapter returned invalid context metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_CONTEXT");
			const inputModalities = this.detachedModalities(resolved.inputModalities);
			const systemPromptUpdate = resolved.systemPromptUpdate;
			if (systemPromptUpdate !== void 0 && systemPromptUpdate !== "in-history") throw new LlmError(`adapter returned invalid system prompt update mode for provider "${provider}" model "${model}"`, "INVALID_MODEL_INFO");
			const toolUpdate = resolved.toolUpdate;
			if (toolUpdate !== void 0 && toolUpdate !== "in-history" && toolUpdate !== "addition-only") throw new LlmError(`adapter returned invalid tool update mode for provider "${provider}" model "${model}"`, "INVALID_MODEL_INFO");
			const defaultMaxTokens = resolved.defaultMaxTokens;
			if (defaultMaxTokens !== void 0 && (!Number.isSafeInteger(defaultMaxTokens) || defaultMaxTokens <= 0)) throw new LlmError(`adapter returned invalid default maxTokens for provider "${provider}" model "${model}"`, "INVALID_MODEL_MAX_TOKENS");
			const info = {
				provider,
				id: model,
				name: resolved.name,
				...resolved.description === void 0 ? {} : { description: resolved.description },
				...inputModalities === void 0 ? {} : { inputModalities },
				...context === void 0 ? {} : { context: { contextWindow: context.contextWindow } },
				...defaultMaxTokens === void 0 ? {} : { defaultMaxTokens },
				...resolved.systemPromptUpdate === void 0 ? {} : { systemPromptUpdate: resolved.systemPromptUpdate },
				...resolved.toolUpdate === void 0 ? {} : { toolUpdate: resolved.toolUpdate }
			};
			const reasoning = resolved.reasoning;
			if (reasoning === void 0) return info;
			if (reasoning.efforts.length === 0) throw new LlmError(`adapter returned invalid reasoning metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_REASONING");
			const seen = /* @__PURE__ */ new Set();
			const efforts = reasoning.efforts.map((effort) => {
				if (typeof effort.id !== "string" || effort.id.length === 0 || typeof effort.name !== "string" || effort.name.length === 0 || effort.description !== void 0 && typeof effort.description !== "string" || seen.has(effort.id)) throw new LlmError(`adapter returned invalid or duplicate reasoning effort metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_REASONING");
				seen.add(effort.id);
				return {
					id: effort.id,
					name: effort.name,
					...effort.description === void 0 ? {} : { description: effort.description }
				};
			});
			if (reasoning.defaultEffort !== void 0 && !seen.has(reasoning.defaultEffort)) throw new LlmError(`adapter returned an unknown default reasoning effort for provider "${provider}" model "${model}"`, "INVALID_MODEL_REASONING");
			return {
				...info,
				reasoning: {
					efforts,
					...reasoning.defaultEffort === void 0 ? {} : { defaultEffort: reasoning.defaultEffort }
				}
			};
		}
		/**
		* Validate a conversation call config against its exact model capability and
		* materialize adapter-configured defaults. Unsupported explicit efforts
		* reject before provider I/O; no clamping or aliasing is performed. This
		* standalone query does not bind a later dispatch; use {@link prepareCall}
		* when logging and streaming must share one adapter registration.
		* @param config - provider/model route and optional request controls.
		* @param signal - optional cancellation for adapter-owned capability lookup.
		* @returns a detached config only when a default must be materialized.
		*/
		async resolveCallConfig(config, signal) {
			return (await this.resolveCallFor(this.registration(config.provider), config, signal)).config;
		}
		async resolveCallFor(registration, config, signal) {
			const info = await this.resolveModelInfoFor(registration, config.model, signal);
			return this.resolveCallWithInfo(config, info);
		}
		/** Validate request controls against one already-bound exact model result. */
		resolveCallWithInfo(config, info) {
			const defaulted = config.maxTokens === void 0 && info.defaultMaxTokens !== void 0 ? {
				...config,
				maxTokens: info.defaultMaxTokens
			} : config;
			const reasoning = info.reasoning;
			const requested = defaulted.reasoningEffort;
			let resolvedConfig = defaulted;
			if (reasoning === void 0) {
				if (requested !== void 0) throw new LlmError(`provider "${config.provider}" model "${config.model}" does not support reasoning effort "${requested}"`, "UNSUPPORTED_REASONING_EFFORT");
			} else {
				const effective = requested ?? reasoning.defaultEffort;
				if (effective !== void 0) {
					if (!reasoning.efforts.some((effort) => effort.id === effective)) throw new LlmError(`provider "${config.provider}" model "${config.model}" does not support reasoning effort "${effective}"`, "UNSUPPORTED_REASONING_EFFORT");
					if (requested !== effective) resolvedConfig = {
						...defaulted,
						reasoningEffort: effective
					};
				}
			}
			return {
				config: resolvedConfig,
				...info.context === void 0 ? {} : { context: info.context },
				modelInfo: info
			};
		}
		/**
		* Resolve one call under its current adapter registration. The returned
		* one-shot handle keeps that registration across header logging and dispatch,
		* so HMR cannot combine one adapter's capability result with another adapter.
		* An optional synchronous callback selects concrete controls using captured
		* model metadata. Defaults and validation apply to its result. Callback
		* failures and cancellation reject preparation before dispatch.
		* @param config - provider/model route and optional concrete request controls.
		* @param signal - optional cancellation for adapter-owned capability lookup.
		* @param configure - pure control selection, called once before defaults and validation.
		* @returns a prepared config and its registration-bound stream entry point.
		*/
		async prepareCall(config, signal, configure) {
			signal?.throwIfAborted();
			const { provider, model, ...controls } = config;
			const registration = this.registration(provider);
			const adapterCall = await registration.adapter.prepareCall(provider, model, signal);
			signal?.throwIfAborted();
			const modelInfo = this.normalizeModelInfo(registration, model, adapterCall.model);
			const proposed = configure === void 0 ? config : {
				...configure(deepFreeze(structuredClone(controls)), deepFreeze(modelInfo)),
				provider,
				model
			};
			signal?.throwIfAborted();
			const resolved = this.resolveCallWithInfo(proposed, modelInfo);
			const resolvedConfig = deepFreeze(structuredClone(resolved.config));
			const context = resolved.context === void 0 ? void 0 : deepFreeze(structuredClone(resolved.context));
			const adapterDefaults = deepFreeze({
				...proposed.reasoningEffort === void 0 && resolvedConfig.reasoningEffort !== void 0 ? { reasoningEffort: true } : {},
				...proposed.maxTokens === void 0 && resolvedConfig.maxTokens !== void 0 ? { maxTokens: true } : {}
			});
			let dispatched = false;
			return Object.freeze({
				config: resolvedConfig,
				retryPolicy: registration.retryPolicy,
				adapterDefaults,
				...context === void 0 ? {} : { context },
				...modelInfo.inputModalities === void 0 ? {} : { inputModalities: Object.freeze([...modelInfo.inputModalities]) },
				...modelInfo.systemPromptUpdate === void 0 ? {} : { systemPromptUpdate: modelInfo.systemPromptUpdate },
				...modelInfo.toolUpdate === void 0 ? {} : { toolUpdate: modelInfo.toolUpdate },
				stream: (options) => {
					if (dispatched) throw new LlmError("a prepared LLM call can only be dispatched once", "INVALID_PREPARED_CALL");
					if (!callConfigEquals(options, resolvedConfig)) throw new LlmError("prepared LLM call config changed before adapter dispatch", "INVALID_PREPARED_CALL");
					dispatched = true;
					return this.streamWithRegistration(options, {
						registration,
						config: resolvedConfig,
						modelInfo,
						dispatch: (options) => adapterCall.stream(options)
					});
				}
			});
		}
		registration(provider) {
			const registration = this.adapters.get(provider);
			if (!registration) throw new LlmError(`no adapter registered for provider "${provider}"`, "NO_ADAPTER");
			return registration;
		}
		/** Remove replay state whose historical route is owned by another adapter. */
		forAdapter(options, adapter) {
			const messages = options.messages.map((message) => {
				if (message.role !== "assistant") return message;
				const source = message.source;
				if (source.replayState === void 0) return message;
				if (this.adapters.get(source.provider)?.adapter === adapter) return message;
				return freezeMessage({
					...message,
					source: {
						kind: "model",
						provider: source.provider,
						model: source.model
					}
				});
			});
			if (messages.every((message, index) => message === options.messages[index])) return options;
			const filtered = {
				...options,
				messages
			};
			return Object.isFrozen(options) ? deepFreeze(filtered) : filtered;
		}
		/**
		* Resolve the current execution-world read path of one durable file
		* reference through the mounted attachment and filesystem providers.
		*/
		fileReadPath(ref) {
			let hostPath;
			try {
				hostPath = this.ctx.get("attachments")?.fileHostPath(ref);
			} catch {
				return;
			}
			if (hostPath === void 0) return void 0;
			return this.ctx.get("fs")?.processPathFromHostPath(hostPath);
		}
		/**
		* Final adapter boundary. Adapter selection, dispatch, iterator construction,
		* and iteration failures become one terminal failure chunk. Middleware and
		* downstream consumer failures remain thrown plugin or consumer errors.
		*/
		async *adapterStream(options, prepared) {
			let iterator;
			try {
				const registration = prepared?.registration ?? this.registration(options.provider);
				const adapter = registration.adapter;
				let modelInfo;
				let resolvedConfig;
				let dispatch;
				if (prepared === void 0) {
					const adapterCall = await adapter.prepareCall(options.provider, options.model, options.signal);
					modelInfo = this.normalizeModelInfo(registration, options.model, adapterCall.model);
					resolvedConfig = this.resolveCallWithInfo(options, modelInfo).config;
					dispatch = (options) => adapterCall.stream(options);
				} else {
					modelInfo = prepared.modelInfo;
					resolvedConfig = prepared.config;
					dispatch = prepared.dispatch;
				}
				if (prepared !== void 0 && !callConfigEquals(options, resolvedConfig)) throw new LlmError("prepared LLM call config changed before adapter dispatch", "INVALID_PREPARED_CALL");
				const resolvedOptions = callConfigEquals(options, resolvedConfig) ? options : Object.isFrozen(options) ? deepFreeze({
					...options,
					...resolvedConfig
				}) : {
					...options,
					...resolvedConfig
				};
				let projectedMessages = resolvedOptions.messages;
				if (projectedMessages.some((message) => contentHasFile(message.content))) projectedMessages = projectFilesToText(projectedMessages, (ref) => this.fileReadPath(ref));
				if (modelInfo.inputModalities !== void 0 && !modelInfo.inputModalities.includes("image") && projectedMessages.some((message) => contentHasImage(message.content))) projectedMessages = projectImagesForTextModel(projectedMessages);
				const projectedTools = projectToolUpdates(projectedMessages, resolvedOptions.tools, modelInfo.toolUpdate, resolvedOptions.toolHistory);
				projectedMessages = projectedTools.messages;
				let projectedOptions = resolvedOptions;
				if (projectedMessages !== resolvedOptions.messages || projectedTools.tools !== resolvedOptions.tools) {
					projectedOptions = {
						...resolvedOptions,
						messages: projectedMessages,
						...projectedTools.tools === void 0 ? {} : { tools: projectedTools.tools }
					};
					if (Object.isFrozen(resolvedOptions)) deepFreeze(projectedOptions);
				}
				iterator = dispatch(this.forAdapter(projectedOptions, adapter))[Symbol.asyncIterator]();
			} catch (error) {
				yield adapterFailureChunk(error, options.signal);
				return;
			}
			let completed = false;
			try {
				while (true) {
					let item;
					try {
						const next = await iterator.next();
						item = next.done ? { done: true } : {
							done: false,
							value: next.value
						};
					} catch (error) {
						completed = true;
						yield adapterFailureChunk(error, options.signal);
						return;
					}
					if (item.done) {
						completed = true;
						return;
					}
					yield item.value;
				}
			} finally {
				if (!completed) {
					const close = iterator.return?.bind(iterator);
					if (close) await close();
				}
			}
		}
		/**
		* Stream one model call as raw chunks (token-level deltas). Replay state is
		* retained only when the same adapter instance owns its historical provider
		* and the target provider. Final adapter selection remains fixed through
		* asynchronous exact-model resolution and dispatch. Adapter selection,
		* dispatch, and iteration failures become terminal `error` or `aborted`
		* finish chunks; middleware, nested-call, cleanup, and consumer failures
		* remain thrown.
		* @param options - the full request; `options.provider` selects the adapter.
		* @returns the chunk stream, possibly wrapped by `llm/stream` listeners.
		*/
		stream(options) {
			return this.streamWithRegistration(options);
		}
		streamWithRegistration(options, prepared) {
			return this.ctx.waterfall(this, "llm/stream", options, () => this.adapterStream(options, prepared));
		}
	};
})();
/** Convert one adapter throw into the stream protocol's terminal outcome. */
function adapterFailureChunk(error, signal) {
	const failure = normalizeLlmFailure(error);
	return {
		type: "finish",
		reason: signal?.aborted || failure.code === "ABORTED" ? {
			kind: "aborted",
			failure
		} : {
			kind: "error",
			failure
		}
	};
}
/** Copy a directory entry, including its arrays, so neither side can mutate the other's copy. */
function detachDirectoryEntry(entry) {
	const { nativeAuth } = entry;
	return {
		...entry,
		settingsPath: [...entry.settingsPath],
		...entry.baseURLEnv === void 0 ? {} : { baseURLEnv: [...entry.baseURLEnv] },
		...nativeAuth === void 0 ? {} : { nativeAuth: {
			...nativeAuth,
			env: [...nativeAuth.env]
		} }
	};
}
//#endregion
//#region ../node_modules/@deepseek-ai/dsh-session/lib/index.js
/**
* Brand a string as a {@link SessionId}.
* @param id - the raw session id string.
* @returns the same string with the session-id brand.
*/
function SessionId(id) {
	return brandString(id);
}
/**
* Deep structural equality over the session-event JSON value domain
* (null/boolean/number/string, arrays, plain objects). Replaces
* `node:util`'s isDeepStrictEqual to keep this module browser-safe.
*/
function isDeepEqualJson(a, b) {
	if (a === b) return true;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
		return a.every((item, i) => isDeepEqualJson(item, b[i]));
	}
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
	const aKeys = Object.keys(a);
	const bRecord = b;
	if (aKeys.length !== Object.keys(b).length) return false;
	return aKeys.every((key) => Object.hasOwn(b, key) && isDeepEqualJson(a[key], bRecord[key]));
}
//#endregion
//#region ../.build/agent-preset-authoring/tsc/storage.js
/**
* The directory layout authored agents persist to, and the readers and
* writers that keep it honest.
*
* One agent is one directory under the harness home's `.agent-presets` root,
* nothing else: the identity files at the top (`preset.yml` display metadata
* plus the `agent.cordis.yml` composition) and one `compositions.yml` file
* holding every chat-time mode composition this agent has ever run, keyed by
* mode id. A combined composition's flattened roster id is
* `<agentId>-<modeId>`, registered as an ordinary declaration, so the
* registry addresses each mode while the file system keeps one agent one
* folder.
*
* Layouts written before the single-file consolidation nested each mode at
* `modes/<modeId>/`; the scan migrates them in place (merge, atomic write,
* then remove the directory) so an upgrade needs no manual step.
*
* The composition file is exactly what the loader reads: a top-level YAML
* list of plugin rows in the loader's own dialect (`!!js` conditions
* included). Compositions authored before the persona row split its text
* into `prefix` and `suffix` are migrated in memory at read time, so data
* written by older deployments keeps composing without a disk rewrite.
*
* @module @istarry/dsh-agent-preset-authoring/storage
*/
/** Directory name of the authoring root under the harness home. */
const USER_PRESET_DIR = ".agent-presets";
/** Reserved legacy subdirectory holding one directory per combined preset. */
const LEGACY_MODES_DIR = "modes";
/** Composition file name inside one preset directory. */
const COMPOSITION_FILE = "agent.cordis.yml";
/** Display-metadata file name inside one preset directory. */
const METADATA_FILE = "preset.yml";
/** The single file holding every combined composition of one agent. */
const COMPOSITIONS_FILE = "compositions.yml";
/**
* Ids a preset directory may use. The id becomes a path segment, so this is a
* containment boundary rather than a style rule: `..`, a separator, or an
* absolute-looking name would place the composition outside the root.
*/
const PRESET_ID = /^[a-z0-9][a-z0-9-]*$/;
/**
* The mode-id suffix a combined-preset id may carry: the shipped modes
* (standard, PTC, minimal, creator) plus the reserved `env-` namespace of
* per-agent environment compositions. Kept here so the host splitter and
* every client-side filter read one spelling.
*/
const COMBINED_MODE_SUFFIX = "(?:standard|ptc|minimal|cordis|env-[a-z0-9-]+)";
/**
* Split a flattened combined-preset id (`<agentId>-<modeId>`) into its parts,
* when it is one.
* @param id - a preset id.
* @returns the agent and mode parts, or undefined for a bare preset id.
*/
function combinedPartsOf(id) {
	const match = new RegExp(`^(.+)-(${COMBINED_MODE_SUFFIX})$`).exec(id);
	const agentId = match?.[1];
	const modeId = match?.[2];
	if (agentId === void 0 || modeId === void 0) return void 0;
	return {
		agentId,
		modeId
	};
}
/** A non-empty trimmed string, or undefined for anything else. */
function text(value) {
	if (typeof value !== "string") return void 0;
	const trimmed = value.trim();
	return trimmed === "" ? void 0 : trimmed;
}
/** Parse a composition file's text into rows; malformed input throws. */
function parseComposition(raw) {
	const parsed = load(raw, { schema: entryListSchema });
	if (!Array.isArray(parsed)) throw new Error("the composition must be a top-level list of plugin rows");
	return parsed;
}
/**
* Render composition rows back into the loader's own YAML dialect, so a
* written composition reads exactly like one the deployment shipped.
*/
function renderComposition(plugins) {
	return dump(plugins, {
		schema: entryListSchema,
		noRefs: true,
		lineWidth: -1
	});
}
/** The `persona` row id inside a composition, per the dsh-persona contract. */
const PERSONA_ROW_ID = "persona";
/**
* Migrate a persona row authored against the pre-split `text` schema: the
* whole text becomes the prefix, which is a template the runtime interpolates
* exactly as the former single field did.
*/
function migratePersonaRow(row) {
	if (row.id !== "persona") return row;
	const config = row.config;
	const legacyText = config?.text;
	if (config === void 0 || typeof legacyText !== "string" || typeof config.prefix === "string") return row;
	const next = {
		...config,
		prefix: legacyText
	};
	delete next.text;
	return {
		...row,
		config: next
	};
}
/**
* Read one agent directory's identity files into memory.
* @param dir - the agent directory holding `agent.cordis.yml` and `preset.yml`.
* @param id - the agent's roster id (its directory name).
* @returns the parsed agent, or undefined when no composition occupies it.
*/
async function readAgent(dir, id) {
	let raw;
	try {
		raw = await readFile(join(dir, COMPOSITION_FILE), "utf8");
	} catch {
		return;
	}
	let plugins;
	try {
		plugins = parseComposition(raw).map(migratePersonaRow);
	} catch (error) {
		throw new Error(`composition of "${id}" cannot be parsed: ${error.message}`);
	}
	return {
		id,
		agentId: id,
		dir,
		metadata: await readMetadata(dir),
		plugins
	};
}
/** Read an agent directory's display metadata; absence degrades to empty. */
async function readMetadata(dir) {
	try {
		const parsed = load(await readFile(join(dir, METADATA_FILE), "utf8"));
		if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
			const record = parsed;
			const name = text(record.name);
			const description = text(record.description);
			const language = text(record.language);
			const persona = text(record.persona);
			return {
				...name === void 0 ? {} : { name },
				...description === void 0 ? {} : { description },
				...language === void 0 ? {} : { language },
				...persona === void 0 ? {} : { persona }
			};
		}
	} catch {}
	return {};
}
/** Normalize one parsed compositions-file value into its entry, or drop it. */
function compositionEntryOf(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
	const record = value;
	const plugins = Array.isArray(record.plugins) ? record.plugins : void 0;
	if (plugins === void 0) return void 0;
	const name = text(record.name);
	const description = text(record.description);
	return {
		...name === void 0 ? {} : { name },
		...description === void 0 ? {} : { description },
		plugins: plugins.map(migratePersonaRow)
	};
}
/**
* Read every combined composition of one agent from its `compositions.yml`.
* @param dir - the agent directory.
* @param agentId - the agent's roster id.
* @returns the combined presets in file order; a missing file is empty.
*/
async function readCompositions(dir, agentId) {
	let raw;
	try {
		raw = await readFile(join(dir, COMPOSITIONS_FILE), "utf8");
	} catch {
		return [];
	}
	let parsed;
	try {
		parsed = load(raw, { schema: entryListSchema });
	} catch (error) {
		throw new Error(`compositions of "${agentId}" cannot be parsed: ${error.message}`);
	}
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return [];
	const presets = [];
	for (const [modeId, value] of Object.entries(parsed)) {
		if (!PRESET_ID.test(modeId)) continue;
		const entry = compositionEntryOf(value);
		if (entry === void 0) continue;
		presets.push({
			id: `${agentId}-${modeId}`,
			agentId,
			modeId,
			dir,
			metadata: {
				...entry.name === void 0 ? {} : { name: entry.name },
				...entry.description === void 0 ? {} : { description: entry.description }
			},
			plugins: entry.plugins
		});
	}
	return presets;
}
/**
* Rewrite the agent's whole compositions file.
* @param dir - the agent directory.
* @param entries - every composition the agent keeps, keyed by mode id.
*/
async function writeCompositions(dir, entries) {
	const record = {};
	for (const [modeId, entry] of entries) record[modeId] = {
		...entry.name === void 0 ? {} : { name: entry.name },
		...entry.description === void 0 ? {} : { description: entry.description },
		plugins: entry.plugins
	};
	const body = Object.keys(record).length === 0 ? "# No chat-time compositions yet; one map entry per mode id.\n{}\n" : dump(record, {
		schema: entryListSchema,
		noRefs: true,
		lineWidth: -1
	});
	await mkdir(dir, { recursive: true });
	await writeFileAtomic(join(dir, COMPOSITIONS_FILE), body, {
		mode: 384,
		dirMode: 448
	});
}
/**
* Write one agent's identity files: display metadata and the composition
* with its persona row rewritten.
* @param dir - the agent directory; created when absent.
* @param plugins - the composition rows to write.
* @param metadata - the display metadata to publish.
*/
async function writeAgent(dir, plugins, metadata) {
	await mkdir(dir, { recursive: true });
	await writeFileAtomic(join(dir, COMPOSITION_FILE), `${renderComposition(plugins)}\n`, {
		mode: 384,
		dirMode: 448
	});
	await writeFileAtomic(join(dir, METADATA_FILE), renderMetadata(metadata), {
		mode: 384,
		dirMode: 448
	});
}
/** Render the display-metadata file; an all-empty identity still names the preset. */
function renderMetadata(metadata) {
	const record = {};
	for (const [key, value] of Object.entries(metadata)) {
		const trimmed = value?.trim();
		if (trimmed !== void 0 && trimmed !== "") record[key] = trimmed;
	}
	return dump(record, {
		noRefs: true,
		lineWidth: -1
	});
}
/** Delete one agent directory whole, compositions included. */
async function deleteAgent(dir) {
	await rm(dir, {
		recursive: true,
		force: true
	});
}
/**
* Rewrite one combined composition inside the agent's single file, leaving
* every other mode untouched.
* @param dir - the agent directory.
* @param agentId - the agent's roster id (for diagnostics).
* @param modeId - the mode the entry belongs to.
* @param entry - the composition to store.
*/
async function writeComposition(dir, agentId, modeId, entry) {
	const entries = await readCompositionEntries(dir, agentId);
	entries.set(modeId, entry);
	await writeCompositions(dir, entries);
}
/**
* Drop one combined composition from the agent's single file.
* @param dir - the agent directory.
* @param agentId - the agent's roster id (for diagnostics).
* @param modeId - the mode whose entry is removed.
*/
async function deleteComposition(dir, agentId, modeId) {
	const entries = await readCompositionEntries(dir, agentId);
	if (!entries.delete(modeId)) return;
	await writeCompositions(dir, entries);
}
/** The compositions file as an editable map; missing file reads empty. */
async function readCompositionEntries(dir, agentId) {
	const entries = /* @__PURE__ */ new Map();
	for (const preset of await readCompositions(dir, agentId)) entries.set(preset.modeId, compositionOf(preset));
	return entries;
}
/**
* Scan the authoring root: every agent directory at the top level, each
* followed by the combined compositions its `compositions.yml` declares.
* Legacy `modes/<modeId>/` directories are migrated into the single file on
* first sight (merge, atomic write, then removal), so one agent keeps one
* folder across upgrades.
* @param root - absolute path of the `.agent-presets` directory.
* @returns the presets found, each agent before its compositions, in
* directory order; unreadable compositions throw so a broken file is reported
* rather than silently dropped.
*/
async function scanRoot(root) {
	const found = [];
	let top;
	try {
		top = await readdir(root);
	} catch {
		return found;
	}
	for (const name of top.sort()) {
		if (!PRESET_ID.test(name)) continue;
		const agentDir = join(root, name);
		if (!await isDirectory(agentDir)) continue;
		const agent = await readAgent(agentDir, name);
		if (agent === void 0) continue;
		found.push(agent);
		const entries = /* @__PURE__ */ new Map();
		for (const preset of await readCompositions(agentDir, name)) entries.set(preset.modeId, compositionOf(preset));
		const legacy = await migrateLegacyModes(agentDir, name);
		if (legacy.size > 0) {
			for (const [modeId, entry] of legacy) entries.set(modeId, entry);
			await writeCompositions(agentDir, entries);
			await rm(join(agentDir, LEGACY_MODES_DIR), {
				recursive: true,
				force: true
			});
		}
		for (const [modeId, entry] of entries) found.push({
			id: `${name}-${modeId}`,
			agentId: name,
			modeId,
			dir: agentDir,
			metadata: {
				...entry.name === void 0 ? {} : { name: entry.name },
				...entry.description === void 0 ? {} : { description: entry.description }
			},
			plugins: entry.plugins
		});
	}
	return found;
}
/** Project one combined preset back to its compositions-file entry. */
function compositionOf(preset) {
	return {
		...preset.metadata.name === void 0 ? {} : { name: preset.metadata.name },
		...preset.metadata.description === void 0 ? {} : { description: preset.metadata.description },
		plugins: preset.plugins
	};
}
/**
* Read the legacy per-mode directories of one agent, if any remain.
* @param agentDir - the agent directory.
* @param agentId - the agent's roster id.
* @returns the legacy compositions keyed by mode id; empty when none exist.
*/
async function migrateLegacyModes(agentDir, agentId) {
	const modesDir = join(agentDir, LEGACY_MODES_DIR);
	let modes;
	try {
		modes = await readdir(modesDir);
	} catch {
		return /* @__PURE__ */ new Map();
	}
	const entries = /* @__PURE__ */ new Map();
	for (const mode of modes.sort()) {
		if (!PRESET_ID.test(mode)) continue;
		const modeDir = join(modesDir, mode);
		if (!await isDirectory(modeDir)) continue;
		const preset = await readLegacyPreset(modeDir, `${agentId}-${mode}`);
		if (preset !== void 0) entries.set(mode, compositionOf(preset));
	}
	return entries;
}
/**
* Read one legacy preset directory into memory.
* @param dir - the legacy mode directory.
* @param id - the flattened roster id the directory publishes.
* @returns the parsed preset, or undefined when no composition occupies it.
*/
async function readLegacyPreset(dir, id) {
	const parts = combinedPartsOf(id);
	const agentId = parts?.agentId ?? id;
	let raw;
	try {
		raw = await readFile(join(dir, COMPOSITION_FILE), "utf8");
	} catch {
		return;
	}
	let plugins;
	try {
		plugins = parseComposition(raw).map(migratePersonaRow);
	} catch (error) {
		throw new Error(`composition of "${id}" cannot be parsed: ${error.message}`);
	}
	const metadata = await readMetadata(dir);
	return {
		id,
		agentId,
		...parts === void 0 ? {} : { modeId: parts.modeId },
		dir,
		metadata,
		plugins
	};
}
/** Whether a path exists and is a directory. */
async function isDirectory(path) {
	try {
		return (await stat(path)).isDirectory();
	} catch {
		return false;
	}
}
//#endregion
//#region ../.build/agent-preset-authoring/tsc/persona.js
/**
* The persona row an authored agent composes under.
*
* An agent's identity is two template fields: a prefix carrying the reply
* language directive and the author's persona text verbatim, and the working
* directory line as the suffix, whose `{{cwd}}` placeholder the runtime
* resolves at mount. Every other row of the base composition carries over
* untouched, so an authored agent is exactly as capable as the mode it was
* created from.
*
* @module @istarry/dsh-agent-preset-authoring/persona
*/
/** The persona plugin's package name. */
const PERSONA_PLUGIN_NAME = "@deepseek-ai/dsh-persona";
/**
* The working-directory suffix template.
*
* 0.2.1 起 persona 模板不再注册 `{{cwd}}` 变量（会报 unknown prompt variable），
* 工作目录已由宿主的 `working-directory` 消息源注入，所以这里不再内插变量。
*/
const WORKING_DIRECTORY_SUFFIX = "Your working directory is the session working directory.";
/**
* Render the persona prefix: the language directive when one was given,
* followed by the author's persona text. Both lines are optional; an agent
* with neither still carries the working-directory suffix.
* @param input - the identity fields.
* @returns the prefix template text.
*/
function renderPersonaPrefix(input) {
	const language = input.language.trim();
	const persona = input.persona.trim();
	return [...language === "" ? [] : [`Reply in ${language} throughout.`], ...persona === "" ? [] : [persona]].join("\n\n");
}
/**
* Rewrite a composition's persona row to carry one agent's identity. The row
* is replaced structurally — never re-serialized from foreign rows — and a
* composition without a persona row gets one prepended, so an authored agent
* always presents as its author wrote it.
* @param plugins - the base composition rows.
* @param input - the identity fields.
* @returns the composition rows with the persona row replaced.
*/
function applyPersona(plugins, input) {
	const row = {
		id: PERSONA_ROW_ID,
		name: PERSONA_PLUGIN_NAME,
		config: {
			prefix: renderPersonaPrefix(input),
			suffix: WORKING_DIRECTORY_SUFFIX
		}
	};
	const index = plugins.findIndex((candidate) => candidate.id === PERSONA_ROW_ID);
	if (index < 0) return [row, ...plugins];
	return plugins.map((candidate, position) => position === index ? row : candidate);
}
//#endregion
//#region ../.build/agent-preset-authoring/tsc/session.js
/**
* The session-side projection this package owns: `agentOwner`, the authored
* agent a session's chat belongs to.
*
* Sessions compose onto a combined preset id (`<agentId>-<modeId>`), but
* ownership is an agent-level fact. Deriving it host-side — once, at the
* moment the selection event folds, with the same split the authoring root
* reads — gives every client an exact key to filter chat history by, instead
* of each surface re-deriving it from id prefixes.
*
* @module @istarry/dsh-agent-preset-authoring/session
*/
const agentOwnerSchema = z$1.union([z$1.string(), z$1.null()]);
/**
* Derive the owning agent id from a preset id: a combined
* `<agentId>-<modeId>` id resolves to `<agentId>`, a bare shipped mode or
* plain session resolves to null (no authored agent owns it).
* @param presetId - the preset id a session selected, when one is known.
* @returns the owning agent id, or null.
*/
function ownerOf(presetId) {
	if (typeof presetId !== "string") return null;
	return combinedPartsOf(presetId)?.agentId ?? null;
}
/** The `agentOwner` projection: session chat ownership as one exact key. */
const agentOwnerProjectionDefinition = {
	key: "agentOwner",
	stateSchema: agentOwnerSchema,
	init: (header) => ownerOf(header.agentPreset),
	apply: (state, event) => {
		if (event.type !== "agent-preset/selected") return state;
		return ownerOf(event.data.agentPreset);
	},
	wire: {
		viewSchema: agentOwnerSchema,
		view: (state) => state
	},
	stateVersion: 1
};
//#endregion
//#region ../.build/agent-preset-authoring/tsc/environment.js
/**
* The Define-mode capability palette: per-agent compositions assembled as a
* strict subset of the `standard` preset.
*
* A capability group names the composition rows one user-facing ability is
* made of (a tool, or an isolated plugin group). An environment keeps the
* identity rows and the rows of every enabled group, and drops the rest, so
* an environment can never grant a capability `standard` does not carry. The
* group ids and row ids mirror `packages/bundle/web-app/presets/
* standard.patch.yml`; the browser renders the palette from the same list.
*
* @module @istarry/dsh-agent-preset-authoring/environment
*/
/**
* The palette, in baseline-first then opt-in narrative order: the five
* conversation-baseline groups ship enabled, the opt-in groups follow from
* personal productivity (jobs, goals) through process control (plan) and
* outside reach (web, compaction) to multi-agent work (subagents). Groups
* flagged `plugin` render in the client's separate 插件能力 category.
*/
const ENVIRONMENT_GROUPS = [
	{
		id: "shell",
		ids: ["tool-bash", "tool-pwsh"],
		defaultOn: true
	},
	{
		id: "files",
		ids: ["tool-fs"],
		defaultOn: true
	},
	{
		id: "fileSearch",
		ids: ["tool-fs-search"],
		defaultOn: true
	},
	{
		id: "todo",
		ids: ["tool-todo"],
		defaultOn: true
	},
	{
		id: "askUser",
		ids: ["tool-ask-user"],
		defaultOn: true
	},
	{
		id: "jobs",
		ids: ["tool-jobs"],
		defaultOn: false
	},
	{
		id: "goals",
		ids: ["command-goal", "tool-goal"],
		defaultOn: false
	},
	{
		id: "plan",
		ids: ["planning"],
		defaultOn: false
	},
	{
		id: "web",
		ids: ["tool-web"],
		defaultOn: false
	},
	{
		id: "compaction",
		ids: ["compaction"],
		defaultOn: false
	},
	{
		id: "subagents",
		ids: ["delegation"],
		defaultOn: false
	},
	{
		id: "skills",
		ids: ["skill-filesystem", "tool-skill"],
		defaultOn: false,
		plugin: true
	},
	{
		id: "browser",
		ids: ["browser"],
		defaultOn: false,
		plugin: true
	}
];
/** Composition rows every environment keeps regardless of the palette. */
const ALWAYS_ON_ROW_IDS = /* @__PURE__ */ new Set([
	"persona",
	"agent-instructions",
	"present"
]);
/** Prefix of the per-agent environment mode ids. */
const ENVIRONMENT_MODE_PREFIX = "env-";
/** A valid environment slug: lowercase id characters, 1-24 of them. */
const ENVIRONMENT_SLUG = /^[a-z0-9][a-z0-9-]{0,23}$/;
/**
* Filter one composition down to the rows of the enabled groups.
* @param plugins - the base composition rows (`standard`).
* @param enabledGroups - the capability group ids the environment keeps.
* @returns the environment's composition rows, in base order.
*/
function buildEnvironmentComposition(plugins, enabledGroups) {
	const keep = new Set(ALWAYS_ON_ROW_IDS);
	for (const group of ENVIRONMENT_GROUPS) {
		if (!enabledGroups.includes(group.id)) continue;
		for (const id of group.ids) keep.add(id);
	}
	return plugins.filter((row) => keep.has(row.id ?? ""));
}
/**
* The palette's default selection.
* @returns the group ids that are on by default.
*/
function defaultEnvironmentGroups() {
	return ENVIRONMENT_GROUPS.filter((group) => group.defaultOn).map((group) => group.id);
}
/**
* Keyword inference over a task description, with no model call: the
* conversation defaults plus every group whose keyword set hits. The client
* applies the result as a starting selection the user can edit.
* @param description - the user's task description.
* @returns the inferred group ids (defaults always included).
*/
function suggestCapabilityGroups(description) {
	const text = description.toLowerCase();
	const hits = [...defaultEnvironmentGroups()];
	const add = (id) => {
		if (!hits.includes(id)) hits.push(id);
	};
	const matches = (patterns) => patterns.some((pattern) => pattern.test(text));
	if (matches([
		/终端/,
		/命令行/,
		/脚本/,
		/shell/,
		/bash/,
		/powershell/,
		/构建/,
		/运行/,
		/编译/,
		/build/
	])) add("shell");
	if (matches([
		/搜索文件/,
		/查找文件/,
		/检索/,
		/glob/,
		/grep/,
		/find files?/
	])) add("fileSearch");
	if (matches([
		/任务清单/,
		/待办/,
		/todo/,
		/checklist/
	])) add("todo");
	if (matches([
		/后台/,
		/任务队列/,
		/jobs?/,
		/background/
	])) add("jobs");
	if (matches([/技能/, /skill/])) add("skills");
	if (matches([
		/目标/,
		/长任务/,
		/goal/
	])) add("goals");
	if (matches([
		/网页/,
		/联网/,
		/搜索网络/,
		/web search/,
		/互联网/,
		/网上/
	])) add("web");
	if (matches([
		/浏览器/,
		/打开网页/,
		/browser/,
		/网页操作/
	])) add("browser");
	if (matches([
		/计划/,
		/规划/,
		/方案/,
		/plan/,
		/design/
	])) add("plan");
	if (matches([
		/压缩/,
		/长对话/,
		/上下文/,
		/compact/,
		/context/
	])) add("compaction");
	if (matches([
		/子代理/,
		/并行/,
		/委托/,
		/subagent/,
		/delegate/,
		/parallel/,
		/工作流/,
		/workflow/
	])) add("subagents");
	return hits;
}
/**
* Generate one fresh environment mode id.
* @returns `env-<base36 timestamp><random suffix>`, unique per call.
*/
function newEnvironmentModeId() {
	const stamp = Date.now().toString(36);
	const random = Math.floor(Math.random() * 1296).toString(36).padStart(2, "0");
	return `${ENVIRONMENT_MODE_PREFIX}${stamp}${random}`;
}
/**
* Validate a caller-supplied environment mode id or accept a generated one.
* @param modeId - the requested mode id, when given.
* @returns the mode id to use.
* @throws when the requested id is not a valid environment slug.
*/
function resolveEnvironmentModeId(modeId) {
	if (modeId === void 0 || modeId === "") return newEnvironmentModeId();
	if (!modeId.startsWith("env-") || !ENVIRONMENT_SLUG.test(modeId.slice(4))) throw new Error(`environment mode id ${JSON.stringify(modeId)} must be ${ENVIRONMENT_MODE_PREFIX}<slug>`);
	return modeId;
}
//#endregion
//#region ../.build/agent-preset-authoring/tsc/index.js
/**
* Directory-backed agent identity authoring over the declarative preset
* registry.
*
* Agents are identity only — name, language, persona, description — with no
* capabilities attached at creation. Capabilities come at chat time: starting
* a chat composes a combined preset (`<agentId>-<modeId>`) that copies the
* chosen mode's composition and folds the agent's persona row in. Combined
* presets are deterministic (created once, reused), so the same agent-mode
* pair always resolves to the same session composition. One agent is one
* directory — its combined compositions live as entries of a single
* `compositions.yml` inside it — and session ownership is published as the
* `agentOwner` projection, an exact key every chat-history surface filters
* by.
*
* The service owns the harness home's `.agent-presets` directory as its
* storage and the registry as its activation surface: every preset found on
* disk is registered as an ordinary declaration at start, and every mutation
* rewrites the directory before swapping the registration, so the roster and
* the files never drift apart. Live sessions keep the revision they mounted;
* the registry's retirement path owns that lifetime.
*
* @module @istarry/dsh-agent-preset-authoring
*/
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __addDisposableResource = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
/** Runtime schema. */
const Config = z.object({ root: z.string().default("") });
/**
* The persisted default preset this suite withdrew at its teardown. A reload
* or re-enable re-registers the same ids on the next init and writes the
* value back; an uninstall never reaches that restore, which is what hands
* the default to the deployment's own fallback instead of leaving it pointed
* at a preset no host can resolve any more.
*/
let withheldDefaultPreset;
/** The registry plugin's settings entry, where the default preset persists. */
const REGISTRY_SETTINGS_ENTRY = "agent-preset-registry";
let AgentPresetAuthoring = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _roster_decorators;
	let _document_decorators;
	let _create_decorators;
	let _update_decorators;
	let _remove_decorators;
	let _environmentGroups_decorators;
	let _composeEnvironment_decorators;
	let _suggestEnvironment_decorators;
	let _deleteSession_decorators;
	let _readFileAttachment_decorators;
	let _rewriteBoundary_decorators;
	return class AgentPresetAuthoring extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_roster_decorators = [Remote("list")];
			_document_decorators = [Remote("read")];
			_create_decorators = [Remote("create")];
			_update_decorators = [Remote("update")];
			_remove_decorators = [Remote("delete")];
			_environmentGroups_decorators = [Remote("environmentGroups")];
			_composeEnvironment_decorators = [Remote("composeEnvironment")];
			_suggestEnvironment_decorators = [Remote("suggestEnvironment")];
			_deleteSession_decorators = [Remote("deleteSession")];
			_readFileAttachment_decorators = [Remote("readFileAttachment")];
			_rewriteBoundary_decorators = [Remote("rewriteBoundary")];
			__esDecorate(this, null, _roster_decorators, {
				kind: "method",
				name: "roster",
				static: false,
				private: false,
				access: {
					has: (obj) => "roster" in obj,
					get: (obj) => obj.roster
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _document_decorators, {
				kind: "method",
				name: "document",
				static: false,
				private: false,
				access: {
					has: (obj) => "document" in obj,
					get: (obj) => obj.document
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _create_decorators, {
				kind: "method",
				name: "create",
				static: false,
				private: false,
				access: {
					has: (obj) => "create" in obj,
					get: (obj) => obj.create
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _update_decorators, {
				kind: "method",
				name: "update",
				static: false,
				private: false,
				access: {
					has: (obj) => "update" in obj,
					get: (obj) => obj.update
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _remove_decorators, {
				kind: "method",
				name: "remove",
				static: false,
				private: false,
				access: {
					has: (obj) => "remove" in obj,
					get: (obj) => obj.remove
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _environmentGroups_decorators, {
				kind: "method",
				name: "environmentGroups",
				static: false,
				private: false,
				access: {
					has: (obj) => "environmentGroups" in obj,
					get: (obj) => obj.environmentGroups
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _composeEnvironment_decorators, {
				kind: "method",
				name: "composeEnvironment",
				static: false,
				private: false,
				access: {
					has: (obj) => "composeEnvironment" in obj,
					get: (obj) => obj.composeEnvironment
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _suggestEnvironment_decorators, {
				kind: "method",
				name: "suggestEnvironment",
				static: false,
				private: false,
				access: {
					has: (obj) => "suggestEnvironment" in obj,
					get: (obj) => obj.suggestEnvironment
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _deleteSession_decorators, {
				kind: "method",
				name: "deleteSession",
				static: false,
				private: false,
				access: {
					has: (obj) => "deleteSession" in obj,
					get: (obj) => obj.deleteSession
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _readFileAttachment_decorators, {
				kind: "method",
				name: "readFileAttachment",
				static: false,
				private: false,
				access: {
					has: (obj) => "readFileAttachment" in obj,
					get: (obj) => obj.readFileAttachment
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _rewriteBoundary_decorators, {
				kind: "method",
				name: "rewriteBoundary",
				static: false,
				private: false,
				access: {
					has: (obj) => "rewriteBoundary" in obj,
					get: (obj) => obj.rewriteBoundary
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		/** The preset registry and the projection registry this service builds on. */
		static inject = [
			"agentPresets",
			"sessionProjections",
			"attachments",
			"sessions",
			"sessionQuery"
		];
		static Config = Config;
		/** Absolute path of the authoring root. */
		root = __runInitializers(this, _instanceExtraInitializers);
		/** Live registrations, keyed by flattened preset id. */
		registrations = /* @__PURE__ */ new Map();
		constructor(ctx, config = {}) {
			super(ctx, "agentPresetAuthoring");
			const override = (config.root ?? "").trim();
			this.root = override === "" ? dshHomePath(USER_PRESET_DIR) : override;
			ctx.sessionProjections.register(agentOwnerProjectionDefinition);
		}
		/**
		* Fold the `agentOwner` key for cold sessions whose persisted projection
		* row predates the key: open each as a read-only observer, fold its whole
		* log once, and let the cache's fail-soft write-back persist the row. A
		* one-time cost per session after an upgrade; failures are logged and
		* skipped, never fatal.
		*/
		backfillAgentOwner() {
			this.ctx.inject(["sessionPersistence", "sessionProjectionCache"], async (scope) => {
				try {
					const snapshots = await scope.sessionPersistence.list();
					for (const snapshot of snapshots) {
						const { header } = snapshot;
						if (scope.sessionProjectionCache.cachedSnapshot(header, ["agentOwner"]) !== void 0) continue;
						try {
							const handle = await scope.sessionPersistence.open(header.id, "read");
							try {
								const read = await handle.read();
								scope.sessionProjectionCache.coldSnapshot(header, handle.inheritedEventCount, read.events);
							} finally {
								await handle.close();
							}
						} catch (error) {
							scope.logger.warn(`agent-preset-authoring: agentOwner backfill for "${header.id}" failed: ${String(error)}`);
						}
					}
				} catch (error) {
					scope.logger.warn(`agent-preset-authoring: agentOwner backfill skipped: ${String(error)}`);
				}
			});
		}
		/**
		* Load the authoring root and register every preset found on disk, then
		* backfill the ownership projection for cold sessions.
		* @yields the disposer that withdraws every registration.
		*/
		async *[Service.init]() {
			for (const preset of await scanRoot(this.root)) await this.register(preset);
			await this.restoreWithheldDefault();
			this.backfillAgentOwner();
			yield () => this.withdrawAll();
		}
		/**
		* Write back a default preset withdrawn at the previous teardown, once
		* the same id has re-registered here. An uninstall never reaches this,
		* so after an uninstall the withdrawn reset stands and session creation
		* resolves the deployment's own default again.
		*/
		async restoreWithheldDefault() {
			if (withheldDefaultPreset === void 0) return;
			if (!this.registrations.has(withheldDefaultPreset)) return;
			const restored = withheldDefaultPreset;
			withheldDefaultPreset = void 0;
			try {
				if (await this.ctx.get("configForms")?.get(REGISTRY_SETTINGS_ENTRY)?.set("selectedDefault", restored) === false) {
					withheldDefaultPreset = restored;
					this.ctx.logger.warn("agent-preset-authoring: default-preset restore was refused; it retries on the next activation");
				}
			} catch (error) {
				withheldDefaultPreset = restored;
				this.ctx.logger.warn(`agent-preset-authoring: default-preset restore failed: ${String(error)}`);
			}
		}
		/**
		* Withdraw every registration this service owns, newest last. When the
		* persisted default preset is one of the withdrawn ids it is reset to
		* the deployment fallback and remembered: every later session creation
		* would otherwise fail with "Unknown agent preset" once this plugin is
		* gone (uninstall or disable), because the host resolves the default
		* before any roster exists to refuse it gracefully. A plain reload
		* re-registers the same ids on the next init and restores the value.
		*/
		async withdrawAll() {
			const owned = new Set(this.registrations.keys());
			for (const [, registration] of [...this.registrations].reverse()) await registration.unregister();
			this.registrations.clear();
			try {
				const current = this.ctx.get("agentPresets")?.config?.selectedDefault?.get();
				if (typeof current !== "string" || !owned.has(current)) return;
				withheldDefaultPreset = current;
				if (await this.ctx.get("configForms")?.get(REGISTRY_SETTINGS_ENTRY)?.set("selectedDefault", void 0) === false) {
					withheldDefaultPreset = void 0;
					this.ctx.logger.warn("agent-preset-authoring: default-preset cleanup was refused; the stored default may point at a withdrawn preset");
				}
			} catch (error) {
				this.ctx.logger.warn(`agent-preset-authoring: default-preset cleanup failed: ${String(error)}`);
			}
		}
		/** Register one authored preset as a registry declaration. */
		async register(preset) {
			const definition = {
				id: preset.id,
				...preset.metadata.name === void 0 ? {} : { name: preset.metadata.name },
				...preset.metadata.description === void 0 ? {} : { description: preset.metadata.description },
				plugins: preset.plugins
			};
			const unregister = await this.ctx.agentPresets.register(definition);
			this.registrations.set(preset.id, {
				unregister,
				preset
			});
		}
		/** Swap one registration: withdraw the old revision before the new one. */
		async swap(preset) {
			const previous = this.registrations.get(preset.id);
			if (previous !== void 0) await previous.unregister();
			try {
				await this.register(preset);
			} catch (error) {
				this.registrations.delete(preset.id);
				throw error;
			}
		}
		/** The authored preset a roster id addresses. */
		authored(agentPreset) {
			const registration = this.registrations.get(agentPreset);
			if (registration === void 0) throw new RemoteError("agent-preset-authoring/not-found", `no authored preset "${agentPreset}" exists`, { agentPreset });
			return registration.preset;
		}
		/**
		* The composition rows a creation starts from: an authored preset's own
		* files when the base is one, otherwise the registry's declaration.
		*/
		async baseComposition(from) {
			const authored = this.registrations.get(from);
			if (authored !== void 0) return authored.preset.plugins;
			let content;
			try {
				content = (await this.ctx.agentPresets.readDocument(from)).content;
			} catch {
				throw new RemoteError("agent-preset-authoring/invalid", `base preset "${from}" does not resolve`, {
					agentPreset: from,
					reason: "unknown base preset"
				});
			}
			const parsed = load(content, { schema: entryListSchema });
			if (!Array.isArray(parsed)) throw new RemoteError("agent-preset-authoring/invalid", `base preset "${from}" carries no composition`, {
				agentPreset: from,
				reason: "empty composition"
			});
			return parsed;
		}
		/** Require a non-empty trimmed value for the identity fields that carry one. */
		static requireText(value, agentPreset, field) {
			const trimmed = value.trim();
			if (trimmed === "") throw new RemoteError("agent-preset-authoring/invalid", `${field} must not be empty`, {
				agentPreset,
				reason: "empty field"
			});
			return trimmed;
		}
		/** Read the authored roster, with activation diagnostics from the registry. */
		async roster() {
			const diagnostics = new Map((await this.ctx.agentPresets.list()).map((row) => [row.id, row.broken]));
			return { presets: [...this.registrations.values()].map(({ preset }) => {
				const { name, description, language, persona } = preset.metadata;
				const broken = diagnostics.get(preset.id);
				return {
					id: preset.id,
					agentId: preset.agentId,
					...preset.modeId === void 0 ? {} : { modeId: preset.modeId },
					...name === void 0 ? {} : { name },
					...description === void 0 ? {} : { description },
					...language === void 0 ? {} : { language },
					...persona === void 0 ? {} : { persona },
					...broken === void 0 ? {} : { broken }
				};
			}).sort((left, right) => left.id.localeCompare(right.id)) };
		}
		/** Read one authored preset's identity, prefilled from its files. */
		async document(agentPreset) {
			const { metadata } = this.authored(agentPreset);
			return {
				agentPreset,
				name: metadata.name ?? agentPreset,
				language: metadata.language ?? "",
				persona: metadata.persona ?? "",
				description: metadata.description ?? ""
			};
		}
		/**
		* Create a preset by copying a base composition and folding an identity
		* into it. The caller supplies no composition text — only ids the host
		* resolves and identity fields — so authoring grants no capability the
		* base preset did not already carry. A combined target lands as one entry
		* of its agent's `compositions.yml`; a bare target becomes a roster agent.
		*/
		async create(request) {
			const id = request.agentPreset;
			const name = AgentPresetAuthoring.requireText(request.name, id, "name");
			if (this.registrations.has(id)) throw new RemoteError("agent-preset-authoring/exists", `authored preset "${id}" already exists`, { agentPreset: id });
			const parts = combinedPartsOf(id);
			const agentId = parts?.agentId ?? id;
			const dir = join(this.root, agentId);
			if (!PRESET_ID.test(agentId)) throw new RemoteError("agent-preset-authoring/invalid", `preset id "${id}" is not usable as a directory name`, {
				agentPreset: id,
				reason: "invalid id"
			});
			const plugins = applyPersona(await this.baseComposition(request.from), {
				language: request.language,
				persona: request.persona
			});
			const metadata = {
				name,
				description: request.description.trim(),
				language: request.language.trim(),
				persona: request.persona.trim()
			};
			try {
				if (parts === void 0) {
					await writeAgent(dir, plugins, metadata);
					const preset = await readAgent(dir, id);
					if (preset === void 0) throw new Error("the written composition did not read back");
					await this.register(preset);
				} else {
					await writeComposition(dir, agentId, parts.modeId, {
						name: metadata.name,
						...metadata.description === "" ? {} : { description: metadata.description },
						plugins
					});
					const preset = (await readCompositions(dir, agentId)).find((candidate) => candidate.modeId === parts.modeId);
					if (preset === void 0) throw new Error("the written composition did not read back");
					await this.register(preset);
				}
			} catch (error) {
				if (error instanceof RemoteError) throw error;
				throw new RemoteError("agent-preset-authoring/invalid", `preset "${id}" cannot be written: ${error.message}`, {
					agentPreset: id,
					reason: error.message
				});
			}
			return {
				agentPreset: id,
				...identityOf(metadata, id)
			};
		}
		/**
		* Rewrite one authored preset's identity: display metadata and the persona
		* row. Every other composition row carries over untouched, so a profile
		* edit cannot change an agent's capabilities — only who it presents as.
		* An agent edit propagates to every composition it owns in the same write:
		* one identity, one folder, every mode following it.
		*/
		async update(request) {
			const id = request.agentPreset;
			const name = AgentPresetAuthoring.requireText(request.name, id, "name");
			const existing = this.authored(id);
			const agentId = existing.agentId;
			const dir = join(this.root, agentId);
			const identity = {
				name,
				description: request.description.trim(),
				language: request.language.trim(),
				persona: request.persona.trim()
			};
			try {
				if (existing.modeId === void 0) {
					await writeAgent(dir, applyPersona(existing.plugins, {
						language: identity.language,
						persona: identity.persona
					}), identity);
					const agent = await readAgent(dir, agentId);
					if (agent === void 0) throw new Error("the written composition did not read back");
					await this.swap(agent);
					for (const composition of await readCompositions(dir, agentId)) {
						const entry = compositionOf(composition);
						await writeComposition(dir, agentId, composition.modeId, {
							...entry,
							name: identity.name,
							plugins: applyPersona(composition.plugins, {
								language: identity.language,
								persona: identity.persona
							})
						});
						const rewritten = (await readCompositions(dir, agentId)).find((candidate) => candidate.modeId === composition.modeId);
						if (rewritten === void 0) throw new Error("the rewritten composition did not read back");
						await this.swap(rewritten);
					}
				} else {
					await writeComposition(dir, agentId, existing.modeId, {
						name: identity.name,
						...identity.description === "" ? {} : { description: identity.description },
						plugins: applyPersona(existing.plugins, {
							language: identity.language,
							persona: identity.persona
						})
					});
					const rewritten = (await readCompositions(dir, agentId)).find((candidate) => candidate.modeId === existing.modeId);
					if (rewritten === void 0) throw new Error("the rewritten composition did not read back");
					await this.swap(rewritten);
				}
			} catch (error) {
				if (error instanceof RemoteError) throw error;
				throw new RemoteError("agent-preset-authoring/invalid", `preset "${id}" cannot be rewritten: ${error.message}`, {
					agentPreset: id,
					reason: error.message
				});
			}
			return {
				agentPreset: id,
				...identityOf(identity, id)
			};
		}
		/**
		* Delete one authored preset. A combined preset removes its entry from the
		* agent's compositions file; a bare agent removes its folder whole and
		* sweeps the agent's whole local footprint host-side (its chat sessions
		* and memory store) — the host projection cache is authoritative there,
		* while the client catalog marks cold sessions as non-blank and can miss
		* them. A preset a live session mounted is not refused — the registry's
		* retirement path keeps that session on the revision it started with.
		*/
		async remove(request) {
			const id = request.agentPreset;
			const existing = this.authored(id);
			if (existing.modeId === void 0) {
				const orphans = [...this.registrations.values()].map(({ preset }) => preset).filter((preset) => preset.agentId === id && preset.id !== id);
				for (const orphan of orphans) {
					const registration = this.registrations.get(orphan.id);
					this.registrations.delete(orphan.id);
					await registration?.unregister();
				}
				const registration = this.registrations.get(id);
				this.registrations.delete(id);
				await registration?.unregister();
				await deleteAgent(existing.dir);
				this.purgeAgentFootprint(id);
				return;
			}
			const registration = this.registrations.get(id);
			this.registrations.delete(id);
			await registration?.unregister();
			await deleteComposition(existing.dir, existing.agentId, existing.modeId);
		}
		/**
		* Sweep one deleted agent's remaining local footprint: every session whose
		* cached `agentOwner` names the agent goes through the same durable
		* deletion as the chat-row remote (idle agents detached first, running
		* ones skipped with a log), and the agent's memory store directory goes
		* with it. Best-effort and logged; runs after the preset deletion, so a
		* session can never keep pointing at a preset that no longer exists.
		* @param agentId - the deleted agent's id.
		*/
		purgeAgentFootprint(agentId) {
			this.ctx.inject(["sessionPersistence", "sessionProjectionCache"], async (scope) => {
				const memory = this.ctx.get("agentMemory");
				try {
					memory?.purgeAgent?.(agentId);
				} catch (error) {
					scope.logger.warn(`agent-preset-authoring: memory purge for "${agentId}" failed: ${String(error)}`);
				}
				try {
					const snapshots = await scope.sessionPersistence.list();
					for (const snapshot of snapshots) {
						const cached = scope.sessionProjectionCache.cachedSnapshot(snapshot.header, ["agentOwner"]);
						if ((typeof cached === "string" ? cached : cached?.agentOwner) !== agentId) continue;
						const sessionId = snapshot.header.id;
						try {
							if (this.ctx.get("agents")?.get(sessionId) !== void 0 && !detachIdleAgent(this.ctx, sessionId)) {
								scope.logger.warn(`agent-preset-authoring: session "${sessionId}" of deleted agent "${agentId}" is still live; skipped`);
								continue;
							}
							if (scope.sessionPersistence.remove === void 0) {
								scope.logger.warn(`agent-preset-authoring: chat "${sessionId}" of deleted agent "${agentId}" was not removed: storage without deletion support`);
								continue;
							}
							await scope.sessionPersistence.remove(sessionId);
							await this.ctx.get("sessionProjectionCache")?.forget?.(sessionId);
							await this.ctx.get("workspaceRegistry")?.forgetSession?.(sessionId);
							this.ctx.emit("api-session/removed", sessionId);
						} catch (error) {
							scope.logger.warn(`agent-preset-authoring: chat "${sessionId}" of deleted agent "${agentId}" was not removed: ${String(error)}`);
						}
					}
				} catch (error) {
					scope.logger.warn(`agent-preset-authoring: footprint sweep for "${agentId}" failed: ${String(error)}`);
				}
			});
		}
		/** The Define-mode capability palette, as a client renders it. */
		environmentGroups() {
			return { groups: ENVIRONMENT_GROUPS.map((group) => ({
				id: group.id,
				defaultOn: group.defaultOn,
				plugin: group.plugin === true
			})) };
		}
		/**
		* Compose one agent's on-demand environment: a strict subset of the
		* `standard` composition keeping the enabled groups' rows, with the
		* agent's identity folded in, persisted as one entry of the agent's
		* `compositions.yml`, and registered as an ordinary declaration. The
		* combined id is returned so the caller can bind a blank session to it
		* directly.
		*/
		async composeEnvironment(request) {
			const agentId = request.agentPreset;
			const agent = this.authored(agentId);
			let modeId;
			try {
				modeId = resolveEnvironmentModeId(request.modeId);
			} catch (error) {
				throw new RemoteError("agent-preset-authoring/invalid", error.message, {
					agentPreset: agentId,
					reason: "invalid mode id"
				});
			}
			const combinedId = `${agentId}-${modeId}`;
			if (this.registrations.has(combinedId)) return {
				agentPreset: combinedId,
				modeId
			};
			if (!PRESET_ID.test(agentId) || !PRESET_ID.test(modeId)) throw new RemoteError("agent-preset-authoring/invalid", `preset id "${combinedId}" is not usable`, {
				agentPreset: combinedId,
				reason: "invalid id"
			});
			const base = await this.baseComposition("standard");
			const { metadata } = agent;
			const plugins = applyPersona(buildEnvironmentComposition(base, request.groups), {
				language: metadata.language ?? "",
				persona: metadata.persona ?? ""
			});
			try {
				await writeComposition(join(this.root, agentId), agentId, modeId, {
					name: `${metadata.name ?? agentId}`,
					...metadata.description === void 0 || metadata.description === "" ? {} : { description: metadata.description },
					plugins
				});
				const preset = (await readCompositions(join(this.root, agentId), agentId)).find((candidate) => candidate.modeId === modeId);
				if (preset === void 0) throw new Error("the written composition did not read back");
				await this.register(preset);
			} catch (error) {
				if (error instanceof RemoteError) throw error;
				throw new RemoteError("agent-preset-authoring/invalid", `environment "${combinedId}" cannot be written: ${error.message}`, {
					agentPreset: combinedId,
					reason: error.message
				});
			}
			return {
				agentPreset: combinedId,
				modeId
			};
		}
		/**
		* Infer a capability selection from a task description. Pure keyword
		* matching over the palette: a fast local baseline the client pre-checks,
		* always including the conversation defaults.
		*/
		suggestEnvironment(request) {
			return { groups: suggestCapabilityGroups(request.description) };
		}
		/**
		* Delete one chat durably: the session's log artifacts, its projection
		* cache row, and its workspace accounting. A running agent is refused — the
		* caller stops the conversation first. An opened-but-idle agent is
		* unpublished through the registry's internal detach before deletion (the
		* official runtime keeps no disposal verb for it); on a runtime whose
		* internals differ, that case degrades to the "still open" refusal.
		*/
		async deleteSession(sessionId) {
			const agents = this.ctx.get("agents");
			if ((agents?.get(sessionId))?.status === "running") throw new RemoteError("agent-preset-authoring/session-busy", `session "${sessionId}" is running; stop its conversation before deleting`, {
				sessionId,
				reason: "running"
			});
			if (agents?.get(sessionId) !== void 0 && !detachIdleAgent(this.ctx, sessionId)) throw new RemoteError("agent-preset-authoring/session-busy", `session "${sessionId}" is still open; close its conversation before deleting`, {
				sessionId,
				reason: "open"
			});
			const persistence = this.ctx.get("sessionPersistence");
			if (!(persistence?.remove === void 0 ? await removeSessionArtifacts(sessionId) : await persistence.remove(sessionId))) throw new RemoteError("agent-preset-authoring/session-not-found", `session "${sessionId}" not found`, { sessionId });
			await this.ctx.get("sessionProjectionCache")?.forget?.(sessionId);
			await this.ctx.get("workspaceRegistry")?.forgetSession?.(sessionId);
			this.ctx.emit("api-session/removed", SessionId(sessionId));
		}
		/**
		* Read one file attachment's exact stored bytes, authorizing against the
		* session's own event log: only a file referenced by `sessionId` is
		* readable, the same rule the official image read enforces. Backs the
		* edit-and-regenerate surface's resend of kept file attachments.
		* @param request - Session and attachment identities used for authorization.
		* @returns the stored display name and base64 bytes.
		*/
		async readFileAttachment(request) {
			const ref = referencedFile(await this.sessionEvents(request.sessionId), request.attachmentId);
			if (ref === void 0) throw new RemoteError("session/attachment-invalid", "File is not referenced by this session.", { reason: "ATTACHMENT_NOT_REFERENCED" });
			const MAX_READ_BYTES = 128 * 1024 * 1024;
			if (ref.bytes > MAX_READ_BYTES) throw new RemoteError("session/attachment-invalid", `File exceeds the read-back size limit (${String(MAX_READ_BYTES)} bytes).`, { reason: "ATTACHMENT_TOO_LARGE" });
			try {
				const chunks = [];
				let total = 0;
				for await (const chunk of this.ctx.attachments.readFileStream(ref)) {
					chunks.push(chunk);
					total += chunk.byteLength;
				}
				const bytes = new Uint8Array(total);
				let offset = 0;
				for (const chunk of chunks) {
					bytes.set(chunk, offset);
					offset += chunk.byteLength;
				}
				return {
					name: ref.name,
					data: Buffer.from(bytes).toString("base64")
				};
			} catch (error) {
				if (error instanceof AttachmentError) throw new RemoteError("session/attachment-invalid", error.message, { reason: error.code });
				throw new RemoteError("gateway/internal", "Unable to read file attachment.", {});
			}
		}
		/**
		* Locate the fork boundary for a rewrite anchored on one durable
		* `user/message`: the `turn/end` of the message's PREVIOUS turn — the
		* previous turn's own closing event, so the seed stops exactly on a turn
		* boundary. Cutting at "next turn/start minus one" would instead land in
		* the inter-turn gap and can sweep inter-turn `agent/inbox/spliced` events
		* into the seed, which the child then replays as injected user messages.
		* A message whose turn has not ended (open) cuts before its `turn/start`;
		* a message with no preceding turn at all keeps whatever precedes it via
		* `seq - 1` (a preset binding, the session opener), and a message with no
		* preceding event answers null — the caller reuses or creates a blank
		* session.
		* @param request - session and the anchored message seq.
		* @returns the inclusive fork boundary, or null for the blank path.
		*/
		async rewriteBoundary(request) {
			const events = await this.sessionEvents(request.sessionId);
			let lastTurnEnd;
			let openTurnStart;
			for (const event of events) {
				if (event.seq >= request.seq) break;
				if (event.type === "turn/start") openTurnStart = event.seq;
				else if (event.type === "turn/end" && openTurnStart !== void 0) {
					lastTurnEnd = event.seq;
					openTurnStart = void 0;
				}
			}
			return { atSeq: lastTurnEnd !== void 0 ? lastTurnEnd : null };
		}
		/**
		* The named session's events: the live agent's snapshot when attached, else
		* one cold query observation (no repair, resume, or publication — the same
		* read the official session controller's inspection uses).
		*/
		async sessionEvents(sessionId) {
			const env_1 = {
				stack: [],
				error: void 0,
				hasError: false
			};
			try {
				const id = SessionId(sessionId);
				const attached = this.ctx.sessions?.get(id);
				if (attached !== void 0) return attached.snapshotEvents();
				const query = this.ctx.get("sessionQuery");
				if (query === void 0) throw new RemoteError("gateway/internal", `session "${sessionId}" cannot be inspected: no session query service`, { sessionId });
				return [...__addDisposableResource(env_1, await query.observeSession(id, { projectionMode: "none" }), false).events];
			} catch (e_1) {
				env_1.error = e_1;
				env_1.hasError = true;
			} finally {
				__disposeResources(env_1);
			}
		}
	};
})();
/** Project stored metadata back to the wire identity shape. */
function identityOf(metadata, id) {
	return {
		name: metadata.name === "" ? id : metadata.name,
		language: metadata.language,
		persona: metadata.persona,
		description: metadata.description
	};
}
/**
* Scan a session's events for a first-party  content block whose
* attachment id matches. Read only declared content fields, mirroring the
* official image scan; unknown payloads stay opaque.
* @param events - the authorizing session's events.
* @param attachmentId - requested file attachment id.
* @returns the stored reference, or undefined when unreferenced.
*/
function referencedFile(events, attachmentId) {
	for (const event of events) {
		const found = fileInEvent(event, (ref) => String(ref.attachmentId) === attachmentId);
		if (found !== void 0) return found;
	}
}
function fileInEvent(event, match) {
	const data = event.data;
	switch (event.type) {
		case "user/message":
		case "tool/ptc-dispatch": return fileBlockIn(data.content, match);
		case "system/message":
		case "developer/message":
		case "tool/result":
		case "team/message/queued": return fileBlockIn(data.message?.content, match);
		case "agent/inbox/spliced": {
			const messages = data.inserted;
			if (!Array.isArray(messages)) return void 0;
			for (const message of messages) {
				if (typeof message !== "object" || message === null || Array.isArray(message)) continue;
				const found = fileBlockIn(message.content, match);
				if (found !== void 0) return found;
			}
			return;
		}
		default: return;
	}
}
function fileBlockIn(content, match) {
	if (!Array.isArray(content)) return void 0;
	for (const value of content) {
		if (typeof value !== "object" || value === null || Array.isArray(value)) continue;
		const block = value;
		if (block.type === "file" && typeof block.attachment === "object" && block.attachment !== null) {
			const ref = block.attachment;
			if (match(ref)) return ref;
		}
	}
}
/**
* Unpublish one idle agent through the registry's internal detach path: the
* official runtime drops the AgentHandle after resume, so no public verb can
* retire an opened-but-idle session's agent. The internal entry leaves the
* registry store and the paired `agent/disposed` lifecycle edge reaches
* every official listener; the session's memory-resident scope stays until
* the process restarts (idle and unreachable — its log handle opens per
* append, so deleting the storage under it is safe). The internals shape is
* pinned by this bundle's engines range; a mismatch on a future runtime
* reports failure and the caller refuses the deletion.
* @param ctx - host context carrying the agents service.
* @param sessionId - the agent/session id to unpublish.
* @returns whether the registry entry was detached.
*/
function detachIdleAgent(ctx, sessionId) {
	const registry = ctx.get("agents");
	const entry = registry?.store?.get(sessionId);
	if (entry === void 0 || typeof registry?.detachEntered !== "function") return false;
	try {
		registry.detachEntered(entry);
		return true;
	} catch {
		return false;
	}
}
/**
* 直接删除某个会话在磁盘上的目录。
*
* 0.2.1 的会话持久化后端移除了 `remove`，会话按
* `<harness home>/sessions/<projectKey>/session-<id>/` 组织，删掉整个会话目录即可。
* 调用方随后还会清投影缓存、让工作区索引 forget，并广播 `api-session/removed`。
* @param sessionId - the stored session id, with or without its `session-` prefix.
* @returns whether any session directory was actually removed.
*/
async function removeSessionArtifacts(sessionId) {
	const root = dshHomePath("sessions");
	let projects;
	try {
		projects = await readdir(root);
	} catch {
		return false;
	}
	const directoryNames = sessionId.startsWith("session-") ? [sessionId] : [`session-${sessionId}`, sessionId];
	let removed = false;
	for (const project of projects) for (const name of directoryNames) {
		const target = join(root, project, name);
		if (!existsSync(target)) continue;
		try {
			await rm(target, {
				recursive: true,
				force: true
			});
			removed = true;
		} catch {}
	}
	return removed;
}
//#endregion
export { COMBINED_MODE_SUFFIX, Config, ENVIRONMENT_GROUPS, PRESET_ID, USER_PRESET_DIR, combinedPartsOf, AgentPresetAuthoring as default, defaultEnvironmentGroups, suggestCapabilityGroups };
