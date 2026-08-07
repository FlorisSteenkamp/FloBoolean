declare const _debug_: Debug; 
import type { Debug, Timing } from '../debug/debug.js';
import type { Mutable } from '../utils/mutable.js';
import type { Loop } from '../shape/loop.js';
import type { SimplifyOptions } from './simplify-options.js';
import { orderLoopAscendingByMinY } from '../calc-paths/order-loop-ascending-by-min-y.js';
import { splitLoopTrees } from '../calc-paths/split-loop-trees.js';
import { getLoopsFromTree } from '../calc-paths/get-loops-from-tree.js';
import { getContainers } from '../containers/get-containers/get-containers.js';
import { loopFromBeziers } from '../shape/loop-from-beziers.js';
import { normalizeLoops } from '../shape/normalize/normalize-loop.js';
import { getMaxCoordinate } from '../shape/normalize/get-max-coordinate.js';
import { addDebugInfo2 } from './add-debug-info-2.js';
import { loopFromOut } from './loop-from-out.js';
import { removeAllMicroCorners } from './remove-micro-corners.js';
import { getInOutsOfContainer } from '../containers/get-container-in-outs/get-in-outs-via-sides/get-in-outs-via-sides.js';
import { getMinYXpair } from '../get-critical-points/get-min-y-x-pair.js';
import { filterLoopsByMinAllowedArea } from './filter-loops-by-min-area.js';
import { completePaths } from './complete-paths.js';
import { reverseShapeOrientation } from '../shape/reverse-shape-orientation.js';

const { ceil, log2 } = Math;


/**
 * Returns the result of simplifying the given bezier loops so that the returned
 * loops is an array of loops.
 * 
 * Uses the algorithm of Lavanya Subramaniam: PARTITION OF A NON-SIMPLE POLYGON 
 * INTO SIMPLE POLYGONS; 
 * 
 * see http://www.cis.southalabama.edu/~hain/general/Theses/Subramaniam_thesis.pdf 
 * but modified to use bezier curves (as opposed to polygons) and to additionally 
 * take care of paths with multiple subpaths, i.e. such as disjoint nested paths.
 * 
 * Also takes care of all special cases.
 * 
 * @param loops an array of possibly intersecting paths
 */
function simplifyPaths(
        bezierLoops: (number[][])[][],
        options: SimplifyOptions = {}): Loop[][] {

    // bezierLoops = bezierLoops.map(reverseShapeOrientation);  // For quick tests
    // TODO - remove bitlength requirements??

    const { minYXPairs, loops, expMax } = prepLoops(bezierLoops);
    const containers = getContainers(loops, minYXPairs, expMax);

    const {
        inclMicroCorners = true,
        minLoopArea = (2**(expMax - 16))**2,
        forceOrientationNegative = false,
        booleanOp = "OR"
    } = options;

    const root = completePaths(loops, minYXPairs);

    const outSets = splitLoopTrees(root)
        .map(getLoopsFromTree(booleanOp))
        .filter(v => v.length !== 0);

    //----------------------------------------
    // Create loops for all `outSets`
    //----------------------------------------
    const loopss = outSets.map(outSet => {
        const outerLoopOrientation = outSet[0].out.orientation;

        return outSet.map(({ out, depth }, idx) => 
            loopFromOut(out, outerLoopOrientation, idx, depth, forceOrientationNegative)
        );
    });

    const loopss_ = filterLoopsByMinAllowedArea(minLoopArea, loopss);
    
    //-------------------------------------
    // Remove "micro corners" if requested
    //-------------------------------------
    const _loopss_ = inclMicroCorners
        ? loopss_
        : removeAllMicroCorners(loopss_, containers);

    addDebugInfo2(_loopss_);  // adds debug info used within __tests__ (and the demo)

    // console.log(structuredClone(getInOutsOfContainer.getStats()));
    getInOutsOfContainer.resetStats();

    return _loopss_;
}


/**
 * * used internally only
 * 
 * @param bezierLoops 
 * @param maxCoordinate 
 * @param options 
 * 
 * @internal
 */
function prepLoops(
        bezierLoops: (number[][])[][]) {

    if (typeof _debug_ !== 'undefined') {
        (_debug_.timing as Mutable<Timing>).timingStart = performance.now();
    }

    /** The exponent, e, such that 2**e >= all bezier coordinate points. */
    const expMax = ceil(log2(getMaxCoordinate(bezierLoops)));

    bezierLoops = normalizeLoops(bezierLoops, expMax)
        .sort(orderLoopAscendingByMinY);

    const loops = bezierLoops.map(loopFromBeziers);

    const minYXPairs = loops.map(getMinYXpair);

    return { minYXPairs, loops, expMax };
}


export { simplifyPaths, prepLoops }
