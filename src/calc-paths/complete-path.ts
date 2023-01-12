import { completeLoop } from './complete-loop.js';
import { InOut } from '../in-out.js';
import { Loop } from '../loop/loop.js';


/**
 * Completes the path of a disjoint set of loops, i.e. this function is called 
 * for each disjoint set of paths.
 * @param intersections 
 * @param takenLoops 
 * @param parent 
 * @param loop 
 */
function completePath(
        expMax     : number,
        initialOut : InOut,
        takenLoops : Set<Loop>,
        takenOuts  : Set<InOut>) {

    const outStack = [initialOut];

    while (outStack.length) {
        const out = outStack.pop()!;
        takenLoops.add(out!._x_!.curve.loop);

        if (takenOuts.has(out)) { continue; }

        out.children = new Set();
        const { beziers, additionalOutsToCheck } = 
            completeLoop(expMax, takenOuts, out);
            
        out.beziers = beziers;
        out.parent!.children = out.parent!.children || new Set();
        out.parent!.children.add(out);

        outStack.push(...additionalOutsToCheck);
    }
}


export { completePath }
