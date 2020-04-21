"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_numerical_1 = require("flo-numerical");
const flo_vector2d_1 = require("flo-vector2d");
const flo_bezier3_1 = require("flo-bezier3");
const flo_bezier3_2 = require("flo-bezier3");
const are_boxes_intersecting_1 = require("../sweep-line/are-boxes-intersecting");
const do_convex_polygons_intersect_1 = require("../geometry/do-convex-polygons-intersect");
const get_intersection_1 = require("./get-intersection");
const flo_poly_1 = require("flo-poly");
const make_simple_x_1 = require("./make-simple-x");
/** function that returns true if *open* axis aligned boxes intersect, false otherwise */
let areBoxesIntersectingOpen = are_boxes_intersecting_1.areBoxesIntersecting(false);
/** function that returns true if *closed* axis aligned boxes intersect, false otherwise */
let areBoxesIntersectingClosed = are_boxes_intersecting_1.areBoxesIntersecting(true);
/**
 * Returns the pairs of intersection t values between the curves. Interface
 * intersections may not be returned - they should already be caught.
 * @param curveA
 * @param curveB
 */
function getCurvesIntersections(expMax) {
    return (curveA, curveB) => {
        let psA = curveA.ps;
        let psB = curveB.ps;
        if (psA.length === 2 && psB.length === 2) {
            return getLineLineIntersections(curveA, curveB, expMax);
        }
        if (curveA.next === curveB || curveB.next === curveA) {
            // curves are connected at endpoints
            // closed bounding boxes are guaranteed to intersect - don't check
            // check open bounding boxes
            let aabbsIntersectOpen = areBoxesIntersectingOpen(flo_bezier3_1.getBoundingBox(psA), flo_bezier3_1.getBoundingBox(psB));
            if (!aabbsIntersectOpen) {
                return checkEndpoints(curveA, curveB);
            }
            // check open bounding hulls
            let bbHullA = flo_bezier3_1.getBoundingHull(psA);
            let bbHullB = flo_bezier3_1.getBoundingHull(psB);
            let hullsIntersectOpen = do_convex_polygons_intersect_1.doConvexPolygonsIntersect(bbHullA, bbHullB, false);
            if (!hullsIntersectOpen) {
                return checkEndpoints(curveA, curveB);
            }
            // neither aabbs nor hulls can split the curves
            return curveB.next === curveA
                ? get_intersection_1.getIntersection(curveB, curveA, expMax, true) // B-->A
                : get_intersection_1.getIntersection(curveA, curveB, expMax, true); // A-->B
        }
        // curves are not connected at endpoints
        // check closed bounding boxes
        let possiblyIntersecting = areBoxesIntersectingClosed(flo_bezier3_1.getBoundingBox(psA), flo_bezier3_1.getBoundingBox(psB));
        if (!possiblyIntersecting) {
            return undefined;
        }
        // check closed bounding hulls
        let bbHullA = flo_bezier3_1.getBoundingHull(psA);
        let bbHullB = flo_bezier3_1.getBoundingHull(psB);
        possiblyIntersecting = do_convex_polygons_intersect_1.doConvexPolygonsIntersect(bbHullA, bbHullB, true);
        if (!possiblyIntersecting) {
            return undefined;
        }
        return get_intersection_1.getIntersection(curveA, curveB, expMax, false);
    };
}
exports.getCurvesIntersections = getCurvesIntersections;
/**
 * Returns an un-ordered pair of intersections (excluding interface intersections,
 * in which case undefined is returned) between curveA and curveB.
 * * **precondition**: curveA.next === curveB || curveB.next === curveA
 * * **precondition**: every intersection will be at an endpoint of at least
 * one of the curves
 * @param curveA
 * @param curveB
 */
function checkEndpoints(curveA, curveB) {
    let _x_s = [];
    //let swapped = false;
    if (curveB.next === curveA) {
        if (curveA.next === curveB) {
            // if this is a very simple loop with only 2 beziers in it
            return undefined;
        }
        // else swap the curves to make the algorithm simpler
        //swapped = true;
        [curveA, curveB] = [curveB, curveA];
    }
    // At this point A-->B (curveA's next === curveB)
    // There is thus an intersection at curveA(t=1) and curveB(t=0)
    let psA = curveA.ps;
    let psB = curveB.ps;
    // Is last point of curveB on curveA?
    if (isPointOnBezier(psA, psB[psB.length - 1])) {
        let xPair = flo_bezier3_2.getOtherTs(psA, psB, [flo_poly_1.createRootExact(1)])[0];
        if (!xPair) {
            return undefined;
        }
        return [[
                { x: xPair[0], curve: curveA },
                make_simple_x_1.makeSimpleX(1, curveB, 1)
            ]];
    }
}
function isPointOnBezier(ps, p) {
    // TODO - isPointOnBezierExtension not same as isPointOnBezier ???
    return flo_bezier3_2.isPointOnBezierExtension(ps, p);
}
function getLineLineIntersections(curveA, curveB, expMax) {
    let psA = curveA.ps;
    let psB = curveB.ps;
    let bbA = flo_bezier3_1.getBoundingBox(psA);
    let bbB = flo_bezier3_1.getBoundingBox(psB);
    if (curveA.next !== curveB && curveB.next !== curveA) {
        // the two lines are not connected at their endpoints
        if (areBoxesIntersectingClosed(bbA, bbB)) {
            let xs = get_intersection_1.getIntersection(curveA, curveB, expMax, false);
            return xs.length ? xs : undefined;
        }
        return undefined;
    }
    // the two lines are connected at their endpoints
    let swap = curveB.next === curveA;
    if (swap) {
        [curveA, curveB] = [curveB, curveA];
        [psA, psB] = [psB, psA];
    }
    let orientation = flo_numerical_1.orient2d(psA[0], psA[1], psB[1]);
    if (orientation !== 0) {
        // they cannot intersect
        return undefined;
    }
    // they are in the same k family - they can either go in the
    // same direction or go back on top of each other
    // if going in same direction
    if (!areBoxesIntersectingOpen(bbA, bbB)) {
        // they cannot intersect
        return undefined;
    }
    // it is a line going back on itself 
    // - return endpoint intersections
    let lenCurve1 = flo_vector2d_1.squaredDistanceBetween(psA[0], psA[1]);
    let lenCurve2 = flo_vector2d_1.squaredDistanceBetween(psB[0], psB[1]);
    let tPair;
    if (lenCurve1 > lenCurve2) {
        tPair = [flo_bezier3_1.inversion1_BL52_1ULP(psA, psB[1]), 1];
    }
    else {
        tPair = [0, flo_bezier3_1.inversion1_BL52_1ULP(psB, psA[0])];
    }
    return [[
            make_simple_x_1.makeSimpleX(1, curveA, 5),
            make_simple_x_1.makeSimpleX(0, curveB, 5),
        ], [
            make_simple_x_1.makeSimpleX(tPair[0], curveA, 5),
            make_simple_x_1.makeSimpleX(tPair[1], curveB, 5) // exact overlap endpoint
        ]];
}
// tight bounding boxes
/*
let bbTightA = getBoundingBoxTight(psA);
let bbTightB = getBoundingBoxTight(psB);
possiblyIntersecting =
    doConvexPolygonsIntersect(bbTightA, bbTightB, closed);
    //doConvexPolygonsIntersect(bbTightA, bbTightB, false);
//if (!possiblyIntersecting) { return false; }
if (!possiblyIntersecting) { return checkEndpoints(curveA, curveB); }
*/ 
//# sourceMappingURL=get-curves-intersections.js.map