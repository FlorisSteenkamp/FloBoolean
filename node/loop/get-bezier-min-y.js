import { roots } from 'flo-poly';
import { evalDeCasteljauDd, getIntervalBox, toPowerBasis_1stDerivativeDd } from 'flo-bezier3';
/**
 * Returns tight y-coordinate bounds of the given bezier curve.
 *
 * @param ps an order 1, 2 or 3 bezier curve given as an array of control
 * points, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 *
 * @doc mdx
 */
function getBezierMinY(ps) {
    const pS = ps[0];
    const pE = ps[ps.length - 1];
    let minY;
    if (pS[1] < pE[1]) {
        minY = { t: 0, p: pS };
    }
    else {
        minY = { t: 1, p: pE };
    }
    if (ps.length === 2) {
        return minY;
    }
    const [, dy] = toPowerBasis_1stDerivativeDd(ps);
    const rootsY = roots(dy, 0, 1) || [];
    // Test points
    for (let i = 0; i < rootsY.length; i++) {
        const { tS, tE, t } = rootsY[i];
        const ts = [tS, tE];
        const box = getIntervalBox(ps, ts);
        if (box[0][1] < minY.p[1]) {
            minY = { t, p: evalDeCasteljauDd(ps, [0, t]).map(c => c[1]) };
        }
    }
    return minY;
}
export { getBezierMinY };
//# sourceMappingURL=get-bezier-min-y.js.map