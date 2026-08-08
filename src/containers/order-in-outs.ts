import type { Container } from "./container.js";
import type { Mutable } from "../utils/mutable.js";
import type { InOut } from "./in-out/in-out.js";
import { compareInOut } from "./get-container-in-outs/get-in-outs-via-sides/compare-in-out.js";
import { timeFunctionCalls } from "../utils/time-function-call.js";
import { getInOutsViaCrossing } from './get-container-in-outs/get-in-outs-via-crossing/get-in-outs-via-crossing.js';


/**
 * Orders the `InOut`s within the container in a loop.
 * 
 * * modifies `prevAround` and `nextAround` of the given container's `InOut`s
 * 
 * @param container
 */
const orderInOuts = timeFunctionCalls(function orderInOuts(
        container: Container) {

    const inOuts = container.inOuts;
    // getInOutsViaCrossing

    // console.log(2);
    // inOuts.sort(compareInOut);
    if (inOuts.length > 2) {
        inOuts.sort(compareInOut);
        // console.log(inOuts.length);
    } else {
        // TODO - investigate a simpler method?
        let isTopMost = false;
        for (let inOut of inOuts) {
            if (inOut._x_.x.kind === 0) { isTopMost = true; break; }
        }
        if (isTopMost) {
            inOuts.sort(compareInOut);
        }
    }

    let prevInOut = inOuts[inOuts.length - 1] as Mutable<InOut>;
    for (let i=0; i<inOuts.length; i++) {
        const inOut = inOuts[i] as Mutable<InOut>;

        inOut.prevAround = prevInOut;
        prevInOut.nextAround = inOut;

        prevInOut = inOut;
    }
});


export { orderInOuts }
