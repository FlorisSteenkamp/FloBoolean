import type { Out } from '../containers/in-out/in-out.js';
import type { Loop } from '../shape/loop.js';
/**
 * Completes the path of a disjoint set of loops, i.e. this function is called
 * for each disjoint set of paths.
 *
 * @param intersections
 * @param takenLoops
 * @param parent
 * @param loop
 */
declare function completePath(initialOut: Out, takenLoops: Set<Loop>, takenOuts: Set<Out>): void;
export { completePath };
