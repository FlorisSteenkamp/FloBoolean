declare const _debug_: Debug;
import type { Debug } from '../debug/debug.js';

import type { InOut } from '../containers/in-out/in-out.js';
import type { Loop } from '../loop/loop.js';
import type { Mutable } from '../types/mutable.js';
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
        initialOut: InOut,
        takenLoops: Set<Loop>,
        takenInOuts: Set<InOut>,
        tight: boolean) {

    const inOutStack = [initialOut];

    while (inOutStack.length) {
        const origInOut = inOutStack.pop()!;
        takenLoops.add(origInOut!._x_!.curve.loop);

        if (takenInOuts.has(origInOut)) { continue; }

        (origInOut as Mutable<InOut>).children = new Set();
        const { bezierPieces, additionalOutsToCheck } = 
            completeLoop(takenInOuts, origInOut, tight);

        (origInOut as Mutable<InOut>).bezierPieces = bezierPieces;
        (origInOut.parent! as Mutable<InOut>).children = origInOut.parent!.children || new Set();
        origInOut.parent!.children!.add(origInOut);

        // for (let i=additionalOutsToCheck.length - 1; i>=0; i--) {
        for (let i=0; i<additionalOutsToCheck.length; i++) {
            inOutStack.push(additionalOutsToCheck[i]);
        }
    }
}


export { completePath }
