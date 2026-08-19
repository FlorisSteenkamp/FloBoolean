declare const _debug_: Debug; 
import type { Debug, Timing } from '../debug/debug.js';
import type { Loop } from '../shape/loop.js';
import { orderLoopAscendingByMinY } from '../calc-paths/order-loop-ascending-by-min-y.js';
import { splitLoopTrees } from '../calc-paths/split-loop-trees.js';
import { getLoopsFromTree } from '../calc-paths/get-loops-from-tree.js';
import { getContainers } from '../containers/get-containers/get-containers.js';
import { addDebugInfo2 } from './add-debug-info-2.js';
import { loopFromOut } from './loop-from-out.js';
import { filterLoopsByMinAllowedArea } from './filter-loops-by-min-area.js';
import { completePaths } from './complete-paths.js';
import { _isLoopInLoop } from '../is-loop-in-loop/is-loop-in-loop.js';
import { getLoopMinY } from '../shape/get-min-y.js';
import { _X_ } from '../get-critical-points/-x-.js';


function rerunForXor(
        expMax: number,
        forceOrientationNegative: boolean,
        minLoopArea: number,
        loopss: Loop[][]): Loop[][] {

    // Pass 1 can emit overlapping loops that share coincident, CO-directed edges
    // (produced by coincident co-directed input edges). Re-running the arrangement
    // on the pass-1 output makes those shared edges anti-parallel so they cancel,
    // yielding the clean, non-overlapping decomposition.

    const allLoopss: Loop[][] = [];
    let loopIdx = 0;
    
    const shapeLoops = loopss.flat();

    // The pass-1 loops are fresh curves with NO intersection/container linkage,
    // so rebuild min-y + containers for them (the original minYXPairs/containers
    // reference the ORIGINAL curves).
    const loops = shapeLoops.sort(
        (a, b) => orderLoopAscendingByMinY(a.beziers, b.beziers)
    );
    const minYXPairs = loops.map(getLoopMinY);
    getContainers(loops, minYXPairs, expMax);
    const root = completePaths(expMax, loops, minYXPairs);

    const outSets = splitLoopTrees(root)
        .map(getLoopsFromTree('XOR'))
        .filter(v => v.length !== 0);

    for (const outSet of outSets) {
        const outerLoopOrientation = outSet[0].out.orientation;
        allLoopss.push(outSet.map(({ out, depth }) =>
            loopFromOut(out, outerLoopOrientation, loopIdx++, depth, forceOrientationNegative)
        ));
    }

    const allLoopss_ = filterLoopsByMinAllowedArea(minLoopArea)(allLoopss);

    addDebugInfo2(allLoopss_);  // adds debug info used within __tests__ (and the demo)
    return allLoopss_;
}


export { rerunForXor }
