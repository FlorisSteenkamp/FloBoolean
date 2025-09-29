import type { Container } from "../container";
import { Mutable } from "../types/mutable";
import { compareInOut } from "./get-container-in-outs/get-in-outs-via-sides/compare-in-out";
import { InOut } from "./in-out/in-out";


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

    container.beenOrdered = true;

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
