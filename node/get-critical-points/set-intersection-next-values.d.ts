import type { _X_ } from "./-x-.js";
/**
 * Set each intersection on the given original loop's `next`/`prev` (the next/
 * prev intersection in a *different* container) and emit its `In`/`Out` when it
 * is an entry/exit of its container - i.e. when its immediate loop-neighbour is
 * already in a different container (consumed later by `getXInOuts`).
 *
 * @param xPairs
 */
declare function setIntersectionNextAndPrevs(xPairs: _X_[][]): void;
export { setIntersectionNextAndPrevs };
