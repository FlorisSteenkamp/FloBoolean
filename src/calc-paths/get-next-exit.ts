import type { InOut } from "../containers/in-out/in-out.js";
import { containerIsBasic } from "../container.js";
import { DualSet, dualSetHas } from "../dual-set.js";
import { orderInOuts } from "../containers/order-in-outs.js";


/**
 * 
 * @param in_ the in for which the next exit should be found
 * @param additionalOutsToCheck 
 */
function getNextExit(
        in_: InOut, 
        originalOut: InOut,
        additionalOutsToCheck: InOut[],
        takenOuts: DualSet<InOut, number>,
        noMicroCorners: boolean) {

    const markOutForChecking_ = markInOutForChecking(
        takenOuts,
        additionalOutsToCheck
    );

    // the ordering below also ensures ins comes before outs
    orderInOuts(in_.container, originalOut.orientation!);

    // console.log([in_.idx, in_.dir]);

    let additionalBezier: number[][] | undefined = undefined;
    let toCount = 1;
    let next = in_;
    let outToUse: InOut | undefined = undefined;
    let curOrientation = originalOut.orientation!;
    do {
        next = originalOut.orientation! === +1
            ? next.nextAround!
            : next.prevAround!

        if (next === in_) { break; }

        const prevToCount = toCount;
        toCount = toCount - next.dir;

        if (toCount === 1) {
            curOrientation *= -1;
        }

        if (next.dir === -1) { continue; }

        if (!outToUse) {
            // we are still rotating on the inside of the loop
            if (toCount === 0) {
                outToUse = next;
                // console.log([outToUse.idx, outToUse.dir], 'used');
            } else if (toCount === 1) {
                // ...must have the same orientation (see complexish2.svg in tests)
                markOutForChecking_(next, originalOut.orientation!, originalOut);
            }
        } else {
            // else we are rotating on the outside of the loop
            if (prevToCount === 1 && toCount === 0) {
                markOutForChecking_(next, originalOut.orientation!, originalOut.parent!);
            } else if (prevToCount === 0 && toCount === -1) {
                markOutForChecking_(next, -originalOut.orientation!, originalOut.parent!);
            }
        }
    } while (true)

    if (!containerIsBasic(in_.container) && !noMicroCorners) {
        // if there is multiple intersection pairs then add an additional bezier
        additionalBezier = [in_.p, outToUse!.p];
    }
    
    return { inOutToUse: outToUse!, additionalBezier };
}


function markInOutForChecking(
        takenInOuts: DualSet<InOut, number>,
        additionalOutsToCheck: InOut[]) {
            
    return (inOut: InOut,
            orientation: number,
            origParent: InOut) => {

        if (!dualSetHas(takenInOuts, inOut, 1)) {
            // @ts-ignore
            inOut.orientation = orientation;
            // @ts-ignore
            inOut.parent = origParent;
            // @ts-ignore
            inOut.windingNum = origParent.windingNum! + inOut.orientation;
            additionalOutsToCheck.push(inOut);
        }
    }
}


export { getNextExit }
