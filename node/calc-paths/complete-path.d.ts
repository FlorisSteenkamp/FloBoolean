import { InOut } from '../in-out';
import { Loop } from '../loop/loop';
/**
 * Completes the path of a disjoint set of loops, i.e. this function is called
 * for each disjoint set of paths.
 * @param intersections
 * @param takenLoops
 * @param parent
 * @param loop
 */
declare function completePath(expMax: number, initialOut: InOut, takenLoops: Set<Loop>, takenOuts: Set<InOut>): void;
export { completePath };
