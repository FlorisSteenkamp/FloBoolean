import { toPowerBasis_1stDerivative_46_O } from './to-power-basis-1st-derivative-dd-46-o.js';
import { roots } from "flo-poly";


function getBezierTurnarounds(
        ps: number[][]) {

    if (ps.length === 2) { return []; }  // It's a line

    const [dx,dy] = toPowerBasis_1stDerivative_46_O(ps);

    const rootsX = roots(dx, 0, 1) || [];
    const rootsY = roots(dy, 0, 1) || [];

    return [...rootsX, ...rootsY];
}


export { getBezierTurnarounds }
