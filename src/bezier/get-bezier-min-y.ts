import type { X } from '../get-critical-points/x.js';
import { createRootExact, roots } from 'flo-poly';
import { toP } from '../utils/to-p.js';
import { toPowerBasis_1stDerivative_46_O } from './to-power-basis-1st-derivative-dd-46-o.js';


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
        ps: number[][]): X {

    const pS = ps[0];
    const pE = ps[ps.length-1];

    let minY: X = pS[1] < pE[1]
        ? { ri: createRootExact(0), p: pS, kind: 0 }
        : { ri: createRootExact(1), p: pE, kind: 0 };

    if (ps.length === 2) {
        // It's a line

        if (pS[1] === pE[1]) {
            // so that forward and reverse bezier have the same minY point
            const p = [(pS[0] + pE[0])/2, (pS[1] + pE[1])/2];
            return { ri: createRootExact(0.5), p, kind: 0 };
        }

        return minY;
    }

    const [,dy] = toPowerBasis_1stDerivative_46_O(ps);
    const ris = roots(dy,0,1) || [];

    // Test points
    for (let i=0; i<ris.length; i++) {
        const ri = ris[i];
        const p = toP(ps, ri.t);

        if (p[1] < minY.p[1]) {
            minY = { ri, p, kind: 0 };
        }
    }

    return minY;
}


export { getBezierMinY }
