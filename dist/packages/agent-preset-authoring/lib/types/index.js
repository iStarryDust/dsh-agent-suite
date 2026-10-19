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
 * @module @deepseek-ai/dsh-agent-preset-authoring
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
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
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
import { Service } from '@deepseek-ai/cordis';
import { join } from 'node:path';
import z from '@deepseek-ai/schemastery';
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { load as yamlLoad } from 'js-yaml';
import { entryListSchema } from '@deepseek-ai/cordis-plugin-include';
import { dshHomePath } from '@deepseek-ai/dsh-home-paths';
import { SessionId } from '@deepseek-ai/dsh-session';
import { AttachmentError } from '@deepseek-ai/dsh-attachment';
import { applyPersona } from "./persona.js";
import { agentOwnerProjectionDefinition } from "./session.js";
import { buildEnvironmentComposition, ENVIRONMENT_GROUPS, resolveEnvironmentModeId, suggestCapabilityGroups, } from "./environment.js";
import { combinedPartsOf, compositionOf, deleteAgent, deleteComposition, PRESET_ID, readAgent, readCompositions, scanRoot, USER_PRESET_DIR, writeAgent, writeComposition, } from "./storage.js";
export { combinedPartsOf, COMBINED_MODE_SUFFIX, PRESET_ID, USER_PRESET_DIR, } from "./storage.js";
export { defaultEnvironmentGroups, ENVIRONMENT_GROUPS, suggestCapabilityGroups } from "./environment.js";
/** Runtime schema. */
export const Config = z.object({
    root: z.string().default(''),
});
/**
 * The persisted default preset this suite withdrew at its teardown. A reload
 * or re-enable re-registers the same ids on the next init and writes the
 * value back; an uninstall never reaches that restore, which is what hands
 * the default to the deployment's own fallback instead of leaving it pointed
 * at a preset no host can resolve any more.
 */
let withheldDefaultPreset;
/** The registry plugin's settings entry, where the default preset persists. */
const REGISTRY_SETTINGS_ENTRY = 'agent-preset-registry';
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
            _roster_decorators = [Remote('list')];
            _document_decorators = [Remote('read')];
            _create_decorators = [Remote('create')];
            _update_decorators = [Remote('update')];
            _remove_decorators = [Remote('delete')];
            _environmentGroups_decorators = [Remote('environmentGroups')];
            _composeEnvironment_decorators = [Remote('composeEnvironment')];
            _suggestEnvironment_decorators = [Remote('suggestEnvironment')];
            _deleteSession_decorators = [Remote('deleteSession')];
            _readFileAttachment_decorators = [Remote('readFileAttachment')];
            _rewriteBoundary_decorators = [Remote('rewriteBoundary')];
            __esDecorate(this, null, _roster_decorators, { kind: "method", name: "roster", static: false, private: false, access: { has: obj => "roster" in obj, get: obj => obj.roster }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _document_decorators, { kind: "method", name: "document", static: false, private: false, access: { has: obj => "document" in obj, get: obj => obj.document }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _environmentGroups_decorators, { kind: "method", name: "environmentGroups", static: false, private: false, access: { has: obj => "environmentGroups" in obj, get: obj => obj.environmentGroups }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _composeEnvironment_decorators, { kind: "method", name: "composeEnvironment", static: false, private: false, access: { has: obj => "composeEnvironment" in obj, get: obj => obj.composeEnvironment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _suggestEnvironment_decorators, { kind: "method", name: "suggestEnvironment", static: false, private: false, access: { has: obj => "suggestEnvironment" in obj, get: obj => obj.suggestEnvironment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteSession_decorators, { kind: "method", name: "deleteSession", static: false, private: false, access: { has: obj => "deleteSession" in obj, get: obj => obj.deleteSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _readFileAttachment_decorators, { kind: "method", name: "readFileAttachment", static: false, private: false, access: { has: obj => "readFileAttachment" in obj, get: obj => obj.readFileAttachment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _rewriteBoundary_decorators, { kind: "method", name: "rewriteBoundary", static: false, private: false, access: { has: obj => "rewriteBoundary" in obj, get: obj => obj.rewriteBoundary }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /** The preset registry and the projection registry this service builds on. */
        static inject = ['agentPresets', 'sessionProjections', 'attachments', 'sessions', 'sessionQuery'];
        static Config = Config;
        /** Absolute path of the authoring root. */
        root = __runInitializers(this, _instanceExtraInitializers);
        /** Live registrations, keyed by flattened preset id. */
        registrations = new Map();
        constructor(ctx, config = {}) {
            super(ctx, 'agentPresetAuthoring');
            const override = (config.root ?? '').trim();
            this.root = override === '' ? dshHomePath(USER_PRESET_DIR) : override;
            // The ownership projection every chat-history surface filters by. It
            // folds the registry's own selection event, so agent chat membership is
            // derived once, host-side, with the same combined-id split the authoring
            // root reads.
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
            void this.ctx.inject(['sessionPersistence', 'sessionProjectionCache'], async (scope) => {
                try {
                    const snapshots = await scope.sessionPersistence.list();
                    for (const snapshot of snapshots) {
                        const { header } = snapshot;
                        if (scope.sessionProjectionCache.cachedSnapshot(header, ['agentOwner']) !== undefined)
                            continue;
                        try {
                            const handle = await scope.sessionPersistence.open(header.id, 'read');
                            try {
                                const read = await handle.read();
                                scope.sessionProjectionCache.coldSnapshot(header, handle.inheritedEventCount, read.events);
                            }
                            finally {
                                await handle.close();
                            }
                        }
                        catch (error) {
                            scope.logger.warn(`agent-preset-authoring: agentOwner backfill for "${header.id}" failed: ${String(error)}`);
                        }
                    }
                }
                catch (error) {
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
            for (const preset of await scanRoot(this.root)) {
                await this.register(preset);
            }
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
            if (withheldDefaultPreset === undefined)
                return;
            if (!this.registrations.has(withheldDefaultPreset))
                return;
            const restored = withheldDefaultPreset;
            withheldDefaultPreset = undefined;
            try {
                const forms = this.ctx.get('configForms');
                const done = await forms?.get(REGISTRY_SETTINGS_ENTRY)?.set('selectedDefault', restored);
                if (done === false) {
                    withheldDefaultPreset = restored;
                    this.ctx.logger.warn('agent-preset-authoring: default-preset restore was refused; it retries on the next activation');
                }
            }
            catch (error) {
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
            for (const [, registration] of [...this.registrations].reverse()) {
                await registration.unregister();
            }
            this.registrations.clear();
            try {
                const registry = this.ctx.get('agentPresets');
                const current = registry?.config?.selectedDefault?.get();
                if (typeof current !== 'string' || !owned.has(current))
                    return;
                withheldDefaultPreset = current;
                const forms = this.ctx.get('configForms');
                const done = await forms?.get(REGISTRY_SETTINGS_ENTRY)?.set('selectedDefault', undefined);
                if (done === false) {
                    withheldDefaultPreset = undefined;
                    this.ctx.logger.warn('agent-preset-authoring: default-preset cleanup was refused; the stored default may point at a withdrawn preset');
                }
            }
            catch (error) {
                this.ctx.logger.warn(`agent-preset-authoring: default-preset cleanup failed: ${String(error)}`);
            }
        }
        /** Register one authored preset as a registry declaration. */
        async register(preset) {
            const definition = {
                id: preset.id,
                ...preset.metadata.name === undefined ? {} : { name: preset.metadata.name },
                ...preset.metadata.description === undefined ? {} : { description: preset.metadata.description },
                plugins: preset.plugins,
            };
            const unregister = await this.ctx.agentPresets.register(definition);
            this.registrations.set(preset.id, { unregister, preset });
        }
        /** Swap one registration: withdraw the old revision before the new one. */
        async swap(preset) {
            const previous = this.registrations.get(preset.id);
            if (previous !== undefined)
                await previous.unregister();
            try {
                await this.register(preset);
            }
            catch (error) {
                // A failed re-registration leaves the preset on disk without a roster
                // entry; withdrawing the map entry keeps bookkeeping honest for a retry.
                this.registrations.delete(preset.id);
                throw error;
            }
        }
        /** The authored preset a roster id addresses. */
        authored(agentPreset) {
            const registration = this.registrations.get(agentPreset);
            if (registration === undefined) {
                throw new RemoteError('agent-preset-authoring/not-found', `no authored preset "${agentPreset}" exists`, { agentPreset });
            }
            return registration.preset;
        }
        /**
         * The composition rows a creation starts from: an authored preset's own
         * files when the base is one, otherwise the registry's declaration.
         */
        async baseComposition(from) {
            const authored = this.registrations.get(from);
            if (authored !== undefined)
                return authored.preset.plugins;
            let content;
            try {
                content = (await this.ctx.agentPresets.readDocument(from)).content;
            }
            catch {
                throw new RemoteError('agent-preset-authoring/invalid', `base preset "${from}" does not resolve`, { agentPreset: from, reason: 'unknown base preset' });
            }
            const parsed = yamlLoad(content, { schema: entryListSchema });
            if (!Array.isArray(parsed)) {
                throw new RemoteError('agent-preset-authoring/invalid', `base preset "${from}" carries no composition`, { agentPreset: from, reason: 'empty composition' });
            }
            return parsed;
        }
        /** Require a non-empty trimmed value for the identity fields that carry one. */
        static requireText(value, agentPreset, field) {
            const trimmed = value.trim();
            if (trimmed === '') {
                throw new RemoteError('agent-preset-authoring/invalid', `${field} must not be empty`, { agentPreset, reason: 'empty field' });
            }
            return trimmed;
        }
        /** Read the authored roster, with activation diagnostics from the registry. */
        async roster() {
            const diagnostics = new Map((await this.ctx.agentPresets.list())
                .map(row => [row.id, row.broken]));
            const presets = [...this.registrations.values()]
                .map(({ preset }) => {
                const { name, description, language, persona } = preset.metadata;
                const broken = diagnostics.get(preset.id);
                return {
                    id: preset.id,
                    agentId: preset.agentId,
                    ...preset.modeId === undefined ? {} : { modeId: preset.modeId },
                    ...name === undefined ? {} : { name },
                    ...description === undefined ? {} : { description },
                    ...language === undefined ? {} : { language },
                    ...persona === undefined ? {} : { persona },
                    ...broken === undefined ? {} : { broken },
                };
            })
                .sort((left, right) => left.id.localeCompare(right.id));
            return { presets };
        }
        /** Read one authored preset's identity, prefilled from its files. */
        async document(agentPreset) {
            const { metadata } = this.authored(agentPreset);
            return {
                agentPreset,
                name: metadata.name ?? agentPreset,
                language: metadata.language ?? '',
                persona: metadata.persona ?? '',
                description: metadata.description ?? '',
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
            const name = AgentPresetAuthoring.requireText(request.name, id, 'name');
            if (this.registrations.has(id)) {
                throw new RemoteError('agent-preset-authoring/exists', `authored preset "${id}" already exists`, { agentPreset: id });
            }
            const parts = combinedPartsOf(id);
            const agentId = parts?.agentId ?? id;
            const dir = join(this.root, agentId);
            if (!PRESET_ID.test(agentId)) {
                throw new RemoteError('agent-preset-authoring/invalid', `preset id "${id}" is not usable as a directory name`, { agentPreset: id, reason: 'invalid id' });
            }
            const base = await this.baseComposition(request.from);
            const plugins = applyPersona(base, { language: request.language, persona: request.persona });
            const metadata = {
                name,
                description: request.description.trim(),
                language: request.language.trim(),
                persona: request.persona.trim(),
            };
            try {
                if (parts === undefined) {
                    await writeAgent(dir, plugins, metadata);
                    const preset = await readAgent(dir, id);
                    if (preset === undefined) {
                        throw new Error('the written composition did not read back');
                    }
                    await this.register(preset);
                }
                else {
                    await writeComposition(dir, agentId, parts.modeId, {
                        name: metadata.name,
                        ...metadata.description === '' ? {} : { description: metadata.description },
                        plugins,
                    });
                    const preset = (await readCompositions(dir, agentId))
                        .find(candidate => candidate.modeId === parts.modeId);
                    if (preset === undefined)
                        throw new Error('the written composition did not read back');
                    await this.register(preset);
                }
            }
            catch (error) {
                if (error instanceof RemoteError)
                    throw error;
                throw new RemoteError('agent-preset-authoring/invalid', `preset "${id}" cannot be written: ${error.message}`, { agentPreset: id, reason: error.message });
            }
            return { agentPreset: id, ...identityOf(metadata, id) };
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
            const name = AgentPresetAuthoring.requireText(request.name, id, 'name');
            const existing = this.authored(id);
            const agentId = existing.agentId;
            const dir = join(this.root, agentId);
            const identity = {
                name,
                description: request.description.trim(),
                language: request.language.trim(),
                persona: request.persona.trim(),
            };
            try {
                if (existing.modeId === undefined) {
                    const plugins = applyPersona(existing.plugins, {
                        language: identity.language,
                        persona: identity.persona,
                    });
                    await writeAgent(dir, plugins, identity);
                    const agent = await readAgent(dir, agentId);
                    if (agent === undefined)
                        throw new Error('the written composition did not read back');
                    await this.swap(agent);
                    // Follow the agent's identity into every composition it owns, so no
                    // chat-time mode keeps presenting a stale persona.
                    for (const composition of await readCompositions(dir, agentId)) {
                        const entry = compositionOf(composition);
                        await writeComposition(dir, agentId, composition.modeId, {
                            ...entry,
                            name: identity.name,
                            plugins: applyPersona(composition.plugins, {
                                language: identity.language,
                                persona: identity.persona,
                            }),
                        });
                        const rewritten = (await readCompositions(dir, agentId))
                            .find(candidate => candidate.modeId === composition.modeId);
                        if (rewritten === undefined)
                            throw new Error('the rewritten composition did not read back');
                        await this.swap(rewritten);
                    }
                }
                else {
                    await writeComposition(dir, agentId, existing.modeId, {
                        name: identity.name,
                        ...identity.description === '' ? {} : { description: identity.description },
                        plugins: applyPersona(existing.plugins, {
                            language: identity.language,
                            persona: identity.persona,
                        }),
                    });
                    const rewritten = (await readCompositions(dir, agentId))
                        .find(candidate => candidate.modeId === existing.modeId);
                    if (rewritten === undefined)
                        throw new Error('the rewritten composition did not read back');
                    await this.swap(rewritten);
                }
            }
            catch (error) {
                if (error instanceof RemoteError)
                    throw error;
                throw new RemoteError('agent-preset-authoring/invalid', `preset "${id}" cannot be rewritten: ${error.message}`, { agentPreset: id, reason: error.message });
            }
            return { agentPreset: id, ...identityOf(identity, id) };
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
            if (existing.modeId === undefined) {
                const orphans = [...this.registrations.values()]
                    .map(({ preset }) => preset)
                    .filter(preset => preset.agentId === id && preset.id !== id);
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
            void this.ctx.inject(['sessionPersistence', 'sessionProjectionCache'], async (scope) => {
                const memory = this.ctx.get('agentMemory');
                try {
                    memory?.purgeAgent?.(agentId);
                }
                catch (error) {
                    scope.logger.warn(`agent-preset-authoring: memory purge for "${agentId}" failed: ${String(error)}`);
                }
                try {
                    const snapshots = await scope.sessionPersistence.list();
                    for (const snapshot of snapshots) {
                        const cached = scope.sessionProjectionCache.cachedSnapshot(snapshot.header, ['agentOwner']);
                        const owner = typeof cached === 'string'
                            ? cached
                            : cached?.agentOwner;
                        if (owner !== agentId)
                            continue;
                        const sessionId = snapshot.header.id;
                        try {
                            const agents = this.ctx.get('agents');
                            if (agents?.get(sessionId) !== undefined && !detachIdleAgent(this.ctx, sessionId)) {
                                scope.logger.warn(`agent-preset-authoring: session "${sessionId}" of deleted agent "${agentId}" is still live; skipped`);
                                continue;
                            }
                            if (scope.sessionPersistence.remove === undefined) {
                                scope.logger.warn(`agent-preset-authoring: chat "${sessionId}" of deleted agent "${agentId}" was not removed: storage without deletion support`);
                                continue;
                            }
                            await scope.sessionPersistence.remove(sessionId);
                            await this.ctx.get('sessionProjectionCache')?.forget?.(sessionId);
                            await this.ctx.get('workspaceRegistry')?.forgetSession?.(sessionId);
                            this.ctx.emit('api-session/removed', sessionId);
                        }
                        catch (error) {
                            scope.logger.warn(`agent-preset-authoring: chat "${sessionId}" of deleted agent "${agentId}" was not removed: ${String(error)}`);
                        }
                    }
                }
                catch (error) {
                    scope.logger.warn(`agent-preset-authoring: footprint sweep for "${agentId}" failed: ${String(error)}`);
                }
            });
        }
        /** The Define-mode capability palette, as a client renders it. */
        environmentGroups() {
            return {
                groups: ENVIRONMENT_GROUPS.map(group => ({ id: group.id, defaultOn: group.defaultOn, plugin: group.plugin === true })),
            };
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
            }
            catch (error) {
                throw new RemoteError('agent-preset-authoring/invalid', error.message, { agentPreset: agentId, reason: 'invalid mode id' });
            }
            const combinedId = `${agentId}-${modeId}`;
            if (this.registrations.has(combinedId))
                return { agentPreset: combinedId, modeId };
            if (!PRESET_ID.test(agentId) || !PRESET_ID.test(modeId)) {
                throw new RemoteError('agent-preset-authoring/invalid', `preset id "${combinedId}" is not usable`, { agentPreset: combinedId, reason: 'invalid id' });
            }
            // The environment subsets the SHIPPED `standard` composition, never an
            // authored row set: an environment's ceiling is the deployment's ceiling.
            const base = await this.baseComposition('standard');
            const { metadata } = agent;
            const plugins = applyPersona(buildEnvironmentComposition(base, request.groups), {
                language: metadata.language ?? '',
                persona: metadata.persona ?? '',
            });
            try {
                await writeComposition(join(this.root, agentId), agentId, modeId, {
                    name: `${metadata.name ?? agentId}`,
                    ...metadata.description === undefined || metadata.description === ''
                        ? {}
                        : { description: metadata.description },
                    plugins,
                });
                const preset = (await readCompositions(join(this.root, agentId), agentId))
                    .find(candidate => candidate.modeId === modeId);
                if (preset === undefined)
                    throw new Error('the written composition did not read back');
                await this.register(preset);
            }
            catch (error) {
                if (error instanceof RemoteError)
                    throw error;
                throw new RemoteError('agent-preset-authoring/invalid', `environment "${combinedId}" cannot be written: ${error.message}`, { agentPreset: combinedId, reason: error.message });
            }
            return { agentPreset: combinedId, modeId };
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
            const agents = this.ctx.get('agents');
            const agent = agents?.get(sessionId);
            if (agent?.status === 'running') {
                throw new RemoteError('agent-preset-authoring/session-busy', `session "${sessionId}" is running; stop its conversation before deleting`, { sessionId, reason: 'running' });
            }
            if (agents?.get(sessionId) !== undefined && !detachIdleAgent(this.ctx, sessionId)) {
                throw new RemoteError('agent-preset-authoring/session-busy', `session "${sessionId}" is still open; close its conversation before deleting`, { sessionId, reason: 'open' });
            }
            const persistence = this.ctx.get('sessionPersistence');
            if (persistence?.remove === undefined) {
                throw new RemoteError('agent-preset-authoring/remove-unavailable', `this deployment's session storage does not support deletion`, { sessionId, reason: 'storage without deletion support' });
            }
            const removed = await persistence.remove(sessionId);
            if (!removed) {
                throw new RemoteError('agent-preset-authoring/session-not-found', `session "${sessionId}" not found`, { sessionId });
            }
            await this.ctx.get('sessionProjectionCache')?.forget?.(sessionId);
            await this.ctx.get('workspaceRegistry')?.forgetSession?.(sessionId);
            this.ctx.emit('api-session/removed', SessionId(sessionId));
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
            const events = await this.sessionEvents(request.sessionId);
            const ref = referencedFile(events, request.attachmentId);
            if (ref === undefined) {
                throw new RemoteError('session/attachment-invalid', 'File is not referenced by this session.', { reason: 'ATTACHMENT_NOT_REFERENCED' });
            }
            const MAX_READ_BYTES = 128 * 1024 * 1024;
            if (ref.bytes > MAX_READ_BYTES) {
                throw new RemoteError('session/attachment-invalid', `File exceeds the read-back size limit (${String(MAX_READ_BYTES)} bytes).`, { reason: 'ATTACHMENT_TOO_LARGE' });
            }
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
                return { name: ref.name, data: Buffer.from(bytes).toString('base64') };
            }
            catch (error) {
                if (error instanceof AttachmentError) {
                    throw new RemoteError('session/attachment-invalid', error.message, { reason: error.code });
                }
                throw new RemoteError('gateway/internal', 'Unable to read file attachment.', {});
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
                if (event.seq >= request.seq)
                    break;
                if (event.type === 'turn/start') {
                    openTurnStart = event.seq;
                }
                else if (event.type === 'turn/end' && openTurnStart !== undefined) {
                    lastTurnEnd = event.seq;
                    openTurnStart = undefined;
                }
            }
            // No completed turn before the edited message (the first message):
            // the pre-turn region is setup events plus the queue-mode inbox
            // splices that carry the source's own pending messages — forking
            // there resurrects them in the child's inbox and the next turn
            // re-sends them ahead of the edit. Start clean instead; the suite's
            // preset and model carry-over re-establish the rest.
            const atSeq = lastTurnEnd !== undefined ? lastTurnEnd : null;
            return { atSeq };
        }
        /**
         * The named session's events: the live agent's snapshot when attached, else
         * one cold query observation (no repair, resume, or publication — the same
         * read the official session controller's inspection uses).
         */
        async sessionEvents(sessionId) {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const id = SessionId(sessionId);
                const attached = this.ctx.sessions?.get(id);
                if (attached !== undefined) {
                    // oxlint-disable-next-line typescript/no-deprecated -- Existing Session history read; migration deferred.
                    return attached.snapshotEvents();
                }
                const query = this.ctx.get('sessionQuery');
                if (query === undefined) {
                    throw new RemoteError('gateway/internal', `session "${sessionId}" cannot be inspected: no session query service`, { sessionId });
                }
                const observation = __addDisposableResource(env_1, await query.observeSession(id, { projectionMode: 'none' }), false);
                return [...observation.events];
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                __disposeResources(env_1);
            }
        }
    };
})();
/** Authoring service: the `.agent-presets` directory and its registry bridge. */
export default AgentPresetAuthoring;
/** Project stored metadata back to the wire identity shape. */
function identityOf(metadata, id) {
    return {
        name: metadata.name === '' ? id : metadata.name,
        language: metadata.language,
        persona: metadata.persona,
        description: metadata.description,
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
        const found = fileInEvent(event, ref => String(ref.attachmentId) === attachmentId);
        if (found !== undefined)
            return found;
    }
    return undefined;
}
function fileInEvent(event, match) {
    const data = event.data;
    const type = event.type;
    switch (type) {
        case 'user/message':
        case 'tool/ptc-dispatch':
            return fileBlockIn(data.content, match);
        case 'system/message':
        case 'developer/message':
        case 'tool/result':
        case 'team/message/queued':
            return fileBlockIn(data.message?.content, match);
        case 'agent/inbox/spliced': {
            const messages = data.inserted;
            if (!Array.isArray(messages))
                return undefined;
            for (const message of messages) {
                if (typeof message !== 'object' || message === null || Array.isArray(message))
                    continue;
                const found = fileBlockIn(message.content, match);
                if (found !== undefined)
                    return found;
            }
            return undefined;
        }
        default:
            return undefined;
    }
}
function fileBlockIn(content, match) {
    if (!Array.isArray(content))
        return undefined;
    for (const value of content) {
        if (typeof value !== 'object' || value === null || Array.isArray(value))
            continue;
        const block = value;
        if (block.type === 'file' && typeof block.attachment === 'object' && block.attachment !== null) {
            const ref = block.attachment;
            if (match(ref))
                return ref;
        }
    }
    return undefined;
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
    const registry = ctx.get('agents');
    const entry = registry?.store?.get(sessionId);
    if (entry === undefined || typeof registry?.detachEntered !== 'function')
        return false;
    try {
        registry.detachEntered(entry);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=index.js.map