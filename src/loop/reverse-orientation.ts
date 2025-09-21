import type { Loop } from './loop.js';
import { loopFromBeziers } from './loop-from-beziers.js';
import { reverseShapeOrientation } from './reverse-shape-orientation.js';


/**
 * Returns a completely reversed loop of the given bezier loop.
 * 
 * @param loop
 */
function reverseOrientation(loop: Loop) {
    return loopFromBeziers(reverseShapeOrientation(loop.beziers), undefined!);
}


export { reverseOrientation }
