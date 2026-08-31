import type { Container } from "./container.js";
import type { Mutable } from "../utils/mutable.js";
import type { In, Out } from "./in-out/in-out.js";
import { compareInOut } from "./get-container-in-outs/get-in-outs-via-sides/compare-in-out.js";
import { timeFunctionCalls } from "../utils/time-function-call.js";
import { xsHasMinY } from "./xs-has-min-y.js";


/**
 * Orders the `InOut`s within the container in a loop.
 * 
 * * modifies `prevAround` and `nextAround` of the given container's `InOut`s
 * 
 * @param container
 */
const orderInOuts = timeFunctionCalls(function orderInOuts(
        container: Container) {

    const { inOuts, xs } = container;
    // getInOutsViaCrossing  // FUTURE

    // if `inOuts` length <= 2 we only need a cyclic sort UNLESS it contains
    // a `minY` (type 0) `_X_` in which case we need a total order
    if (inOuts.length > 2 || xsHasMinY(container.xs)) {
        inOuts.sort(compareInOut);
    }

    let prevInOut = inOuts[inOuts.length - 1] as Mutable<In|Out>;
    for (let i=0; i<inOuts.length; i++) {
        const inOut = inOuts[i] as Mutable<In|Out>;

        inOut.prevAround = prevInOut;
        prevInOut.nextAround = inOut;

        prevInOut = inOut;
    }
});


export { orderInOuts }
