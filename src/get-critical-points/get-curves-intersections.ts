
import { orient2d } from 'flo-numerical';
import { squaredDistanceBetween } from 'flo-vector2d';
import { getBoundingBox, getBoundingHull, inversion1_BL52_1ULP } from "flo-bezier3";
import { isPointOnBezierExtension, getOtherTs } from "flo-bezier3";
import { Curve } from "../curve/curve";
import { areBoxesIntersecting } from "../sweep-line/are-boxes-intersecting";
import { doConvexPolygonsIntersect } from "../geometry/do-convex-polygons-intersect";
import { getIntersection } from './get-intersection';
import { _X_ } from '../x';
import { createRootExact } from 'flo-poly';
import { makeSimpleX } from './make-simple-x';


/** function that returns true if *open* axis aligned boxes intersect, false otherwise */
let areBoxesIntersectingOpen = areBoxesIntersecting(false);
/** function that returns true if *closed* axis aligned boxes intersect, false otherwise */
let areBoxesIntersectingClosed = areBoxesIntersecting(true);


/**
 * Returns the pairs of intersection t values between the curves. Interface
 * intersections may not be returned - they should already be caught.
 * @param curveA 
 * @param curveB 
 */
function getCurvesIntersections(expMax: number) {
    return (
        curveA: Curve, 
        curveB: Curve): _X_[][] => {

    let psA = curveA.ps;
    let psB = curveB.ps;

    if (psA.length === 2 && psB.length === 2) {
        return getLineLineIntersections(curveA, curveB, expMax);
    }

    if (curveA.next === curveB || curveB.next === curveA) {
        // curves are connected at endpoints
        // closed bounding boxes are guaranteed to intersect - don't check

        // check open bounding boxes
        let aabbsIntersectOpen = areBoxesIntersectingOpen(
            getBoundingBox(psA),
            getBoundingBox(psB)
        );
        if (!aabbsIntersectOpen) {
            return checkEndpoints(curveA, curveB);
        }
        
        // check open bounding hulls
        let bbHullA = getBoundingHull(psA);
        let bbHullB = getBoundingHull(psB);
        let hullsIntersectOpen = doConvexPolygonsIntersect(
            bbHullA, bbHullB, false
        );
        if (!hullsIntersectOpen) {
            return checkEndpoints(curveA, curveB);
        }

        // neither aabbs nor hulls can split the curves
        return curveB.next === curveA 
            ? getIntersection(curveB, curveA, expMax, true)   // B-->A
            : getIntersection(curveA, curveB, expMax, true);  // A-->B
    } 

    // curves are not connected at endpoints

    // check closed bounding boxes
    let possiblyIntersecting = areBoxesIntersectingClosed(
        getBoundingBox(psA),
        getBoundingBox(psB)
    );
    if (!possiblyIntersecting) { return undefined; }

    // check closed bounding hulls
    let bbHullA = getBoundingHull(psA);
    let bbHullB = getBoundingHull(psB);
    possiblyIntersecting = doConvexPolygonsIntersect(bbHullA, bbHullB, true);
    if (!possiblyIntersecting) { return undefined; }

    return getIntersection(curveA, curveB, expMax, false);
}}


/**
 * Returns an un-ordered pair of intersections (excluding interface intersections,
 * in which case undefined is returned) between curveA and curveB.
 * * **precondition**: curveA.next === curveB || curveB.next === curveA
 * * **precondition**: every intersection will be at an endpoint of at least
 * one of the curves
 * @param curveA 
 * @param curveB 
 */
function checkEndpoints(
        curveA: Curve, 
        curveB: Curve): _X_[][] {

    let _x_s: _X_[][] = [];

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
    if (isPointOnBezier(psA, psB[psB.length-1])) {
        let xPair = getOtherTs(psA, psB, [createRootExact(1)])[0];
        if (!xPair) { return undefined; }
        return [[
            { x: xPair[0], curve: curveA },
            makeSimpleX(1, curveB, 1)
        ]];
    }
}


function isPointOnBezier(ps: number[][], p: number[]) {
    // TODO - isPointOnBezierExtension not same as isPointOnBezier ???
    return isPointOnBezierExtension(ps, p);
}


function getLineLineIntersections(
        curveA: Curve, 
        curveB: Curve,
        expMax: number) {

    let psA = curveA.ps;
    let psB = curveB.ps;
    
    let bbA = getBoundingBox(psA);
    let bbB = getBoundingBox(psB);
    
    if (curveA.next !== curveB && curveB.next !== curveA) {
        // the two lines are not connected at their endpoints
        if (areBoxesIntersectingClosed(bbA, bbB)) {
            let xs = getIntersection(curveA, curveB, expMax, false);
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
    let orientation = orient2d(psA[0], psA[1], psB[1]);
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
    let lenCurve1 = squaredDistanceBetween(psA[0], psA[1]);
    let lenCurve2 = squaredDistanceBetween(psB[0], psB[1]);

    let tPair: number[];
    if (lenCurve1 > lenCurve2) {
        tPair = [inversion1_BL52_1ULP(psA, psB[1]), 1];
    } else {
        tPair = [0, inversion1_BL52_1ULP(psB, psA[0])];
    }
    return [[
        makeSimpleX(1, curveA, 5),  // exact overlap endpoint
        makeSimpleX(0, curveB, 5),  // exact overlap endpoint
    ], [
        makeSimpleX(tPair[0], curveA, 5),  // exact overlap endpoint
        makeSimpleX(tPair[1], curveB, 5)   // exact overlap endpoint
    ]];
}


export { getCurvesIntersections }











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