import type { Loop } from "./loop.js";
import { toPowerBasis, toPowerBasis_1stDerivative } from "flo-bezier3";
import { multiply, add, negate, Horner, integrate } from 'flo-poly';


/** 
 * Returns the area of the given Loop.
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 */
function getLoopArea(loop: Loop) {
    let totalArea = 0;
    for (const curve of loop.curves) {
        const ps = curve.ps;

        const [x,y] = toPowerBasis(ps);
        const [dx,dy] = toPowerBasis_1stDerivative(ps);

        const xdy = multiply(x, dy);
        const ydx = negate(multiply(y, dx));

        const poly = integrate(add(xdy, ydx), 0);
        const area = Horner(poly, 1);

        totalArea += area;
    }

    return -totalArea / 2;
}


export { getLoopArea }
