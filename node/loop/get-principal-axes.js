import { allRootsCertifiedSimplified } from 'flo-poly';
import { getMomentOfInertia, getProdMomentOfInertia } from "./get-moment-of-inertia.js";
import { reverseShapeOrientation } from "./reverse-shape-orientation.js";
import { getTotalShapeCurvature } from "./get-total-shape-curvature.js";
const { atan2, abs } = Math;
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
    const [Ixx, Iyy] = getMomentOfInertia(pss_);
    const [Ixy, Iyx] = getProdMomentOfInertia(pss_);
    //-----------------------------------------------------------------------
    // Quick calc of eigenvalues and eigenvectors for matrix [[a,b],[c,d]]
    // using the matrix [[Ixx, Ixy],[Iyx, Iyy]]
    // see https://math.stackexchange.com/questions/395698/fast-way-to-calculate-eigen-of-2x2-matrix-using-a-formula
    //-----------------------------------------------------------------------
    let a = Ixx;
    let b = Ixy;
    let c = Iyx;
    let d = Iyy;
    const poly = [1, -(a + d), a * d - abs(b * c)];
    let v1;
    let v2;
    const roots = allRootsCertifiedSimplified(poly).map(r => (r.tS + r.tE) / 2);
    let r0 = roots[0]; // Eigenvalue 1
    let r1 = roots[1]; // Eigenvalue 2
    // allow for floating point roundoff
    // see e.g. https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html
    const Δ = 2 ** -40;
    if ((abs(b) < Δ && abs(c) < Δ) || r1 === undefined) {
        if (Ixx < Iyy) {
            v1 = [1, 0]; // Eigenvector 1
            v2 = [0, 1]; // Eigenvector 2
            r0 = Ixx;
            r1 = Iyy;
        }
        else {
            v1 = [0, 1]; // Eigenvector 1
            v2 = [1, 0]; // Eigenvector 2
            r0 = Iyy;
            r1 = Ixx;
        }
    }
    else {
        // Actually either of the two options below always works
        // if (c > b) {
        //     v1 = [r0 - d, c];  // Eigenvector 1
        //     v2 = [r1 - d, c];  // Eigenvector 2
        // } else {
        v1 = [b, a - r0]; // Eigenvector 1
        v2 = [b, a - r1]; // Eigenvector 2
        // }
    }
    return {
        eigenValues: [r0, r1],
        eigenVectors: [v1, v2]
    };
}
export { getPrincipalAxes };
// Quokka tests
// import { degToRad, radToDeg } from '../svg/circle-to-cubic-beziers.js';
// import { rotate } from "flo-vector2d";
// const { sin, cos } = Math;
// {
//     //--------------
//     // Some ellipse
//     //--------------
//     const K = 0.5519150244935105707435627;
//     const F = 10;
//     const pss = ([
//         [[0,1], [K*F,1], [1*F,K], [1*F,0]],  // quarter ellipse
//         [[1*F,0], [1*F,-K], [K*F,-1], [0,-1]],
//         [[0,-1], [-K*F,-1], [-1*F,-K], [-1*F,0]],
//         [[-1*F,0], [-1*F,K], [-K*F,1], [0,1]]
//     ]);
//     for (let i=-180; i<=180; i += 10) {
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
//         eigenValues;//?
//         const [θ1d,θ2d] = [θ1r,θ2r].map(radToDeg);//?
//     }
// }
//# sourceMappingURL=get-principal-axes.js.map