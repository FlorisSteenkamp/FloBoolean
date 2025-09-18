import { completeLoop } from './complete-loop.js';
import { InOut } from '../in-out.js';
import { Loop } from '../loop/loop.js';


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
        const inOut = inOutStack.pop()!;
        takenLoops.add(inOut!._x_!.curve.loop);

        if (takenInOuts.has(inOut)) { continue; }

        // @ts-ignore
        inOut.children = new Set();
        const { beziers, additionalOutsToCheck } = 
            completeLoop(takenInOuts, inOut, tight, noMicroCorners);

        // @ts-ignore
        inOut.beziers = beziers;
        // @ts-ignore
        inOut.parent!.children = inOut.parent!.children || new Set();
        inOut.parent!.children.add(inOut);

        inOutStack.push(...additionalOutsToCheck);
    }
}


export { completePath }
