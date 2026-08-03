import type { Container } from '../containers/container.js';
import type { InOut, Out } from '../containers/in-out/in-out.js';
import type { Mutable } from '../utils/mutable.js';


/**
 * Get the initial intersection for the given loop.
 * 
 * The loop must be such that an extreme point on the loop forms part of an
 * outermost loop that is outside all other component loops that is formed by
 * this loop and all other loops it may intersect.
 * 
 * This extreme point is guaranteed by the initial ordering of the loops by
 * their minimum y value.
 * 
 * @param loop 
 * @param parent 
 */
function getOutermostOut(
        container: Container,
        parent: Out): Mutable<Out> {

    const inOuts = container.inOuts;
    const firstInOut: Mutable<InOut> = inOuts[0];
    const lastInOut: Mutable<InOut> = inOuts[inOuts.length-1];

    const initialOut: Out = (firstInOut.dir === 1
        ? firstInOut
        : lastInOut) as Mutable<Out>;

    const orientation = lastInOut.dir;
    const windingNum = parent.windingNum! + orientation!;

    for (const inOut of [firstInOut, lastInOut]) {
        inOut.orientation = orientation;
        inOut.parent = parent;
        inOut.windingNum = windingNum;
        inOut.children = new Set();
    }

    return initialOut as Out;
}


export { getOutermostOut }
