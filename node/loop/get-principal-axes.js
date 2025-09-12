import { allRootsCertified, allRootsCertifiedSimplified } from 'flo-poly';
import { ddGet2ndMomentOfInertia, ddGetProdMomentOfInertia, get2ndMomentOfInertia, getProdMomentOfInertia } from "./get-2nd-moment-of-inertia.js";
import { reverseShapeOrientation } from "./reverse-shape-orientation.js";
import { getTotalShapeCurvature } from "./get-total-shape-curvature.js";
import { ddAddDd, ddDiffDd, ddMultDd, ddNegativeOf } from 'double-double';
const { abs } = Math;
/**
 * Returns the two principal axes of the shape (and some other data).
 *
 * * the returned `eigenValues` are the moments of inertia and the
 * `eigenVectors` are the axes direction vectors (relative to the X and Y axis)
 *
 * * the first axis returned will be the one with lower moment of inertia
 * (when rotating about it)
 *
 * * it can be useful to first move the shape's centroid to the origin, e.g.
 * ```
 * const C = getShapeCentroid(pss);
 * const pss_ = pss.map(ps => ps.map(p => [p[0] - C[0], p[1] - C[1]]));
 * ```
 *
 * @param pss_
 */
function getPrincipalAxes(pss) {
    const k = getTotalShapeCurvature(pss);
    // must be counter-clockwise
    const pss_ = k < 0 ? reverseShapeOrientation(pss) : pss;
    const [Ixx, Iyy] = get2ndMomentOfInertia(pss_);
    const Ixy = getProdMomentOfInertia(pss_);
    //-----------------------------------------------------------------------
    // Quick calc of eigenvalues and eigenvectors for matrix [[a,b],[c,d]]
    // using the matrix [[Ixx, Ixy],[Iyx, Iyy]]
    // see https://math.stackexchange.com/questions/395698/fast-way-to-calculate-eigen-of-2x2-matrix-using-a-formula
    //-----------------------------------------------------------------------
    let a = Ixx;
    let b = -Ixy;
    let c = b;
    let d = Iyy;
    const poly = [1, -(a + d), a * d - b * c];
    let v0;
    let v1;
    const roots = allRootsCertifiedSimplified(poly).map(r => (r.tS + r.tE) / 2);
    let r0 = roots[0]; // Eigenvalue 1
    let r1 = roots[1]; // Eigenvalue 2
    // allow for floating point roundoff
    // see e.g. https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html
    const Δ = 2 ** -40;
    // Note: b === c
    if ((abs(b) < Δ) || r1 === undefined) {
        if (Ixx < Iyy) {
            v0 = [1, 0]; // Eigenvector 1
            v1 = [0, 1]; // Eigenvector 2
            r0 = Ixx;
            r1 = Iyy;
        }
        else {
            v0 = [0, 1]; // Eigenvector 1
            v1 = [1, 0]; // Eigenvector 2
            r0 = Iyy;
            r1 = Ixx;
        }
    }
    else {
        // Relative errors are used to minimize floating point roundoff
        const rErrR0D = abs(r0 / (r0 - d));
        const rErrR0A = abs(r0 / (r0 - a));
        const rErrR1D = abs(r1 / (r1 - d));
        const rErrR1A = abs(r1 / (r1 - a));
        v0 = rErrR0A > rErrR0D
            ? [r0 - d, c]
            : [b, r0 - a]; /*?*/ // Eigenvector 1
        v1 = rErrR1A > rErrR1D
            ? [r1 - d, c]
            : [b, r1 - a]; /*?*/ // Eigenvector 2
    }
    return {
        eigenValues: [r0, r1],
        eigenVectors: [v0, v1]
    };
}
/**
 * Returns the two principal axes of the shape (and some other data).
 *
 * * the returned `eigenValues` are the moments of inertia and the
 * `eigenVectors` are the axes direction vectors (relative to the X and Y axis)
 *
 * * the first axis returned will be the one with lower moment of inertia
 * (when rotating about it)
 *
 * * it can be useful to first move the shape's centroid to the origin, e.g.
 * ```
 * const C = getShapeCentroid(pss);
 * const pss_ = pss.map(ps => ps.map(p => [p[0] - C[0], p[1] - C[1]]));
 * ```
 *
 * @param pss_
 */
function ddGetPrincipalAxes(pss) {
    const k = getTotalShapeCurvature(pss);
    // must be counter-clockwise
    const pss_ = k < 0 ? reverseShapeOrientation(pss) : pss;
    const [Ixx, Iyy] = ddGet2ndMomentOfInertia(pss_);
    const Ixy = ddGetProdMomentOfInertia(pss_);
    //-----------------------------------------------------------------------
    // Quick calc of eigenvalues and eigenvectors for matrix [[a,b],[c,d]]
    // using the matrix [[Ixx, Ixy],[Iyx, Iyy]]
    // see https://math.stackexchange.com/questions/395698/fast-way-to-calculate-eigen-of-2x2-matrix-using-a-formula
    //-----------------------------------------------------------------------
    let a = Ixx;
    let b = ddNegativeOf(Ixy);
    let c = b;
    let d = Iyy;
    // const poly = [1, -(a + d), a*d - b*c];
    const poly = [[0, 1], ddNegativeOf(ddAddDd(a, d)), ddDiffDd(ddMultDd(a, d), ddMultDd(b, c))];
    let v0;
    let v1;
    const roots = allRootsCertified(poly, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY).map(r => (r.tS + r.tE) / 2);
    let r0 = roots[0]; // Eigenvalue 1
    let r1 = roots[1]; // Eigenvalue 2
    // allow for floating point roundoff
    // see e.g. https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html
    const Δ = 2 ** -40;
    // Note: b === c
    // Too aligned or too round
    if ((abs(b[1]) < Δ) || r1 === undefined) {
        if (Ixx < Iyy) {
            v0 = [1, 0]; // Eigenvector 1
            v1 = [0, 1]; // Eigenvector 2
            r0 = Ixx[1];
            r1 = Iyy[1];
        }
        else {
            v0 = [0, 1]; // Eigenvector 1
            v1 = [1, 0]; // Eigenvector 2
            r0 = Iyy[1];
            r1 = Ixx[1];
        }
    }
    else {
        const rErrR0D = abs(r0 / (r0 - d[1]));
        const rErrR0A = abs(r0 / (r0 - a[1]));
        const rErrR1D = abs(r1 / (r1 - d[1]));
        const rErrR1A = abs(r1 / (r1 - a[1]));
        v0 = rErrR0A > rErrR0D
            ? [r0 - d[1], c[1]]
            : [b[1], r0 - a[1]]; // Eigenvector 1
        v1 = rErrR1A > rErrR1D
            ? [r1 - d[1], c[1]]
            : [b[1], r1 - a[1]]; // Eigenvector 2
    }
    return {
        eigenValues: [r0, r1],
        eigenVectors: [v0, v1]
    };
}
export { getPrincipalAxes, ddGetPrincipalAxes };
// Quokka tests
// import { degToRad, radToDeg } from '../svg/circle-to-cubic-beziers.js';
// import { dot, rotate } from "flo-vector2d";
// import { ddGetShapeCentroid, getShapeCentroid } from './get-loop-centroid.js';
// const { sin, cos, sqrt, atan2 } = Math;
// {
//     // const pss = ([
//     //     [ [ 206, 1093 ], [ 221, 1372 ] ],
//     //     [ [ 221, 1372 ], [ 221, 1456 ] ],
//     //     [ [ 221, 1456 ], [ 189, 1456 ] ],
//     //     [ [ 189, 1456 ], [ 189, 1372 ] ],
//     //     [ [ 189, 1372 ], [ 206, 1093 ] ]
//     // ]);
//     // const pss = [
//     //     [ [ -78.5, -268.26307130989994 ], [ 78.5, -268.26307130989994 ] ],
//     //     [ [ 78.5, -268.26307130989994 ], [ 94.5, 106.73692869010006 ] ],
//     //     [ [ 94.5, 106.73692869010006 ], [ 94.5, 250.73692869010006 ] ],
//     //     [ [ 94.5, 250.73692869010006 ], [ -94.5, 250.73692869010006 ] ],
//     //     [ [ -94.5, 250.73692869010006 ], [ -94.5, 106.73692869010006 ] ],
//     //     [ [ -94.5, 106.73692869010006 ], [ -78.5, -268.26307130989994 ] ]
//     // ];
//     const pss = [
//         [ [ 0, -236.73825503355692 ], [ 16, 42.261744966443075 ] ],
//         [ [ 16, 42.261744966443075 ], [ 16, 126.26174496644308 ] ],
//         [ [ 16, 126.26174496644308 ], [ -16, 126.26174496644308 ] ],
//         [ [ -16, 126.26174496644308 ], [ -16, 42.261744966443075 ] ],
//         [ [ -16, 42.261744966443075 ], [ 0, -236.73825503355692 ] ]
//     ];
//     const C = ddGetShapeCentroid(pss);//?
//     // const pss_ = pss.map(ps => ps.map(p => [p[0] - C[0], p[1] - C[1]]));
//     // for (let i=-180; i<=180; i += 10) {
//     const R = -10;
//     for (let i=R; i<=R; i += 10) {
//         const θ = i;
//         const sinθ = sin(degToRad(θ));
//         const cosθ = cos(degToRad(θ));
//         const rot = rotate(sinθ, cosθ);
//         const _pss_ = pss.map(ps => ps.map(rot));
//         const principalAxes = getPrincipalAxes(_pss_);
//         const principalAxes_ = ddGetPrincipalAxes(_pss_);
//         const { eigenValues, eigenVectors: [v1,v2] } = principalAxes;
//         const { eigenValues: eigenValues_, eigenVectors: [v1_,v2_] } = principalAxes_;
//         const θ0r = atan2(v1[1], v1[0]);
//         const θ1r = atan2(v2[1], v2[0]);
//         const dotProd = dot(v1,v2);//?
//         const θ0r_ = atan2(v1_[1], v1_[0]);
//         const θ1r_ = atan2(v2_[1], v2_[0]);
//         const dotProd_ = dot(v1_,v2_);//?
//         v1; //?
//         v1_;//?
//         v2; //?
//         v2_;//?
//         // eigenValues;//?
//         // const [θ1d,θ2d] = [θ0r,θ1r].map(radToDeg);//?
//         // const [θ1d_,θ2d_] = [θ0r_,θ1r_].map(radToDeg);//?
//         const θ0d = (radToDeg(θ0r) + 180)%180;//?
//         const θ1d = (radToDeg(θ1r) + 180)%180;//?
//         const θ0d_ = (radToDeg(θ0r_) + 180)%180;//?
//         const θ1d_ = (radToDeg(θ1r_) + 180)%180;//?
//         sqrt(eigenValues[1])/sqrt(eigenValues[0]);//?
//         // sqrt(eigenValues_[1])/sqrt(eigenValues_[0]);//?
//     }
// }
// {
//     //--------------
//     // Some ellipse
//     //--------------
//     const K = 0.5519150244935105707435627;
//     const F = 1;
//     const G = 1;
//     const pss = ([
//         [[0,1*G], [K*F,1*G], [1*F,K*G], [1*F,0]],  // quarter ellipse
//         [[1*F,0], [1*F,-K*G], [K*F,-1*G], [0,-1*G]],
//         [[0,-1*G], [-K*F,-1*G], [-1*F,-K*G], [-1*F,0]],
//         [[-1*F,0], [-1*F,K*G], [-K*F,1*G], [0,1*G]]
//     ]);
//     const pss_ = reverseShapeOrientation(pss);
//     for (let i=-180; i<=180; i += 10) {
//     // for (let i=-0; i<=180; i += 10) {
//     const R = 10;
//     // for (let i=R; i<=R; i += 10) {
//         const θ = i;//?
//         const sinθ = sin(degToRad(θ));
//         const cosθ = cos(degToRad(θ));
//         const rot = rotate(sinθ, cosθ);
//         const _pss_ = pss_.map(ps => ps.map(rot));
//         const principalAxes = getPrincipalAxes(_pss_);
//         const { eigenValues, eigenVectors: [v0,v1] } = principalAxes;
//         // eigenValues;//?
//         v0;//?
//         const θ0r = atan2(v0[1], v0[0]);
//         const θ1r = atan2(v1[1], v1[0]);
//         // const dotProd = dot(v0,v1);//?
//         // eigenValues;
//         // const [θ1d,θ2d] = [θ1r,θ2r].map(radToDeg);//?
//         const θ0d = (radToDeg(θ0r) + 180)%180;//?
//         const θ1d = (radToDeg(θ1r) + 180)%180;//?
//         sqrt(eigenValues[1])/sqrt(eigenValues[0]);//?
//     }
// }
// {
//     //--------------
//     // Some shape
//     //--------------
//     const K = 0.5519150244935105707435627;
//     const F = 100;
//     const G = 2;
//     const pss = ([
//         [
//             [ -199.67698673219854, -273.43191208212966 ],
//             [ 198.32301326780146, -273.43191208212966 ]
//         ],
//         [
//             [ 198.32301326780146, -273.43191208212966 ],
//             [ 209.32301326780146, 82.56808791787034 ]
//         ],
//         [
//             [ 209.32301326780146, 82.56808791787034 ],
//             [ 209.32301326780146, 268.56808791787034 ]
//         ],
//         [
//             [ 209.32301326780146, 268.56808791787034 ],
//             [ -208.67698673219854, 268.56808791787034 ]
//         ],
//         [
//             [ -208.67698673219854, 268.56808791787034 ],
//             [ -208.67698673219854, 82.56808791787034 ]
//         ],
//         [
//             [ -208.67698673219854, 82.56808791787034 ],
//             [ -199.67698673219854, -273.43191208212966 ]
//         ]
//     ]);
//     // for (let i=-180; i<=180; i += 10) {
//     for (let i=-0; i<=0; i += 10) {
//         const θ = i;
//         const sinθ = sin(degToRad(θ));
//         const cosθ = cos(degToRad(θ));
//         const rot = rotate(sinθ, cosθ);
//         const _pss_ = pss.map(ps => ps.map(rot));
//         const principalAxes = getPrincipalAxes(_pss_);
//         const { eigenValues, eigenVectors: [v1,v2] } = principalAxes;
//         const θ1r = atan2(v1[1], v1[0]);
//         const θ2r = atan2(v2[1], v2[0]);
//         // const dotProd = dot(v1,v2);//?
//         // eigenValues;//?
//         const [θ1d,θ2d] = [θ1r,θ2r].map(radToDeg);//?
//         sqrt(eigenValues[1])/sqrt(eigenValues[0]);//?
//     }
// }
//# sourceMappingURL=get-principal-axes.js.map