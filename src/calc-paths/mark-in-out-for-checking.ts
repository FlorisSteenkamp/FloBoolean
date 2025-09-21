import type { InOut } from "../in-out";


function markInOutForChecking(
        originalOut: InOut,
        takenInOuts: Set<InOut>,
        additionalOutsToCheck: InOut[]) {
            
    return (inOut: InOut,
            orientation: number,
            parent: InOut) => {

        // TODO - remove
        // if (inOut.orientation !== undefined) {
        //     inOut.orientation;                //?
        //     orientation!;//?
        //     takenInOuts.has(inOut);//?
        // }
        if (!takenInOuts.has(inOut)) {
            // @ts-ignore
            inOut.orientation = orientation;
            // @ts-ignore
            inOut.parent = parent;
            // @ts-ignore
            inOut.windingNum = parent.windingNum! + inOut.orientation;
            additionalOutsToCheck.push(inOut);
        }
    }
}


export { markInOutForChecking }
