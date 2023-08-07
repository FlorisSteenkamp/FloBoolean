import { curvature, getCurvatureExtrema } from "flo-bezier3";
import { __X__ } from "../-x-";
import { Loop } from "../loop/loop";
import { makeSimpleX } from "./make-simple-x.js";


const { abs } = Math;


function getExcessiveCurvatures(
        expMax: number,
        loops: Loop[]): __X__[][] {

    /** all one-sided Xs from */
    const xs: __X__[][] = [];
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
                if (k > 10_000_000*2**-expMax) {
                    xs.push([
                        makeSimpleX(t,curve,7),  // excessive curvature
                        makeSimpleX(t,curve,7),  // excessive curvature
                    ]);
                }
            }
        }
    } 

    return xs;
}


export { getExcessiveCurvatures }
