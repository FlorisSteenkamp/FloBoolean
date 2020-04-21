import { Container } from '../container';
/**
 * Get initial an intersection for the given loop. The loop must be such that
 * an extreme point on the loop forms part of an outermost loop that is outside
 * all other component loops that is formed by this loop and all other loops it
 * may intersect. This extreme point is guaranteed by the initial ordering of
 * the loops by their minimum y value.
 * @param loop
 * @param parent
 */
declare function getOutermostInAndOut(container: Container): import("../in-out").InOut;
export { getOutermostInAndOut };
