import type { In, Out } from "../containers/in-out/in-out.js";
import type { Mutable } from "../utils/mutable.js";


/**
 * 
 * @param in_ the in for which the next exit should be found
 * @param origOut
 * @param additionalOutsToCheck 
 * @param takenOuts
 */
function getNextExit(
        origOut: Out,
        additionalOutsToCheck: Out[],
        takenOuts: Set<Out>) {

    const markOutForChecking_ = markInOutForChecking(
        takenOuts,
        additionalOutsToCheck
    );

    return function(prevOut: Out): Out {
        let in_ = prevOut.next;

        let toCount = 1;
        let next: In|Out = in_;
        let outToUse: Out | undefined;
        do {
            next = origOut.orientation === +1
                ? next.nextAround
                : next.prevAround

            if (next === in_) { break; }

            toCount = toCount - next.dir;

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
                if (toCount === 0) {
                    markOutForChecking_(out, origOut.orientation, origOut.parent);
                } else if (toCount === -1) {
                    markOutForChecking_(out, -origOut.orientation, origOut.parent);
                }
            }
        } while (true)

        return outToUse!;
    }
}


function markInOutForChecking(
        takenOuts: Set<Out>,
        additionalOutsToCheck: Out[]) {

    return (out: Out,
            orientation: number,
            origParent: Out) => {

        if (takenOuts.has(out)) { return; }

        const out_: Mutable<Out> = out;

        out_.orientation = orientation;
        out_.parent = origParent;
        out_.windingNum = origParent.windingNum + out.orientation;

        additionalOutsToCheck.push(out);
    }
}


export { getNextExit }
