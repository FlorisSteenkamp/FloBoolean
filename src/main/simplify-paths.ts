declare const _debug_: Debug; 
import type { Debug, Timing } from '../debug/debug.js';
import type { BezierPiece } from 'flo-bezier3';
import type { Mutable } from '../utils/mutable.js';
import type { InOut, Out } from '../containers/in-out/in-out.js';
import type { Loop } from '../loop/loop.js';
import type { SimplifyOptions } from './simplify-options.js';
import { completePath } from '../calc-paths/complete-path.js';
import { getTightestContainingLoop } from '../calc-paths/get-tightest-containing-loop.js';
import { orderLoopAscendingByMinY } from '../calc-paths/order-loop-ascending-by-min-y.js';
import { splitLoopTrees } from '../calc-paths/split-loop-trees.js';
import { getLoopsFromTree } from '../calc-paths/get-loops-from-tree.js';
import { getContainers } from '../containers/get-containers/get-containers.js';
import { getOutermostInAndOut } from '../calc-paths/get-outermost-in-and-out.js';
import { loopFromBeziers } from '../loop/loop-from-beziers.js';
import { normalizeLoops } from '../loop/normalize/normalize-loop.js';
import { getMaxCoordinate } from '../loop/normalize/get-max-coordinate.js';
import { getShapeArea } from '../loop/get-loop-area.js';
import { addDebugInfo1 } from './add-debug-info-1.js';
import { addDebugInfo2 } from './add-debug-info-2.js';
import { loopFromOut } from './loop-from-out.js';
import { createRootInOut } from './create-root-in-out.js';
import { bezierToBezierPiece } from '../calc-paths/bezier-to-bezier-piece.js';
import { removeMicroCorners } from './remove-micro-corners.js';
import { MAX_BIT_LENGTH } from './max-bitlength.js';
import { getInOutsOfContainer } from '../containers/get-container-in-outs/get-in-outs-via-sides/get-in-outs-via-sides.js';
import { getMinYXpair } from '../get-critical-points/get-min-y-x-pair.js';

const { abs, max, ceil, log2 } = Math;


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

    const { minYXPairs, containers, loops, expMax } = 
        prepLoops(bezierLoops);

    const {
        inclMicroCorners = true,
        minLoopArea = (2**expMax * 2**(-12))**2,
        forceOrientationNegative = false,
        booleanOp = "OR"
    } = options;

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
        if (container.inOuts.length === 0) { continue; }

        const initialOut = getOutermostInAndOut(container, parent, loop);

        // Each loop generated will give rise to one componentLoop. 

        const containerIsSimple =
            container.inOuts.length === 2 &&  // only 2 InOuts
            container.xs.length === 2;  // only 2 Xs

        if (containerIsSimple &&
            container.inOuts[0].nextOrPrev === container.inOuts[1]) { 

            //---------------------------------------------------
            // It's a Jordan curve: short-circuit `completePath`
            //---------------------------------------------------
            initialOut.bezierPieces = loop.beziers.map(bezierToBezierPiece);
            (initialOut.parent! as Mutable<InOut>).children = initialOut.parent!.children || new Set();
            initialOut.parent!.children!.add(initialOut);
            continue;
        }

        completePath(
            initialOut,
            takenLoops,
            takenOuts
        );

        if (containerIsSimple &&
            initialOut.bezierPieces !== undefined) {

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

    const loopTrees = splitLoopTrees(root);

    const getLoopsFromTree_ = getLoopsFromTree(booleanOp);
    const outSets = loopTrees.map(getLoopsFromTree_)
        .filter(v => v.length !== 0);

    //----------------------------------------
    // Give outer loop a positive orientation
    //----------------------------------------
    const loopss = outSets.map(outSet => {
        const outerLoopOrientation = outSet[0].orientation;

        return outSet.map((inOut,idx) => 
            loopFromOut(inOut, outerLoopOrientation, idx, forceOrientationNegative)
        );
    });

    //----------------------------------------------------------
    // Filter each `loops` in `loopss` by min allowed loop area
    //----------------------------------------------------------
    const loopss_: Loop[][] = [];
    for (let i=0; i<loopss.length; i++) {
        const loops = loopss[i];

        const loops_ = loops.filter(
            loop => abs(getShapeArea(loop.beziers)) > minLoopArea
        );

        if (loops_.length) { 
            loops_.sort((loopA, loopB) => { 
                return orderLoopAscendingByMinY(loopA.beziers, loopB.beziers) 
            });
            loopss_.push(loops_); 
        }
    }

    if (typeof _debug_ !== 'undefined') {
        (_debug_.timing as Mutable<Timing>).simplifyPaths =
            performance.now() - _debug_.timing.timingStart - _debug_.timing.normalize;
    }

    //-------------------------------------
    // Remove "micro corners" if requested
    //-------------------------------------
    const _loopss_ = inclMicroCorners
        ? loopss_
        : loopss_.map(loops => loops.map(loop => {
            const { beziers } = loop;
            const lengthTol = max(
                ...containers.map(
                    container => abs(container.box[0][0] - container.box[1][0])
                ),
                ...containers.map(
                    container => abs(container.box[0][1] - container.box[1][1])
                )
            );
            const beziers_ = removeMicroCorners(beziers, lengthTol);
            return loopFromBeziers(beziers_, loop.idx);
        }));

    addDebugInfo2(_loopss_);  // adds debug info used within __tests__ (and the demo)

    // console.log(loopss_);

    console.log(structuredClone(getInOutsOfContainer.getStats()));
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

    /** 
     * All bezier coordinates will be truncated to this (bit-aligned) bitlength.
     * Higher bitlengths would increase the running time of the algorithm 
     * considerably.
     */
    const maxCoordinate_ = getMaxCoordinate(bezierLoops);
    /** The exponent, e, such that 2**e >= all bezier coordinate points. */
    const expMax = ceil(log2(maxCoordinate_));

    /** 
     * A size (based on the max value of the tangent) for the containers holding 
     * critical points.
     */

    bezierLoops = normalizeLoops(
        bezierLoops, 
        MAX_BIT_LENGTH,
        expMax,
        false,
        true,
    );

    addDebugInfo1(bezierLoops);
    bezierLoops.sort(orderLoopAscendingByMinY);

    const loops = bezierLoops.map((loop, i) => loopFromBeziers(loop, i));

    const minYXPairs = loops.map(getMinYXpair);

    const containers = getContainers(loops, minYXPairs, expMax);

    return { minYXPairs, containers, loops, expMax };
}


export { simplifyPaths, prepLoops }
