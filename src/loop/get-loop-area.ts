
import { getXY, getDxy } from "flo-bezier3";
import { gaussQuadrature } from 'flo-gauss-quadrature';
import { multiply, add, negate, Horner as evaluatePoly } from 'flo-poly';
import { Loop } from "./loop";


/** 
 * Returns the area of the given Loop.
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 */
function getLoopArea(loop: Loop) {
    let totalArea = 0;
    for (let curve of loop.curves) {
        let ps = curve.ps;

        let [x,y] = getXY(ps);
        let [dx,dy] = getDxy(ps);

        // xy' named as xy_
        let xdy = multiply(x, dy);
        let ydx = negate(multiply(y, dx));

        let poly = add(xdy, ydx);
        let f = (x: number) => evaluatePoly(poly, x);
        // TODO - why not calculate directly (it's just a poly)?😳
        let area = gaussQuadrature(f, [0,1], 16);

        totalArea += area;
    }

    return -totalArea / 2;
}


export { getLoopArea }
