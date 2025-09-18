import type { InOut } from "../in-out";


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


export { markInOutForChecking }
