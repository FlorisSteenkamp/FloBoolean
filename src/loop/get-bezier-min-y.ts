import { roots } from 'flo-poly';
import { getIntervalBox, toPowerBasis_1stDerivativeDd } from 'flo-bezier3';
import { toP } from '../utils/to-p.js';


/**
 * Returns the minimum y-coordinate (point and `t` value) of the given bezier
 * curve.
 * 
 * @param ps an order 1, 2 or 3 bezier curve given as an array of control 
 * points, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 * 
 * @doc mdx
 */
 function getBezierMinY(
        ps: number[][]) {

    const pS = ps[0];
    const pE = ps[ps.length-1];

    let minY: { t: number; p: number[]; };
    if (pS[1] < pE[1]) {
        minY = { t: 0, p: pS };
    } else {
        minY = { t: 1, p: pE };
    }

    if (ps.length === 2) { return minY; }  // It's a line

    const [,dy] = toPowerBasis_1stDerivativeDd(ps);
    const rootsY = roots(dy,0,1) || [];

    // Test points
    for (let i=0; i<rootsY.length; i++) {
        const { tS, tE, t } = rootsY[i];
        const ts = [tS, tE];
        const box = getIntervalBox(ps, ts);

        if (box[0][1] < minY.p[1]) { 
            const p = toP(ps, t);
            minY = { t, p };
        }
    }

    return minY;
}


export { getBezierMinY }
