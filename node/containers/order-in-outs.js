import { compareInOut } from "./get-container-in-outs/get-in-outs-via-sides/compare-in-out.js";
/**
 * Orders the `InOut`s within the container.
 *
 * * modifies `prevAround` and `nextAround` of the given container's `InOut`s
 *
 * @param container
 */
function orderInOuts(container, snugDir) {
    const inOuts = container.inOuts;
    inOuts.sort(compareInOut(snugDir));
    let prevInOut = inOuts[inOuts.length - 1];
    for (let i = 0; i < inOuts.length; i++) {
        const inOut = inOuts[i];
        inOut.prevAround = prevInOut;
        prevInOut.nextAround = inOut;
        prevInOut = inOut;
    }
}
export { orderInOuts };
//# sourceMappingURL=order-in-outs.js.map