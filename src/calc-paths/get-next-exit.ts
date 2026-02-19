import type { InOut } from "../containers/in-out/in-out.js";
import type { Mutable } from "../types/mutable.js";
import { containerIsBasic } from "../container.js";
import { orderInOuts } from "../containers/order-in-outs.js";


/**
 * 
 * @param in_ the in for which the next exit should be found
 * @param originalOut
 * @param additionalOutsToCheck 
 * @param takenOuts
 */
function getNextExit(
        in_: InOut, 
        originalOut: InOut,
        additionalOutsToCheck: InOut[],
        takenOuts: Set<InOut>): {
            inOutToUse: InOut;
            additionalBezier: number[][] | undefined;
        } {

    const markOutForChecking_ = markInOutForChecking(
        takenOuts,
        additionalOutsToCheck
    );

    // the ordering below also ensures ins comes before outs
    orderInOuts(in_.container, originalOut.orientation!);

    // console.log([in_.idx, in_.dir]);

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

    let additionalBezier: number[][] | undefined = undefined;
    if (!containerIsBasic(in_.container)) {
        // add a "micro corner"
        additionalBezier = [in_.p, outToUse!.p];
    }
    
    return { inOutToUse: outToUse!, additionalBezier };
}


function markInOutForChecking(
        takenInOuts: Set<InOut>,
        additionalOutsToCheck: InOut[]) {
            
    return (inOut: InOut,
            orientation: number,
            origParent: InOut) => {

        if (!takenInOuts.has(inOut)) {
            (inOut as Mutable<InOut>).orientation = orientation;
            (inOut as Mutable<InOut>).parent = origParent;
            (inOut as Mutable<InOut>).windingNum = origParent.windingNum! + inOut.orientation!;
            additionalOutsToCheck.push(inOut);
        }
    }
}


export { getNextExit }
