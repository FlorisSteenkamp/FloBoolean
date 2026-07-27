import type { __X__ } from './-x-.js';
import type { Loop } from '../loop/loop.js';
import type { Curve } from '../curve/curve.js';
import { sweepLine } from '../sweep-line/sweep-line.js';
import { getCurvesIntersections } from './get-curves-intersections.js';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';


/**
 * Find and return all one-sided intersections on all given loops as a map from 
 * each curve to an array of intersections on the curve, ordered by `t` value.
 * 
 * @param loops 
 */
function getIntersections(
        loops: Loop[], 
        expMax: number): [__X__,__X__][] {

    const curves: Curve[] = [];
    for (const loop of loops) {
        for (const curve of loop.curves) {
            curves.push(curve)
        }
    }

    // Filter curves so that we eliminate those that can definitely not intersect
    const rs = sweepLine(
        curves, 
        curve => getBoundingBox$(curve.ps)[0][0],
        curve => getBoundingBox$(curve.ps)[1][0],
        getCurvesIntersections(expMax)
    );

    const xs: [__X__,__X__][] = [];
    for (const r of rs) {
        for (const xPair of r.u!) {
            xs.push(xPair);
        }
    }

    return xs;
}


export { getIntersections }
