import { InOut } from "../containers/in-out/in-out";
import { orderInOuts } from "../containers/order-in-outs";


function gotoNextContainer(
        initialOut: InOut) {

    let next = initialOut.next!;

    orderInOuts(next.container, 1);

    while (true) {
        next = initialOut.dir === +1
            ? next.prevAround!
            : next.nextAround!

        if (next.dir === +1) {
            // remove minY `InOut`
            initialOut.container.inOuts
            break;
        }
    }

    // @ts-ignore
    next.children = new Set();

    return next;
}


export { gotoNextContainer }
