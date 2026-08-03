import type { InOut } from "../../../containers/in-out/in-out.js";
import { MinX } from "../../../containers/in-out/in-out.js";
import { refineK1 } from "flo-poly";
import { eCompare } from "big-float-ts";
import { evalDeCasteljau, evalDeCasteljauDd } from "flo-bezier3";
import { followToBoxEdge } from "./follow-to-box-edge.js";
import { toP } from "../../../utils/to-p.js";
import { Mutable } from "../../../utils/mutable.js";
import { X } from "../../../get-critical-points/x.js";
import { compareInOut2 } from './compare-in-out2.js';

const { abs } = Math;


/**
 * Returns the result of comparing two `InOut`s within the same container.
 * 
 * @param inOutA 
 * @param inOutB 
 */
function compareInOut(
        inOutA: InOut,
        inOutB: InOut): number {

    const { side: sideA, sideX: xA, dir: dirA, idx: idxA } = inOutA;
    const { side: sideB, sideX: xB, dir: dirB, idx: idxB } = inOutB;

    // First compare side indexes - side indexes are the coarsest ordering
    let res = sideA - sideB;
    if (res !== 0) { return res; }

    //======================================================================
    // This is currently an experiment considering the case where both curves
    // go through the left edge of the box only. We want to compare the y values
    // at a distance far away from the box (say between the boxes) so we don't
    // have to use very high precision in the calculations in the usual case.
    //
    // The two events are coincident on the min-x side - disambiguate by following
    // each loop (in its `dir`) to the edge of its `nextOrPrev` box (or until
    // it leaves the original box) and comparing the resulting points.
    if (sideA === MinX) {
        const r = compareInOut2(inOutA, inOutB);
        // if (r === 0) {
        //     throw 'AAA';
        // }
        // if (r !== undefined) {
        //     return r;
        // }
    }
    //======================================================================

    const { ri: riA } = xA;
    const { ri: riB } = xB;

    // Could not resolve by side indexes (they are the same)
    // Compare by side `t` values
    res = riA.t - riB.t;

    const errBound = 2**3 * Number.EPSILON;  // TODO
    if (abs(res) >= errBound) {
        return res;
    }

    // At this point we zoom in once more (compensated once) to add an 
    // additional 49 bits accuracy

    if (!xA.compensated) { // else the root is already compensated once
        (xA as Mutable<X>).compensated = 1;  // compensate once - in future we can compensate more times if necessary
        // there should be only 1 root in the 4u interval
        // FUTURE - getPExact called too often - cache it!
        (xA as Mutable<X>).riExp = refineK1(xA.ri, xA.getPExact!())[0];
    }

    if (!xB.compensated) { // else the root is already compensated once
        (xB as Mutable<X>).compensated = 1;  // compensate once - in future we can compensate more times if necessary
        // there should be only 1 root in the 4u interval
        // FUTURE - getPExact called too often - cache it!
        (xB as Mutable<X>).riExp = refineK1(xB.ri, xB.getPExact!())[0];
    }

    res = eCompare(xA.riExp!.tS, xB.riExp!.tS);

    if (res !== 0) { 
        return res; 
    }

    // At this stage it is either the same curve (mathematically, if endpoints
    // are ignored) or even the once compenensated roots cannot be
    // resolved. In future we can cascade compensations to ensure resolution
    // but we are already about a quadrillionth of a quadrillionth of a unit
    // accurate at this stage.

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


export { compareInOut }
