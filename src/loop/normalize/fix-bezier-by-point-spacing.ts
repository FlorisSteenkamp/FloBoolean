import { squaredDistanceBetween, toLength, fromTo as fromToVect, translate } from "flo-vector2d";
// import { lengthSquaredUpperBound, isLine, isCubicReallyQuad, toQuadraticFromCubic } from "flo-bezier3";
import { isReallyPoint, isCubicReallyQuad, cubicToQuadratic, isCollinear } from "flo-bezier3";
import { areAllPointsDifferent } from "./are-all-points-different.js";

const { abs } = Math;


/**
 * Returns the same bezier if its points are well-spaced, e.g. all points not
 * coincident, etc., else fix it, if possible, and return the fixed bezier,
 * else return undefined.
 * @param ps A bezier
 */
function fixBezierByPointSpacing(
        ps: number[][], 
        gridSpacing: number,
        sendToGrid: (p: number[]) => number[]): number[][] | undefined {

    // Early filter - if all points coincide, we're done - degenerate to point
    if (isReallyPoint(ps)) {
        return undefined; // Cannot fix
    }

    if (ps.length === 2) {
        // obviously no need to fix a line (that is not degenerate to a point)
        return ps;
    }

    if (ps.length === 3) {
        // Early filter - if no points coincide, we're done - well spaced
        if (areAllPointsDifferent(ps)) {
            // but if it s a line masquerading as a quadratic or cubic bezier
            // then make it line
            // return isLine(ps) ? [ps[0], ps[2]] : ps;
            return isCollinear(ps) ? [ps[0], ps[2]] : ps;
        }

        // Is the quadratic bezier overlapping onto itself? 
        if (arePsEqual(ps[0], ps[2])) {
            // a quadratic with equal endpoints (and not degenerate to a point)
            // The overlap is of no consequence to the algorithm so make it a
            // line
            return [ps[0], ps[1]];
        }
        // At this point not all points same and not all points different and 
        // not endpoints coincide, so either:
        // * point 0 and 1 coincide
        // * point 1 and 2 coincide
        // but in that case we simply have a line
        return [ps[0], ps[2]];
    }


    // ---- at this point we must have a cubic

    // Early filter - if no points coincide, we're done - well spaced
    if (areAllPointsDifferent(ps)) {
        return checkCubicForLineOrQuad(ps);
    }
    
    if (arePsEqual(ps[0], ps[3])) {
        // we should simply handle this case for cubics - lines and quadratics 
        // degenerate into a point and a self-overlapping curve respectively.
        
        if (arePsEqual(ps[1], ps[2])) {
            // it is a cubic degenerated to a line
            return [ps[0], ps[2]];
        }

        // no need to fix anything - it is a loop - it cannot be a line or a
        // quadratic (they don't make loops)
        return ps; 
    }

    // At this point, either:
    // * point 0, 1 and 2 coincide
    // * point 1, 2 and 3 coincide
    // * points 0,1 AND points 2,3 coincide
    // * only point 0 and point 1 coincides
    // * only point 0 and point 2 coincides        
    // * only point 1 and point 2 coincides
    // * only point 1 and point 3 coincides
    // * only point 2 and point 3 coincides

    // If point 0, 1 and 2 coincide OR point 1, 2 and 3 coincide OR
    // points 0,1 AND points 2,3 coincide we have a line
    if ((arePsEqual(ps[0], ps[1]) && 
        arePsEqual(ps[1], ps[2])) ||
        
        (arePsEqual(ps[1], ps[2]) && 
         arePsEqual(ps[2], ps[3])) ||

        (arePsEqual(ps[0], ps[1]) && 
         arePsEqual(ps[2], ps[3]))
    ) {
        // Check if first and last point are sufficiently far apart to split
        // the bezier into a line so that all points differ.
        if (abs(ps[0][0] - ps[3][0]) > (3+1)*gridSpacing || 
            abs(ps[0][1] - ps[3][1]) > (3+1)*gridSpacing) {

            return [ps[0], ps[ps.length-1]];
        } else {
            // Points are not sufficiently far apart to resolve onto grid -
            // cannot fix it - it is basically a point.

            return undefined;
        }
    }


    // At this point, either:
    // * only point 0 and point 1 coincides
    // * only point 0 and point 2 coincides        
    // * only point 1 and point 2 coincides
    // * only point 1 and point 3 coincides
    // * only point 2 and point 3 coincides

    // If points 0,2 OR points 1,3 OR points 1,2 coincide we're done - they
    // are not problematic
    if (arePsEqual(ps[0], ps[2]) ||
        arePsEqual(ps[1], ps[3]) ||
        arePsEqual(ps[1], ps[2])) {

        // these kinds of cubics cannot be quadratics and the case for a line
        // has already been checked - we're done
        return ps;
    }


    // At this point, either:
    // * only point 0 and point 1 coincides
    // * only point 2 and point 3 coincides
    // it is a cubic with a cusp at an endpoint - these are fine for our
    // algorithm but lets move them a little apart for later alogorithms 
    // operating on our returned result.

    if (arePsEqual(ps[0], ps[1])) {
        // Move point 1 towards point 2 without surpassing it and ensuring it
        // will be on a new grid point

        // If squared distance between the points < 4 * gridSpacing just 
        // move them onto each other - this shouldn't affect the overall 
        // accuracy of the algorithm and it ensures the move > gridSpacing.

        if (squaredDistanceBetween(ps[1], ps[2]) < 4 * gridSpacing) {
            return [
                ps[0],
                ps[2],
                ps[2],
                ps[3]
            ]; // cannot be a line or quad
        } else {
            const v = toLength(fromToVect(ps[1], ps[2]), 2 * gridSpacing);
            const p1 = translate(ps[1], v);
            return checkCubicForLineOrQuad([
                ps[0],
                sendToGrid(p1),
                ps[2],
                ps[3]
            ]);
        }
    }


    if (arePsEqual(ps[2], ps[3])) {
        // Move point 2 towards point 1 without surpassing it and ensuring it
        // will be on a new grid point

        // If squared distance between the points < 4 * gridSpacing just 
        // move them onto each other - this shouldn't affect the overall 
        // accuracy of the algorithm and it ensures the move > gridSpacing.
        if (squaredDistanceBetween(ps[2], ps[1]) < 4 * gridSpacing) {
            return [
                ps[0],
                ps[1],
                ps[1],
                ps[3]
            ]; // cannot be a line or quad
        } else {
            const v = toLength(fromToVect(ps[2], ps[1]), 2 * gridSpacing);
            const p2 = translate(ps[2], v);
            return checkCubicForLineOrQuad([
                ps[0],
                ps[1],
                sendToGrid(p2),
                ps[3]
            ]);
        }
    }
}


function checkCubicForLineOrQuad(ps: number[][]) {
    // return isLine(ps)
    return isCollinear(ps)
        ? [ps[0], ps[3]]
        : isCubicReallyQuad(ps)
            ? cubicToQuadratic(ps)
            : ps;
}

/** Returns true if the points are the same */
function arePsEqual(p1: number[], p2: number[]) {
    return p1[0] === p2[0] && p1[1] === p2[1];
}


export { fixBezierByPointSpacing }
