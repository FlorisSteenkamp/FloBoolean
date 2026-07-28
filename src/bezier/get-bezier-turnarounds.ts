import { toPowerBasis_1stDerivativeDd } from "flo-bezier3";
import { roots } from "flo-poly";
import { toP } from "../utils/to-p.js";


function getBezierTurnarounds(
        ps: number[][]) {

    // if (ps.length === 2) { return minY; }  // It's a line

    const [dx,dy] = toPowerBasis_1stDerivativeDd(ps);

    const rootsX = roots(dx,0,1) || [];
    const rootsY = roots(dy,0,1) || [];

    const turnaroundXs = rootsX.map(
        r => ({ t: r.t, p: toP(ps, r.t) })
    );

    const turnaroundYs = rootsY.map(
        r => ({ t: r.t, p: toP(ps, r.t) })
    );

    return { turnaroundXs, turnaroundYs };
}


export { getBezierTurnarounds }
