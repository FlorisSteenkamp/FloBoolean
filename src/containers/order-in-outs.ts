import type { Container } from "../container";
import { compareInOut } from "./get-container-in-outs/get-in-outs-via-sides/compare-in-out";


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
        // @ts-ignore
        inOut.prevAround = prevInOut;
        // @ts-ignore
        prevInOut.nextAround = inOut;
        prevInOut = inOut;
    }
}


export { orderInOuts }
