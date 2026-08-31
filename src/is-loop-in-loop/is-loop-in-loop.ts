declare const _debug_: Debug; 
import type { Debug } from '../debug/debug.js';
import type { BezierPiece } from 'flo-bezier3';
import { ddAddDd as qaq, ddDivBy2 as qd2, ddGte as qgt } from 'double-double';
import { eps, refineK1, roots } from 'flo-poly';
import { bezierPieceToBezier, evalDeCasteljauDd } from 'flo-bezier3';
import { translate } from 'flo-vector2d';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';
import { toP } from '../utils/to-p.js';
import { isLoopNotInLoop } from './is-loop-not-in-loop.js';
import { timeFunctionCalls } from '../utils/time-function-call.js';
import { getCandidates } from './get-candidates.js';
import { memoize } from 'flo-memoize';
import { clamp } from '../utils/clamp.js';
import { getCrossingCountAtEndpoints } from './get-crossing-count-at-endpoints.js';
import { toPowerBasisRootsAtExact } from './to-power-basis-root-at.js';


/**
 * Returns `true` if the first loop is wholly contained within the second loop's
 * boundary. 
 * 
 * * precondition: the loop must either wholly contained inside the loop or be
 *   wholly outside.
 * 
 * @param loop1
 * @param loop2
 */
const _isLoopInLoop = timeFunctionCalls(function _isLoopInLoop(
        expMax: number,
        loop1: number[][][],
        bezierPieces: BezierPiece[]): boolean {

    // if (typeof _debug_ !== 'undefined') { _debug_.callCounts.lil1++; }

    const loop2 = bezierPiecesToBeziers$(bezierPieces);

    if (isLoopNotInLoop(loop1, loop2)) {
        return false;
    }

    // Choose a NON-DEGENERATE ray-start point on `loop1`. A ray that passes
    // exactly through a vertex of, or lies collinear with an edge of, `loop2`
    // makes the crossing count ambiguous - `isPointInLoop` then returns
    // `undefined`. Sample points on `loop1` until one gives a definite answer:
    // sweep every bezier at a bisection sequence of parameter values
    // 0, 1/2, 1/4, 3/4, 1/8, ... (t = 1 is skipped as it coincides with the
    // next bezier's t = 0). Degenerate points form a measure-zero set, so this
    // resolves almost immediately.
    for (const t of bisectionParams(30)) {
        for (const bezier of loop1) {
            const p = toP(bezier, t);
            const r = isPointInLoop(expMax, p, bezierPieces);
            if (r !== undefined) { return r; }
        }
    }

    // Unreachable for valid input: a valid loop always has a non-degenerate
    // ray-start point well within 30 bisection levels.
    throw new Error('_isLoopInLoop: no non-degenerate ray-start point found');
});


function isPointInLoop(
        expMax: number,
        p: number[],
        bezierPieces: BezierPiece[]): boolean | undefined {

    const count = getAxisAlignedRayLoopIntersections(expMax, bezierPieces, p);

    if (count === undefined) { return undefined; }

    return count%2 !== 0;
}


/**
 * Returns the number of times an axis-aligned ray from `p` crosses the loop,
 * or `undefined` when the result is ambiguous - i.e. when a crossing falls
 * within `2*eps` of an inexact piece boundary (an intersection parameter that
 * is not exactly 0 or 1). The caller resolves this by retrying the ray from a
 * different point.
 *
 * Crossings are counted delta-free:
 * * roots are taken on the half-open parameter interval `[0,1)` so a vertex
 *   shared by two curves is owned by exactly one of them and counted once;
 * * each root contributes `multiplicity % 2`, so a transversal crossing (odd
 *   multiplicity) counts while a tangential touch (even multiplicity) does not.
 *
 * @param loop a loop of curves
 * @param p the point where the ray starts
 * @param dir the ray direction
 */
export const getAxisAlignedRayLoopIntersections = timeFunctionCalls(function getAxisAlignedRayLoopIntersections(
        expMax: number,
        bezierPieces: BezierPiece[],
        p: number[]): number | undefined {

    // if (typeof _debug_ !== 'undefined') { _debug_.callCounts.lil2++; }

    const [X,Y] = p;
    const candidates = getCandidates(bezierPieces, Y);

    let count = 0;
    for (let i=0; i<candidates.length; i++) {
        // if (typeof _debug_ !== 'undefined') { _debug_.callCounts.lil3++; }

        const piece = candidates[i];
        const { ps, ts } = piece;

        // Check if ray origin is to right of bezier bounding box
        const minX = getBoundingBox$(ps)[0][0];
        if (minX > X) { continue; }

        // if (typeof _debug_ !== 'undefined') { _debug_.callCounts.lil4++; }

        //------------------------------------------------------/
        //----------- Count ray crossings on bezier ------------/
        //------------------------------------------------------/
        // const ps_ = bezierPieceToBezier(piece);  // rather keep original `ps` by working with `BezierPiece` instead.

        const tPs = ps.map(translate([0,-Y]));  // exact (due to 46-bit alignment)

        // exact polynomial since max bit-length increase === 4 and tPs is 46-bit aligned -> 50 bits max
        // `tPs` may have 2, 3 or 4 control points (a line, quadratic or cubic).
        const n = tPs.length;

        // A control point at y === 0 (the ray has been translated to y = 0) means
        // the curve passes exactly through the ray at that end, i.e. a guaranteed
        // root: leading zeros from the start force successive roots at t = 0 and
        // trailing zeros from the end force successive roots at t = 1. We deflate
        // these known endpoint roots out of the polynomial so `roots` below only
        // yields interior crossings - shared vertices are then not counted twice
        // when the ray passes exactly through an endpoint. The count is capped at
        // the curve order (`n - 1`); an all-zero (collinear) curve is handled by
        // the `roots === undefined` branch below.
        let numRoots0 = 0;
        while (numRoots0 < n - 1 && tPs[numRoots0][1] === 0) { numRoots0++; }
        let numRoots1 = 0;
        while (numRoots1 < n - 1 && tPs[n - 1 - numRoots1][1] === 0) { numRoots1++; }

        const poly = toPowerBasisRootsAtExact(tPs, numRoots0, numRoots1);

        // Endpoint crossings (t = 0 and/or t = 1 lying exactly on the ray) were
        // deflated out of `poly` above, so `roots` below reports only interior
        // crossings. Account for each shared vertex here exactly once using the
        // strict-above (half-open) convention: count a crossing only when the
        // curve departs *above* the ray. A monotone crossing is then counted
        // once (odd) while a local extremum is counted on both its adjacent
        // edges (even) - both correct under the final `count % 2`.
        //
        // This runs before the collinear/no-root `continue` below so that
        // endpoint-only crossings (e.g. a triple root at t = 0, whose deflated
        // polynomial is a non-zero constant with no interior roots) aren't missed.
        //
        // `numRoots0`/`numRoots1` are derived from the *original* curve's
        // endpoint control points, but a `BezierPiece` may cover only a
        // sub-interval `ts` of that curve (e.g. the partial first/last piece of
        // a run). So only count an endpoint the piece actually reaches:
        // `ts[0] <= 0` for t = 0 and `ts[1] >= 1` for t = 1.
        if (numRoots0 > 0 && ts[0] <= 0) {
            const up = getCrossingCountAtEndpoints(tPs, 0) > 0;
            const onRaySide = p[0] >= tPs[0][0];
            if (up && onRaySide) { count++; }
        }
        if (numRoots1 > 0 && ts[1] >= 1) {
            const up = getCrossingCountAtEndpoints(tPs, 1) > 0;
            const onRaySide = p[0] >= tPs[tPs.length - 1][0];
            if (up && onRaySide) { count++; }
        }

        const tS = ts[0];
        const tE = ts[1];

        const tS_ = clamp(tS - 2*eps, 0, 1);  // error in roots (of original X calculation) is max 2 eps
        const tE_ = clamp(tE + 2*eps, 0, 1);  // ...

        // Roots of the coordinate perpendicular to the ray give the parameter
        // values where the curve meets the ray's (infinite) line.
        const rs = roots(poly, tS_, tE_);

        if (rs === undefined || rs.length === 0) {
            // The curve is collinear with the ray - the crossing count is "even"
            continue;
        }

        for (const r of rs) {
            const { t, multiplicity } = r;

            // `tS`/`tE` are, in general, inexact: they are intersection
            // parameters between two beziers (algebraic numbers) unless they are
            // exactly 0 or 1 (a real curve endpoint). We widened the search by
            // 2*eps to be sure of capturing every genuine root, but that means a
            // root landing within 4*eps of such an inexact boundary is ambiguous
            // - we cannot tell whether it truly lies inside this piece. Bail so
            // the caller retries the ray from a different point.
            if ((tS !== 0 && Math.abs(t - tS) <= 4*eps) ||
                (tE !== 1 && Math.abs(t - tE) <= 4*eps)) {
                return undefined;
            }

            // The below is more accurate but much slower then the calculation below
            //----------------------------------------------------------------------
            // const box = getIntervalBox(ps, [tS,tE]);
            // const minX = box[0][0];
            // const maxX = box[1][0];
            // const along = toP(tPs, t)[0];
            // const alongMin = minX;
            // const alongMax = maxX;
            //----------------------------------------------------------------------

            //----------------------------------------------------------------------
            const along = toP(tPs, t)[0];
            // === max dX by definition for cubics * max error in roots * 2
            const δ = (24*(2**expMax))*(4*eps);
            const alongMin = along - δ;
            const alongMax = along + δ;
            //----------------------------------------------------------------------

            const onRaySideMin = p[0] > alongMin;
            const onRaySideMax = p[0] > alongMax;
            const canResolve = onRaySideMin === onRaySideMax;
            if (!canResolve) {
                // It would be very rare to get here
                const rEs = refineK1(r, poly.map(c => [c]));
                for (let j=0; j<rEs.length; j++) {
                    const { tS: etS, tE: etE, multiplicity: eMultiplicity } = rEs[j];

                    // `te` is accurate enough that error will be smaller than that
                    // of intersections between loops
                    const te = qd2(qaq(etS, etE));  // (teS + teE)/2
                    
                    const eAlong = evalDeCasteljauDd(tPs, te)[0];
                    const eOnRaySide = qgt([0,p[0]], eAlong);

                    if (eOnRaySide) {
                        count += eMultiplicity % 2;
                    }
                }
            } else {
                // odd multiplicity = transversal crossing, even = tangential touch
                if (canResolve && onRaySideMin) {
                    count += multiplicity % 2;
                }
            }
        }
    }

    return count;
});


/**
 * Yields parameter values in bisection order - 0, 1/2, 1/4, 3/4, 1/8, 3/8, ...
 * - up to `maxLevel` levels deep (t = 1 is intentionally omitted since it
 * coincides with the next bezier's t = 0). Used to sample successively more
 * ray-start points on a loop until a non-degenerate one is found.
 */
function* bisectionParams(maxLevel: number): Generator<number> {
    yield 0;
    for (let level = 1; level <= maxLevel; level++) {
        const d = 2 ** level;
        for (let num = 1; num < d; num += 2) {
            yield num / d;
        }
    }
}


// memoize to preserve identity
const bezierPiecesToBeziers$ = memoize(function(
        bezierPieces: BezierPiece[]) {

    return bezierPieces.map(bezierPieceToBezier);
});


/**
 * Returns `true` if the first loop is wholly contained within the second loop's
 * boundary. 
 * 
 * * precondition: the loop must either wholly contained inside the loop or be
 *   wholly outside.
 * 
 * * we use this intermediate function to ensure the second loop still has its
 *   original beziers so no floating point issues arise
 * 
 * @param loop1
 * @param bezierPieces
 */
function isLoopInLoop(
        expMax: number,
        loop1: number[][][],
        loop2: number[][][]): boolean {

    return _isLoopInLoop(
        expMax,
        loop1,
        loop2.map((ps): BezierPiece => ({ ps, ts: [0,1] }))
    );
}


export { isLoopInLoop, _isLoopInLoop, isPointInLoop, bezierPiecesToBeziers$ }
