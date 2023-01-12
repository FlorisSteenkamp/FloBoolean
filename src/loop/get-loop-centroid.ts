import { toPowerBasis, toPowerBasis_1stDerivative } from "flo-bezier3";
import { Horner, multiply, integrate } from 'flo-poly';
import { Loop } from "./loop.js";
import { getLoopArea } from "./get-loop-area.js";


/** 
 * Returns the approximate centroid of the given loop
 * 
 * * **precondition**: loop must be a jordan curve (i.e. closed and simple)
 * 
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 */
function getLoopCentroid(loop: Loop) {
    const A = getLoopArea(loop);

    let cx = 0;
    let cy = 0;
    for (const curve of loop.curves) {
        const ps = curve.ps;

        const [x,y] = toPowerBasis(ps);
        const [dx,dy] = toPowerBasis_1stDerivative(ps);

        const polyX = integrate(multiply(multiply(x, x), dy), 0);
        const polyY = integrate(multiply(multiply(y, y), dx), 0);

        const _x = Horner(polyX, 1);
        const _y = Horner(polyY, 1);

        cx += _x;
        cy += _y;
    }

    const a = 1/(2*A);

    return [-a*cx, a*cy];
}


export { getLoopCentroid }
