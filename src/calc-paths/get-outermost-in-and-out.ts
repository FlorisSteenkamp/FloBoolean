import type { Container } from '../container.js';
import type { InOut } from '../containers/in-out/in-out.js';
import type { Loop } from '../loop/loop.js';
import { orderInOuts } from '../containers/order-in-outs.js';


/**
 * Get initial intersection for the given loop. The loop must be such that 
 * an extreme point on the loop forms part of an outermost loop that is outside 
 * all other component loops that is formed by this loop and all other loops it 
 * may intersect. This extreme point is guaranteed by the initial ordering of
 * the loops by their minimum y value.
 * 
 * @param loop 
 * @param parent 
 */
function getOutermostInAndOut(
        container: Container,
        parent: InOut,
        loop: Loop) {

    orderInOuts(container, 1);  // `snugDir` doesn't really matters here

    const inOuts = container.inOuts;
    const firstInOut = inOuts[0];
    const lastInOut = inOuts[inOuts.length-1];

    const initialOut = firstInOut.dir === 1
        ? firstInOut
        : lastInOut;

    const orientation = lastInOut.dir;

    const set: Set<number> = parent.idx === 0
        ? new Set()
        : parent.orientation === 1 ? parent.loopsIdxs! : new Set();

    // @ts-ignore
    initialOut.orientation = orientation;
    // @ts-ignore
    initialOut.parent = parent;
    // @ts-ignore
    initialOut.windingNum = parent.windingNum! + initialOut.orientation!;
    // @ts-ignore
    initialOut.loopsIdxs = new Set(set);
    // @ts-ignore
    initialOut.children = new Set();
    if (initialOut.orientation === 1) {
        initialOut.loopsIdxs?.add(loop.idx!);
    }

    return initialOut;
}


export { getOutermostInAndOut }
