import type { Loop } from '../shape/loop.js';
import type { Out } from '../containers/in-out/in-out.js';
import type { BezierPiece } from 'flo-bezier3';
import type { _X_ } from '../get-critical-points/-x-.js';
import { createRootInOut } from "./create-root-in-out.js";
import { getTightestContainingLoop } from '../calc-paths/get-tightest-containing-loop.js';
import { getOutermostOut } from '../calc-paths/get-outermost-in-and-out.js';
import { completePath } from '../calc-paths/complete-path.js';


function completePaths(
        loops: Loop[],
        minYXPairs: [_X_, _X_][]) {

    const root = createRootInOut();
    // `takenLoops` is important in rare cases such as in the 'koldat52' vector
    const takenLoops: Set<Loop> = new Set();
    const takenOuts: Set<Out> = new Set();  // Taken intersections

    for (let i=0; i<loops.length; i++) {
        const loop = loops[i];

        if (takenLoops.has(loop)) { continue; }
        takenLoops.add(loop);

        const parent = getTightestContainingLoop(root, loop);

        const container = minYXPairs[i][0].container!;
        const { inOuts, xs } = container;

        if (inOuts.length === 0) { continue; }

        const initialOut = getOutermostOut(container, parent);

        const containerIsSimple =
            inOuts.length === 2 &&  // only 2 InOuts
            xs.length === 2;  // only 2 Xs

        completePath(
            initialOut,
            takenLoops,
            takenOuts
        );

        if (containerIsSimple &&
            initialOut.bezierPieces !== undefined) {

            // TODO - can maybe also be done using `BezierPiece`s throughout the code
            //-------------------------------------------------------------------
            // combine first and last bezier so not to have an extraneous bezier
            //-------------------------------------------------------------------
            const { bezierPieces: bps } = initialOut;

            const bp1 = bps[bps.length - 1];
            const bp2 = bps[0];

            if (bp1.ps === bp2.ps) {
                const bp: BezierPiece = {
                    ps: bp1.ps,
                    ts: [bp1.ts[0], bp2.ts[1]]
                }
                bps.shift();
                bps.pop();
                bps.unshift(bp);
            }
        }
    }

    return root;
}


export { completePaths }
