import type { Mutable } from "../utils/mutable.js";
import type { In, Out } from "./in-out/in-out.js";


function setNextAndPrevAround(
        inOuts: (In|Out)[]) {

    let prevInOut = inOuts[inOuts.length - 1] as Mutable<In|Out>;
    for (let i=0; i<inOuts.length; i++) {
        const inOut = inOuts[i] as Mutable<In|Out>;

        inOut.prevAround = prevInOut;
        prevInOut.nextAround = inOut;

        prevInOut = inOut;
    }
}


export { setNextAndPrevAround }
