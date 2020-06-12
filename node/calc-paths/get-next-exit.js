"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextExit = void 0;
const container_1 = require("../container");
/**
 *
 * @param in_ the in for which the next exit should be found
 * @param additionalOutsToCheck
 */
function getNextExit(expMax, in_, originalOut, additionalOutsToCheck, takenOuts) {
    let markOutForChecking_ = markOutForChecking(originalOut, takenOuts, additionalOutsToCheck);
    let additionalBezier = undefined;
    let fromCount = 0;
    let toCount = 1;
    let next = in_;
    let outToUse = undefined;
    do {
        next = originalOut.orientation === +1
            ? next.nextAround
            : next.prevAround;
        if (next === in_) {
            break;
        }
        fromCount = toCount;
        toCount = toCount - next.dir;
        if (next.dir === -1) {
            continue;
        }
        if (!outToUse) {
            // we are still rotating on the inside of the loop
            if (toCount === 0) {
                outToUse = next;
            }
            else if (toCount === 1) {
                // the outermost inner loop must have the same orientation
                markOutForChecking_(next, +1, originalOut);
            }
        }
        else {
            // else we are rotating on the outside of the loop
            if (fromCount === 1 && toCount === 0) {
                markOutForChecking_(next, +1, originalOut.parent);
            }
            else if (fromCount === 0 && toCount === -1) {
                markOutForChecking_(next, -1, originalOut.parent);
            }
        }
    } while (true);
    if (!container_1.containerIsBasic(expMax, in_.container)) {
        // if there is multiple intersection pairs then add an additional bezier
        additionalBezier = [in_.p, outToUse.p];
    }
    return { out_: outToUse, additionalBezier };
}
exports.getNextExit = getNextExit;
function markOutForChecking(originalOut, takenOuts, additionalOutsToCheck) {
    return (out, parity, parent) => {
        if (!takenOuts.has(out) && !out.orientation) {
            out.orientation = parity * originalOut.orientation;
            out.parent = parent;
            out.windingNum = parent.windingNum + out.orientation;
            additionalOutsToCheck.push(out);
        }
    };
}
//# sourceMappingURL=get-next-exit.js.map