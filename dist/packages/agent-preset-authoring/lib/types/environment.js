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
 * @module @deepseek-ai/dsh-agent-preset-authoring/environment
 */
/**
 * The palette, in baseline-first then opt-in narrative order: the five
 * conversation-baseline groups ship enabled, the opt-in groups follow from
 * personal productivity (jobs, goals) through process control (plan) and
 * outside reach (web, compaction) to multi-agent work (subagents). Groups
 * flagged `plugin` render in the client's separate 插件能力 category.
 */
export const ENVIRONMENT_GROUPS = [
    { id: 'shell', ids: ['tool-bash', 'tool-pwsh'], defaultOn: true },
    { id: 'files', ids: ['tool-fs'], defaultOn: true },
    { id: 'fileSearch', ids: ['tool-fs-search'], defaultOn: true },
    { id: 'todo', ids: ['tool-todo'], defaultOn: true },
    { id: 'askUser', ids: ['tool-ask-user'], defaultOn: true },
    { id: 'jobs', ids: ['tool-jobs'], defaultOn: false },
    { id: 'goals', ids: ['command-goal', 'tool-goal'], defaultOn: false },
    { id: 'plan', ids: ['planning'], defaultOn: false },
    { id: 'web', ids: ['tool-web'], defaultOn: false },
    { id: 'compaction', ids: ['compaction'], defaultOn: false },
    { id: 'subagents', ids: ['delegation'], defaultOn: false },
    { id: 'skills', ids: ['skill-filesystem', 'tool-skill'], defaultOn: false, plugin: true },
    { id: 'browser', ids: ['browser'], defaultOn: false, plugin: true },
];
/** Composition rows every environment keeps regardless of the palette. */
const ALWAYS_ON_ROW_IDS = new Set(['persona', 'agent-instructions', 'present']);
/** Prefix of the per-agent environment mode ids. */
export const ENVIRONMENT_MODE_PREFIX = 'env-';
/** A valid environment slug: lowercase id characters, 1-24 of them. */
const ENVIRONMENT_SLUG = /^[a-z0-9][a-z0-9-]{0,23}$/;
/**
 * Filter one composition down to the rows of the enabled groups.
 * @param plugins - the base composition rows (`standard`).
 * @param enabledGroups - the capability group ids the environment keeps.
 * @returns the environment's composition rows, in base order.
 */
export function buildEnvironmentComposition(plugins, enabledGroups) {
    const keep = new Set(ALWAYS_ON_ROW_IDS);
    for (const group of ENVIRONMENT_GROUPS) {
        if (!enabledGroups.includes(group.id))
            continue;
        for (const id of group.ids)
            keep.add(id);
    }
    return plugins.filter(row => keep.has(row.id ?? ''));
}
/**
 * The palette's default selection.
 * @returns the group ids that are on by default.
 */
export function defaultEnvironmentGroups() {
    return ENVIRONMENT_GROUPS.filter(group => group.defaultOn).map(group => group.id);
}
/**
 * Keyword inference over a task description, with no model call: the
 * conversation defaults plus every group whose keyword set hits. The client
 * applies the result as a starting selection the user can edit.
 * @param description - the user's task description.
 * @returns the inferred group ids (defaults always included).
 */
export function suggestCapabilityGroups(description) {
    const text = description.toLowerCase();
    const hits = [...defaultEnvironmentGroups()];
    const add = (id) => {
        if (!hits.includes(id))
            hits.push(id);
    };
    const matches = (patterns) => patterns.some(pattern => pattern.test(text));
    if (matches([/终端/, /命令行/, /脚本/, /shell/, /bash/, /powershell/, /构建/, /运行/, /编译/, /build/]))
        add('shell');
    if (matches([/搜索文件/, /查找文件/, /检索/, /glob/, /grep/, /find files?/]))
        add('fileSearch');
    if (matches([/任务清单/, /待办/, /todo/, /checklist/]))
        add('todo');
    if (matches([/后台/, /任务队列/, /jobs?/, /background/]))
        add('jobs');
    if (matches([/技能/, /skill/]))
        add('skills');
    if (matches([/目标/, /长任务/, /goal/]))
        add('goals');
    if (matches([/网页/, /联网/, /搜索网络/, /web search/, /互联网/, /网上/]))
        add('web');
    if (matches([/浏览器/, /打开网页/, /browser/, /网页操作/]))
        add('browser');
    if (matches([/计划/, /规划/, /方案/, /plan/, /design/]))
        add('plan');
    if (matches([/压缩/, /长对话/, /上下文/, /compact/, /context/]))
        add('compaction');
    if (matches([/子代理/, /并行/, /委托/, /subagent/, /delegate/, /parallel/, /工作流/, /workflow/]))
        add('subagents');
    return hits;
}
/**
 * Generate one fresh environment mode id.
 * @returns `env-<base36 timestamp><random suffix>`, unique per call.
 */
export function newEnvironmentModeId() {
    const stamp = Date.now().toString(36);
    const random = Math.floor(Math.random() * 1296).toString(36).padStart(2, '0');
    return `${ENVIRONMENT_MODE_PREFIX}${stamp}${random}`;
}
/**
 * Validate a caller-supplied environment mode id or accept a generated one.
 * @param modeId - the requested mode id, when given.
 * @returns the mode id to use.
 * @throws when the requested id is not a valid environment slug.
 */
export function resolveEnvironmentModeId(modeId) {
    if (modeId === undefined || modeId === '')
        return newEnvironmentModeId();
    if (!modeId.startsWith(ENVIRONMENT_MODE_PREFIX)
        || !ENVIRONMENT_SLUG.test(modeId.slice(ENVIRONMENT_MODE_PREFIX.length))) {
        throw new Error(`environment mode id ${JSON.stringify(modeId)} must be ${ENVIRONMENT_MODE_PREFIX}<slug>`);
    }
    return modeId;
}
//# sourceMappingURL=environment.js.map