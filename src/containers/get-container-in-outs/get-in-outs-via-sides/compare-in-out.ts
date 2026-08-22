declare const _debug_: Debug; 
import type { Debug } from '../../../debug/debug.js';
import type { In, Out } from "../../in-out/in-out.js";
import type { _X_ } from "../../../get-critical-points/-x-.js";
import { memoize } from "flo-memoize";
import { ddCompare } from 'double-double';
import { getInOutSide } from './get-in-out-side.js';
import { getFirstSideCrossing$ } from './get-first-side-crossing.js';
import { refineK1, RootInterval, RootIntervalExp } from 'flo-poly';
import { getSideRiExp } from './get-ts.js';


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
        inOutA: In|Out,
        inOutB: In|Out): number {

    let res: number;

    const { _x_: _x_A, dir: dirA, idx: idxA, container } = inOutA;
    const { _x_: _x_B, dir: dirB, idx: idxB } = inOutB;

    const sides = getBigBoxSides$(container.bigBox);

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

    const crossingA = getFirstSideCrossing$(_x_A, sides, forwardA, sidesA);
    const crossingB = getFirstSideCrossing$(_x_B, sides, forwardB, sidesB);

    if (typeof _debug_ !== 'undefined') { _debug_.callCounts.l2++; }

    const { sideIdx: sideIdxA, riSide: riA } = crossingA!;
    const { sideIdx: sideIdxB, riSide: riB } = crossingB!;

    res = sideIdxA - sideIdxB;
    if (res !== 0) { return res; }

    res = doRisOverlap(riA, riB) ? 0 : (riA.tS < riB.tS ? -1 : 1);
    if (res !== 0) { return res; }

    if (typeof _debug_ !== 'undefined') { _debug_.callCounts.l3++; }
    
    //--------------------------------------------------------------------------
    // Cannot discern yet, compensate once
    //--------------------------------------------------------------------------
    const { xPs: xPsA, ps: psA } = crossingA!;
    const { xPs: xPsB, ps: psB } = crossingB!;

    const { ri: riPsA, getPExact: getPExactPsA$ } = xPsA;
    const { ri: riPsB, getPExact: getPExactPsB$ } = xPsB;

    const riExpPsA = refineK1$(riPsA, getPExactPsA$!())[0];  // there can only be 1
    const riExpPsB = refineK1$(riPsB, getPExactPsB$!())[0];  // ...

    const riSideA = getSideRiExp(psA, sides[sideIdxA], riExpPsA);
    const riSideB = getSideRiExp(psB, sides[sideIdxB], riExpPsB);
    
    res = ddDoRisOverlap(riSideA, riSideB)
        ? 0 : ddCompare(riSideA.tS, riSideB.tS);
    if (res !== 0) {
        return res;
    }
    //--------------------------------------------------------------------------

    res = dirA - dirB;
    if (res !== 0) { return res; }

    // At this stage they are both in or both out
    // We reverse sort the ins in comparison to the outs
    return dirA === 1 
        ? idxA - idxB
        : idxB - idxA;
}


function doRisOverlap(
        riA: RootInterval,
        riB: RootInterval): boolean {

    return (riA.tS <= riB.tE && riB.tS <= riA.tE);
}


function ddDoRisOverlap(
        riA: RootIntervalExp,
        riB: RootIntervalExp): boolean {

    return ddCompare(riA.tS, riB.tE) <= 0 &&
        ddCompare(riB.tS, riA.tE) <= 0;
}


const refineK1$ = memoize(refineK1); 


const getBigBoxSides$ = memoize(function(
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

