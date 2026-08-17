declare const _debug_: Debug; 
import type { Debug } from '../debug/debug.js';
import { roots } from 'flo-poly';
import { toPowerBasis } from 'flo-bezier3';
import { translate } from 'flo-vector2d';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';
import { squares } from 'squares-rng';
import { toP } from '../utils/to-p.js';
import { isLoopNotInLoop } from './is-loop-not-in-loop.js';
import { timeFunctionCalls } from '../utils/time-function-call.js';
import { getCandidates } from './get-candidates.js';


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
const isLoopInLoop = timeFunctionCalls(function isLoopInLoop(
        loop1: number[][][],
        loop2: number[][][]): boolean {

    if (typeof _debug_ !== 'undefined') { _debug_.callCounts.lil1++; }

    if (isLoopNotInLoop(loop1, loop2)) {
        return false;
    }

    const p = loop1[0][0];  // choose any point
    const count = getAxisAlignedRayLoopIntersections(loop2, p);
    if (count !== undefined) {
        return count%2 !== 0;
    }
    
    return false;


    // if (typeof _debug_ !== 'undefined') { _debug_.callCounts.lil1++; }

    // let i = 0;
    // do {
    //     i++;

    //     const idx = squares(i)%loop1.length;
    //     // const idx = i;
    //     const ps = loop1[idx];
    //     const p = ps[0];

    //     const r = f(loop1, loop2, p);
        
    //     if (r !== undefined) {
    //         return r;
    //     }
    // } while (i < 100);

    // return true;   // we shouldn't get here


    // function f(
    //         loop1: number[][][],
    //         loop2: number[][][],
    //         p: number[]) {

    //     if (isLoopNotInLoop(loop1, loop2)) {
    //         return false;
    //     }

    //     const count = getAxisAlignedRayLoopIntersections(loop2, p);
    //     if (count !== undefined) { return count%2 !== 0; }
    // }
});


/**
 * Returns the number of times an axis-aligned ray from `p` crosses the loop,
 * or `undefined` if a curve lies collinear with the ray (an ambiguous case the
 * caller resolves by retrying from another point).
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
        loop: number[][][],
        p: number[]): number | undefined {

    if (typeof _debug_ !== 'undefined') { _debug_.callCounts.lil2++; }

    const [x,y] = p;
    const candidates = getCandidates(loop, y);

    let count = 0;
    for (let i=0; i<candidates.length; i++) {
        if (typeof _debug_ !== 'undefined') { _debug_.callCounts.lil3++; }

        const ps = candidates[i];

        // Check if ray origin is to right of bezier bounding box
        const minX = getBoundingBox$(ps)[0][0];
        if (minX > x) { continue; }

        if (typeof _debug_ !== 'undefined') { _debug_.callCounts.lil4++; }

        //------------------------------------------------------/
        //----------- Count ray crossings on bezier ------------/
        //------------------------------------------------------/
        // Roots of the coordinate perpendicular to the ray give the parameter
        // values where the curve meets the ray's (infinite) line.
        const translatedPs = ps.map(translate([0,-y]));
        const poly = toPowerBasis(translatedPs)[1];

        const rs = roots(poly, 0, 1);
        if (rs === undefined) {
            // The curve is collinear with the ray - the crossing count is
            // ambiguous; let the caller retry from another point.
            return undefined;
        }

        for (const r of rs) {
            const t = r.t;
            if (t < 0 || t >= 1) { continue; }  // half-open [0,1): vertex owned once

            const along = toP(ps, t)[0];
            const onRaySide = p[0] >= along;

            // odd multiplicity = transversal crossing, even = tangential touch
            if (onRaySide) { count += r.multiplicity % 2; }
        }
    }

    return count;
});


export { isLoopInLoop }
