import type { Container } from "../container.js";
import type { Mutable } from "../types/mutable.js";
import { compareInOut } from "./get-container-in-outs/get-in-outs-via-sides/compare-in-out.js";
import { InOut } from "./in-out/in-out.js";


/**
 * Orders the `InOut`s within the container.
 * 
 * * modifies `prevAround` and `nextAround` of the given container's `InOut`s
 * 
 * @param container
 */
function orderInOuts(
        container: Container,
        snugDir: number) {

    const inOuts = container.inOuts;

    inOuts.sort(compareInOut(snugDir));

    let prevInOut = inOuts[inOuts.length-1];
    for (let i=0; i<inOuts.length; i++) {
        const inOut = inOuts[i];
        (inOut as Mutable<InOut>).prevAround = prevInOut;
        (prevInOut as Mutable<InOut>).nextAround = inOut;
        prevInOut = inOut;
    }
}


export { orderInOuts }
