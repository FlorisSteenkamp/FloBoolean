import { MaxX, MaxY, MinX, MinY, type InOut } from "../../../containers/in-out/in-out.js";
import { refineK1 } from "flo-poly";
import { eCompare } from "big-float-ts";

const { abs } = Math;


/**
 * Returns the result of comparing two `InOut`s within the same container.
 * 
 * @param snugDir
 * @param inOutA 
 * @param inOutB 
 */
function compareInOut(
        snugDir: number) {

    return (inOutA: InOut,
            inOutB: InOut): number => {

        const { side: sideA, sideX: xA, dir: dirA, idx: idxA } = inOutA;
        const { side: sideB, sideX: xB, dir: dirB, idx: idxB } = inOutB;

        // First compare side indexes - side indexes are the coarsest ordering
        let res = sideA - sideB;
        if (res !== 0) { return res; }

        //======================================================================
        const { _x_: _x_A } = inOutA;
        const { _x_: _x_B } = inOutB;
        if (sideA === MinX) {
            const { curve: curveA } = _x_A;
            const { curve: curveB } = _x_B;
            const { ps: psA } = curveA;
            const { ps: psB } = curveB;
            
            const {} = xB;
        }
        //======================================================================

        const { ri: riA } = xA;
        const { ri: riB } = xB;

        // Could not resolve by side indexes (they are the same)
        // Compare by side `t` values
        res = riA.t - riB.t;

        const errBound = 2**3 * Number.EPSILON;
        if (abs(res) >= errBound) {
            return res;
        }

        // At this point we zoom in once more (compensated once) to add an 
        // additional 49 bits accuracy

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

        res = eCompare(xA.riExp!.tS, xB.riExp!.tS);

        if (res !== 0) { 
            return res; 
        }

        // At this stage it is either the same curve (mathematically, if endpoints
        // and direction is ignored) or even the once compenensated roots cannot be
        // resolved. In future we can cascade compensations to ensure resolution
        // but we are already about a quadrillionth of a quadrillionth of a unit
        // accurate at this stage.

        res = dirA - dirB;
        if (res !== 0) {
            return snugDir*res;
        }

        // At this stage they are both in or both out
        // We reverse sort the ins in comparison to the outs
        return dirA === 1 
            ? idxA - idxB
            : idxB - idxA;
    }
}


export { compareInOut }
