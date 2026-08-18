import type { _X_ } from "../../../get-critical-points/-x-.js";
import { memoize } from "flo-memoize";
import { getTs } from "./get-ts.js";
import { SideCrossing } from './side-crossing.js';


/**
 * Follows the loop's beziers outward from `_x_` (via `iterBeziersToNextX`) and
 * returns the first `side` (index into `sides`) whose segment is crossed by a
 * bezier piece's endpoint segment, together with the crossing point `p`, or
 * `undefined` if no crossing occurs before the next intersection.
 *
 * The `sides` are the axis-aligned edges of a box in the standard side order
 * (0 top, 1 left, 2 bottom, 3 right).
 */
const getFirstSideCrossing$ = memoize(function(
        _x_: _X_,
        sides: number[][][],
        forward: boolean,
        sideIdxs: number[]): SideCrossing | undefined {

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

    const { ps } = curveS;

    // Nearest crossing (smallest parameter along `a` -> `b`) among the sides.
    let best: SideCrossing | undefined = undefined;
    for (let j=0; j<sideIdxs.length; j++) {
        const sideIdx = sideIdxs[j];
        const side = sides[sideIdx];

        // check for possible intersection
        const ts_ = tS < tE ? [tS,tE] : [tE,tS];
        const sideCrossing = getTs(ps, side, ts_, sideIdx);

        if (sideCrossing === undefined) { continue; }

        best = sideCrossing;
    }

    return best;
});


export { getFirstSideCrossing$ }
