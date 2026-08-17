
/** @internal */
const COMMAND_CHARS = new Set('MLCQAHVSTZmlcqahvstz');


/**
 * Returns the normalized path command for `char`, or `undefined` if it is not a
 * command letter. Both `z` and `Z` normalize to `"Z"` (close-path has no
 * separate relative form); every other command keeps its case so the absolute
 * (uppercase) / relative (lowercase) distinction is preserved.
 * @internal
 */
function toCommand(char: string): string | undefined {
    if (!COMMAND_CHARS.has(char)) { return undefined; }
    return char === 'z' ? 'Z' : char;
}


export { toCommand }
