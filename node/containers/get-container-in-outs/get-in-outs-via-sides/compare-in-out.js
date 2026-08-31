import { memoize } from "flo-memoize";
import { ddCompare } from 'double-double';
import { getInOutSideIdx } from './get-in-out-side-idx.js';
import { getFirstSideCrossing$ } from './get-first-side-crossing.js';
import { refineK1 } from 'flo-poly';
import { getSideRiExp } from './get-ts.js';
import { doRisOverlap } from './do-ris-overlap.js';
import { ddDoRisOverlap } from './dd-do-ris-overlap.js';
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
function compareInOut(inOutA, inOutB) {
    let res;
    const { _x_: _x_A, dir: dirA, idx: idxA, swapped: swappedA } = inOutA;
    const { _x_: _x_B, dir: dirB, idx: idxB, swapped: swappedB } = inOutB;
    const sides = getBigBoxSides$(_x_A.container.bigBox);
    // Follow the loop outward from `_x_A` (in its `dir`) and find the
    // first `sidesA` edge it crosses, detected via bezier-piece endpoints.
    // A `swapped` in/out has its `dir` flipped while the loop direction is
    // unchanged, so walk the opposite way in that case.
    const forwardA = (dirA === 1) !== !!swappedA;
    const forwardB = (dirB === 1) !== !!swappedB;
    const sidesA = inOutA.oSideIdxs ?? getInOutSideIdx(inOutA, _x_A, sides, forwardA);
    const sidesB = inOutB.oSideIdxs ?? getInOutSideIdx(inOutB, _x_B, sides, forwardB);
    if (typeof _debug_ !== 'undefined') {
        _debug_.callCounts.l1++;
    }
    if (sidesA.length === 1 && sidesB.length === 1) {
        inOutA.oSideIdx = inOutA.oSideIdx ?? sidesA[0];
        inOutB.oSideIdx = inOutB.oSideIdx ?? sidesB[0];
        res = sidesA[0] - sidesB[0];
        if (res !== 0) {
            return res;
        }
    }
    //--------------------------------------------------------------------------
    // Couldn't compare using sides, compare parameter values at side crossing
    //--------------------------------------------------------------------------
    const crossingA = inOutA.oFSC ?? getFirstSideCrossing$(_x_A, sides, forwardA, sidesA);
    const crossingB = inOutB.oFSC ?? getFirstSideCrossing$(_x_B, sides, forwardB, sidesB);
    if (typeof _debug_ !== 'undefined') {
        _debug_.callCounts.l2++;
    }
    const { sideIdx: sideIdxA, riSide: riA } = crossingA;
    const { sideIdx: sideIdxB, riSide: riB } = crossingB;
    //-------------------------------------------------
    // Re-check sides due to more accurate calculation
    //-------------------------------------------------
    res = sideIdxA - sideIdxB;
    if (res !== 0) {
        inOutA.oSideIdx = sideIdxA;
        inOutB.oSideIdx = sideIdxB;
        return res;
    }
    res = doRisOverlap(riA, riB) ? 0 : (riA.tS < riB.tS ? -1 : 1);
    if (res !== 0) {
        return res;
    }
    if (typeof _debug_ !== 'undefined') {
        _debug_.callCounts.l3++;
    }
    //--------------------------------------------------------------------------
    // Cannot discern yet, compensate once
    //--------------------------------------------------------------------------
    const riSideA = inOutA.oFSCE ?? getSideCrossingExp$(crossingA, sides);
    const riSideB = inOutB.oFSCE ?? getSideCrossingExp$(crossingB, sides);
    res = ddDoRisOverlap(riSideA, riSideB)
        ? 0 : ddCompare(riSideA.tS, riSideB.tS);
    if (res !== 0) {
        return res;
    }
    //--------------------------------------------------------------------------
    //----------------------------------------------------
    // We reverse sort the ins in comparison to the outs.
    //----------------------------------------------------
    res = dirA - dirB;
    if (res !== 0) {
        return res;
    }
    // At this stage they are both in or both out;
    // `idx` doesn't matter but just so it is a stable sort
    return dirA === 1
        ? idxA - idxB
        : idxB - idxA;
}
const refineK1$ = memoize(refineK1);
const getSideCrossingExp$ = memoize(function (crossing, sides) {
    const { xPs, ps, sideIdx } = crossing;
    const { ri: riPs, getPExact: getPExact$ } = xPs;
    const riExpPs = refineK1$(riPs, getPExact$())[0]; // there can only be 1
    return getSideRiExp(ps, sides[sideIdx], riExpPs);
});
const getBigBoxSides$ = memoize(function (bigBox) {
    const [[minX, minY], [maxX, maxY]] = bigBox;
    return [
        [[maxX, minY], [minX, minY]], // top      (right to left)
        [[minX, minY], [minX, maxY]], // left     (top to bottom)
        [[minX, maxY], [maxX, maxY]], // bottom   (left to right)
        [[maxX, maxY], [maxX, minY]] // right    (bottom to top)
    ];
});
export { compareInOut };
//# sourceMappingURL=compare-in-out.js.map