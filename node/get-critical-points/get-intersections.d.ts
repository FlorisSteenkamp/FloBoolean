import type { __X__ } from '../-x-.js';
import type { Loop } from '../loop/loop.js';
/**
 * Find and return all one-sided intersections on all given loops as a map from
 * each curve to an array of intersections on the curve, ordered by t value.
 * @param loops
 */
declare function getIntersections(loops: Loop[], expMax: number): __X__[][];
export { getIntersections };
