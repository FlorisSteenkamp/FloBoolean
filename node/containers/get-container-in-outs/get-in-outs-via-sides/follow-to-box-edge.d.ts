import type { _X_ } from "../../../get-critical-points/-x-.js";
import type { Curve } from "../../../curve/curve.js";
/**
 * Starting from the intersection `_x_` and following the loop in the given
 * direction, returns the curve and `t` value where the loop either:
 *
 *  * first reaches the edge of `targetBox` (e.g. the `nextOrPrev` container's
 *    box), or
 *  * reaches the end of a bezier whose endpoint lies outside `originalBox`
 *    (e.g. the current container's box) - i.e. the loop has left the original
 *    box without ever touching the target box.
 *
 * @param _x_ the intersection to start from (its `curve` and `x.ri.t` give the
 * starting bezier and parameter value)
 * @param dir `+1` to follow the loop forwards (via `curve.next`, increasing
 * `t`), `-1` to follow it backwards (via `curve.prev`, decreasing `t`)
 * @param targetBox the box to stop at when its edge is reached, given as
 * `[[minX, minY], [maxX, maxY]]`
 * @param originalBox the box the walk starts inside, given as
 * `[[minX, minY], [maxX, maxY]]`
 */
declare function followToBoxEdge(_x_: _X_, dir: -1 | 1, targetBox: number[][], originalBox: number[][]): {
    curve: Curve;
    t: number;
};
export { followToBoxEdge };
