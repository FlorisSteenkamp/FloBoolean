import type { Loop } from './loop.js';
import { reverse } from 'flo-bezier3';
import { loopFromBeziers } from './loop.js';


/**
 * Returns a completely reversed loop of the given bezier loop.
 * @param loop
 */
function reverseOrientation(loop: Loop) {
    const beziers = [];
    const curves = loop.curves;
    for (let i=curves.length-1; i>=0; i--) {
        const curve = reverse(curves[i].ps);
        beziers.push(curve);
    }

    return loopFromBeziers(beziers, undefined!);
}


export { reverseOrientation }
