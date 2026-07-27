import type { InOut } from "../containers/in-out/in-out.js";
import type { Mutable } from "../utils/mutable.js";
import { orderInOuts } from "../containers/order-in-outs.js";
import { containerIsBasic } from "../containers/container.js";


/**
 * 
 * @param inOut the in/out for which the next exit should be found
 * @param additionalOutsToCheck 
 */
function getTightNextExit(
        inOut: InOut, 
        origInOut: InOut,
        additionalOutsToCheck: InOut[],
        takenInOuts: Set<InOut>): {
            inOutToUse: InOut;
            additionalBezier: number[][] | undefined;
        } {

    const markInOutForChecking_ = markInOutForChecking(
        origInOut,
        takenInOuts,
        additionalOutsToCheck
    );

    orderInOuts(inOut.container, 1);

    // console.log(inOut.idx, inOut.dir);

    let inOutToUse = inOut.nextAround!;
    // console.log([inOutToUse.idx, inOutToUse.dir], 'used');

    let next = inOut;

    const marks: number[] = [];  // for debugging
    const curLoopsIdxs = new Set(origInOut.loopsIdxs);
    do {
        next = next.nextAround!;

        if (next === inOut) { break; }

        markInOutForChecking_(next, origInOut.dir, origInOut, curLoopsIdxs);
        marks.push(next.idx!);

        if (next.dir === -1) {
            curLoopsIdxs?.add(next._x_?.curve.loop.idx!);
        } else {
            curLoopsIdxs.delete(next._x_?.curve.loop.idx!);
        }
    } while (true)

    marks;

    let additionalBezier: number[][] | undefined = undefined;
    if (!containerIsBasic(inOut.container)) {
        // add a "micro corner"
        additionalBezier = [inOut.p, inOutToUse!.p];
    }

    return { inOutToUse, additionalBezier };
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
            inOut.loopsIdxs = new Set(curLoopsIdxs);

            inOut.orientation = parity * originalOut.orientation!;
            inOut.parent = origInOut.parent;
            inOut.windingNum = origInOut.windingNum! + inOut.orientation;
            additionalOutsToCheck.unshift(inOut);
        }
    }
}


export { getTightNextExit }
