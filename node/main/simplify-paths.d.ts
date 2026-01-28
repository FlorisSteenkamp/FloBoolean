import type { Loop } from '../loop/loop.js';
interface SimplifyOptions {
    /**  */
    readonly inclMicroCorners?: boolean;
    /** defaults to 46 */
    readonly maxBitLength?: number;
    /**
     * * defaults to `(2**expMax * 2**(-12))**2`;
     * * minimum area of a bezer loop before it will be discarded
     */
    readonly minLoopArea?: number;
    /**
     * defaults to `false` (for historic reasons); if `true` then the returned
     * paths all have a positive (counter-clockwise) orientation for each single
     * outermost loop (with the set of returned loops) with the rest being negatively
     * oriented, else, if `false` the reverse is true.
     */
    readonly orientationPositive?: boolean;
    /**
     * defaults to `false` (for historic reasons);
     */
    readonly keepOriginalOrientation?: boolean;
}
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
declare function simplifyPaths(bezierLoops: number[][][][], maxCoordinate?: number, options?: SimplifyOptions): Loop[][];
export type { SimplifyOptions };
export { simplifyPaths };
