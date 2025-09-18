declare const _debug_: Debug;
declare const _debug_temp: Debug;

import { Debug } from '../debug/debug.js';
import { completePath } from '../calc-paths/complete-path.js';
import { getTightestContainingLoop } from '../calc-paths/get-tightest-containing-loop.js';
import { orderLoopAscendingByMinY } from '../calc-paths/order-loop-ascending-by-min-y.js';
import { getContainers } from '../calc-containers/get-containers.js';
import { InOut } from '../in-out.js';
import { getOutermostInAndOut } from '../calc-paths/get-outermost-in-and-out.js';
import { Loop, loopFromBeziers } from '../loop/loop.js';
import { normalizeLoops } from '../loop/normalize/normalize-loop.js';
import { getMaxCoordinate } from '../loop/normalize/get-max-coordinate.js';
import { getShapeArea } from '../loop/get-loop-area.js';
import { getAllLoopsFromTree } from './get-all-loops-from-tree.js';

// the imports below is used in the test cases - see code below
import { simplifyPaths } from './simplify-paths.js';
import { addDebugInfo1 } from './add-debug-info-1.js';
import { loopFromOut } from './loop-from-out.js';
import { reverseShapeOrientation } from '../loop/reverse-shape-orientation.js';



interface BooleanOptions {
    /** defaults to 46;
     * All bezier coordinates will be truncated to this (bit-aligned) bitlength.
     * Higher bitlengths would increase the running time of the algorithm 
     * considerably.
     */
    readonly maxBitLength?: number;
    /**
     * * defaults to `(2**expMax * 2**(-12))**2`;
     * * minimum area of a bezer loop before it will be discarded
     */
    readonly minLoopArea?: number;
}


/**
 * Split all paths into regions with each region identifying the original paths
 * belonging to it (which can later be used in boolean operations).
 * 
 * * the seperate paths must already be simplified by first calling
 * `simplifyPaths` if necessary, e.g. for self-overlapping paths
 * 
 * * uses an algorithm similirar to that of Lavanya Subramaniam: PARTITION OF A
 * NON-SIMPLE POLYGON INTO SIMPLE POLYGONS (see `simplifyPaths`); 
 * 
 * @param loops an array of possibly intersecting paths
 * @param maxCoordinate optional - if not provided, it will be calculated - a
 * wrong value could cause the algorithm to fail
 */
function splitAllPaths(
        bezierLoopss: number[][][][][],
        options: BooleanOptions = {}): Loop[][] {

    if (typeof _debug_ !== 'undefined') {
        (window as any)._debug_temp = _debug_;
        (window as any)._debug_ = undefined;
    }
    
    const maxCoordinate = Math.max(...bezierLoopss.map(getMaxCoordinate));
    /** The exponent, e, such that 2**e >= all bezier coordinate points. */
    const expMax = Math.ceil(Math.log2(maxCoordinate));

    const {
        maxBitLength = 46,
        minLoopArea = (2**expMax * 2**(-12))**2
    } = options;

    const gridSpacing = 2**expMax * 2**(-maxBitLength);

    /** 
     * A size (based on the max value of the tangent) for the containers holding 
     * critical points.
     */
    // const containerSizeMultiplier = 2**6;
    const containerSizeMultiplier = 2**41;
    const containerDim = gridSpacing * containerSizeMultiplier;

    bezierLoopss = bezierLoopss.map(bezierLoops => normalizeLoops(
        bezierLoops, maxBitLength, expMax,
        false, true,
    ));

    const bezierLoops = bezierLoopss.map(
        bezierLoops => {
            const r = simplifyPaths(bezierLoops, maxCoordinate, {
                maxBitLength, minLoopArea, noMicroCorners: true
            }).flat().map(v => v.beziers);

            // return r;
            return r.map(reverseShapeOrientation);
        }
    ).flat();
    // const bezierLoops = bezierLoopss.flat();
    console.log(bezierLoops);

    if (typeof _debug_temp !== 'undefined') {
        (window as any)._debug_ = _debug_temp;
        (window as any)._debug_temp = undefined;
    }
    // throw 'a';

    addDebugInfo1(bezierLoops);
    bezierLoops.sort(orderLoopAscendingByMinY);

    const loops = bezierLoops.map((loop, i) => loopFromBeziers(loop, i));
    const { extremes } = getContainers(loops, containerDim, expMax, true);

    const root = createRootInOut();
    const takenLoops: Set<Loop> = new Set();
    const takenInOuts: Set<InOut> = new Set();  // Taken intersections

    for (let i=0; i<loops.length; i++) {
        const loop = loops[i];

        if (takenLoops.has(loop)) { continue; }
        takenLoops.add(loop);

        const parent = getTightestContainingLoop(root, loop);

        const container = extremes.get(loop)![0].container!;
        if (container.inOuts.length === 0) { continue; }

        const initialOut = getOutermostInAndOut(container);
        // @ts-ignore
        initialOut.parent = parent;
        // @ts-ignore
        initialOut.windingNum = parent.windingNum! + initialOut.orientation!;
        // @ts-ignore
        initialOut.children = new Set();

        completePath(
            initialOut,
            takenLoops,
            takenInOuts,
            true,  // take the tightest loop around
            true  // noMicroCorners
        );
    }

    const outSet = getAllLoopsFromTree(root);
    // console.log(outSet.length);

    const loopss = [outSet.map((out,idx) => loopFromOut(out, outSet[0].orientation!, idx))];

    const loopss_: Loop[][] = [];
    for (let i=0; i<loopss.length; i++) {
        const loops = loopss[i].filter(
            (loop: Loop) => Math.abs(getShapeArea(loop.beziers)) > minLoopArea
        );
        loopss_.push(loops); 
    }

    addDebugInfo2(loopss_);

    console.log(loopss_)

    return loopss_;
}


function createRootInOut(): InOut {
    return {
        dir: undefined!,
        idx: 0,
        parent: undefined,
        children: new Set(),
        windingNum: 0,
        p: undefined!,
        pBox: undefined!,
        _x_: undefined,
        container: undefined!
    };
}


function addDebugInfo2(loopss: Loop[][]) {
    if (typeof _debug_ === 'undefined') { return; }

    for (const loops of loopss) {
        _debug_.generated.elems.loop.push(...loops);
        _debug_.generated.elems.loops.push(loops);
        //console.log(loopsToSvgPathStr(loops.map(loop => loop.beziers)));
    }
}


export { splitAllPaths }
