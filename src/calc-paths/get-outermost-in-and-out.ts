import { Container } from '../container.js';


/**
 * Get initial an intersection for the given loop. The loop must be such that 
 * an extreme point on the loop forms part of an outermost loop that is outside 
 * all other component loops that is formed by this loop and all other loops it 
 * may intersect. This extreme point is guaranteed by the initial ordering of
 * the loops by their minimum y value.
 * @param loop 
 * @param parent 
 */
function getOutermostInAndOut(container: Container) {
    const inOuts = container.inOuts;
    const firstInOut = inOuts[0];
    const lastInOut = inOuts[inOuts.length-1];

    // set 'loop' direction
    if (firstInOut.dir === 1) { 
        firstInOut.orientation = -1; // anti-clockwise

        return firstInOut;
    } else {
        lastInOut.orientation = +1;
        
        return lastInOut;
    }
}


export { getOutermostInAndOut }
