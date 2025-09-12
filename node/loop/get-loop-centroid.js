import { toPowerBasis, toPowerBasis_1stDerivative, toPowerBasis_1stDerivativeDd, toPowerBasisDd } from "flo-bezier3";
import { Horner, multiply, integrate, ddIntegrate, ddMultiply, ddHorner } from 'flo-poly';
import { ddGetShapeArea, getShapeArea } from "./get-loop-area.js";
import { ddAddDd, ddDivDd, ddMultBy2, ddMultDd } from "double-double";
/**
 * Returns the approximate centroid of the given shape.
 *
 * * **precondition**: shape must be a jordan curve (i.e. closed and simple)
 * * intermediate calculations are done in double-double precision
 *
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 */
function getShapeCentroid(pss) {
    const A = getShapeArea(pss);
    let cx = 0;
    let cy = 0;
    for (const ps of pss) {
        const [x, y] = toPowerBasis(ps);
        const [dx, dy] = toPowerBasis_1stDerivative(ps);
        const polyX = integrate(multiply(multiply(x, x), dy), 0); // First moment of inertia
        const polyY = integrate(multiply(multiply(y, y), dx), 0); // First moment of inertia
        const _x = Horner(polyX, 1);
        const _y = Horner(polyY, 1);
        cx += _x;
        cy += _y;
    }
    const a = 1 / (2 * A);
    return [-a * cx, a * cy];
}
/**
 * Returns the approximate centroid of the given shape.
 *
 * * **precondition**: shape must be a jordan curve (i.e. closed and simple)
 * * intermediate calculations are done in double-double precision
 *
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 */
function ddGetShapeCentroid(pss) {
    const A = ddGetShapeArea(pss);
    const A2 = ddMultBy2(A);
    let cx = [0, 0];
    let cy = [0, 0];
    for (const ps of pss) {
        const [x, y] = toPowerBasisDd(ps);
        const [dx, dy] = toPowerBasis_1stDerivativeDd(ps);
        const polyX = ddIntegrate(ddMultiply(ddMultiply(x, x), dy), [0, 0]); // First moment of inertia
        const polyY = ddIntegrate(ddMultiply(ddMultiply(y, y), dx), [0, 0]); // First moment of inertia
        const _x = ddHorner(polyX, 1);
        const _y = ddHorner(polyY, 1);
        cx = ddAddDd(cx, _x);
        cy = ddAddDd(cy, _y);
    }
    const CX = ddDivDd([0, -1], A2);
    const CY = ddDivDd([0, 1], A2);
    const X = ddMultDd(CX, cx);
    const Y = ddMultDd(CY, cy);
    return [X, Y];
}
/**
 * @deprecated This function is deprecated. Use `getShapeCentroid` instead.
 *
 * Returns the approximate centroid of the given loop
 *
 * * **precondition**: loop must be a jordan curve (i.e. closed and simple)
 *
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 */
function getLoopCentroid(loop) {
    return getShapeCentroid(loop.beziers);
}
export { getLoopCentroid, getShapeCentroid, ddGetShapeCentroid };
// Quokka tests
// {
//     const pss = [
//         [ [ 0, -236.73825503355692 ], [ 16, 42.261744966443075 ] ],
//         [ [ 16, 42.261744966443075 ], [ 16, 126.26174496644308 ] ],
//         [ [ 16, 126.26174496644308 ], [ -16, 126.26174496644308 ] ],
//         [ [ -16, 126.26174496644308 ], [ -16, 42.261744966443075 ] ],
//         [ [ -16, 42.261744966443075 ], [ 0, -236.73825503355692 ] ]
//     ];
//     getShapeCentroid(pss);//?
//     ddGetShapeCentroid(pss);//?
// }
//# sourceMappingURL=get-loop-centroid.js.map