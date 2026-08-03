declare const _debug_: Debug; 
import type { Debug, Timing } from '../../debug/debug.js';
import type { Mutable } from '../../utils/mutable.js';
import { fixBeziers } from "./fix-beziers.js";
import { MAX_BIT_LENGTH } from '../../main/max-bitlength.js';
import { addDebugInfo1 } from '../../main/add-debug-info-1.js';


/**
 * Returns new loops from the given loops by aligning the 53-bit double 
 * precision coordinates to 46-bit coordinates. This speeds up the algorithm
 * considerably.
 * 
 * The following guarantees are put in place for the returned loops:
 * * All points are coerced onto a grid. In other words, such that the
 *   significand of all coordinates are reduced to a specified number of bits 
 *   and the significant bits of all points 'overlap'.
 * 
 * * No curves are disguised as higher order curves (this includes the case 
 *   that no bezier is of zero length and the case where there are an infinite
 *   number of self-intersections). The curves are simply deflated exactly.
 * 
 * * No cusps (this includes the case that all bezier end-points of each curve 
 *   are seperated. (this prevents infinite curvature at the endpoints, etc).
 *   (this condition is not necessary for this algorithm but may help algorithms
 *    down the line that needs such guarantees)
 * 
 * @param bezierLoops
 * @param maxBitLength
 * @param expMax
 */
function normalizeLoops(
        bezierLoops: number[][][][],
        expMax: number): number[][][][] {

    const loops = bezierLoops
        .slice()
        .map(fixBeziers(expMax, MAX_BIT_LENGTH))
        .filter(loop => loop.length > 0);

    if (typeof _debug_ !== 'undefined') {
        (_debug_.timing as Mutable<Timing>).normalize = performance.now() - _debug_.timing.timingStart;
    }

    addDebugInfo1(loops);

    return loops;
}


export { normalizeLoops }
