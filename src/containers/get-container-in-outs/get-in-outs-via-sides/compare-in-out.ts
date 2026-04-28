import type { InOut } from "../../../containers/in-out/in-out.js";
import { refineK1 } from "flo-poly";
import { eCompare } from "big-float-ts";

const { abs } = Math;


/**
 * Returns the result of comparing two `InOut`s within the same container.
 * 
 * @param inOutA 
 * @param inOutB 
 */
function compareInOut(
        snugDir: number) {

    return (inOutA: InOut,
            inOutB: InOut): number => {

        // First compare side indexes - side indexes are the coursest ordering
        const sideA = inOutA.side!;
        const sideB = inOutB.side!;
        let res = sideA - sideB;
        if (res !== 0) { return res; }

        // Could not resolve by side indexes (they are the same)

        // Compare by side `t` values
        const xA = inOutA.sideX!;
        const xB = inOutB.sideX!;
        res = xA.ri.tS - xB.ri.tS;

        const errBound = 2*4 * Number.EPSILON;  // is factor of 2 necessary?
        if (abs(res) >= errBound) {
            return res;
        }

        // At this point we zoom in once more (compensated once) to add an 
        // additional 49 bits accuracy

        // FUTURE - first check if they are in the same k family - this will speed
        // up the algorithm in those cases.

        if (!xA.compensated) { // else the root is already compensated once
            xA.compensated = 1;  // compensate once - in future we can compensate more times if necessary
            // there should be only 1 root in the 4u interval
            // FUTURE - getPExact called too often - cache it!
            xA.riExp = refineK1(xA.ri, xA.getPExact!())[0];
        }

        if (!xB.compensated) { // else the root is already compensated once
            xB.compensated = 1;  // compensate once - in future we can compensate more times if necessary
            // there should be only 1 root in the 4u interval
            // FUTURE - getPExact called too often - cache it!
            xB.riExp = refineK1(xB.ri, xB.getPExact!())[0];
        }

        //console.log('compensated')
        //console.log('xA', expEst(xA.riExp.tS), ' - ', expEst(xA.riExp.tE));
        //console.log('xB', expEst(xB.riExp.tS), ' - ', expEst(xB.riExp.tE));

        res = eCompare(xA.riExp!.tS, xB.riExp!.tS);

        if (res !== 0) { 
            return res; 
        }

        // console.log('aa')

        // At this stage it is either the same curve (mathematically, if endpoints
        // and direction is ignored) or even the once compenensated roots cannot be
        // resolved. In future we can cascade compensations to ensure resolution
        // but we are already about a quadrillionth of a quadrillionth of a unit
        // accurate at this stage.
        // res = inOutB.dir - inOutA.dir;
        res = inOutA.dir - inOutB.dir;
        // console.log(inOutA.orientation);
        // console.log(inOutB.orientation);
        if (res !== 0) {
            return snugDir*res;
        }

        // At this stage they are both in or both out
        // We reverse sort the ins in comparison to the outs
        return inOutA.dir === 1 
            ? inOutA.idx! - inOutB.idx!
            : inOutB.idx! - inOutA.idx!;
    }
}


export { compareInOut }
