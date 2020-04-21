/**
 * Returns true if the first loop is wholly contained within the second loop's
 * boundary.
 *
 * Precondition: the loop is either wholly contained inside the loop or is wholly outside.
 * @param loops
 */
declare function isLoopInLoop(loop1: number[][][], loop2: number[][][]): boolean;
export { isLoopInLoop };
