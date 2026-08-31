import { curvature, getCurvatureExtrema } from "flo-bezier3";
import { makeSimpleX } from "./make-simple-x.js";
const { abs } = Math;
const MAX_CURVATURE_AT_EXP_MAX_0 = 10_000_000;
function getExcessiveCurvatures(expMax, loops) {
    const xs = [];
    const maxCurvature = MAX_CURVATURE_AT_EXP_MAX_0 * (2 ** -expMax);
    // Get points of extreme curvature
    for (const loop of loops) {
        for (const curve of loop.curves) {
            const { ps } = curve;
            const extrema = getCurvatureExtrema(ps);
            const { minima, maxima } = extrema;
            const minmaxs = [0, 1, ...minima, ...maxima];
            for (let t of minmaxs) {
                const k = abs(curvature(ps, t));
                if (k > maxCurvature) {
                    const xA = makeSimpleX(t, curve, 7); // excessive curvature
                    const xB = makeSimpleX(t, curve, 7); // ...
                    xs.push([xA, xB]);
                }
            }
        }
    }
    return xs;
}
export { getExcessiveCurvatures };
//# sourceMappingURL=get-excessive-curvatures.js.map