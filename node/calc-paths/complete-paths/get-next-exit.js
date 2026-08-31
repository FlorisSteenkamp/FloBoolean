/**
 * @param origOut
 * @param additionalOutsToCheck
 * @param takenOuts
 */
function getNextExit(origOut, additionalOutsToCheck, takenOuts) {
    const markOutForChecking_ = markInOutForChecking(takenOuts, additionalOutsToCheck);
    return function (prevOut) {
        let in_ = prevOut.twin;
        let toCount = 1;
        let next = in_;
        let outToUse;
        do {
            next = origOut.orientation === +1
                ? next.nextAround
                : next.prevAround;
            if (next === in_) {
                break;
            }
            toCount = toCount - next.dir;
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
                if (toCount === 0) {
                    markOutForChecking_(out, origOut.orientation, origOut.parent);
                }
                else if (toCount === -1) {
                    markOutForChecking_(out, -origOut.orientation, origOut.parent);
                }
            }
        } while (true);
        return outToUse;
    };
}
function markInOutForChecking(takenOuts, additionalOutsToCheck) {
    return function (out, orientation, origParent) {
        if (takenOuts.has(out)) {
            return;
        }
        const out_ = out;
        if (out_.orientation !== undefined) {
            return; // already assigned - see e.g. complex6.svg (would fail otherwise)
        }
        out_.orientation = orientation;
        out_.parent = origParent;
        out_.windingNum = origParent.windingNum + out_.orientation;
        additionalOutsToCheck.push(out_);
    };
}
export { getNextExit };
//# sourceMappingURL=get-next-exit.js.map