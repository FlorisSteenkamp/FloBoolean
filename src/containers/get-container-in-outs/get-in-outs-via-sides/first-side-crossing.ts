declare const _debug_: Debug; 
import type { Debug } from '../../../debug/debug.js';
import type { _X_ } from "../../../get-critical-points/-x-.js";
import { memoize } from "flo-memoize";
import { getTs } from "./get-ts.js";
import { RootInterval } from 'flo-poly';


/**
 * Follows the loop's beziers outward from `_x_` (via `iterBeziersToNextX`) and
 * returns the first `side` (index into `sides`) whose segment is crossed by a
 * bezier piece's endpoint segment, together with the crossing point `p`, or
 * `undefined` if no crossing occurs before the next intersection.
 *
 * The `sides` are the axis-aligned edges of a box in the standard side order
 * (0 top, 1 left, 2 bottom, 3 right).
 */
const firstSideCrossing = memoize(function firstSideCrossing(
        _x_: _X_,
        sides: number[][][],
        forward: boolean,
        sideIdxs: number[]): { side: number, p: number[], ri: RootInterval } | undefined {

    // We only ever need the first bezier piece from `_x_` up to its adjacent
    // `_X_`, so compute that single piece directly rather than iterating.
    const curveS = _x_.curve;
    const tS = _x_.x.ri.tS;
    const endX = forward ? _x_.next! : _x_.prev!;
    const pieceEndT = forward ? 1 : 0;
    const runsToEnd =
        curveS === endX.curve &&
        (forward ? tS < endX.x.ri.tS : tS > endX.x.ri.tS);
    const tE = runsToEnd ? endX.x.ri.tS : pieceEndT;

    const ps = curveS.ps;
    const ts = [tS, tE];

    // Nearest crossing (smallest parameter along `a` -> `b`) among the sides.
    let best: { side: number; ri: RootInterval; p: number[] } | undefined = undefined;
    for (let j=0; j<sideIdxs.length; j++) {
        const i = sideIdxs[j];
        const side = sides[i];

        // check for possible intersection
        const ts_ = ts[0] < ts[1] ? ts : [ts[1],ts[0]];
        const xs = getTs(ps, side, ts_);

        if (xs === undefined) { continue; }
        const { ri, p } = xs;

        best = { side: i, ri, p };
    }

    return best;
});


export { firstSideCrossing }
