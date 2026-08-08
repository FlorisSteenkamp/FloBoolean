import type { In, InOut, Out } from "../containers/in-out/in-out.js";
import type { Mutable } from "../utils/mutable.js";


/**
 * 
 * @param in_ the in for which the next exit should be found
 * @param origOut
 * @param additionalOutsToCheck 
 * @param takenOuts
 */
function getNextExit(
        in_: In, 
        origOut: Out,
        additionalOutsToCheck: Out[],
        takenOuts: Set<Out>): Out {

    const markOutForChecking_ = markInOutForChecking(
        takenOuts,
        additionalOutsToCheck
    );

    let toCount = 1;
    let next: InOut = in_;
    let outToUse: Out | undefined = undefined;
    let curOrientation = origOut.orientation!;
    do {
        next = origOut.orientation === +1
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
                markOutForChecking_(out, origOut.orientation, origOut);
            }
        } else {
            // else we are rotating on the outside of the loop
            if (prevToCount === 1 && toCount === 0) {
                markOutForChecking_(out, origOut.orientation, origOut.parent);
            } else if (prevToCount === 0 && toCount === -1) {
                markOutForChecking_(out, -origOut.orientation, origOut.parent);
            }
        }
    } while (true)

    return outToUse!;
}


function markInOutForChecking(
        takenOuts: Set<Out>,
        additionalOutsToCheck: Out[]) {

    return (inOut: Out,
            orientation: number,
            origParent: Out) => {

        if (!takenOuts.has(inOut)) {
            const inOut_: Mutable<Out> = inOut;

            inOut_.orientation = orientation;
            inOut_.parent = origParent;
            inOut_.windingNum = origParent.windingNum! + inOut.orientation!;
            additionalOutsToCheck.push(inOut);
        }
    }
}


export { getNextExit }
