declare const _debug_: Debug; 
import type { Debug } from '../../../debug/debug.js';
import type { InOut } from "../../in-out/in-out.js";
import type { _X_ } from "../../../get-critical-points/-x-.js";
import { iterBeziersToNextX } from '../../get-beziers-to-next-x.js';
import { toP } from "../../../utils/to-p.js";
import { getTs } from "./get-ts copy.js";
import { memoize } from "flo-memoize";

const { min, max } = Math;


/**
 * Returns the result of comparing two `InOut`s within the same container.
 * 
 * Note the edge ordering around the container:
 *   * 0 -> MinY edge (top)
 *   * 1 -> MinX edge (left)
 *   * 2 -> MaxY edge (bottom)
 *   * 3 -> MaxX edge (right)
 * 
 * @param inOutA 
 * @param inOutB 
 */
function compareInOut(
        inOutA: InOut,
        inOutB: InOut): number {

    let res: number;

    const { _x_: _x_A, dir: dirA, idx: idxA, container } = inOutA;
    const { _x_: _x_B, dir: dirB, idx: idxB } = inOutB;

    const sides = getBigBoxSides(container.bigBox);

    // 1st step: follow the loop outward from `_x_A` (in its `dir`) and find the
    // first `sidesA` edge it crosses, detected via bezier-piece endpoints.
    const forwardA = dirA === 1;
    const forwardB = dirB === 1;

    const sidesA = inOutA.oSideIdxs ?? getInOutSide(inOutA, _x_A, sides, forwardA);
    const sidesB = inOutB.oSideIdxs ?? getInOutSide(inOutB, _x_B, sides, forwardB);

    if (typeof _debug_ !== 'undefined') { _debug_.callCounts.l1++; }

    if (sidesA.length === 1 && sidesB.length === 1) {
        res = sidesA[0] - sidesB[0];
        if (res !== 0) {
            return res;
        }
    }

    const crossingA = firstSideCrossing(_x_A, sides, forwardA, sidesA);
    const crossingB = firstSideCrossing(_x_B, sides, forwardB, sidesB);

    if (typeof _debug_ !== 'undefined') { _debug_.callCounts.l2++; }

    const { side: sideA, t: tA } = crossingA!;
    const { side: sideB, t: tB } = crossingB!;

    res = sideA - sideB;
    if (res !== 0) { return res; }

    res = tA - tB;
    if (res !== 0) { return res; }

    // TODO - add compensation here as was done with the older version of this funcition

    res = dirA - dirB;
    if (res !== 0) {
        return res;
    }

    // console.log('aaaa')
    // At this stage they are both in or both out
    // We reverse sort the ins in comparison to the outs
    return dirA === 1 
        ? idxA - idxB
        : idxB - idxA;
}


function getInOutSide(
        inOut: InOut,
        _x_: _X_,
        sides: number[][][],
        forward: boolean): number[] {

    let pS: number[] | undefined = undefined;

    for (const { ps, ts } of iterBeziersToNextX(_x_, forward)) {
        if (pS === undefined) { pS = toP(ps, ts[0]); }
        const pE = toP(ps, ts[1]);

        const [xS, yS] = pS;
        const [xE, yE] = pE;

        // Nearest crossing (smallest parameter along `a` -> `b`) among the sides.
        let bestSideIdxs: number[] = [];
        for (let i=0; i<sides.length; i++) {
            const side = sides[i];
            const [[X, Y]] = side;
            if (!((i%2 === 0 && min(yS,yE) <= Y && Y <= max(yS,yE)) ||   // top & bottom
                  (i%2 === 1 && min(xS,xE) <= X && X <= max(xS,xE)))) {  // left & right

                continue;
            }

            bestSideIdxs.push(i);
        }

        if (bestSideIdxs.length > 0) {
            inOut.oSideIdxs = bestSideIdxs;
            return bestSideIdxs;
        }

        pS = pE;
    }

    return undefined!;  // shouldn't be possible
}


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
        sideIdxs: number[]): { side: number, p: number[], t: number } | undefined {

    if (typeof _debug_ !== 'undefined') { _debug_.callCounts.l3++; }

    let pS: number[] | undefined = undefined;

    for (const { ps, ts } of iterBeziersToNextX(_x_, forward)) {
        if (pS === undefined) { pS = toP(ps, ts[0]); }
        const pE = toP(ps, ts[1]);

        // Nearest crossing (smallest parameter along `a` -> `b`) among the sides.
        let best: { side: number; t: number; p: number[] } | undefined = undefined;
        for (let j=0; j<sideIdxs.length; j++) {
            const i = sideIdxs[j];
            const side = sides[i];
             
            // check for possible intersection
            const ts_ = ts[0] < ts[1] ? ts : [ts[1],ts[0]];
            const xs = getTs(ps, side, ts_, [0,1]);

            if (xs.length <= 0) { continue; }
            const x = xs[0];
            const { sideX } = x;
            const { ri } = sideX;
            const { t } = ri;
            const p = toP(side, t);

            // if (xs === undefined) { continue; }
            // const x = xs;
            // const { ri, p } = x;
            // const { t } = ri;

            best = { side: i, t, p };
        }

        if (best !== undefined) {
            return best;
        }

        pS = pE;
    }

    return undefined;
});


const getBigBoxSides = memoize(function(
        bigBox: number[][]) {

    const [[minX,minY], [maxX,maxY]] = bigBox;

    return [  // anti-clockwise from top right (left-handed coordinate system)
        [[maxX, minY], [minX, minY]],  // top      (right to left)
        [[minX, minY], [minX, maxY]],  // left     (top to bottom)
        [[minX, maxY], [maxX, maxY]],  // bottom   (left to right)
        [[maxX, maxY], [maxX, minY]]   // right    (bottom to top)
    ];
});


export { compareInOut }
