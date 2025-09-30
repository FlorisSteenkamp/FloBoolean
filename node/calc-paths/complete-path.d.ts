import type { InOut } from '../containers/in-out/in-out.js';
import type { Loop } from '../loop/loop.js';
/**
 * Completes the path of a disjoint set of loops, i.e. this function is called
 * for each disjoint set of paths.
 *
 * @param intersections
 * @param takenLoops
 * @param parent
 * @param loop
 */
declare function completePath(initialOut: InOut, takenLoops: Set<Loop>, takenInOuts: Set<InOut>, tight: boolean): void;
export { completePath };
