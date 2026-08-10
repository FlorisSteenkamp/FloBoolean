import type { _X_ } from "./-x-.js";
import type { Loop } from "../shape/loop.js";
import { curvature, getCurvatureExtrema } from "flo-bezier3";
import { makeSimpleX } from "./make-simple-x.js";

const { abs } = Math;


function getExcessiveCurvatures(
        expMax: number,
        loops: Loop[]): [_X_,_X_][] {

    /** all one-sided Xs from */
    const xs: [_X_,_X_][] = [];
    // return xs;

    // Get interface points
    for (const loop of loops) {
        for (const curve of loop.curves) {
            const ps = curve.ps;

            const extrema = getCurvatureExtrema(ps);

            const { minima, maxima } = extrema;
            const minmaxs = [0,1,...minima, ...maxima];
            for (let t of minmaxs) {
                //const k = eeCurvature(ps,[t]);
                const k = abs(curvature(ps, t));
                if (k > 10_000_000*2**-expMax) {  // TODO - check curvature max
                    const _x_ = makeSimpleX(t,curve,7);  // excessive curvature
                    xs.push([
                        _x_,
                        { ..._x_ }
                    ]);
                }
            }
        }
    } 

    return xs;
}


export { getExcessiveCurvatures }
