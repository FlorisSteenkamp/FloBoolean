import type { _X_ } from "../get-critical-points/-x-.js";
import { Curve } from "../curve/curve.js";
/**
 * Yields the `BezierPiece`s along the original loop from the given `_X_` up to
 * (and including the partial piece ending at) its adjacent `_X_` - the `next`
 * one if `nextElsePrev` is `true`, otherwise the `prev` one.
 *
 * This is the `_X_`-based analog of `getBeziersToNextContainer` and is intended
 * for debugging: instead of walking between container interfaces (`Out` ->
 * `In`) it walks between two consecutive intersections along the loop using the
 * `_X_.next`/`_X_.prev` link and the curve chain.
 *
 * When walking backwards each yielded piece has a descending `ts` (i.e.
 * `ts[0] > ts[1]`), reflecting the reversed traversal direction.
 *
 * @param x_ the starting intersection
 * @param nextElsePrev walk towards `x_.next` when `true`, else towards `x_.prev`
 */
declare function iterBeziersToNextX(x_: _X_, nextElsePrev: boolean): Generator<{
    curve: Curve;
    ts: number[];
}>;
export { iterBeziersToNextX };
