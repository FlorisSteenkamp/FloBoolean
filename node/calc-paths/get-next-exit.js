import { containerIsBasic } from "../containers/container.js";
import { orderInOuts } from "../containers/order-in-outs.js";
/**
 *
 * @param in_ the in for which the next exit should be found
 * @param origOut
 * @param additionalOutsToCheck
 * @param takenOuts
 */
function getNextExit(in_, origOut, additionalOutsToCheck, takenOuts) {
    const markOutForChecking_ = markInOutForChecking(takenOuts, additionalOutsToCheck);
    // the ordering below also ensures ins comes before outs
    orderInOuts(in_.container);
    let toCount = 1;
    let next = in_;
    let outToUse = undefined;
    let curOrientation = origOut.orientation;
    do {
        next = origOut.orientation === +1
            ? next.nextAround
            : next.prevAround;
        if (next === in_) {
            break;
        }
        const prevToCount = toCount;
        toCount = toCount - next.dir;
        if (toCount === 1) {
            curOrientation *= -1;
        }
        if (next.dir === -1) {
            continue;
        }
        const out = next;
        if (!outToUse) {
            // we are still rotating on the inside of the loop
            if (toCount === 0) {
                outToUse = out;
            }
            else if (toCount === 1) {
                // ...must have the same orientation (see complexish2.svg in tests)
                markOutForChecking_(out, origOut.orientation, origOut);
            }
        }
        else {
            // else we are rotating on the outside of the loop
            if (prevToCount === 1 && toCount === 0) {
                markOutForChecking_(out, origOut.orientation, origOut.parent);
            }
            else if (prevToCount === 0 && toCount === -1) {
                markOutForChecking_(out, -origOut.orientation, origOut.parent);
            }
        }
    } while (true);
    let additionalBezier = undefined;
    if (!containerIsBasic(in_.container)) {
        // add a "micro corner"
        additionalBezier = [in_.p, outToUse.p];
    }
    return { outToUse: outToUse, additionalBezier };
}
function markInOutForChecking(takenOuts, additionalOutsToCheck) {
    return (inOut, orientation, origParent) => {
        if (!takenOuts.has(inOut)) {
            const inOut_ = inOut;
            inOut_.orientation = orientation;
            inOut_.parent = origParent;
            inOut_.windingNum = origParent.windingNum + inOut.orientation;
            additionalOutsToCheck.push(inOut);
        }
    };
}
export { getNextExit };
//# sourceMappingURL=get-next-exit.js.map