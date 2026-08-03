import { ddAddDd } from "double-double";
import { toPowerBasis, toPowerBasis_1stDerivative, toPowerBasis_1stDerivativeDd, toPowerBasisDd } from "flo-bezier3";
import { multiply, add, negate, Horner, integrate, ddMultiply, ddNegate, ddIntegrate, ddAdd, ddHorner } from 'flo-poly';
/**
 * Returns the area of the given shape.
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
function getShapeArea(shape) {
    let totalArea = 0;
    for (const ps of shape) {
        const [x, y] = toPowerBasis(ps);
        const [dx, dy] = toPowerBasis_1stDerivative(ps);
        const xdy = multiply(x, dy);
        const ydx = negate(multiply(y, dx));
        const poly = integrate(add(xdy, ydx), 0);
        const area = Horner(poly, 1);
        totalArea += area;
    }
    return totalArea / 2;
}
/**
 * Returns the area of the given shape.
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
function ddGetShapeArea(shape) {
    let totalArea = [0, 0];
    for (const ps of shape) {
        const [x, y] = toPowerBasisDd(ps);
        const [dx, dy] = toPowerBasis_1stDerivativeDd(ps);
        const xdy = ddMultiply(x, dy);
        const ydx = ddNegate(ddMultiply(y, dx));
        const poly = ddIntegrate(ddAdd(xdy, ydx), [0, 0]);
        const area = ddHorner(poly, 1);
        totalArea = ddAddDd(totalArea, area);
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
//# sourceMappingURL=get-shape-area.js.map