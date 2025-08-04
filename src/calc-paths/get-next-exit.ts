import { InOut } from "../in-out.js";
import { containerIsBasic } from "../container.js";


/**
 * 
 * @param in_ the in for which the next exit should be found
 * @param additionalOutsToCheck 
 */
function getNextExit(
        in_: InOut, 
        originalOut: InOut,
        additionalOutsToCheck: InOut[],
        takenOuts: Set<InOut>) {

    const markOutForChecking_ = markOutForChecking(
        originalOut, 
        takenOuts, 
        additionalOutsToCheck
    );

    let additionalBezier: number[][] | undefined = undefined;
    let fromCount = 0;
    let toCount = 1;
    let next = in_;
    let outToUse = undefined;
    do {
        next = originalOut.orientation === +1
            ? next.nextAround!
            : next.prevAround!;

        if (next === in_) { break; }
        fromCount = toCount;
        toCount = toCount - next.dir;

        if (next.dir === -1) { continue; }

        if (!outToUse) {
            // we are still rotating on the inside of the loop
            if (toCount === 0) {
                outToUse = next;
            } else if (toCount === 1) {
                // the outermost inner loop must have the same orientation
                markOutForChecking_(next, +1, originalOut);
            }
        } else {
            // else we are rotating on the outside of the loop
            if (fromCount === 1 && toCount === 0) {
                markOutForChecking_(next, +1, originalOut.parent!);
            } else if (fromCount === 0 && toCount === -1) {
                markOutForChecking_(next, -1, originalOut.parent!);
            }
        }
    } while (true)

    if (!containerIsBasic(in_.container)) {
        // if there is multiple intersection pairs then add an additional bezier
        additionalBezier = [in_.p, outToUse!.p];
    }
    
    return { out_: outToUse, additionalBezier };
}


function markOutForChecking(
        originalOut: InOut,
        takenOuts: Set<InOut>,
        additionalOutsToCheck: InOut[]) {
            
    return (out: InOut, parity: number, parent: InOut) => {
        if (!takenOuts.has(out) && !out.orientation) {
            out.orientation = parity * originalOut.orientation!;
            out.parent = parent;
            out.windingNum = parent.windingNum! + out.orientation;
            additionalOutsToCheck.push(out);
        }
    }
}


export { getNextExit }
