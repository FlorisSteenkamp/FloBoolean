import type { Loop } from "./loop.js";
/**
 * Returns the approximate centroid of the given shape.
 *
 * * **precondition**: shape must be a jordan curve (i.e. closed and simple)
 * * intermediate calculations are done in double-double precision
 *
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 */
declare function getShapeCentroid(shape: number[][][]): number[];
/**
 * Returns the approximate centroid of the given shape.
 *
 * * **precondition**: shape must be a jordan curve (i.e. closed and simple)
 * * intermediate calculations are done in double-double precision
 *
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
declare function ddGetShapeCentroid(shape: number[][][]): number[][];
/**
 * @deprecated This function is deprecated. Use `getShapeCentroid` instead.
 *
 * Returns the approximate centroid of the given loop
 *
 * * **precondition**: loop must be a jordan curve (i.e. closed and simple)
 *
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 */
declare function getLoopCentroid(loop: Loop): number[];
export { getLoopCentroid, getShapeCentroid, ddGetShapeCentroid };
