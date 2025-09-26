import { InOut } from "../containers/in-out/in-out.js";
import { orderInOuts } from "../containers/order-in-outs.js";
import { DualSet, dualSetHas } from "../dual-set.js";


/**
 * 
 * @param inOut the in/out for which the next exit should be found
 * @param additionalOutsToCheck 
 */
function getTightNextExit(
        inOut: InOut, 
        origInOut: InOut,
        additionalOutsToCheck: InOut[],
        takenInOuts: DualSet<InOut, number>,
        noMicroCorners: boolean) {

    const markInOutForChecking_ = markInOutForChecking(
        origInOut,
        takenInOuts,
        additionalOutsToCheck
    );

    orderInOuts(inOut.container, 1);

    // console.log([inOut.idx, inOut.dir]);
    let additionalBezier: number[][] | undefined = undefined;

    let inOutToUse = inOut.nextAround!;
    // console.log([inOutToUse.idx, inOutToUse.dir], 'used');

    let next = inOut;

    const curLoopsIdxs = new Set(origInOut.loopsIdxs);
    do {
        next = next.nextAround!;

        if (next === inOut) { break; }

        // [next.idx, next.dir];//?

        markInOutForChecking_(next, origInOut.dir, origInOut, curLoopsIdxs);

        if (next.dir === -1) {
            curLoopsIdxs?.add(next._x_?.curve.loop.idx!);
        } else {
            curLoopsIdxs.delete(next._x_?.curve.loop.idx!);
        }
    } while (true)

    return { inOutToUse, additionalBezier };
}


function markInOutForChecking(
        originalOut: InOut,
        takenInOuts: DualSet<InOut, number>,
        additionalOutsToCheck: InOut[]) {
            
    return (inOut: InOut,
            parity: number,
            origInOut: InOut,
            curLoopsIdxs: Set<number>) => {

        if (!dualSetHas(takenInOuts, inOut, 1) && inOut.dir === 1) {
            // @ts-ignore
            inOut.loopsIdxs = new Set(curLoopsIdxs);//?

            // @ts-ignore
            inOut.orientation = parity * originalOut.orientation!;
            // @ts-ignore
            inOut.parent = origInOut.parent;
            // @ts-ignore
            inOut.windingNum = origInOut.windingNum! + inOut.orientation;
            additionalOutsToCheck.unshift(inOut);
        }
    }
}


// function toggleSet<T>(set: Set<T>, t: T) {
//     if (set.has(t)) {
//         set.delete(t);
//     } else {
//         set.add(t);
//     }
// }


export { getTightNextExit }
