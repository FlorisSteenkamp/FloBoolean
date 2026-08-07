import { cyclicOrder } from "./cyclic-order.js";
import { compareInOut } from "./get-container-in-outs/get-in-outs-via-sides/compare-in-out.js";
import type { InOut } from "./in-out/in-out.js";


function cyclicCompareInOut(
        a: InOut,
        b: InOut,
        c: InOut): boolean {

    // const { _x_: xA } = a;
    // const { _x_: xB } = b;
    // const { _x_: xC } = c;

    // const nextA = xA.next;
    // const nextB = xB.next;
    // const nextC = xC.next;

    // nextA?.container

    const ab = compareInOut(a, b) < 0;
    const bc = compareInOut(b, c) < 0;
    if (ab && bc) { return true; }
    const ca = compareInOut(c, a) < 0;

    return (bc && ca) || (ca && ab);
}


export { cyclicCompareInOut }
