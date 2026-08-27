import { BezierPiece } from 'flo-bezier3';
import type { Out } from '../containers/in-out/in-out.js';
import type { Loop } from '../shape/loop.js';
import type { Mutable } from '../utils/mutable.js';
import { completeLoop } from './complete-loop.js';
import { getBeziersToNextContainer } from './get-beziers-to-next-container.js';


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
        takenOuts: Set<Out>): void {

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
        takenLoops.add(origOut._x_.x.curve.loop);

        if (takenOuts.has(origOut)) { continue; }

        origOut.children = new Set();
        const { path, additionalOutsToCheck, loopOuts } = 
            completeLoop(takenOuts, takenLoops, origOut);

        // If this loop shares any `Out` with an already-emitted loop it is a
        // duplicate of that region - discard it (do not emit, do not spawn its
        // children).
        if (loopOuts.some(o => takenByLoop.has(o))) {
            continue;
        }
        for (const o of loopOuts) { takenByLoop.add(o); }

        // const bezierPieces: BezierPiece[] = [];
        // for (const out of path) {
        //     const beziersToNextContainer = getBeziersToNextContainer(out);
        //     bezierPieces.push(...beziersToNextContainer);
        // }

        origOut.path = path;

        (origOut.parent as Mutable<Out>).children = origOut.parent.children || new Set();
        origOut.parent.children.add(origOut);

        outStack.push(...additionalOutsToCheck);
    }
}


export { completePath }
