/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Block } from '../block.js';
import type { Workspace } from '../workspace.js';
import type { Abstract } from './events_abstract.js';
import type { BlockCreate } from './events_block_create.js';
import type { BlockMove } from './events_block_move.js';
import type { CommentCreate } from './events_comment_create.js';
import type { CommentMove } from './events_comment_move.js';
import type { CommentResize } from './events_comment_resize.js';
/**
 * Sets whether events should be added to the undo stack.
 *
 * @param newValue True if events should be added to the undo stack.
 */
export declare function setRecordUndo(newValue: boolean): void;
/**
 * Returns whether or not events will be added to the undo stack.
 *
 * @returns True if events will be added to the undo stack.
 */
export declare function getRecordUndo(): boolean;
/**
 * Type of events that cause objects to be bumped back into the visible
 * portion of the workspace.
 *
 * Not to be confused with bumping so that disconnected connections do not
 * appear connected.
 */
export type BumpEvent = BlockCreate | BlockMove | CommentCreate | CommentMove | CommentResize;
/**
 * Create a custom event and fire it.
 *
 * @param event Custom data for event.
 */
export declare function fire(event: Abstract): void;
/**
 * Private version of fireInternal for stubbing in tests.
 */
declare function fireInternal(event: Abstract): void;
/** Dispatch all queued events. */
declare function fireNow(): void;
/**
 * Filter the queued events by merging duplicates, removing null
 * events and reording BlockChange events.
 *
 * History of this function:
 *
 * This function was originally added in commit cf257ea5 with the
 * intention of dramatically reduing the total number of dispatched
 * events.  Initialy it affected only BlockMove events but others were
 * added over time.
 *
 * Code was added to reorder BlockChange events added in commit
 * 5578458, for uncertain reasons but most probably as part of an
 * only-partially-successful attemp to fix problems with event
 * ordering during block mutations.  This code should probably have
 * been added to the top of the function, before merging and
 * null-removal, but was added at the bottom for now-forgotten
 * reasons.  See these bug investigations for a fuller discussion of
 * the underlying issue and some of the failures that arose because of
 * this incomplete/incorrect fix:
 *
 * https://github.com/google/blockly/issues/8225#issuecomment-2195751783
 * https://github.com/google/blockly/issues/2037#issuecomment-2209696351
 *
 * Later, in PR #1205 the original O(n^2) implementation was replaced
 * by a linear-time implementation, though addiitonal fixes were made
 * subsequently.
 *
 * This function was previously called from Workspace.prototype.undo,
 * but this was the cause of issue #7026, the originally-chosen fix
 * for which was the addition (in PR #7069) of code to fireNow to
 * post-filter the .undoStack_ and .redoStack_ of any workspace that
 * had just been involved in dispatching events.  This apparently
 * resolved the issue but added considerable additional complexity and
 * made it difficlut to reason about how events are processed for
 * undo/redo, so both the call from undo and the post-processing code
 * was later removed.
 *
 * @param queueIn Array of events.
 * @param forward True if forward (redo), false if backward (undo).
 * @returns Array of filtered events.
 */
export declare function filter(queueIn: Abstract[], forward: boolean): Abstract[];
/**
 * Modify pending undo events so that when they are fired they don't land
 * in the undo stack.  Called by Workspace.clearUndo.
 */
export declare function clearPendingUndo(): void;
/**
 * Stop sending events.  Every call to this function MUST also call enable.
 */
export declare function disable(): void;
/**
 * Start sending events.  Unless events were already disabled when the
 * corresponding call to disable was made.
 */
export declare function enable(): void;
/**
 * Returns whether events may be fired or not.
 *
 * @returns True if enabled.
 */
export declare function isEnabled(): boolean;
/**
 * Current group.
 *
 * @returns ID string.
 */
export declare function getGroup(): string;
/**
 * Start or stop a group.
 *
 * @param state True to start new group, false to end group.
 *   String to set group explicitly.
 */
export declare function setGroup(state: boolean | string): void;
/**
 * Private version of setGroup for stubbing in tests.
 */
declare function setGroupInternal(state: boolean | string): void;
/**
 * Compute a list of the IDs of the specified block and all its descendants.
 *
 * @param block The root block.
 * @returns List of block IDs.
 * @internal
 */
export declare function getDescendantIds(block: Block): string[];
/**
 * Decode the JSON into an event.
 *
 * @param json JSON representation.
 * @param workspace Target workspace for event.
 * @returns The event represented by the JSON.
 * @throws {Error} if an event type is not found in the registry.
 */
export declare function fromJson(json: any, workspace: Workspace): Abstract;
/**
 * Gets the class for a specific event type from the registry.
 *
 * @param eventType The type of the event to get.
 * @returns The event class with the given type.
 */
export declare function get(eventType: string): new (...p1: any[]) => Abstract;
/**
 * Set if a block is disabled depending on whether it is properly connected.
 * Use this on applications where all blocks should be connected to a top block.
 *
 * @param event Custom data for event.
 */
export declare function disableOrphans(event: Abstract): void;
export declare const TEST_ONLY: {
    FIRE_QUEUE: Abstract[];
    fireNow: typeof fireNow;
    fireInternal: typeof fireInternal;
    setGroupInternal: typeof setGroupInternal;
};
export {};
//# sourceMappingURL=utils.d.ts.map