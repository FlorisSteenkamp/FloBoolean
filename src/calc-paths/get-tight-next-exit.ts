import { BezierPiece } from "flo-bezier3";
import { InOut } from "../containers/in-out/in-out.js";
import { orderInOuts } from "../containers/order-in-outs.js";
import { Mutable } from "../types/mutable.js";


/**
 * 
 * @param inOut the in/out for which the next exit should be found
 * @param additionalOutsToCheck 
 */
function getTightNextExit(
        inOut: InOut, 
        origInOut: InOut,
        additionalOutsToCheck: InOut[],
        takenInOuts: Set<InOut>,
        noMicroCorners: boolean): {
            inOutToUse: InOut;
            additionalBezier: number[][] | undefined;
        } {

    const markInOutForChecking_ = markInOutForChecking(
        origInOut,
        takenInOuts,
        additionalOutsToCheck
    );

    orderInOuts(inOut.container, 1);

    // console.log([inOut.idx, inOut.dir]);
    // let additionalBezier: number[][] | undefined = undefined;

    let inOutToUse = inOut.nextAround!;
    // console.log([inOutToUse.idx, inOutToUse.dir], 'used');

    let next = inOut;

    const curLoopsIdxs = new Set(origInOut.loopsIdxs);
    do {
        next = next.nextAround!;

        if (next === inOut) { break; }

        // [next.idx, next.dir];//?

        markInOutForChecking_(next, origInOut.dir, origInOut, curLoopsIdxs);

        if (next.dir === -1) {
            curLoopsIdxs?.add(next._x_?.curve.loop.idx!);
        } else {
            curLoopsIdxs.delete(next._x_?.curve.loop.idx!);
        }
    } while (true)

    return { inOutToUse, additionalBezier: undefined };
}


function markInOutForChecking(
        originalOut: InOut,
        takenInOuts: Set<InOut>,
        additionalOutsToCheck: InOut[]) {
            
    return (inOut: Mutable<InOut>,
            parity: number,
            origInOut: InOut,
            curLoopsIdxs: Set<number>) => {

        if (!takenInOuts.has(inOut) && inOut.dir === 1) {
            inOut.loopsIdxs = new Set(curLoopsIdxs);//?

            inOut.orientation = parity * originalOut.orientation!;
            inOut.parent = origInOut.parent;
            inOut.windingNum = origInOut.windingNum! + inOut.orientation;
            additionalOutsToCheck.unshift(inOut);
        }
    }
}


export { getTightNextExit }
