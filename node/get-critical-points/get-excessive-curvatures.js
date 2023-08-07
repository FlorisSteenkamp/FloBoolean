import { curvature, getCurvatureExtrema } from "flo-bezier3";
import { makeSimpleX } from "./make-simple-x.js";
const { abs } = Math;
function getExcessiveCurvatures(expMax, loops) {
    /** all one-sided Xs from */
    const xs = [];
    // return xs;
    // Get interface points
    for (const loop of loops) {
        for (const curve of loop.curves) {
            const ps = curve.ps;
            const extrema = getCurvatureExtrema(ps);
            const { minima, maxima } = extrema;
            const minmaxs = [0, 1, ...minima, ...maxima];
            for (let t of minmaxs) {
                //const k = eeCurvature(ps,[t]);
                const k = abs(curvature(ps, t));
                if (k > 10000000 * 2 ** -expMax) {
                    xs.push([
                        makeSimpleX(t, curve, 7),
                        makeSimpleX(t, curve, 7), // excessive curvature
                    ]);
                }
            }
        }
    }
    return xs;
}
export { getExcessiveCurvatures };
//# sourceMappingURL=get-excessive-curvatures.js.map