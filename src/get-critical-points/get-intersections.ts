import { _X_ } from '../x';
import { Loop } from '../loop/loop';
import { Curve } from '../curve/curve';
import { sweepLine } from '../sweep-line/sweep-line';
import { getCurvesIntersections } from './get-curves-intersections';
import { getBoundingBox_ } from '../get-bounding-box-';


/**
 * Find and return all one-sided intersections on all given loops as a map from 
 * each curve to an array of intersections on the curve, ordered by t value.
 * @param loops 
 */
function getIntersections(
        loops: Loop[], 
        expMax: number): _X_[][] {

    let curves: Curve[] = [];
    for (let loop of loops) { for (let curve of loop.curves) {
        curves.push(curve)
    }};

    // Filter curves so that we eliminate those that can definitely not intersect
    let _xs = sweepLine(
        curves, 
        curve => getBoundingBox_(curve.ps)[0][0],
        curve => getBoundingBox_(curve.ps)[1][0],
        getCurvesIntersections(expMax)
    );

    let xs: _X_[][] = [];
    for (let _x of _xs) {
        for (let x of _x.u) {
            xs.push(x);
        }
    }

    return xs;
}


export { getIntersections }
