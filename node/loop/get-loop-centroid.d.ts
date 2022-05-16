import { Loop } from "./loop.js";
/**
 * Returns the approximate centroid of the given loop
 *
 * * **precondition**: loop must be a jordan curve (i.e. closed and simple)
 *
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 */
declare function getLoopCentroid(loop: Loop): number[];
export { getLoopCentroid };
