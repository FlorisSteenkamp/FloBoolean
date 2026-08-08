import type { InOut } from "../../in-out/in-out.js";
import type { _X_ } from "../../../get-critical-points/-x-.js";
import { iterBeziersToNextX } from '../../get-beziers-to-next-x.js';
import { toP } from "../../../utils/to-p.js";
import { getTs } from "./get-ts.js";
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

    const { _x_: _x_A, dir: dirA, idx: idxA, container } = inOutA;
    const { _x_: _x_B, dir: dirB, idx: idxB } = inOutB;

    const [[minX,minY], [maxX,maxY]] = container.bigBox;

    const sides = [  // anti-clockwise from top right (left-handed coordinate system)
        [[maxX, minY], [minX, minY]],  // top      (right to left)
        [[minX, minY], [minX, maxY]],  // left     (top to bottom)
        [[minX, maxY], [maxX, maxY]],  // bottom   (left to right)
        [[maxX, maxY], [maxX, minY]]   // right    (bottom to top)
    ];

    // 1st step: follow the loop outward from `_x_A` (in its `dir`) and find the
    // first `sidesA` edge it crosses, detected via bezier-piece endpoints.
    const forwardA = dirA === 1;
    const crossingA = firstSideCrossing(_x_A, sides, forwardA);
    
    const forwardB = dirB === 1;
    const crossingB = firstSideCrossing(_x_B, sides, forwardB);

    const { side: sideA, t: tA } = crossingA!;
    const { side: sideB, t: tB } = crossingB!;

    let res: number;

    res = sideA - sideB;
    if (res !== 0) { return res; }

    res = tA - tB;
    if (res !== 0) { return res; }

    // TODO - add compensation here as was done with the older version of this funcition

    res = dirA - dirB;
    if (res !== 0) {
        return res;
    }

    // At this stage they are both in or both out
    // We reverse sort the ins in comparison to the outs
    return dirA === 1 
        ? idxA - idxB
        : idxB - idxA;
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
const firstSideCrossing = memoize(function(
        _x_: _X_,
        sides: number[][][],
        forward: boolean): { side: number, p: number[], t: number } | undefined {

    let pS: number[] | undefined = undefined;

    for (const { ps, ts } of iterBeziersToNextX(_x_, forward)) {
        if (pS === undefined) { pS = toP(ps, ts[0]); }
        const pE = toP(ps, ts[1]);

        const [xS, yS] = pS;
        const [xE, yE] = pE;

        // Nearest crossing (smallest parameter along `a` -> `b`) among the sides.
        let best: { side: number; t: number; p: number[] } | undefined = undefined;
        for (let i=0; i<sides.length; i++) {
            const side = sides[i];
            const [[X, Y]] = side;
            if (!((i%2 === 0 && min(yS,yE) <= Y && Y <= max(yS,yE)) ||   // top & bottom
                  (i%2 === 1 && min(xS,xE) <= X && X <= max(xS,xE)))) {  // left & right

                continue;
            }
             
            // check for possible intersection
            const ts_ = ts[0] < ts[1] ? ts : [ts[1],ts[0]];
            const xs = getTs(ps, side, ts_, [0,1]);

            if (xs.length <= 0) { continue; }
            const x = xs[0];
            const { sideX } = x;
            const { ri } = sideX;

            const { t } = ri;
            const p = toP(side, t);  // TODO
            best = { side: i, t, p };
        }

        if (best !== undefined) {
            return best;
        }

        pS = pE;
    }

    return undefined;
});


export { compareInOut }
