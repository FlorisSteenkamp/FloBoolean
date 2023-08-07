import { getBoundingHull, getBoundingBoxTight } from 'flo-bezier3';
import { completePath } from './complete-path.js';
import { getTightestContainingLoop } from './get-tightest-containing-loop.js';
import { orderLoopAscendingByMinY } from './order-loop-ascending-by-min-y.js';
import { splitLoopTrees } from './split-loop-trees.js';
import { getLoopsFromTree } from './get-loops-from-tree.js';
import { getContainers } from '../calc-containers/get-containers.js';
import { getOutermostInAndOut } from './get-outermost-in-and-out.js';
import { reverseOrientation } from '../loop/reverse-orientation.js';
import { loopFromBeziers } from '../loop/loop.js';
import { normalizeLoops } from '../loop/normalize/normalize-loop.js';
import { getMaxCoordinate } from '../loop/normalize/get-max-coordinate.js';
import { getLoopArea } from '../loop/get-loop-area.js';
import { loopsToSvgPathStr } from '../svg/loops-to-svg-path-str.js';
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
function simplifyPaths(bezierLoops, maxCoordinate) {
    let timingStart;
    if (typeof _debug_ !== 'undefined') {
        timingStart = performance.now();
    }
    // bezierLoops = bezierLoops.map(loopFromBeziers).map(reverseOrientation).map(loops => loops.beziers);
    // console.log(loopsToSvgPathStr(bezierLoops));
    /**
     * All bezier coordinates will be truncated to this (bit-aligned) bitlength.
     * Higher bitlengths would increase the running time of the algorithm
     * considerably.
     */
    // const maxBitLength = 46;
    const maxBitLength = 46;
    maxCoordinate = maxCoordinate || getMaxCoordinate(bezierLoops);
    /** The exponent, e, such that 2**e >= all bezier coordinate points. */
    const expMax = Math.ceil(Math.log2(maxCoordinate));
    const gridSpacing = 2 ** expMax * 2 ** (-maxBitLength);
    /**
     * A size (based on the max value of the tangent) for the containers holding
     * critical points.
     */
    const containerSizeMultiplier = 2 ** 6;
    // const containerSizeMultiplier = 2**36;
    const containerDim = gridSpacing * containerSizeMultiplier;
    bezierLoops = normalizeLoops(bezierLoops, maxBitLength, expMax, false, true);
    // console.log(bezierLoops)
    addDebugInfo1(bezierLoops);
    bezierLoops.sort(orderLoopAscendingByMinY);
    const loops = bezierLoops.map((loop, i) => loopFromBeziers(loop, i));
    const { extremes } = getContainers(loops, containerDim, expMax);
    const root = createRootInOut();
    const takenLoops = new Set();
    const takenOuts = new Set(); // Taken intersections
    for (const loop of loops) {
        if (takenLoops.has(loop)) {
            continue;
        }
        takenLoops.add(loop);
        const parent = getTightestContainingLoop(root, loop);
        const container = extremes.get(loop)[0].container;
        if (!container.inOuts.length) {
            continue;
        }
        const initialOut = getOutermostInAndOut(container);
        // Each loop generated will give rise to one componentLoop. 
        initialOut.parent = parent;
        initialOut.windingNum = parent.windingNum + initialOut.orientation;
        initialOut.children = new Set();
        completePath(expMax, getOutermostInAndOut(container), takenLoops, takenOuts);
    }
    const loopTrees = splitLoopTrees(root);
    const outSets = loopTrees.map(getLoopsFromTree);
    const loopss = outSets.map(outSet => outSet.map((out, idx) => loopFromOut(out, outSet[0].orientation, idx)));
    /**
     * Arbitrarily choose min. loop area to be equal to one square pixel on a
     * 4096 x 4096 grid.
     */
    const minLoopArea = (2 ** expMax * 2 ** (-12)) ** 2;
    const loopss_ = [];
    for (let i = 0; i < loopss.length; i++) {
        const loops = loopss[i].filter((loop) => Math.abs(getLoopArea(loop)) > minLoopArea);
        if (loops.length) {
            loops.sort((loopA, loopB) => {
                return orderLoopAscendingByMinY(loopA.beziers, loopB.beziers);
            });
            loopss_.push(loops);
        }
    }
    addDebugInfo2(loopss_);
    if (typeof _debug_ !== 'undefined') {
        const timing = _debug_.generated.timing;
        timing.simplifyPaths = performance.now() - timingStart;
    }
    // console.log(loopsToSvgPathStr(loopss_[0].map(loop => loop.beziers)));
    return loopss_;
}
/**
 *
 * @param out
 * @param orientation
 * @param idx identifies the loop during debugging
 */
function loopFromOut(out, orientation, idx) {
    const loop = orientation < 0
        ? loopFromBeziers(out.beziers, idx)
        : reverseOrientation(loopFromBeziers(out.beziers, idx));
    return loop;
}
function addDebugInfo2(loopss) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    for (const loops of loopss) {
        _debug_.generated.elems.loop.push(...loops);
        _debug_.generated.elems.loops.push(loops);
        //console.log(loopsToSvgPathStr(loops.map(loop => loop.beziers)));
    }
    // Don't delete below commented lines - it is for creating test cases.
    // if (typeof document === 'undefined') { return; }
    // let g = document.getElementsByTagName('g')[0];
    // let invariants = loopss.map(loops => {
    //    return loops.map(loop => {
    //        let centroid = getLoopCentroid(loop);
    //        let area     = getLoopArea(loop);
    //        let bounds   = simplifyBounds(getLoopBounds(loop));
    //        //drawFs.crossHair(g, centroid, 'thin10 red nofill', 1, 0);
    //        return { centroid, area, bounds };
    //    });
    // });
    // console.log(JSON.stringify(invariants, undefined, '    '));
}
function addDebugInfo1(loops) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    // Modifies the displayed SVG to reflect changes caused by `normalizeLoops`.
    if (typeof document !== 'undefined') {
        const pathStr = loopsToSvgPathStr(loops);
        const $svg = document.getElementsByClassName('shape')[0];
        $svg.setAttributeNS(null, 'd', pathStr);
    }
    for (const loop of loops) {
        _debug_.generated.elems.loopPre.push(...loops);
        _debug_.generated.elems.loopsPre.push(loops);
        for (const ps of loop) {
            const lbb = getBoundingBox_(ps);
            const tbb = getBoundingBoxTight(ps);
            const bhull = getBoundingHull(ps);
            _debug_.generated.elems.bezier_.push(ps);
            _debug_.generated.elems.looseBoundingBox_.push(lbb);
            _debug_.generated.elems.tightBoundingBox_.push(tbb);
            _debug_.generated.elems.boundingHull_.push(bhull);
        }
    }
}
function createRootInOut() {
    return {
        dir: undefined,
        idx: 0,
        parent: undefined,
        children: new Set(),
        windingNum: 0,
        p: undefined,
        _x_: undefined,
        container: undefined
    };
}
export { simplifyPaths };
// TODO - Handle case where bezier tangentially touches container edge. 
// Simply move the container boundary 1/8th or 1/16th inward and try again. 
// This case is truly extremely rare and not hard to fix completely.
//# sourceMappingURL=simplify-paths.js.map