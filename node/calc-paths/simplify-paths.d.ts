import { Loop } from '../loop/loop';
interface BooleanOptions {
    readonly noMicroCorners?: boolean;
}
/**
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
 * @param maxCoordinate optional - if not provided, it will be calculated - a
 * wrong value could cause the algorithm to fail
 */
declare function simplifyPaths(bezierLoops: number[][][][], maxCoordinate?: number, options?: BooleanOptions): Loop[][];
export { simplifyPaths };
