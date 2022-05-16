import { toPowerBasis, toPowerBasis_1stDerivative } from "flo-bezier3";
import { Horner, multiply, integrate } from 'flo-poly';
import { getLoopArea } from "./get-loop-area.js";
/**
 * Returns the approximate centroid of the given loop
 *
 * * **precondition**: loop must be a jordan curve (i.e. closed and simple)
 *
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 */
function getLoopCentroid(loop) {
    let A = getLoopArea(loop);
    let cx = 0;
    let cy = 0;
    for (let curve of loop.curves) {
        let ps = curve.ps;
        let [x, y] = toPowerBasis(ps);
        let [dx, dy] = toPowerBasis_1stDerivative(ps);
        const polyX = integrate(multiply(multiply(x, x), dy), 0);
        const polyY = integrate(multiply(multiply(y, y), dx), 0);
        let _x = Horner(polyX, 1);
        let _y = Horner(polyY, 1);
        cx += _x;
        cy += _y;
    }
    let a = 1 / (2 * A);
    return [-a * cx, a * cy];
}
export { getLoopCentroid };
//# sourceMappingURL=get-loop-centroid.js.map