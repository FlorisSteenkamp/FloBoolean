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
function getPrincipalAxes(
        pss: number[][][]) {

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

    const poly = [1, -(a + d), a*d - b*c];
    let v0: number[];
    let v1: number[];

    const roots = allRootsCertifiedSimplified(poly).map(r => (r.tS + r.tE)/2);
    roots.sort((a,b) => abs(a) - abs(b));
    let r0 = roots[0];  // Eigenvalue 1
    let r1 = roots[1];  // Eigenvalue 2

    // allow for floating point roundoff
    // see e.g. https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html
    const Δ = 2**-40; 
    // Note: b === c
    if ((abs(b) < Δ) || r1 === undefined) {
        if (Ixx < Iyy) {
            v0 = [1,0];  // Eigenvector 1
            v1 = [0,1];  // Eigenvector 2
            r0 = Ixx;
            r1 = Iyy;
        } else {
            v0 = [0,1];  // Eigenvector 1
            v1 = [1,0];  // Eigenvector 2
            r0 = Iyy;
            r1 = Ixx;
        }
    } else {
        // Relative errors are used to minimize floating point roundoff
        const rErrR0D = abs(r0/(r0 - d));
        const rErrR0A = abs(r0/(r0 - a));
        const rErrR1D = abs(r1/(r1 - d));
        const rErrR1A = abs(r1/(r1 - a));
        v0 = rErrR0A > rErrR0D
            ? [r0 - d, c]
            : [b, r0 - a];  // Eigenvector 1
        v1 = rErrR1A > rErrR1D
            ? [r1 - d, c]
            : [b, r1 - a];  // Eigenvector 2
    }
    
    return {
        eigenValues: [r0,r1],
        eigenVectors: [v0,v1]
    }
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
function ddGetPrincipalAxes(
        pss: number[][][]) {

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
    const poly = [[0,1], ddNegativeOf(ddAddDd(a,d)), ddDiffDd(ddMultDd(a,d), ddMultDd(b,c))];
    let v0: number[];
    let v1: number[];

    const roots = allRootsCertified(poly, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY).map(r => (r.tS + r.tE)/2);
    roots.sort((a,b) => abs(a) - abs(b));
    let r0 = roots[0];  // Eigenvalue 1
    let r1 = roots[1];  // Eigenvalue 2

    // allow for floating point roundoff
    // see e.g. https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html
    const Δ = 2**-40; 
    // Note: b === c
    // Too aligned or too round
    if ((abs(b[1]) < Δ) || r1 === undefined) {
        if (Ixx < Iyy) {
            v0 = [1,0];  // Eigenvector 1
            v1 = [0,1];  // Eigenvector 2
            r0 = Ixx[1];
            r1 = Iyy[1];
        } else {
            v0 = [0,1];  // Eigenvector 1
            v1 = [1,0];  // Eigenvector 2
            r0 = Iyy[1];
            r1 = Ixx[1];
        }
    } else {
        const rErrR0D = abs(r0/(r0 - d[1]));
        const rErrR0A = abs(r0/(r0 - a[1]));
        const rErrR1D = abs(r1/(r1 - d[1]));
        const rErrR1A = abs(r1/(r1 - a[1]));
        v0 = rErrR0A > rErrR0D
            ? [r0 - d[1], c[1]]
            : [b[1], r0 - a[1]];  // Eigenvector 1
        v1 = rErrR1A > rErrR1D
            ? [r1 - d[1], c[1]]
            : [b[1], r1 - a[1]];  // Eigenvector 2
    }
    
    return {
        eigenValues: [r0,r1],
        eigenVectors: [v0,v1]
    }
}


export { getPrincipalAxes, ddGetPrincipalAxes }
