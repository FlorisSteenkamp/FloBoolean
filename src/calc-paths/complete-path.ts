import type { Out } from '../containers/in-out/in-out.js';
import type { Loop } from '../loop/loop.js';
import type { Mutable } from '../utils/mutable.js';
import { completeLoop } from './complete-loop.js';


/**
 * Completes the path of a disjoint set of loops, i.e. this function is called 
 * for each disjoint set of paths.
 * 
 * @param intersections 
 * @param takenLoops 
 * @param parent 
 * @param loop 
 */
function completePath(
        initialOut: Out,
        takenLoops: Set<Loop>,
        takenOuts: Set<Out>) {

    const outStack: Out[] = [initialOut];

    while (outStack.length) {
        const origOut = outStack.pop()! as Mutable<Out>;
        takenLoops.add(origOut._x_.curve.loop);

        if (takenOuts.has(origOut)) { continue; }

        origOut.children = new Set();
        const { bezierPieces, additionalOutsToCheck } = 
            completeLoop(takenOuts, origOut);

        origOut.bezierPieces = bezierPieces;
        (origOut.parent as Mutable<Out>).children = origOut.parent.children || new Set();
        origOut.parent.children.add(origOut);

        for (let i=0; i<additionalOutsToCheck.length; i++) {
            outStack.push(additionalOutsToCheck[i]);
        }
    }
}


export { completePath }
