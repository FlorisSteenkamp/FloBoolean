declare const _debug_: Debug;
import type { Debug, Timing } from '../debug/debug.js';
import type { Mutable } from '../utils/mutable.js';
import type { Loop } from '../shape/loop.js';
import type { SimplifyOptions } from './simplify-options.js';
import type { _X_ } from '../get-critical-points/-x-.js';
import { compareLoopByMinY } from '../calc-paths/order-loop-ascending-by-min-y.js';
import { splitLoopTrees } from '../calc-paths/split-loop-trees.js';
import { getLoopsFromTree } from '../calc-paths/get-loops-from-tree.js';
import { getContainers } from '../containers/get-containers/get-containers.js';
import { loopFromBeziers } from '../shape/loop-from-beziers.js';
import { normalizeLoops } from '../shape/normalize/normalize-loop.js';
import { getMaxCoordinate } from '../shape/normalize/get-max-coordinate.js';
import { completePaths } from '../calc-paths/complete-paths/complete-paths.js';
import { getAllXPairs } from '../containers/get-containers/get-all-x-pairs.js';
import { getLoopMinY } from '../shape/get-min-y.js';
import { xsHasMinY } from '../containers/xs-has-min-y.js';
import { MAX_BIT_LENGTH } from './max-bitlength.js';
import { postProcess } from './post-process.js';
import { rerun } from './rerun/rerun.js';
import { loopssFromOutsets } from './loopss-from-outsets.js';


const { ceil, log2 } = Math;


/** 
 * A size multiplier for the containers holding critical points.
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
        // minLoopArea = (2**(expMax - 16))**2,
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

    bezierLoops =
        normalizeLoops(bezierLoops, expMax)
        .sort(compareLoopByMinY);

    const loops = bezierLoops.map(loopFromBeziers);
    //==========================================================================


    //==========================================================================
    const minYXPairs = loops.map(getLoopMinY);
    if (typeof _debug_ !== 'undefined') { minYXPairs.forEach(_x_ => _debug_.elems.minY.push(_x_)); }

    const xPairs = getAllXPairs(loops, minYXPairs, expMax);

    const containers = getContainers(xPairs, expMax, expContainer);
    if (typeof _debug_ !== 'undefined') { _debug_.elems.container.push(...containers); }

    const minYContainers = containers.filter(container => xsHasMinY(container.xs));

    const root = completePaths(expMax, minYContainers);

    const outs = splitLoopTrees(root);

    const outSets = outs
        .map(getLoopsFromTree(booleanOp))
        .filter(v => v.length !== 0);

    //----------------------------------------
    // Create loops for all `outSets`
    //----------------------------------------
    const loopss_ = loopssFromOutsets(outSets);

    const loopss__ = postProcess(
        // Use this for rerun:
        rerun(expMax, outSets, containers, loopss_),
        // Use this if no rerun wanted:
        // loopss_,
        forceOrientationNegative, minLoopArea
    );

    // if (typeof _debug_ !== 'undefined') { logTimings(); }

    return loopss__;
}


export { simplifyPaths }
