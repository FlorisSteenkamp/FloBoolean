declare var _debug_: Debug; 

import { getBoundingHull, getBoundingBoxTight } from 'flo-bezier3';
import { Debug } from '../debug/debug.js';
import { completePath } from './complete-path.js';
import { getTightestContainingLoop } from './get-tightest-containing-loop.js';
import { orderLoopAscendingByMinY } from './order-loop-ascending-by-min-y.js';
import { splitLoopTrees } from './split-loop-trees.js';
import { getLoopsFromTree } from './get-loops-from-tree.js';
import { getContainers } from '../calc-containers/get-containers.js';
import { InOut } from '../in-out.js';
import { getOutermostInAndOut } from './get-outermost-in-and-out.js';
import { reverseOrientation } from '../loop/reverse-orientation.js';
import { Loop, loopFromBeziers } from '../loop/loop.js';
import { normalizeLoops } from '../loop/normalize/normalize-loop.js';
import { getMaxCoordinate } from '../loop/normalize/get-max-coordinate.js';
import { getLoopArea } from '../loop/get-loop-area.js';
import { loopsToSvgPathStr } from '../svg/loops-to-svg-path-str.js';

// the imports below is used in the test cases - see code below
import { getLoopCentroid } from '../loop/get-loop-centroid.js';
import { simplifyBounds } from '../loop/simplify-bounds.js';
import { getLoopBounds } from '../loop/get-loop-bounds.js';
import { getBoundingBox_ } from '../get-bounding-box-.js';


/**
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
 * @param maxCoordinate optional - if not provided, it will be calculated - a
 * wrong value could cause the algorithm to fail
 */
function simplifyPaths(
        bezierLoops: number[][][][],
        maxCoordinate?: number): Loop[][] {


    let timingStart: number;
    if (typeof _debug_ !== 'undefined') {
        timingStart = performance.now();
    }

    /** 
     * All bezier coordinates will be truncated to this (bit-aligned) bitlength.
     * Higher bitlengths would increase the running time of the algorithm 
     * considerably.
     */
    let maxBitLength = 46;

    maxCoordinate = maxCoordinate || getMaxCoordinate(bezierLoops);
    /** The exponent, e, such that 2**e >= all bezier coordinate points. */
    let expMax = Math.ceil(Math.log2(maxCoordinate));
    let gridSpacing = 2**expMax * 2**(-maxBitLength);

    /** 
     * A size (based on the max value of the tangent) for the containers holding 
     * critical points.
     */
    const containerSizeMultiplier = 2**4;
    //const containerSizeMultiplier = 2**39;
    let containerDim = gridSpacing * containerSizeMultiplier;

    bezierLoops = normalizeLoops(
        bezierLoops, 
        maxBitLength, 
        expMax,
        false,
        true,
    );

    addDebugInfo1(bezierLoops);
    bezierLoops.sort(orderLoopAscendingByMinY);

    let loops = bezierLoops.map((loop, i) => loopFromBeziers(loop, i));
    let { extremes } = getContainers(loops, containerDim, expMax);

    let root = createRootInOut();
    let takenLoops: Set<Loop> = new Set();
    let takenOuts: Set<InOut> = new Set(); // Taken intersections

    for (let loop of loops) {
        if (takenLoops.has(loop)) { continue; }
        takenLoops.add(loop);

        let parent = getTightestContainingLoop(root, loop);

        let container = extremes.get(loop)![0].container!;
        if (!container.inOuts.length) { continue; }

        let initialOut = getOutermostInAndOut(container);
        // Each loop generated will give rise to one componentLoop. 
        initialOut.parent = parent;
        initialOut.windingNum = parent.windingNum! + initialOut.orientation!;
        initialOut.children = new Set();

        completePath(
            expMax,
            getOutermostInAndOut(container),
            takenLoops, 
            takenOuts
        );
    }

    let loopTrees = splitLoopTrees(root);
    let outSets = loopTrees.map(getLoopsFromTree);

    let loopss = outSets.map(
        outSet => outSet.map(out => loopFromOut(out, outSet[0].orientation!))
    );

    /** 
     * Arbitrarily choose min. loop area to be equal to one square pixel on a 
     * 4096 x 4096 grid.
     */
    let minLoopArea = (2**expMax * 2**(-12))**2;

    let loopss_: Loop[][] = [];
    for (let i=0; i<loopss.length; i++) {
        let loops = loopss[i].filter(
            (loop: Loop) => Math.abs(getLoopArea(loop)) > minLoopArea
        );
        if (loops.length) { 
            loops.sort((loopA, loopB) => { 
                return orderLoopAscendingByMinY(loopA.beziers, loopB.beziers) 
            });
            loopss_.push(loops); 
        }
    }

    addDebugInfo2(loopss_);

    if (typeof _debug_ !== 'undefined') {
        const timing = _debug_.generated.timing;
        timing.simplifyPaths = performance.now() - timingStart!;
    }

    return loopss_;
}


function loopFromOut(out: InOut, orientation: number) {
    let loop = orientation < 0
        ? loopFromBeziers(out.beziers)
        : reverseOrientation(loopFromBeziers(out.beziers));

    return loop;
}


function addDebugInfo2(loopss: Loop[][]) {
    if (typeof _debug_ === 'undefined') { return; }

    for (let loops of loopss) {
        _debug_.generated.elems.loop.push(...loops);
        _debug_.generated.elems.loops.push(loops);
        //console.log(loopsToSvgPathStr(loops.map(loop => loop.beziers)));
    }

    // Don't delete below commented lines - it is for creating test cases.
    //if (typeof document === 'undefined') { return; }
    //let g = document.getElementsByTagName('g')[0];
    //let invariants = loopss.map(loops => {
    //    return loops.map(loop => {
    //        let centroid = getLoopCentroid(loop);
    //        let area     = getLoopArea(loop);
    //        let bounds   = simplifyBounds(getLoopBounds(loop));
    //        //drawFs.crossHair(g, centroid, 'thin10 red nofill', 1, 0);
    //        return { centroid, area, bounds };
    //    });
    //});
    //console.log(JSON.stringify(invariants, undefined, '    '));
}


function addDebugInfo1(loops: number[][][][]) {
    if (typeof _debug_ === 'undefined') { return; }

    // Modifies the displayed SVG to reflect changes caused by `normalizeLoops`.
    if (typeof document !== 'undefined') { 
        let pathStr = loopsToSvgPathStr(loops); 
        let $svg = document.getElementsByClassName('shape')[0]; 
        $svg.setAttributeNS(null, 'd', pathStr); 
    }

    
    for (let loop of loops) {
        _debug_.generated.elems.loopPre.push(...loops);
        _debug_.generated.elems.loopsPre.push(loops);

        for (let ps of loop) {
            let lbb   = getBoundingBox_(ps);
            let tbb   = getBoundingBoxTight(ps);
            let bhull = getBoundingHull(ps)!;
            _debug_.generated.elems.bezier_          .push(ps);
            _debug_.generated.elems.looseBoundingBox_.push(lbb);
            _debug_.generated.elems.tightBoundingBox_.push(tbb);
            _debug_.generated.elems.boundingHull_    .push(bhull);
        }
    }
}


function createRootInOut(): InOut {
    return {
        dir: undefined!,
        idx: 0,
        parent: undefined,
        children: new Set(),
        windingNum: 0,
        p: undefined!,
        _x_: undefined,
        container: undefined!
    };
}


export { simplifyPaths }

// TODO - Handle case where bezier tangentially touches container edge. 
// Simply move the container boundary 1/8th or 1/16th inward and try again. 
// This case is truly extremely rare and not hard to fix completely.
