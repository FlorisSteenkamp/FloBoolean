import type { Container } from "./container.js";
import type { Mutable } from "../utils/mutable.js";
import type { InOut } from "./in-out/in-out.js";
import { compareInOut } from "./get-container-in-outs/get-in-outs-via-sides/compare-in-out.js";
import { cyclicCompareInOut } from "./cyclic-compare-in-out.js";
import { cyclicOrder } from "./cyclic-order.js";
import { isCyclicOrdered } from "./is-cyclic-ordered.js";


/**
 * Orders the `InOut`s within the container in a loop.
 * 
 * * modifies `prevAround` and `nextAround` of the given container's `InOut`s
 * 
 * @param container
 */
function orderInOuts(
        container: Container) {

    const inOuts = container.inOuts;

    inOuts.sort(compareInOut);
    // cyclicOrder(inOuts, cyclicCompareInOut);

    // const r = isCyclicOrdered(inOuts, cyclicCompareInOut);
    // console.log(r);

    let prevInOut = inOuts[inOuts.length - 1] as Mutable<InOut>;
    for (let i=0; i<inOuts.length; i++) {
        const inOut = inOuts[i] as Mutable<InOut>;

        inOut.prevAround = prevInOut;
        prevInOut.nextAround = inOut;

        prevInOut = inOut;
    }
}


export { orderInOuts }
