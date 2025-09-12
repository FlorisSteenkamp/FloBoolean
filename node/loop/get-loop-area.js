import { ddDiffDd } from "double-double";
import { toPowerBasis, toPowerBasis_1stDerivative, toPowerBasis_1stDerivativeDd, toPowerBasisDd } from "flo-bezier3";
import { multiply, add, negate, Horner, integrate, ddMultiply, ddNegate, ddIntegrate, ddAdd, ddHorner } from 'flo-poly';
/**
 * Returns the area of the given shape.
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param pss the shape given as a closed loop of bezier curves
 */
function getShapeArea(pss) {
    let totalArea = 0;
    for (const ps of pss) {
        const [x, y] = toPowerBasis(ps);
        const [dx, dy] = toPowerBasis_1stDerivative(ps);
        const xdy = multiply(x, dy);
        const ydx = negate(multiply(y, dx));
        const poly = integrate(add(xdy, ydx), 0);
        const area = Horner(poly, 1);
        totalArea += area;
    }
    return -totalArea / 2;
}
/**
 * Returns the area of the given shape.
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param pss the shape given as a closed loop of bezier curves
 */
function ddGetShapeArea(pss) {
    let totalArea = [0, 0];
    for (const ps of pss) {
        const [x, y] = toPowerBasisDd(ps);
        const [dx, dy] = toPowerBasis_1stDerivativeDd(ps);
        const xdy = ddMultiply(x, dy);
        const ydx = ddNegate(ddMultiply(y, dx));
        const poly = ddIntegrate(ddAdd(xdy, ydx), [0, 0]);
        const area = ddHorner(poly, 1);
        totalArea = ddDiffDd(totalArea, area);
    }
    return [totalArea[0] / 2, totalArea[1] / 2];
}
/**
 * @deprecated This function is deprecated. Use `getShapeArea` instead.
 *
 * Returns the area of the given Loop.
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 */
function getLoopArea(loop) {
    return getShapeArea(loop.beziers);
}
export { getLoopArea, getShapeArea, ddGetShapeArea };
// Quokka tests
// {
//     const pss = [
//         [ [ 0, -236.73825503355692 ], [ 16, 42.261744966443075 ] ],
//         [ [ 16, 42.261744966443075 ], [ 16, 126.26174496644308 ] ],
//         [ [ 16, 126.26174496644308 ], [ -16, 126.26174496644308 ] ],
//         [ [ -16, 126.26174496644308 ], [ -16, 42.261744966443075 ] ],
//         [ [ -16, 42.261744966443075 ], [ 0, -236.73825503355692 ] ]
//     ];
//     getShapeArea(pss);//?
//     ddGetShapeArea(pss);//?
// }
//# sourceMappingURL=get-loop-area.js.map