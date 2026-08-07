import type { BezierPiece } from "flo-bezier3";
import type { _X_ } from "../get-critical-points/-x-.js";


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
function* iterBeziersToNextX(
        x_: _X_,
        nextElsePrev: boolean): Generator<BezierPiece> {

    const endX = nextElsePrev ? x_.next! : x_.prev!;

    const curveS = x_.curve;
    const tS = x_.x.ri.tS;

    const curveE = endX.curve;
    const tE = endX.x.ri.tS;

    // A non-final piece runs to the end of the current curve in the walk
    // direction (`1` forwards, `0` backwards); stepping then continues on the
    // next/prev curve starting from its opposite end.
    const pieceEndT = nextElsePrev ? 1 : 0;
    const stepStartT = nextElsePrev ? 0 : 1;

    let curCurve = curveS;
    let curT = tS;
    let emitted = false;

    while (true) {
        const reachedEnd = curCurve === curveE && (
            curT === tE
                ? emitted
                : (nextElsePrev ? curT < tE : curT > tE)
        );

        if (reachedEnd) {
            yield { ps: curCurve.ps, ts: [curT, tE] };
            return;
        } else {
            yield { ps: curCurve.ps, ts: [curT, pieceEndT] };
            emitted = true;
        }

        curT = stepStartT;
        curCurve = nextElsePrev ? curCurve.next : curCurve.prev;
    }
}


/**
 * Returns the `BezierPiece`s along the original loop from the given `_X_` up to
 * (and including the partial piece ending at) its adjacent `_X_` - the `next`
 * one if `nextElsePrev` is `true`, otherwise the `prev` one.
 *
 * This is the array-collecting wrapper around `iterBeziersToNextX`.
 *
 * @param x_ the starting intersection
 * @param nextElsePrev walk towards `x_.next` when `true`, else towards `x_.prev`
 */
function getBeziersToNextX(
        x_: _X_,
        nextElsePrev: boolean): BezierPiece[] {

    return [...iterBeziersToNextX(x_, nextElsePrev)];
}


export { getBeziersToNextX, iterBeziersToNextX }
