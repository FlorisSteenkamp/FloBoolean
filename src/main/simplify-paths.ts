declare const _debug_: Debug; 

import { Debug } from '../debug/debug.js';
import { completePath } from '../calc-paths/complete-path.js';
import { getTightestContainingLoop } from '../calc-paths/get-tightest-containing-loop.js';
import { orderLoopAscendingByMinY } from '../calc-paths/order-loop-ascending-by-min-y.js';
import { splitLoopTrees } from '../calc-paths/split-loop-trees.js';
import { getLoopsFromTree } from '../calc-paths/get-loops-from-tree.js';
import { getContainers } from '../containers/get-containers.js';
import { InOut } from '../containers/in-out/in-out.js';
import { getOutermostInAndOut } from '../calc-paths/get-outermost-in-and-out.js';
import { Loop } from '../loop/loop.js';
import { loopFromBeziers } from '../loop/loop-from-beziers.js';
import { normalizeLoops } from '../loop/normalize/normalize-loop.js';
import { getMaxCoordinate } from '../loop/normalize/get-max-coordinate.js';
import { getShapeArea } from '../loop/get-loop-area.js';
import { addDebugInfo1 } from './add-debug-info-1.js';
import { addDebugInfo2 } from './add-debug-info-2.js';
import { loopFromOut } from './loop-from-out.js';
import { createRootInOut } from './create-root-in-out.js';
import { bezierToBezierPiece } from '../calc-paths/bezier-to-bezier-piece.js';
import { Mutable } from '../types/mutable.js';
// import { gotoNextContainer } from './goto-next-container.js';
// import { reverseShapeOrientation } from '../loop/reverse-shape-orientation.js';


interface SimplifyOptions {
    /**  */
    readonly noMicroCorners?: boolean;
    /** defaults to 46 */
    readonly maxBitLength?: number;
    /**
     * * defaults to `(2**expMax * 2**(-12))**2`;
     * * minimum area of a bezer loop before it will be discarded
     */
    readonly minLoopArea?: number;
    /**
     * defaults to `false` (for historic reasons); if `true` then the returned
     * paths all have a positive (counter-clockwise) orientation for each single
     * outermost loop (with the set of returned loops) with the rest being negatively
     * oriented, else, if `false` the reverse is true.
     */
    readonly orientationPositive?: boolean;
}


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
 * @param maxCoordinate optional; if not provided, it will be calculated; a
 * wrong value could cause the algorithm to fail
 */
function simplifyPaths(
        bezierLoops: number[][][][],
        maxCoordinate?: number,
        options: SimplifyOptions = {}): Loop[][] {

    let timingStart: number;
    if (typeof _debug_ !== 'undefined') {
        timingStart = performance.now();
    }

    // bezierLoops = bezierLoops.map(reverseShapeOrientation);  // For quick tests

    /** 
     * All bezier coordinates will be truncated to this (bit-aligned) bitlength.
     * Higher bitlengths would increase the running time of the algorithm 
     * considerably.
     */
    maxCoordinate = maxCoordinate || getMaxCoordinate(bezierLoops);
    /** The exponent, e, such that 2**e >= all bezier coordinate points. */
    const expMax = Math.ceil(Math.log2(maxCoordinate));

    const {
        maxBitLength = 46,
        noMicroCorners = false,
        minLoopArea = (2**expMax * 2**(-12))**2,
        orientationPositive = false
    } = options;

    const gridSpacing = 2**expMax * 2**(-maxBitLength);

    /** 
     * A size (based on the max value of the tangent) for the containers holding 
     * critical points.
     */
    //==================================================================
    const containerSizeMultiplier = 2**6;
    // const containerSizeMultiplier = 2**37;
    //==================================================================
    const containerDim = gridSpacing * containerSizeMultiplier;

    bezierLoops = normalizeLoops(
        bezierLoops, 
        maxBitLength, 
        expMax,
        false,
        true,
    );

    addDebugInfo1(bezierLoops);
    bezierLoops.sort(orderLoopAscendingByMinY);

    const loops = bezierLoops.map((loop, i) => loopFromBeziers(loop, i));
    const { extremes } = getContainers(loops, containerDim, expMax, noMicroCorners);

    const root = createRootInOut();
    // `takenLoops` is important in rare cases such as in the 'koldat52' vector
    const takenLoops: Set<Loop> = new Set();
    const takenOuts: Set<InOut> = new Set();  // Taken intersections

    for (const loop of loops) {
        if (takenLoops.has(loop)) { continue; }
        takenLoops.add(loop);

        const parent = getTightestContainingLoop(root, loop);

        const container = extremes.get(loop)![0].container!;
        if (container.inOuts.length === 0) { continue; }

        const initialOut = getOutermostInAndOut(container, parent, loop);

        // Each loop generated will give rise to one componentLoop. 

        if (container.inOuts.length === 2 &&
            container.inOuts[0].nextOrPrev === container.inOuts[1]) {
            // short-circuit `completePath` for Jordan curves
            initialOut.bezierPieces = loop.beziers.map(bezierToBezierPiece);
            (initialOut.parent! as Mutable<InOut>).children = initialOut.parent!.children || new Set();
            initialOut.parent!.children!.add(initialOut);
            continue;
        }

        completePath(
            initialOut,
            takenLoops,
            takenOuts,
            false,
            noMicroCorners
        );

        if (container.inOuts.length === 2 &&
            container.xs.length === 2 &&
            container.xs[0].x.kind === 0 && container.xs[1].x.kind === 0 &&  // just for good measure
            initialOut.bezierPieces !== undefined) {

            // combine first and last bezier so not to have an extraneous bezier
            const { bezierPieces } = initialOut;
            const bezierPiece = {
                ps: initialOut._x_?.curve.ps!,
                ts: [0,1]
            };

            // bezierPieces.shift();
            // bezierPieces.pop();
            // bezierPieces.unshift(bezierPiece);
        }
    }

    const loopTrees = splitLoopTrees(root);
    const outSets = loopTrees.map(getLoopsFromTree);

    const loopss = outSets.map(outSet => {
        const outerLoopOrientation =
            (orientationPositive ? +1 : -1) * outSet[0].orientation!;

        return outSet.map((out,idx) => loopFromOut(out, outerLoopOrientation, idx));
    });

    const loopss_: Loop[][] = [];
    for (let i=0; i<loopss.length; i++) {
        const loops = loopss[i].filter(
            (loop: Loop) => Math.abs(getShapeArea(loop.beziers)) > minLoopArea
        );

        if (loops.length) { 
            loops.sort((loopA, loopB) => { 
                return orderLoopAscendingByMinY(loopA.beziers, loopB.beziers) 
            });
            loopss_.push(loops); 
        }
    }

    addDebugInfo2(loopss_);  // adds debug info used within __tests__ (and the demo)

    if (typeof _debug_ !== 'undefined') {
        const timing = _debug_.generated.timing;
        timing.simplifyPaths = performance.now() - timingStart!;
    }

    // console.log(loopss_);

    return loopss_;
}


export type { SimplifyOptions }
export { simplifyPaths }
