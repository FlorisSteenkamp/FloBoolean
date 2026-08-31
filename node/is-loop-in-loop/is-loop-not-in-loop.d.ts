/**
 * Returns `true` if the first loop is not wholly within the second. The converse
 * is not necessarily true. It is assumed the loops don't intersect.
 *
 * @param loops
 */
declare function isLoopNotInLoop(loop1: number[][][], loop2: number[][][]): boolean;
export { isLoopNotInLoop };
