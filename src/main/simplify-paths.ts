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
import { filterLoopsByMinAllowedArea } from './filter-loops-by-min-area.js';
import { completePaths } from './complete-paths.js';
import { timeFunctionCalls } from '../utils/time-function-call.js';
import { reverseShapeOrientation } from '../shape/reverse-shape-orientation.js';

// import { getAllXPairs, getIntersections_, getSelfIntersections_, getInterfaceIntersections_, getExcessiveCurvatures_, getTurnarounds_ } from '../containers/get-containers/get-all-x-pairs.js';
import { getIntersection } from '../get-critical-points/get-intersection.js';
import { combineOverlappingContainers } from '../containers/get-containers/combine-overlapping-containers/combine-overlapping-containers.js';
import { assignBigBoxesToContainers } from '../containers/get-containers/assign-big-boxes-to-containers.js';
import { orderInOuts } from '../containers/order-in-outs.js';
import { completeLoop } from '../calc-paths/complete-loop.js';
import { getAxisAlignedRayLoopIntersections, _isLoopInLoop } from '../is-loop-in-loop/is-loop-in-loop.js';
import { getAllXPairs, getExcessiveCurvatures_, getInterfaceIntersections_, getIntersections_, getSelfIntersections_, getTurnarounds_ } from '../containers/get-containers/get-all-x-pairs.js';
import { getLoopMinY } from '../shape/get-min-y.js';


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

    //==========================================================================
    // Preamble
    //==========================================================================
    if (typeof _debug_ !== 'undefined') {
        (_debug_.timing as Mutable<Timing>).timingStart = performance.now();
    }

    /** The exponent, e, such that 2**e >= all bezier coordinate points. */
    const expMax = ceil(log2(getMaxCoordinate(bezierLoops)));

    const {
        minLoopArea = (2**(expMax - 16))**2,
        forceOrientationNegative = false,
        booleanOp = "OR"
    } = options;

    bezierLoops = normalizeLoops(bezierLoops, expMax)
        .sort(orderLoopAscendingByMinY);

    const loops = bezierLoops.map(loopFromBeziers);
    //==========================================================================


    //==========================================================================
    const minYXPairs = loops.map(getLoopMinY);
    if (typeof _debug_ !== 'undefined') { minYXPairs.forEach(_x_ => _debug_.elems.minY.push(_x_)); }
    getContainers(loops, minYXPairs, expMax);

    const root = completePaths(expMax, loops, minYXPairs);

    const outSets = splitLoopTrees(root)
        .map(getLoopsFromTree(booleanOp))
        .filter(v => v.length !== 0);

    const minAreaFilter = timeFunctionCalls(filterLoopsByMinAllowedArea(minLoopArea));

    //----------------------------------------
    // Create loops for all `outSets`
    //----------------------------------------
    let loopIdx = 0;
    const loopss = minAreaFilter(
        outSets.map(outSet => {
            const outerLoopOrientation = outSet[0].out.orientation;

            return outSet.map(({ out, depth }) => 
                loopFromOut(out, outerLoopOrientation, loopIdx++, depth, forceOrientationNegative)
            );
        })
    );
    
    addDebugInfo2(loopss);  // adds debug info used within __tests__ (and the demo)

    // TODO - somehehere - reconnect minY

    // console.log(structuredClone(getContainers.getStats()));
    // console.log(structuredClone(normalizeLoops.getStats()));
    // console.log(structuredClone(completePaths.getStats()));
    // console.log(structuredClone(minAreaFilter.getStats()));
    // getContainers.resetStats();
    // normalizeLoops.resetStats();
    // completePaths.resetStats();
    // minAreaFilter.resetStats();

    // normalizeLoops -> 1.3 ms
    // getContainers  -> 51.1 ms  (improve)
    // completePaths  -> 0.5 ms
    // minAreaFilter  -> 1.1 ms

    // `getContainers`
    // console.log(structuredClone(getAllXPairs.getStats()));
    // console.log(structuredClone(getIntersection.getStats()));
    // console.log(structuredClone(getIntersections_.getStats()));
    // console.log(structuredClone(getSelfIntersections_.getStats()));
    // console.log(structuredClone(getInterfaceIntersections_.getStats()));
    // console.log(structuredClone(getExcessiveCurvatures_.getStats()));
    // console.log(structuredClone(getTurnarounds_.getStats()));
    // console.log(structuredClone(combineOverlappingContainers.getStats()));
    // console.log(structuredClone(assignBigBoxesToContainers.getStats()));

    // console.log(structuredClone(orderInOuts.getStats()));

    // `completePaths`
    // console.log(structuredClone(completeLoop.getStats()));

    // console.log(structuredClone(_isLoopInLoop.getStats()));

    // console.log(getAxisAlignedRayLoopIntersections.getStats());
    // getAllXPairs.resetStats();
    // getIntersection.resetStats();
    // getIntersections_.resetStats();
    // getSelfIntersections_.resetStats();
    // getInterfaceIntersections_.resetStats();
    // getExcessiveCurvatures_.resetStats();
    // getTurnarounds_.resetStats();

    // combineOverlappingContainers.resetStats();
    // assignBigBoxesToContainers.resetStats();
    // orderInOuts.resetStats();
    // completeLoop.resetStats();

    // _isLoopInLoop.resetStats();
    // getAxisAlignedRayLoopIntersections.resetStats();

    // getAllXPairs -> 11.9 ms  (improve)
    // combineOverlappingContainers -> 1.8 ms  (improve)
    // assignBigBoxesToContainers -> 0.4 ms
    // orderInOuts -> 36.2 -> 20.8 ms -> 6.7  (improve)


    // getIntersections -> 9.9 ms  (improve)
    // getSelfIntersections -> 0.1 ms
    // getInterfaceIntersections -> 0.1 ms
    // getExcessiveCurvatures -> 0.9 ms
    // getTurnarounds -> 0.5 ms

    // console.log(loopss);

    if (typeof _debug_ !== 'undefined') {
        const { l1, l2, l3, lil1, lil2, lil3, lil4 } = _debug_.callCounts;
        // console.log(lil1, lil2, lil3, lil4);
        // console.log(l1,l2,l3);
    }


    return loopss;
}


export { simplifyPaths }
