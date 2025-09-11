import { toPowerBasis, toPowerBasis_1stDerivative } from "flo-bezier3";
import { multiply, Horner, integrate } from 'flo-poly';
const { abs } = Math;
/**
 * Returns the moment of inertia of the given shape (Ixx and Iyy).
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
function getMomentOfInertia(pss) {
    let cx = 0;
    let cy = 0;
    for (const ps of pss) {
        const [x, y] = toPowerBasis(ps);
        const [dx, dy] = toPowerBasis_1stDerivative(ps);
        const polyX = integrate(multiply(multiply(multiply(y, y), x), dy), 0);
        const polyY = integrate(multiply(multiply(multiply(x, x), y), dx), 0);
        const x_ = Horner(polyX, 1);
        const y_ = Horner(polyY, 1);
        cx += x_;
        cy += y_;
    }
    return [abs(cx), abs(cy)];
}
/**
 * Returns the product moment of inertia `[Ixy, Iyx]` of the given shape.
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
function getProdMomentOfInertia(pss) {
    let cXY = 0;
    let cYX = 0;
    for (const ps of pss) {
        const [x, y] = toPowerBasis(ps);
        const [dx, dy] = toPowerBasis_1stDerivative(ps);
        const polyXY = integrate(multiply(multiply(multiply(y, x), x), dy), 0);
        const polyYX = integrate(multiply(multiply(multiply(x, y), y), dx), 0);
        const xy = Horner(polyXY, 1);
        const yx = Horner(polyYX, 1);
        cXY += xy;
        cYX += yx;
    }
    return [cXY / 2, cYX / 2];
}
export { getMomentOfInertia, getProdMomentOfInertia };
// Quokka tests
// import { dot, rotate } from "flo-vector2d";
// import { degToRad, radToDeg } from '../svg/circle-to-cubic-beziers.js';
// import { getShapeCentroid } from './get-loop-centroid.js';
// import { allRootsCertifiedSimplified } from 'flo-poly';
// const { PI, atan2, sin, cos } = Math;
// function reverseBeziers(pss: number[][][]) {
//     return pss.map(ps => ps.toReversed()).toReversed();
// }
// {
//     //----------------
//     // Some rectangle
//     //----------------
//     const pss: number[][][] = reverseBeziers([
//         [[0,0], [0,8]],
//         [[0,8], [1,8]],
//         [[1,8], [1,0]],
//         [[1,0], [0,0]]
//     ]);
//     const c = getShapeCentroid(pss);
//     const pss_ = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));
//     const [Ixx, Iyy] = getMomentOfInertia(pss_);//?
//     // As https://en.wikipedia.org/wiki/List_of_second_moments_of_area
//     const Ixx_ = (1*(8**3))/12;//?
//     const Iyy_ = ((1**3)*8)/12;//?
// }
// {
//     //-------------
//     // Unit circle
//     //-------------
//     const C = 0.5519150244935105707435627
//     const pss = reverseBeziers([
//         [[0,1], [C,1], [1,C], [1,0]],  // quarter circle
//         [[1,0], [1,-C], [C,-1], [0,-1]],
//         [[0,-1], [-C,-1], [-1,-C], [-1,0]],
//         [[-1,0], [-1,C], [-C,1], [0,1]],
//     ]);
//     const c = getShapeCentroid(pss);
//     const pss_ = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));
//     const [Ixx, Iyy] = getMomentOfInertia(pss_);//?
//     // As https://en.wikipedia.org/wiki/List_of_second_moments_of_area
//     const Ixx_ = PI/4;//?
//     const Iyy_ = PI/4;//?
// }
// {
//     //--------------
//     // Some ellipse
//     //--------------
//     const C = 0.5519150244935105707435627
//     const pss = reverseBeziers([
//         [[0,1], [C/3,1], [1/3,C], [1/3,0]],  // quarter circle
//         [[1/3,0], [1/3,-C], [C/3,-1], [0,-1]],
//         [[0,-1], [-C/3,-1], [-1/3,-C], [-1/3,0]],
//         [[-1/3,0], [-1/3,C], [-C/3,1], [0,1]],
//     ]);
//     const c = getShapeCentroid(pss);
//     const pss_ = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));
//     const [Ixx, Iyy] = getMomentOfInertia(pss_);//?
//     // As https://en.wikipedia.org/wiki/List_of_second_moments_of_area
//     const Ixx_ = (PI/4)*(1/3)*(1**3);//?
//     const Iyy_ = (PI/4)*((1/3)**3)*(1);//?
// }
// {
//     //--------
//     // Square
//     //--------
//     const pss: number[][][] = reverseBeziers([
//         [[0,0], [0,1]],
//         [[0,1], [1,1]],
//         [[1,1], [1,0]],
//         [[1,0], [0,0]]
//     ]);
//     const c = getShapeCentroid(pss);
//     const pss_ = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));
//     const [Ixx, Iyy] = getMomentOfInertia(pss_);//?
//     const Ixx_ = 1/12;//?
//     const Iyy_ = 1/12;//?
// }
//# sourceMappingURL=get-moment-of-inertia.js.map