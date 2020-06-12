"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyPaths = void 0;
const complete_path_1 = require("./complete-path");
const get_tightest_containing_loop_1 = require("./get-tightest-containing-loop");
const order_loop_ascending_by_min_y_1 = require("./order-loop-ascending-by-min-y");
const split_loop_trees_1 = require("./split-loop-trees");
const get_loops_from_tree_1 = require("./get-loops-from-tree");
const get_containers_1 = require("../calc-containers/get-containers");
const get_outermost_in_and_out_1 = require("./get-outermost-in-and-out");
const reverse_orientation_1 = require("../loop/reverse-orientation");
const loop_1 = require("../loop/loop");
const normalize_loop_1 = require("../loop/normalize/normalize-loop");
const get_max_coordinate_1 = require("../loop/normalize/get-max-coordinate");
const get_loop_area_1 = require("../loop/get-loop-area");
const flo_bezier3_1 = require("flo-bezier3");
const loops_to_svg_path_str_1 = require("../svg/loops-to-svg-path-str");
/**
 * Uses the algorithm of Lavanya Subramaniam: PARTITION OF A NON-SIMPLE POLYGON
 * INTO SIMPLE POLYGONS;
 * see http://www.cis.southalabama.edu/~hain/general/Theses/Subramaniam_thesis.pdf
 * but modified to use bezier curves (as opposed to polygons) and to additionally
 * take care of paths with multiple subpaths, i.e. such as disjoint nested paths.
 * Also takes care of all special cases.
 * @param loops an array of possibly intersecting paths
 * @param maxCoordinate optional - if not provided, it will be calculated - a
 * wrong value could cause the algorithm to fail
 */
function simplifyPaths(bezierLoops, maxCoordinate) {
    /**
     * All bezier coordinates will be truncated to this (bit-aligned) bitlength.
     * Higher bitlengths would increase the running time of the algorithm
     * considerably.
     */
    let maxBitLength = 46;
    maxCoordinate = maxCoordinate || get_max_coordinate_1.getMaxCoordinate(bezierLoops);
    /** The exponent, e, such that 2**e >= all bezier coordinate points. */
    let expMax = Math.ceil(Math.log2(maxCoordinate));
    let gridSpacing = Math.pow(2, expMax) * Math.pow(2, (-maxBitLength));
    /**
     * A size (based on the max value of the tangent) for the containers holding
     * critical points.
     */
    const containerSizeMultiplier = Math.pow(2, 4);
    //const containerSizeMultiplier = 2**39;
    let containerDim = gridSpacing * containerSizeMultiplier;
    bezierLoops = normalize_loop_1.normalizeLoops(bezierLoops, maxBitLength, expMax, false, true);
    addDebugInfo1(bezierLoops);
    bezierLoops.sort(order_loop_ascending_by_min_y_1.orderLoopAscendingByMinY);
    let loops = bezierLoops.map((loop, i) => loop_1.loopFromBeziers(loop, i));
    let { extremes } = get_containers_1.getContainers(loops, containerDim, expMax);
    let root = createRootInOut();
    let takenLoops = new Set();
    let takenOuts = new Set(); // Taken intersections
    for (let loop of loops) {
        if (takenLoops.has(loop)) {
            continue;
        }
        takenLoops.add(loop);
        let parent = get_tightest_containing_loop_1.getTightestContainingLoop(root, loop);
        let container = extremes.get(loop)[0].container;
        if (!container.inOuts.length) {
            continue;
        }
        let initialOut = get_outermost_in_and_out_1.getOutermostInAndOut(container);
        // Each loop generated will give rise to one componentLoop. 
        initialOut.parent = parent;
        initialOut.windingNum = parent.windingNum + initialOut.orientation;
        initialOut.children = new Set();
        complete_path_1.completePath(expMax, get_outermost_in_and_out_1.getOutermostInAndOut(container), takenLoops, takenOuts);
    }
    let loopTrees = split_loop_trees_1.splitLoopTrees(root);
    let outSets = loopTrees.map(get_loops_from_tree_1.getLoopsFromTree);
    let loopss = outSets.map(outSet => outSet.map(out => loopFromOut(out, outSet[0].orientation)));
    /**
     * Arbitrarily choose min. loop area to be equal to one square pixel on a
     * 4096 x 4096 grid.
     */
    let minLoopArea = Math.pow((Math.pow(2, expMax) * Math.pow(2, (-12))), 2);
    let loopss_ = [];
    for (let i = 0; i < loopss.length; i++) {
        let loops = loopss[i].filter((loop) => Math.abs(get_loop_area_1.getLoopArea(loop)) > minLoopArea);
        if (loops.length) {
            loops.sort((loopA, loopB) => {
                return order_loop_ascending_by_min_y_1.orderLoopAscendingByMinY(loopA.beziers, loopB.beziers);
            });
            loopss_.push(loops);
        }
    }
    addDebugInfo2(loopss_);
    return loopss_;
}
exports.simplifyPaths = simplifyPaths;
function loopFromOut(out, orientation) {
    let loop = orientation < 0
        ? loop_1.loopFromBeziers(out.beziers)
        : reverse_orientation_1.reverseOrientation(loop_1.loopFromBeziers(out.beziers));
    return loop;
}
function addDebugInfo2(loopss) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    for (let loops of loopss) {
        _debug_.generated.elems.loop.push(...loops);
        _debug_.generated.elems.loops.push(loops);
        //console.log(loopsToSvgPathStr(loops.map(loop => loop.beziers)));
    }
    // below is used for test generation purposes
    if (typeof document === 'undefined') {
        return;
    }
    // Don't delete below commented lines - it is for creating test cases.
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
function addDebugInfo1(loops) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    //for (let loop of loops) { console.log(beziersToSvgPathStr(loop.beziers)); }
    if (typeof document !== 'undefined') {
        //let pathStr = loopsToSvgPathStr(loops.map(loop => loop.beziers)); 
        let pathStr = loops_to_svg_path_str_1.loopsToSvgPathStr(loops);
        let $svg = document.getElementsByClassName('shape')[0];
        $svg.setAttributeNS(null, 'd', pathStr);
        //console.log(pathStr); 
    }
    for (let loop of loops) {
        for (let bez of loop) {
            let lbb = flo_bezier3_1.getBoundingBox(bez);
            let tbb = flo_bezier3_1.getBoundingBoxTight(bez);
            let bhull = flo_bezier3_1.getBoundingHull(bez);
            _debug_.generated.elems.bezier_.push(bez);
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
// TODO - Handle case where bezier tangentially touches container edge. 
// Simply move the container boundary 1/8th or 1/16th inward and try again. 
// This case is truly extremely rare and not hard to fix completely.
//# sourceMappingURL=simplify-paths.js.map