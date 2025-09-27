import { completeLoop } from './complete-loop.js';
import type { InOut } from '../containers/in-out/in-out.js';
import type { Loop } from '../loop/loop.js';


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
        tight: boolean,
        noMicroCorners: boolean) {

    const inOutStack = [initialOut];

    while (inOutStack.length) {
        const origInOut = inOutStack.pop()!;
        takenLoops.add(origInOut!._x_!.curve.loop);

        if (takenInOuts.has(origInOut)) { continue; }

        // @ts-ignore
        origInOut.children = new Set();
        const { beziers, additionalOutsToCheck } = 
            completeLoop(takenInOuts, origInOut, tight, noMicroCorners);

        // @ts-ignore
        origInOut.beziers = beziers;
        // @ts-ignore
        origInOut.parent!.children = origInOut.parent!.children || new Set();
        origInOut.parent!.children.add(origInOut);

        inOutStack.push(...additionalOutsToCheck);
    }
}


export { completePath }
