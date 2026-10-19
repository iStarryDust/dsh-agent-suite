/**
 * Global and per-agent long-term memory for the DeepSeek Harness.
 *
 * Two memory tiers, both plain markdown stores under `<dshHome>/agent-memory`
 * (sibling of `.agent-presets`, resolved through `dshHomePath` so `$DSH_HOME`
 * and cross-platform homes land correctly):
 *
 * - **global**: `global/memory.md`, shared by every agent;
 * - **agent**: `<agentId>/memory.md`, one store per agent (the agent id is the
 *   authored preset id, deduced from a combined `<agentId>-<modeId>` preset).
 *
 * Four user switches — the plugin's own configuration section, editable on
 * the standard settings surfaces — control behavior:
 * - `globalEnabled` / `agentEnabled`: whether the corresponding store is
 *   injected into the system prompt (`memory:global` / `memory:agent`
 *   sections, text thunks re-read the files on every assembly so editor saves
 *   take effect without a restart);
 * - `autoMemory`: the model may call the `memory_add` tool and facts are
 *   written straight to the agent store (deduped, timestamped);
 * - `askMemory`: the same tool call first asks the human through the approval
 *   seam (fail-closed when no approval service is composed or a `never`
 *   session policy rejects), and only an `allowed-once` decision writes.
 *
 * The tool is registered only while `autoMemory || askMemory` holds; the
 * switches are volatile (committed without a remount), so the plugin re-syncs
 * the registration on every settings commit. Global memory is human-authored
 * through the editor; the tool always writes the calling agent's store.
 *
 * @module @deepseek-ai/dsh-agent-memory
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
import z from '@deepseek-ai/schemastery';
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { BlockAssembler, createUserMessage } from '@deepseek-ai/dsh-llm';
import { SessionId } from '@deepseek-ai/dsh-session';
import { appendMemory, purgeMemory, readMemoryText, writeMemory, } from "./storage.js";
export * from "./storage.js";
/** System-prompt section names this plugin owns. */
export const GLOBAL_MEMORY_SECTION = 'memory:global';
export const AGENT_MEMORY_SECTION = 'memory:agent';
/**
 * Section positions, ahead of the tool catalog (its first slot sits at 1000)
 * but after the deployment persona: memory states who the user and agent
 * are, which the tool descriptions then assume.
 */
const GLOBAL_MEMORY_ORDER = 500;
const AGENT_MEMORY_ORDER = 510;
/** Runtime schema. The first type parameter is the wire/patch shape (volatile
 * fields optional); the second is the resolved shape the plugin reads. */
export const Config = z.object({
    globalEnabled: z.boolean().default(false).description('Inject the global memory store into the system prompt').volatile(),
    agentEnabled: z.boolean().default(false).description("Inject the calling agent's memory store into the system prompt").volatile(),
    autoMemory: z.boolean().default(false).description('Let the model write facts to the agent store on its own judgment').volatile(),
    askMemory: z.boolean().default(false).description('Ask the human before the memory_add tool writes').volatile(),
});
/**
 * Deduce the owning user-agent id from a preset id: a combined
 * `<agentId>-<modeId>` id resolves to `<agentId>`, anything else is itself.
 * The shipped mode spellings (including the creator mode) and the `env-`
 * namespace match the authoring root's combined-id split, so both sides never
 * drift apart.
 * @param presetId - the preset id bound to the session or agent.
 * @returns the agent id whose memory directory applies.
 */
export function agentIdOf(presetId) {
    const match = /^(.+)-(?:standard|ptc|minimal|cordis|env-[a-z0-9-]+)$/.exec(presetId);
    return match?.[1] ?? presetId;
}
const MEMORY_ADD_DESCRIPTION = 'Add one fact to the current agent\'s long-term memory when the conversation '
    + 'reveals something the agent should remember across future sessions: stable '
    + 'preferences, work habits, durable decisions, or facts the human stated as '
    + 'lasting. Remember prose conclusions, not the raw exchange; merge related '
    + 'facts into one entry. Do not store credentials, one-off task details, or '
    + 'anything the human may have said is transient.';
/** Wire schema of the `memory_add` tool's output value. */
const MEMORY_ADD_VALUE_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
        saved: { type: 'boolean', required: true },
        agentId: { type: 'string' },
        outcome: { type: 'string' },
        content: { type: 'string' },
    },
};
/**
 * The directive that turns selected conversation text into durable memory
 * entries. Delivered as the final user message after the selected surface, so
 * a model reads it as continuation rather than as a separate summarizer.
 * Output is one memory entry per line, in the storage's bare content shape
 * (the writer stamps and dedupes); a genuinely blank line is dropped.
 */
const REMEMBER_INSTRUCTION = '你是一个长期记忆提炼引擎。用户从对话中圈选了下面这段内容，明确希望把它记入助手的长期记忆。'
    + '请把这些内容提炼成简短、稳定、可跨会话复用的记忆条目。'
    + '\n规则：'
    + '\n- 每行输出一条记忆内容本身（不带时间戳、不带 "- " 前缀、不带编号）。'
    + '\n- 用户既然圈选了它，请默认提取出其中明确、稳定的信息：称呼、偏好、习惯、约定、身份事实、项目背景。'
    + '\n- 把相关事实合并成一条；不要逐字复述，只提炼结论，但保留关键名称、数字、关系。'
    + '\n- 只有当整段内容完全是临时任务细节或含凭据、密钥时，才不输出条目（此时只输出一个真正的空行）。'
    + '\n- 用与对话片段一致的语言书写（对话是中文就用中文，是英文就用英文）。'
    + '\n- 严禁输出"空行""（空行）""无""没有""none"之类的占位文字。';
let AgentMemory = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _readGlobal_decorators;
    let _writeGlobal_decorators;
    let _readAgent_decorators;
    let _writeAgent_decorators;
    let _purgeAgent_decorators;
    let _remember_decorators;
    return class AgentMemory extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _readGlobal_decorators = [Remote('readGlobal')];
            _writeGlobal_decorators = [Remote('writeGlobal')];
            _readAgent_decorators = [Remote('readAgent')];
            _writeAgent_decorators = [Remote('writeAgent')];
            _purgeAgent_decorators = [Remote('purgeAgent')];
            _remember_decorators = [Remote('remember')];
            __esDecorate(this, null, _readGlobal_decorators, { kind: "method", name: "readGlobal", static: false, private: false, access: { has: obj => "readGlobal" in obj, get: obj => obj.readGlobal }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _writeGlobal_decorators, { kind: "method", name: "writeGlobal", static: false, private: false, access: { has: obj => "writeGlobal" in obj, get: obj => obj.writeGlobal }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _readAgent_decorators, { kind: "method", name: "readAgent", static: false, private: false, access: { has: obj => "readAgent" in obj, get: obj => obj.readAgent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _writeAgent_decorators, { kind: "method", name: "writeAgent", static: false, private: false, access: { has: obj => "writeAgent" in obj, get: obj => obj.writeAgent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _purgeAgent_decorators, { kind: "method", name: "purgeAgent", static: false, private: false, access: { has: obj => "purgeAgent" in obj, get: obj => obj.purgeAgent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _remember_decorators, { kind: "method", name: "remember", static: false, private: false, access: { has: obj => "remember" in obj, get: obj => obj.remember }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        config = __runInitializers(this, _instanceExtraInitializers);
        static inject = ['systemPrompt', 'tools', 'llm'];
        static Config = Config;
        /** Disposer of the `memory_add` tool registration, present while visible. */
        toolDisposer;
        constructor(ctx, config) {
            super(ctx, 'agentMemory');
            this.config = config;
            // Global memory: one always-registered section whose thunk re-reads the
            // store and the switch on every assembly.
            ctx.effect(() => ctx.systemPrompt.section({
                name: GLOBAL_MEMORY_SECTION,
                order: GLOBAL_MEMORY_ORDER,
                text: () => {
                    if (config.globalEnabled.get() !== true)
                        return '';
                    return readMemoryText().trim();
                },
            }), 'agent-memory: global-memory section');
            // Agent memory: registered on each agent's own context, so the section
            // lands in that agent's prompt assembly only. The owning agent id is NOT
            // snapshotted here: `agent/created` precedes the preset join whenever the
            // preset was chosen on a blank session (the mode-chip flow selects the
            // composition after creation), so `composedPreset` is still undefined at
            // this point and a captured id would be the bare SessionId forever — the
            // section would then read a store directory that never exists and the
            // agent memory would silently stay empty. The thunk therefore re-resolves
            // the owner on every assembly, the same way the tool and the analysis
            // remote do at call time. `agent/created` is a scope-filtered event
            // (subject = the agent scope), so a root listener needs `{ global: true }`
            // to hear it.
            ctx.on('agent/created', ({ agent }) => {
                const agentCtx = agent.ctx;
                agentCtx.effect(() => agentCtx.systemPrompt.section({
                    name: AGENT_MEMORY_SECTION,
                    order: AGENT_MEMORY_ORDER,
                    text: () => {
                        if (config.agentEnabled.get() !== true)
                            return '';
                        return readMemoryText(this.resolveAgentId(agent)).trim();
                    },
                }), 'agent-memory: agent section');
            }, { global: true });
            // The switches are volatile: the loader commits a changed value into the
            // running fiber WITHOUT a remount, so constructor-time registration alone
            // would freeze the tool behind the boot-time switch state. Re-sync on
            // every volatile commit; the sections above need nothing (their thunks
            // re-read the Volatile on each assembly).
            this.syncTool();
            ctx.on('loader/volatile-update', () => { this.syncTool(); });
        }
        /** Register or drop the `memory_add` tool to match the current switches. */
        syncTool() {
            const want = this.config.autoMemory.get() || this.config.askMemory.get();
            if (want && this.toolDisposer === undefined) {
                this.toolDisposer = this.registerTool();
            }
            else if (!want && this.toolDisposer !== undefined) {
                this.toolDisposer();
                this.toolDisposer = undefined;
            }
        }
        /** Register the model-facing memory tool; returns its disposer. */
        registerTool() {
            const ctx = this.ctx;
            const config = this.config;
            const disposer = ctx.tools.register(defineTool({
                name: 'memory_add',
                description: MEMORY_ADD_DESCRIPTION,
                parameters: {
                    text: {
                        type: 'string',
                        required: true,
                        description: 'The stable fact to remember, in its final prose form.',
                    },
                },
                output: {
                    schema: MEMORY_ADD_VALUE_SCHEMA,
                    render: (_args, value) => {
                        const v = value;
                        if (v.saved)
                            return [{ type: 'text', text: `记住：${v.content ?? ''}` }];
                        return [{ type: 'text', text: `未记住：${v.outcome ?? '未启用'}` }];
                    },
                },
                execute: async (args, exec) => {
                    const agent = exec.agent;
                    if (agent === undefined)
                        return { saved: false, outcome: 'no calling agent' };
                    const agentId = this.resolveAgentId(agent);
                    const text = args.text.trim();
                    if (text === '')
                        return { saved: false, outcome: 'empty fact', agentId };
                    if (config.askMemory.get()) {
                        const approval = ctx.get('approval');
                        if (approval === undefined)
                            return { saved: false, outcome: 'no approval service', agentId };
                        const outcome = await approval.request({
                            agent,
                            toolName: 'memory_add',
                            reason: `模型想把这条信息加入「${agentId}」的记忆：${shorten(text, 120)}`,
                        });
                        if (outcome !== 'allowed-once')
                            return { saved: false, outcome, agentId };
                    }
                    const result = this.appendAgent(agentId, text);
                    return {
                        saved: true,
                        agentId,
                        content: result.content,
                        outcome: result.appended ? 'appended' : result.refreshed ? 'refreshed' : 'unchanged',
                    };
                },
            }));
            const teardown = () => { disposer(); this.toolDisposer = undefined; };
            ctx.effect(() => teardown, 'agent-memory: tool registration');
            return () => { disposer(); };
        }
        /**
         * The user-agent id behind one live agent. `agent.id` is the SessionId, not
         * a preset id: the owning user agent is the preset the agent joined
         * (`composedPreset` -> `<agentId>-<modeId>`), split back to `<agentId>`.
         * @param agent - a live agent (or the slim `{ id, ctx }` shape).
         * @returns the user-agent id whose memory store applies.
         */
        resolveAgentId(agent) {
            const presets = this.ctx.get('agentPresets');
            const presetId = presets?.composedPreset(agent.ctx) ?? agent.id;
            return agentIdOf(presetId);
        }
        /** Global store text (editor read). */
        readGlobal() {
            return readMemoryText();
        }
        /** Global store save (editor write). */
        writeGlobal(text) {
            writeMemory(text);
        }
        /** One agent store text (editor read). */
        readAgent(agentId) {
            return readMemoryText(agentIdOf(agentId));
        }
        /** One agent store save (editor write). */
        writeAgent(agentId, text) {
            writeMemory(text, agentIdOf(agentId));
        }
        /** Remove one agent's whole memory store directory (the agent-delete purge). */
        purgeAgent(agentId) {
            purgeMemory(agentIdOf(agentId));
        }
        /** Append one fact to an agent store (deduped, timestamped). */
        appendAgent(agentId, content) {
            return appendMemory(content, agentIdOf(agentId));
        }
        /**
         * Analyze selected conversation text with the agent's own model and write
         * the resulting memory entries to the agent's store. This is the UI-driven
         * path (the memory button): the human selects messages in an open chat, and
         * the model condenses them into stable facts. The session must be live (its
         * agent supplies the model config) and must belong to an authored agent — a
         * plain chat has no agent store to write to. The write always targets the
         * calling agent's store — never global — mirroring the tool's policy.
         * @param sessionId - the live session whose agent performs the analysis.
         * @param text - the selected conversation text to condense.
         * @returns whether anything landed, plus the entries and any outcome detail.
         */
        async remember(sessionId, text) {
            const agents = this.ctx.get('agents');
            const agent = agents?.get(SessionId(sessionId));
            if (agent === undefined)
                return { saved: false, outcome: 'session not open' };
            const presets = this.ctx.get('agentPresets');
            const composed = presets?.composedPreset(agent.ctx);
            if (composed === undefined) {
                return { saved: false, outcome: 'not an agent chat' };
            }
            const agentId = agentIdOf(composed);
            const header = agent.session.requestHeader?.();
            const callConfig = header?.config;
            if (callConfig === undefined) {
                return { saved: false, agentId, outcome: 'no provider/model available for the agent' };
            }
            const trimmed = text.trim();
            if (trimmed === '')
                return { saved: false, agentId, outcome: 'empty selection' };
            const assembler = new BlockAssembler();
            const messages = [
                createUserMessage({
                    content: [{ type: 'text', text: trimmed }],
                    source: { kind: 'user' },
                }),
                createUserMessage({
                    content: [{ type: 'text', text: REMEMBER_INSTRUCTION }],
                    source: { kind: 'user' },
                }),
            ];
            try {
                for await (const chunk of this.ctx.llm.stream({
                    ...callConfig,
                    messages,
                    sessionId: agent.session.id,
                }))
                    assembler.push(chunk);
            }
            catch (error) {
                return { saved: false, agentId, outcome: `analysis failed: ${errorChain(error)}` };
            }
            const error = rememberFinishError(assembler.finish);
            if (error !== undefined)
                return { saved: false, agentId, outcome: error };
            const entries = splitEntries(assembler.blocks());
            if (entries.length === 0)
                return { saved: false, agentId, outcome: 'nothing worth remembering' };
            for (const entry of entries)
                this.appendAgent(agentId, entry);
            return { saved: true, agentId, entries, outcome: `remembered ${entries.length} entry` };
        }
    };
})();
/** Memory service: the harness-home stores, the switches, the prompt sections, and the model-facing `memory_add` tool. */
export default AgentMemory;
/** Trim a long fact for a confirmation prompt. */
function shorten(text, max) {
    return text.length <= max ? text : `${text.slice(0, max)}…`;
}
/** Render one error and its cause chain on one line, for outcome details. */
function errorChain(error) {
    const parts = [];
    let current = error;
    while (typeof current === 'object' && current !== null && parts.length < 4) {
        const message = current.message;
        if (typeof message !== 'string' || message === '')
            break;
        parts.push(message);
        current = current.cause;
    }
    return parts.join(' | ');
}
/** Map a terminal remember finish to a fail-closed outcome string. */
function rememberFinishError(finish) {
    switch (finish.kind) {
        case 'error':
        case 'aborted': {
            return `analysis ${finish.kind}: ${errorChain(finish.failure)}`;
        }
        case 'max-tokens': {
            return 'analysis truncated at the token cap';
        }
        default:
            return undefined;
    }
}
/** Split model output text into bare memory entry lines (trimmed, blank-dropped). */
function splitEntries(blocks) {
    const entries = [];
    for (const block of blocks) {
        if (block.type !== 'text' || typeof block.text !== 'string')
            continue;
        for (const raw of block.text.split(/\r?\n/)) {
            const line = stripInvisible(raw.trim().replace(/^[-*]\s+/, '').trim());
            if (line === '')
                continue;
            // Discard obvious "nothing to remember" placeholders a model may emit
            // instead of a real entry: they are mistakes, never memory.
            if (isVacuousEntry(line))
                continue;
            entries.push(line);
        }
    }
    return entries;
}
/**
 * Strip invisible/whitespace characters a model may emit around real prose
 * without being caught by `String.trim`: control characters, non-breaking and
 * zero-width space variants, BOM, and the full-width space. This keeps a line
 * that is "visually blank but bytewise non-empty" from being written as a
 * memory entry that renders as a block of blank.
 */
export function stripInvisible(value) {
    return value
        .replace(/[\u0000-\u001F\u007F-\u009F\u00A0\u00AD\u1680\u2000-\u200B\u2028-\u202F\u205F-\u206F\u3000\uFEFF\uFFFD]/g, '')
        .trim();
}
/** Whether one candidate line is a vacuous "no content" placeholder. */
export function isVacuousEntry(line) {
    const cleaned = stripInvisible(line);
    if (cleaned === '')
        return true;
    const normalized = cleaned.toLowerCase().replace(/[\s（）()「」"'　\-*—–]+/g, '');
    return normalized === ''
        || normalized === '空行'
        || normalized === '无'
        || normalized === '没有'
        || normalized === '无内容'
        || normalized === '无值得记住的内容'
        || normalized === '暂无'
        || normalized === 'none'
        || normalized === 'no'
        || normalized === 'nothing'
        || normalized === 'na'
        || normalized === 'n/a';
}
//# sourceMappingURL=index.js.map