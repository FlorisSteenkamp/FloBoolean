import type { Container } from '../container.js';
import { orderInOuts } from '../containers/order-in-outs.js';
import type { InOut } from '../containers/in-out/in-out.js';


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
        parent: InOut) {

    orderInOuts(container, 1);  // `snugDir` doesn't really matters here

    const inOuts = container.inOuts;
    const firstInOut = inOuts[0];
    const lastInOut = inOuts[inOuts.length-1];

    // @ts-ignore
    firstInOut.orientation = -1*firstInOut.dir;
    // @ts-ignore
    firstInOut.parent = parent;
    // @ts-ignore
    firstInOut.windingNum = parent.windingNum! + firstInOut.orientation!;

    const set: Set<number> = parent.idx === 0
        ? new Set()
        : parent.orientation === 1 ? parent.loopsIdxs : new Set();

    // @ts-ignore
    firstInOut.loopsIdxs = new Set(set);

    // @ts-ignore
    lastInOut.orientation = 1*lastInOut.dir;
    lastInOut.orientation;//?
    // @ts-ignore
    lastInOut.parent = parent;
    // @ts-ignore
    lastInOut.windingNum = parent.windingNum! + lastInOut.orientation!;
    // @ts-ignore
    lastInOut.loopsIdxs = new Set(set);

    return { firstInOut, lastInOut };
}


export { getOutermostInAndOut }
