import type { Out } from '../containers/in-out/in-out.js';
import type { Loop } from '../shape/loop.js';
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

    // A given Out (directed edge) belongs to exactly one output-boundary loop.
    // A merged (over-large) container can, however, cause the same region to be
    // traced twice: a short-circuited loop and a fuller loop that detours through
    // the merge, sharing the same Out objects. The first loop emitted for a set of
    // Outs is the one designated by the enclosing trace (with correct parent /
    // winding); any later loop that overlaps it is a redundant duplicate and is
    // dropped, leaving the winding tree untouched.
    const takenByLoop = new Set<Out>();

    while (outStack.length) {
        const origOut = outStack.pop()! as Mutable<Out>;
        takenLoops.add(origOut._x_.curve.loop);

        if (takenOuts.has(origOut)) { continue; }

        origOut.children = new Set();
        const { bezierPieces, additionalOutsToCheck, loopOuts } = 
            completeLoop(takenOuts, takenLoops, origOut);

        // If this loop shares any Out with an already-emitted loop it is a
        // duplicate of that region - discard it (do not emit, do not spawn its
        // children).
        let overlaps = false;
        for (const o of loopOuts) {
            if (takenByLoop.has(o)) { overlaps = true; break; }
        }
        if (overlaps) { continue; }

        for (const o of loopOuts) { takenByLoop.add(o); }

        origOut.bezierPieces = bezierPieces;
        (origOut.parent as Mutable<Out>).children = origOut.parent.children || new Set();
        origOut.parent.children.add(origOut);

        for (let i=0; i<additionalOutsToCheck.length; i++) {
            outStack.push(additionalOutsToCheck[i]);
        }
    }
}


export { completePath }
