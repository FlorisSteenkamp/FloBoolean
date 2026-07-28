import type { InOut, Out } from "../containers/in-out/in-out.js";
import type { Mutable } from "../utils/mutable.js";
import { containerIsBasic } from "../containers/container.js";
import { orderInOuts } from "../containers/order-in-outs.js";


/**
 * 
 * @param in_ the in for which the next exit should be found
 * @param origOut
 * @param additionalOutsToCheck 
 * @param takenOuts
 */
function getNextExit(
        in_: InOut, 
        origOut: InOut,
        additionalOutsToCheck: Out[],
        takenOuts: Set<Out>): {
            outToUse: Out;
            additionalBezier: number[][] | undefined;
        } {

    const markOutForChecking_ = markInOutForChecking(
        takenOuts,
        additionalOutsToCheck
    );

    // the ordering below also ensures ins comes before outs
    orderInOuts(in_.container, origOut.orientation!);

    // console.log([in_.idx, in_.dir]);

    let toCount = 1;
    let next = in_;
    let outToUse: Out | undefined = undefined;
    let curOrientation = origOut.orientation!;
    do {
        next = origOut.orientation! === +1
            ? next.nextAround!
            : next.prevAround!

        if (next === in_) { break; }

        const prevToCount = toCount;
        toCount = toCount - next.dir;

        if (toCount === 1) {
            curOrientation *= -1;
        }

        if (next.dir === -1) { continue; }
        const out = next as Out;

        if (!outToUse) {
            // we are still rotating on the inside of the loop
            if (toCount === 0) {
                outToUse = out;
            } else if (toCount === 1) {
                // ...must have the same orientation (see complexish2.svg in tests)
                markOutForChecking_(out, origOut.orientation!, origOut);
            }
        } else {
            // else we are rotating on the outside of the loop
            if (prevToCount === 1 && toCount === 0) {
                markOutForChecking_(out, origOut.orientation!, origOut.parent!);
            } else if (prevToCount === 0 && toCount === -1) {
                markOutForChecking_(out, -origOut.orientation!, origOut.parent!);
            }
        }
    } while (true)

    let additionalBezier: number[][] | undefined = undefined;
    if (!containerIsBasic(in_.container)) {
        // add a "micro corner"
        additionalBezier = [in_.p, outToUse!.p];
    }
    
    return { outToUse: outToUse!, additionalBezier };
}


function markInOutForChecking(
        takenInOuts: Set<InOut>,
        additionalOutsToCheck: InOut[]) {

    return (inOut: Out,
            orientation: number,
            origParent: InOut) => {

        if (!takenInOuts.has(inOut)) {
            (inOut as Mutable<Out>).orientation = orientation;
            (inOut as Mutable<Out>).parent = origParent;
            (inOut as Mutable<Out>).windingNum = origParent.windingNum! + inOut.orientation!;
            additionalOutsToCheck.push(inOut);
        }
    }
}


export { getNextExit }
