import { orderInOuts } from "../containers/order-in-outs.js";
import { containerIsBasic } from "../container.js";
/**
 *
 * @param inOut the in/out for which the next exit should be found
 * @param additionalOutsToCheck
 */
function getTightNextExit(inOut, origInOut, additionalOutsToCheck, takenInOuts) {
    const markInOutForChecking_ = markInOutForChecking(origInOut, takenInOuts, additionalOutsToCheck);
    orderInOuts(inOut.container, 1);
    // console.log([inOut.idx, inOut.dir]);
    let inOutToUse = inOut.nextAround;
    // console.log([inOutToUse.idx, inOutToUse.dir], 'used');
    let next = inOut;
    const curLoopsIdxs = new Set(origInOut.loopsIdxs);
    do {
        next = next.nextAround;
        if (next === inOut) {
            break;
        }
        markInOutForChecking_(next, origInOut.dir, origInOut, curLoopsIdxs);
        if (next.dir === -1) {
            curLoopsIdxs?.add(next._x_?.curve.loop.idx);
        }
        else {
            curLoopsIdxs.delete(next._x_?.curve.loop.idx);
        }
    } while (true);
    let additionalBezier = undefined;
    if (!containerIsBasic(inOut.container)) {
        // add a "micro corner"
        additionalBezier = [inOut.p, inOutToUse.p];
    }
    return { inOutToUse, additionalBezier };
}
function markInOutForChecking(originalOut, takenInOuts, additionalOutsToCheck) {
    return (inOut, parity, origInOut, curLoopsIdxs) => {
        if (!takenInOuts.has(inOut) && inOut.dir === 1) {
            inOut.loopsIdxs = new Set(curLoopsIdxs);
            inOut.orientation = parity * originalOut.orientation;
            inOut.parent = origInOut.parent;
            inOut.windingNum = origInOut.windingNum + inOut.orientation;
            additionalOutsToCheck.unshift(inOut);
        }
    };
}
export { getTightNextExit };
//# sourceMappingURL=get-tight-next-exit.js.map