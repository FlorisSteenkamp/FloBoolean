import { sweepLine } from '../sweep-line/sweep-line.js';
import { getCurvesIntersections } from './get-curves-intersections.js';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';
/**
 * Find and return all one-sided intersections on all given loops as a map from
 * each curve to an array of intersections on the curve, ordered by `t` value.
 *
 * @param loops
 */
function getIntersections(loops, expMax) {
    const curves = [];
    for (const loop of loops) {
        for (const curve of loop.curves) {
            curves.push(curve);
        }
    }
    // Filter curves so that we eliminate those that can definitely not intersect
    const rs = sweepLine(curves, curve => getBoundingBox$(curve.ps)[0][0], curve => getBoundingBox$(curve.ps)[1][0], getCurvesIntersections(expMax));
    const xs = [];
    for (const r of rs) {
        for (const xPair of r.u) {
            xs.push(xPair);
        }
    }
    return xs;
}
export { getIntersections };
//# sourceMappingURL=get-intersections.js.map