import type { Loop } from '../loop/loop.js';
import type { SimplifyOptions } from './simplify-options.js';
/**
 * Returns the result of simplifying the given bezier loops so that the returned
 * loops is an array of loops.
 *
 * Uses the algorithm of Lavanya Subramaniam: PARTITION OF A NON-SIMPLE POLYGON
 * INTO SIMPLE POLYGONS;
 *
 * see http://www.cis.southalabama.edu/~hain/general/Theses/Subramaniam_thesis.pdf
 * but modified to use bezier curves (as opposed to polygons) and to additionally
 * take care of paths with multiple subpaths, i.e. such as disjoint nested paths.
 *
 * Also takes care of all special cases.
 *
 * @param loops an array of possibly intersecting paths
 * @param maxCoordinate optional; if not provided, it will be calculated; a
 * wrong value could cause the algorithm to fail
 */
declare function simplifyPaths(bezierLoops: (number[][])[][], maxCoordinate?: number, options?: SimplifyOptions): Loop[][];
/**
 * * used internally only
 *
 * @param bezierLoops
 * @param maxCoordinate
 * @param options
 *
 * @internal
 */
declare function prepLoops(bezierLoops: (number[][])[][], maxCoordinate?: number, containerSizeMultiplier?: number): {
    extremes: Map<Loop, [import("../get-critical-points/-x-.js").__X__, import("../get-critical-points/-x-.js").__X__]>;
    containers: import("../containers/container.js").Container[];
    loops: Loop[];
    expMax: number;
};
export { simplifyPaths, prepLoops };
