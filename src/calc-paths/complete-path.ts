import type { InOut, Out } from '../containers/in-out/in-out.js';
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
        const origInOut = outStack.pop()!;
        takenLoops.add(origInOut!._x_!.curve.loop);

        if (takenOuts.has(origInOut)) { continue; }

        (origInOut as Mutable<InOut>).children = new Set();
        const { bezierPieces, additionalOutsToCheck } = 
            completeLoop(takenOuts, origInOut);

        (origInOut as Mutable<InOut>).bezierPieces = bezierPieces;
        (origInOut.parent! as Mutable<InOut>).children = origInOut.parent!.children || new Set();
        origInOut.parent!.children!.add(origInOut);

        for (let i=0; i<additionalOutsToCheck.length; i++) {
            outStack.push(additionalOutsToCheck[i]);
        }
    }
}


export { completePath }
