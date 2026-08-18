import type { BezierPiece } from 'flo-bezier3';
import type { In, Out } from '../containers/in-out/in-out.js';
import type { Loop } from '../shape/loop.js';
import { getNextExit } from './get-next-exit.js';
import { getBeziersToNextContainer } from './get-beziers-to-next-container.js';
import { timeFunctionCalls } from '../utils/time-function-call.js';


/** 
 * Completes a loop for a specific intersection point entry curve.
 * 
 * @param expMax
 * @param takenOuts
 * @param origOut
 */
const completeLoop = timeFunctionCalls(function completeLoop(
        takenOuts: Set<Out>,
        takenLoops: Set<Loop>,
        origOut: Out): {
            bezierPieces: BezierPiece[],
            additionalOutsToCheck: Out[],
            loopOuts: Out[]
        } {

    const additionalOutsToCheck: Out[] = [];
    const bezierPieces: BezierPiece[] = [];
    const loopOuts: Out[] = [];

    // Out in blue, In in red - e.g. 3->3->5->5
    const path: string[] = [];  // TODO - temp - remove

    // Move immediately to the outgoing start of the loop
    let outToUse: Out = origOut;

    do {
        takenOuts.add(outToUse);
        loopOuts.push(outToUse);
        // Every curve threaded through this loop belongs to this component, so
        // mark its loop as taken to prevent it being re-processed as a separate
        // outermost loop (which would reset already-built child nesting).
        takenLoops.add(outToUse._x_.curve.loop);

        const nextIn = outToUse.nextOrPrev as In;

        path.push(`\x1b[34m${outToUse.idx}\x1b[0m`);  // Out (blue)
        path.push(`\x1b[31m${nextIn.idx}\x1b[0m`);     // In (red)

        const beziersToNextContainer = 
            getBeziersToNextContainer(outToUse, nextIn);

        bezierPieces.push(...beziersToNextContainer);

        outToUse = getNextExit(
            nextIn!, origOut,
            additionalOutsToCheck, takenOuts
        );

    } while (outToUse !== origOut);

    console.log(path.join('->'));

    return { bezierPieces, additionalOutsToCheck, loopOuts };
});


export { completeLoop }
