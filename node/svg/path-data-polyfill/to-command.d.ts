/**
 * Returns the normalized path command for `char`, or `undefined` if it is not a
 * command letter. Both `z` and `Z` normalize to `"Z"` (close-path has no
 * separate relative form); every other command keeps its case so the absolute
 * (uppercase) / relative (lowercase) distinction is preserved.
 * @internal
 */
declare function toCommand(char: string): string | undefined;
export { toCommand };
