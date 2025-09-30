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
function getOutermostInAndOut(container, parent, loop) {
    orderInOuts(container, 1); // `snugDir` doesn't really matters here
    const inOuts = container.inOuts;
    const firstInOut = inOuts[0];
    const lastInOut = inOuts[inOuts.length - 1];
    const initialOut = firstInOut.dir === 1
        ? firstInOut
        : lastInOut;
    const orientation = lastInOut.dir;
    const set = parent.idx === 0
        ? new Set()
        : parent.orientation === 1 ? parent.loopsIdxs : new Set();
    firstInOut.orientation = orientation;
    firstInOut.parent = parent;
    firstInOut.windingNum = parent.windingNum + orientation;
    firstInOut.loopsIdxs = new Set(set);
    firstInOut.children = new Set();
    if (orientation === 1) {
        firstInOut.loopsIdxs?.add(loop.idx);
    }
    lastInOut.orientation = orientation;
    lastInOut.parent = parent;
    lastInOut.windingNum = parent.windingNum + orientation;
    lastInOut.loopsIdxs = new Set(set);
    lastInOut.children = new Set();
    if (orientation === 1) {
        lastInOut.loopsIdxs?.add(loop.idx);
    }
    return initialOut;
}
export { getOutermostInAndOut };
//# sourceMappingURL=get-outermost-in-and-out.js.map