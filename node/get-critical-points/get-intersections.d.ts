import type { X } from './x.js';
import type { Loop } from '../shape/loop.js';
/**
 * Find and return all one-sided intersections on all given loops as a map from
 * each curve to an array of intersections on the curve, ordered by `t` value.
 *
 * @param loops
 */
declare function getIntersections(loops: Loop[]): [X, X][];
export { getIntersections };
