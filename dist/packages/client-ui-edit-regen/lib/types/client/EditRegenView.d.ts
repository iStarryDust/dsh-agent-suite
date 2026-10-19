/**
 * The shadowed durable user-message renderer: the official bubble and icon
 * actions with one 编辑 entry added, swapping to an inline editor that
 * rewrites the session from that message onward. Editing is offered while
 * the agent is idle and the session is not a subagent; images and files in
 * the message stay individually removable and new ones attach.
 */
import { type ReactNode } from 'react';
import type { InjectFace, PropsLocale, PropsRuntime, Translate } from '@deepseek-ai/dsh-client-ui-slots';
import type { EditActionsInjected } from './actions.ts';
/** The date-template share of the chat dictionary the clock consumes. */
type ChatTranslate = Translate<'clock.md' | 'clock.ymd' | 'json.truncated' | 'message.extraBlock' | 'message.referenceSummary' | 'message.referenceSeparator'>;
/** Injected face of the shadowed renderer, threaded by apply(). */
export interface UserViewInjected extends EditActionsInjected {
    /** The official chat dictionary's translate seat (bubble chrome copy). */
    readonly chatT: ChatTranslate;
}
/** Full props of the shadowed durable user-message renderer. The locale seat is
  this plugin's dictionary; the official chat copy rides the injected chatT. */
export type UserMessageNodeViewProps = PropsRuntime<'conversation.chat.node', 'user'> & PropsLocale<'editregen'> & InjectFace<UserViewInjected>;
/**
 * The keyed user-message renderer: official bubble presentation, the icon
 * actions row with one added 编辑 entry, and the inline editor swap.
 * @param props - composed slot props.
 * @returns the message row.
 */
export declare const UserMessageNodeView: import("react").MemoExoticComponent<({ node, renderMessageImages, openFile, openSkill, loadImage, useSession, sessionId, rewriteFrom, chatT, t, }: UserMessageNodeViewProps) => ReactNode>;
export {};
//# sourceMappingURL=EditRegenView.d.ts.map