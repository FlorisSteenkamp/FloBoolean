import { orient2d } from 'big-float-ts';
import { createRootExact, mid } from 'flo-poly';
import { squaredDistanceBetween } from 'flo-vector2d';
import { isPointOnBezierExtension, getBoundingHull, closestPointOnBezierCertified } from "flo-bezier3";
import { getOtherTs } from './get-other-t';
import { doConvexPolygonsIntersect } from "../geometry/do-convex-polygons-intersect";
import { getIntersection } from './get-intersection';
import { makeSimpleX } from './make-simple-x';
import { getBoundingBox_ } from '../get-bounding-box-';
import { areBoxesIntersecting } from '../are-boxes-intersecting';
/**
 * Returns the pairs of intersection `t` values between the curves. Interface
 * intersections may not be returned - they should already be caught.
 *
 * @param curveA
 * @param curveB
 */
function getCurvesIntersections(expMax) {
    return (curveA, curveB) => {
        const psA = curveA.ps;
        const psB = curveB.ps;
        if (psA.length === 2 && psB.length === 2) {
            return getLineLineIntersections(curveA, curveB, expMax);
        }
        if (curveA.next === curveB || curveB.next === curveA) {
            // curves are connected at endpoints
            // closed bounding boxes are guaranteed to intersect - don't check
            // check open bounding boxes
            const aabbsIntersectOpen = areBoxesIntersecting(false, 
            // const aabbsIntersectOpen = areBoxesIntersecting(true,
            getBoundingBox_(psA), getBoundingBox_(psB));
            if (!aabbsIntersectOpen) {
                return checkEndpoints(curveA, curveB);
            }
            // check open bounding hulls
            const bbHullA = getBoundingHull(psA, false);
            const bbHullB = getBoundingHull(psB, false);
            const hullsIntersectOpen = doConvexPolygonsIntersect(bbHullA, bbHullB, false);
            if (!hullsIntersectOpen) {
                return checkEndpoints(curveA, curveB);
            }
            // neither aabbs nor hulls can split the curves
            return curveB.next === curveA
                ? getIntersection(curveB, curveA, expMax, true) // B-->A
                : getIntersection(curveA, curveB, expMax, true); // A-->B
        }
        // curves are not connected at endpoints
        // check closed bounding boxes
        let possiblyIntersecting = areBoxesIntersecting(true, getBoundingBox_(psA), getBoundingBox_(psB));
        if (!possiblyIntersecting) {
            return undefined;
        }
        // check closed bounding hulls
        const bbHullA = getBoundingHull(psA, false);
        const bbHullB = getBoundingHull(psB, false);
        possiblyIntersecting = doConvexPolygonsIntersect(bbHullA, bbHullB, true);
        if (!possiblyIntersecting) {
            return undefined;
        }
        return getIntersection(curveA, curveB, expMax, false);
    };
}
/**
 * Returns an un-ordered pair of intersections (excluding interface intersections,
 * in which case `undefined` is returned) between curveA and curveB.
 *
 * * **precondition:** curveA.next === curveB || curveB.next === curveA
 * * **precondition:** every intersection will be at an endpoint of at least
 * one of the curves
 *
 * @param curveA
 * @param curveB
 */
function checkEndpoints(curveA, curveB) {
    if (curveB.next === curveA) {
        if (curveA.next === curveB) {
            // if this is a very simple loop with only 2 beziers in it
            return undefined;
        }
        // else swap the curves to make the algorithm simpler
        [curveA, curveB] = [curveB, curveA];
    }
    // At this point A-->B (curveA's next === curveB)
    // There is thus an intersection at curveA(t=1) and curveB(t=0)
    const psA = curveA.ps;
    const psB = curveB.ps;
    // Is last point (i.e. at `t` === 1) of curveB on curveA?
    // if (isPointOnBezierExtension(psA, psB[psB.length-1])) {
    if (isPointOnBezierExtension(psA, psB[psB.length - 1].map(c => [c]))) {
        // Check if they are in same k family (this *is* necessary for two curves
        // in same k-family joined end to end, e.g. ---A--->|---B---> in which
        // case ...)
        const xPairs = getOtherTs(psA, psB, [createRootExact(1)]);
        if (xPairs === undefined || xPairs.length === 0) {
            return undefined;
        }
        const xPair = xPairs[0];
        return [[
                { x: xPair[0], curve: curveA },
                makeSimpleX(1, curveB, 1)
            ]];
    }
}
function getLineLineIntersections(curveA, curveB, expMax) {
    let psA = curveA.ps;
    let psB = curveB.ps;
    const bbA = getBoundingBox_(psA);
    const bbB = getBoundingBox_(psB);
    // if (equal(psA,[[4,8],[4,7]]) && equal(psB,[[4,6],[4,8]])) {
    //     console.log('testing');
    // }
    if (curveA.next !== curveB && curveB.next !== curveA) {
        // the two line curves are not consecutive in the loop
        if (areBoxesIntersecting(true, bbA, bbB)) {
            const xs = getIntersection(curveA, curveB, expMax, false);
            return xs.length ? xs : undefined;
        }
        return undefined;
    }
    // the two line curves are consecutive in the loop
    const swap = curveB.next === curveA;
    if (swap) {
        [curveA, curveB] = [curveB, curveA];
        [psA, psB] = [psB, psA];
    }
    const orientation = orient2d(psA[0], psA[1], psB[1]);
    if (orientation !== 0) {
        // they cannot intersect
        return undefined;
    }
    // they are in the same k family - they can either go in the
    // same direction or go back on top of each other
    // if going in same direction
    if (!areBoxesIntersecting(false, bbA, bbB)) {
        // they cannot intersect
        return undefined;
    }
    // it is a line going back on itself 
    // - return endpoint intersections
    const lenCurveA = squaredDistanceBetween(psA[0], psA[1]);
    const lenCurveB = squaredDistanceBetween(psB[0], psB[1]);
    let tPair;
    if (lenCurveA > lenCurveB) {
        const t0 = mid(closestPointOnBezierCertified(psA, psB[1])[0].ri);
        tPair = [t0, 1];
    }
    else {
        const t1 = mid(closestPointOnBezierCertified(psB, psA[0])[0].ri);
        tPair = [0, t1];
    }
    return [[
            makeSimpleX(1, curveA, 5), // exact overlap endpoint
            makeSimpleX(0, curveB, 5), // exact overlap endpoint
        ], [
            makeSimpleX(tPair[0], curveA, 5), // exact overlap endpoint
            makeSimpleX(tPair[1], curveB, 5) // exact overlap endpoint
        ]];
}
export { getCurvesIntersections };
//# sourceMappingURL=get-curves-intersections.js.map