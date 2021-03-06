import { _X_ } from '../x';
import { Loop } from '../loop/loop';
/**
 * Find and return all one-sided intersections on all given loops as a map from
 * each curve to an array of intersections on the curve, ordered by t value.
 * @param loops
 */
declare function getIntersections(loops: Loop[], expMax: number): _X_[][];
export { getIntersections };
