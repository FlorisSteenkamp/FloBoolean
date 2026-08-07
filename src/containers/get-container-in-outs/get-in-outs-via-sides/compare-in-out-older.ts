import type { InOut } from "../../../containers/in-out/in-out.js";
import { refineK1 } from "flo-poly";
import { eCompare } from "big-float-ts";
import { Mutable } from "../../../utils/mutable.js";
import { X } from "../../../get-critical-points/x.js";

const { abs } = Math;


/**
 * Returns the result of comparing two `InOut`s within the same container.
 * 
 * @param inOutA 
 * @param inOutB 
 */
function compareInOutOlder(
        inOutA: InOut,
        inOutB: InOut): number {

    let res: number;

    const { side: sideA, sideX: xA, dir: dirA, idx: idxA } = inOutA;
    const { side: sideB, sideX: xB, dir: dirB, idx: idxB } = inOutB;

    // First compare side indexes - side indexes are the coarsest ordering
    res = sideA - sideB;
    if (res !== 0) { return res; }

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
