import { InOut } from "../in-out.js";
import { containerIsBasic } from "../container.js";
// import { markInOutForChecking } from './mark-in-out-for-checking.js';


/**
 * 
 * @param inOut the in/out for which the next exit should be found
 * @param additionalOutsToCheck 
 */
function getTightNextExit(
        inOut: InOut, 
        originalInOut: InOut,
        additionalOutsToCheck: InOut[],
        takenInOuts: Set<InOut>) {

    const markInOutForChecking_ = markInOutForChecking(
        originalInOut, 
        takenInOuts, 
        additionalOutsToCheck
    );

    let additionalBezier: number[][] | undefined = undefined;
    let next = inOut;
    let inOutToUse = originalInOut.dir * originalInOut.orientation! === +1
        ? next.nextAround!
        : next.prevAround!;
    next = inOutToUse;

    do {
        next = originalInOut.orientation === +1
            ? next.nextAround!
            : next.prevAround!;

        if (next === inOut) { break; }

        markInOutForChecking_(next, originalInOut.dir * originalInOut.orientation!, originalInOut);
    } while (true)

    if (!containerIsBasic(inOut.container)) {
        // if there is multiple intersection pairs then add an additional bezier
        // additionalBezier = [inOut.p, inOutToUse!.p];  // TODO noMicroCorners
    }
    
    return { inOutToUse, additionalBezier };
}


function markInOutForChecking(
        originalOut: InOut,
        takenInOuts: Set<InOut>,
        additionalOutsToCheck: InOut[]) {
            
    return (inOut: InOut,
            parity: number,
            parent: InOut) => {

        if (!takenInOuts.has(inOut) && !inOut.orientation) {
            // @ts-ignore
            inOut.orientation = parity * originalOut.orientation!;
            // @ts-ignore
            inOut.parent = parent;
            // @ts-ignore
            inOut.windingNum = parent.windingNum! + inOut.orientation;
            additionalOutsToCheck.push(inOut);
        }
    }
}


export { getTightNextExit }
