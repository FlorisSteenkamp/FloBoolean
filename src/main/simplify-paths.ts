declare const _debug_: Debug; 
import type { Debug, Timing } from '../debug/debug.js';
import type { Mutable } from '../utils/mutable.js';
import type { Loop } from '../shape/loop.js';
import type { SimplifyOptions } from './simplify-options.js';
import { compareLoopByMinY } from '../calc-paths/order-loop-ascending-by-min-y.js';
import { splitLoopTrees } from '../calc-paths/split-loop-trees.js';
import { getLoopsFromTree } from '../calc-paths/get-loops-from-tree.js';
import { getContainers } from '../containers/get-containers/get-containers.js';
import { loopFromBeziers } from '../shape/loop-from-beziers.js';
import { normalizeLoops } from '../shape/normalize/normalize-loop.js';
import { getMaxCoordinate } from '../shape/normalize/get-max-coordinate.js';
import { addDebugInfo2 } from './add-debug-info-2.js';
import { loopFromOut } from './loop-from-out.js';
import { filterLoopsByMinAllowedArea } from './filter-loops-by-min-allowed-area.js';
import { completePaths } from './complete-paths.js';
import { timeFunctionCalls } from '../utils/time-function-call.js';
// import { rerunForXor } from './rerun-for-xor.js';

// import { getAllXPairs, getIntersections_, getSelfIntersections_, getInterfaceIntersections_, getExcessiveCurvatures_, getTurnarounds_ } from '../containers/get-containers/get-all-x-pairs.js';
import { getIntersection } from '../get-critical-points/get-intersection.js';
import { combineOverlappingContainers } from '../containers/get-containers/combine-overlapping-containers/combine-overlapping-containers.js';
import { assignBigBoxesToContainers } from '../containers/get-containers/assign-big-boxes-to-containers.js';
import { orderInOuts } from '../containers/order-in-outs.js';
import { completeLoop } from '../calc-paths/complete-loop.js';
import { getAxisAlignedRayLoopIntersections, _isLoopInLoop } from '../is-loop-in-loop/is-loop-in-loop.js';
import { getAllXPairs, getExcessiveCurvatures_, getInterfaceIntersections_, getIntersections_, getSelfIntersections_, getTurnarounds_ } from '../containers/get-containers/get-all-x-pairs.js';
import { getLoopMinY } from '../shape/get-min-y.js';
import { _X_ } from '../get-critical-points/-x-.js';
import { BezierPiece, bezierPieceToBezier } from 'flo-bezier3';
import { reverseShapeOrientation } from '../shape/reverse-shape-orientation.js';
import { mapmap } from '../utils/map-map.js';
import { getJordanTurningNumber } from '../shape/get-jordan-turning-number.js';
import { containerHasMinY } from '../containers/container-has-min-y.js';
import { getShapeArea$ } from '../shape/get-shape-area.js';
import { MAX_BIT_LENGTH } from './max-bitlength.js';


const { ceil, log2 } = Math;


/** 
 * A size multiplier (based on the max value of the tangent) for the containers
 * holding critical points.
 */
const CONTAINER_SIZE_MULTIPLIER_EXP = 4;
const CONTAINER_SIZE_MULTIPLIER_EXP_FOR_DEBUGGING = 30;


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
        bezierLoops: ((number[][])[])[],
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

    //--------------------------------------------------------------------------
    const containerSizeMultiplierExp = typeof _debug_ === 'undefined'
        ? CONTAINER_SIZE_MULTIPLIER_EXP
        : CONTAINER_SIZE_MULTIPLIER_EXP_FOR_DEBUGGING;
    const expGrid = expMax - MAX_BIT_LENGTH;
    const expContainer = expGrid + containerSizeMultiplierExp;
    //--------------------------------------------------------------------------

    // const preMinLoopArea = (2**(expContainer + 6))**2;  //  an entire loop mustn't fit inside a container
    bezierLoops =
        normalizeLoops(bezierLoops, expMax)
        // cannot work: getShapeArea$ is the signed, winding number weighted area, not the actual area
        // .filter(loop => abs(getShapeArea$(loop)) > preMinLoopArea)
        .sort(compareLoopByMinY);

    const loops = bezierLoops.map(loopFromBeziers);
    //==========================================================================


    //==========================================================================
    const minYXPairs = loops.map(getLoopMinY);
    if (typeof _debug_ !== 'undefined') { minYXPairs.forEach(_x_ => _debug_.elems.minY.push(_x_)); }

    const containers = getContainers(loops, minYXPairs, expMax, expContainer);
    const minYContainers = containers.filter(containerHasMinY);

    const root = completePaths(expMax, minYContainers);

    const outs = splitLoopTrees(root);

    const outSets = outs
        .map(getLoopsFromTree(booleanOp))
        .filter(v => v.length !== 0);

    //----------------------------------------
    // Create loops for all `outSets`
    //----------------------------------------
    const __loopss = outSets.map(outSet => {
        const outerLoopOrientation = outSet[0].out.orientation;

        return outSet.map(({ out, depth }) => {
            return loopFromOut(out, outerLoopOrientation, depth);
        });
    });


    //-----------------
    // Post processing
    //-----------------

    const _loopss = __loopss.map(loops => {
        return loops.map(bezierPieces => {
            const beziers = bezierPieces.map(bezierPieceToBezier);

            return beziers;
        });
    });


    const loopss = _loopss.map(
        (_loops, i) => {
            const outerOrientation = getJordanTurningNumber(_loops[0]);

            const shouldReverse = outerOrientation !== -1 && forceOrientationNegative;

            return _loops.map(_loop =>
                shouldReverse ? reverseShapeOrientation(_loop) : _loop
            );
        }
    );


    const minAreaFilter = timeFunctionCalls(filterLoopsByMinAllowedArea(minLoopArea));

    const loopss_ = minAreaFilter(loopss)
    // TODO might be used downstream but uneccessary to do here even though it's fast
        .map(loops => loops.toSorted(compareLoopByMinY));

    let loopIdx = 0;
    const loopss__ = mapmap(loopss_, l => loopFromBeziers(l, loopIdx++));

    addDebugInfo2(loopss__);  // adds debug info used within __tests__ (and the demo)

    if (typeof _debug_ !== 'undefined') {
        const { l1, l2, l3, lil1, lil2, lil3, lil4 } = _debug_.callCounts;
        // console.log(lil1, lil2, lil3, lil4);
        // console.log(l1,l2,l3);
    }

    return loopss__;
}


export { simplifyPaths }




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