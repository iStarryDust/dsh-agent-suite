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
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** One mode option the chip offers. */
export interface HeroModeOption {
    /** Shipped preset id (standard / ptc / minimal / cordis). */
    readonly id: string;
    /** Localized display name. */
    readonly name: string;
    /** Localized one-line description. */
    readonly description: string;
}
/** Seat snapshot. */
export interface HeroSeatState {
    /** The offered modes, roster order. */
    readonly options: readonly HeroModeOption[];
    /** The id bound to the current session, empty when none. */
    readonly current: string;
    /** A wire call is in flight. */
    readonly busy: boolean;
}
/** Define-dialog snapshot. */
export interface HeroDefineState {
    /** The capability palette, absent until first load. */
    readonly groups: readonly {
        readonly id: string;
        readonly defaultOn: boolean;
        readonly plugin?: boolean;
    }[];
    /** Whether the palette has loaded. */
    readonly loaded: boolean;
    /** A refused compose/suggest, shown above the actions. */
    readonly error: string | null;
    /** Whether a call is in flight. */
    readonly busy: boolean;
}
/** Business face the hero chip's slot registration injects. */
export interface HeroChipInjected {
    hooks: {
        /** Seat snapshot bound by the renderer as useHeroSeat. */
        heroSeat: SnapshotStore<HeroSeatState>;
        /** Define-dialog snapshot bound as useHeroDefine. */
        heroDefine: SnapshotStore<HeroDefineState>;
    };
    /** Load the roster and reflect the current binding. */
    load: (sessionId: string | undefined) => Promise<void>;
    /** Stage and apply one mode pick on the named session. */
    select: (sessionId: string, id: string) => Promise<string | undefined>;
    /** Open the Define dialog (the composing agent is derived from the session). */
    defineTarget: (sessionId: string | undefined) => string;
    loadDefine: () => Promise<void>;
    suggestDefine: (description: string) => Promise<readonly string[]>;
    composeDefine: (agentPreset: string, groups: readonly string[]) => Promise<string>;
}
/** Full component props. */
export type HeroChipProps = PropsRuntime<'conversation.hero.agentPreset'> & PropsLocale<'agents'> & InjectFace<HeroChipInjected>;
/**
 * Render the mode chip for the current session.
 * @param props - runtime share, injected face, and localized copy.
 * @returns the chip, or null when no session is current.
 */
export declare function HeroChip({ sessionId, load, select, defineTarget, loadDefine, suggestDefine, composeDefine, useHeroSeat, useHeroDefine, t, }: HeroChipProps): import("react").JSX.Element | null;
//# sourceMappingURL=hero.d.ts.map