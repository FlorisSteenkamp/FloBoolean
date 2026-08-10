import type { Loop } from '../shape/loop.js';
import type { Out } from '../containers/in-out/in-out.js';
import type { _X_ } from '../get-critical-points/-x-.js';
import { createRootInOut } from "./create-root-in-out.js";
import { getTightestContainingLoop } from '../calc-paths/get-tightest-containing-loop.js';
import { getOutermostOut } from '../calc-paths/get-outermost-in-and-out.js';
import { completePath } from '../calc-paths/complete-path.js';
import { timeFunctionCalls } from '../utils/time-function-call.js';


const completePaths = timeFunctionCalls(function completePaths(
        loops: Loop[],
        minYXPairs: _X_[]) {

    const root = createRootInOut();
    // `takenLoops` is important in rare cases such as in the 'koldat52' vector
    const takenLoops: Set<Loop> = new Set();
    const takenOuts: Set<Out> = new Set();  // Taken intersections

    for (let i=0; i<loops.length; i++) {
        const loop = loops[i];

        if (takenLoops.has(loop)) { continue; }
        takenLoops.add(loop);

        const parent = getTightestContainingLoop(root, loop);

        const container = minYXPairs[i].container!;
        const { inOuts } = container;

        if (inOuts.length === 0) { continue; }

        // The min-y container must actually represent THIS loop's outermost
        // extreme. When container merging (e.g. at large debugging container
        // sizes) engulfs a whole small loop, the container's boundary
        // straddling pair belongs to other loops - and may both be `in`s - so
        // `getOutermostOut` would return a bogus `initialOut` (an `in`, or an
        // `out` from a different loop) and corrupt the trace into an infinite
        // loop. Detect that and skip: such a loop is interior to the merged
        // crossing cluster and is accounted for by the winding of the traced
        // loops (or discovered via `additionalOutsToCheck`).
        const firstInOut = inOuts[0];
        const lastInOut = inOuts[inOuts.length - 1];
        const initialOutCandidate = firstInOut.dir === 1 ? firstInOut : lastInOut;
        if (initialOutCandidate.dir !== 1 ||
            initialOutCandidate._x_.curve.loop !== loop) {
            continue;
        }

        const initialOut = getOutermostOut(container, parent);

        // const containerIsSimple =
        //     inOuts.length === 2 &&  // only 2 InOuts
        //     xs.length === 2;  // only 2 Xs

        completePath(
            initialOut,
            takenLoops,
            takenOuts
        );

        // TODO - put back later - woodland is very slow
        // if (containerIsSimple &&
        //     initialOut.bezierPieces !== undefined) {

        //     // TODO - can maybe also be done using `BezierPiece`s throughout the code
        //     //-------------------------------------------------------------------
        //     // combine first and last bezier so not to have an extraneous bezier
        //     //-------------------------------------------------------------------
        //     const { bezierPieces: bps } = initialOut;

        //     const bp1 = bps[bps.length - 1];
        //     const bp2 = bps[0];

        //     if (bp1.ps === bp2.ps) {
        //         const bp: BezierPiece = {
        //             ps: bp1.ps,
        //             ts: [bp1.ts[0], bp2.ts[1]]
        //         }
        //         bps.shift();
        //         bps.pop();
        //         bps.unshift(bp);
        //     }
        // }
    }

    return root;
});


export { completePaths }
