import { completeLoop } from './complete-loop.js';
import type { InOut } from '../containers/in-out/in-out.js';
import type { Loop } from '../loop/loop.js';
import { DualSet, dualSetHas } from '../dual-set.js';


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
        inOutStack: InOut[],
        takenLoops: Set<Loop>,
        takenInOuts: DualSet<InOut, number>,
        tight: boolean,
        noMicroCorners: boolean) {

    while (inOutStack.length) {
        const origInOut = inOutStack.pop()!;
        // origInOut.;
        takenLoops.add(origInOut!._x_!.curve.loop);

        if (dualSetHas(takenInOuts, origInOut, 1)) { continue; }

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
