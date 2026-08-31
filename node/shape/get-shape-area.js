import { memoize } from "flo-memoize";
/**
 * Returns the signed winding number weighted area of the given shape.
 *
 * * also useful for finding the orientation of loops
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
const getShapeArea$ = memoize(function (shape) {
    let twiceArea = 0;
    for (const ps of shape) {
        // weights are ∫₀¹ (Bᵢ Bⱼ' − Bᵢ' Bⱼ) dt over the Bernstein basis
        switch (ps.length) {
            case 2: // line
                twiceArea += cross(ps, 0, 1);
                break;
            case 3: // quadratic
                twiceArea +=
                    (2 * cross(ps, 0, 1) +
                        cross(ps, 0, 2) +
                        2 * cross(ps, 1, 2)) / 3;
                break;
            case 4: // cubic
                twiceArea +=
                    (6 * cross(ps, 0, 1) +
                        3 * cross(ps, 0, 2) +
                        cross(ps, 0, 3) +
                        3 * cross(ps, 1, 2) +
                        3 * cross(ps, 1, 3) +
                        6 * cross(ps, 2, 3)) / 10;
                break;
        }
    }
    return twiceArea / 2;
});
// `x_i·y_j - x_j·y_i` for control points `i`,`j` of a piece
function cross(ps, i, j) {
    return ps[i][0] * ps[j][1] - ps[j][0] * ps[i][1];
}
/**
 * @deprecated This function is deprecated. Use `getShapeArea` instead.
 *
 * Returns the area of the given Loop.
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 */
function getLoopArea(loop) {
    return getShapeArea$(loop.beziers);
}
export { getLoopArea, getShapeArea$ };
// import { toPowerBasis, toPowerBasis_1stDerivative } from "flo-bezier3";
// import { multiply, add, negate, Horner, integrate } from 'flo-poly';
/**
 * THIS FUNCTION WAS REPLACED BY A MORE ACCURATE ONE
 *
 * Returns the area of the given shape.
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
// function getShapeArea(
//         shape: (number[][])[]) {
//     let totalArea = 0;
//     for (const ps of shape) {
//         const [x,y] = toPowerBasis(ps);
//         const [dx,dy] = toPowerBasis_1stDerivative(ps);
//         const xdy = multiply(x, dy);
//         const ydx = negate(multiply(y, dx));
//         const poly = integrate(add(xdy, ydx), 0);
//         const area = Horner(poly, 1);
//         totalArea += area;
//     }
//     return totalArea / 2;
// }
//# sourceMappingURL=get-shape-area.js.map