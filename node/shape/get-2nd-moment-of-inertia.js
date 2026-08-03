import { ddAddDd, ddDiffDd } from 'double-double';
import { multiply, Horner, integrate, ddHorner, ddMultiply, ddIntegrate } from 'flo-poly';
import { toPowerBasis, toPowerBasis_1stDerivative, toPowerBasis_1stDerivativeDd, toPowerBasisDd } from "flo-bezier3";
/**
 * Returns the 2nd moment of inertia (as a double-doulbe) of the given
 * shape (Ixx and Iyy).
 *
 * * intermediate calculations are done in double-double precision
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
function ddGet2ndMomentOfInertia(shape) {
    let cx = [0, 0];
    let cy = [0, 0];
    for (const ps of shape) {
        const [x, y] = toPowerBasisDd(ps);
        const [dx, dy] = toPowerBasis_1stDerivativeDd(ps);
        const polyX = ddIntegrate(ddMultiply(ddMultiply(ddMultiply(y, y), x), dy), [0, 0]);
        const polyY = ddIntegrate(ddMultiply(ddMultiply(ddMultiply(x, x), y), dx), [0, 0]);
        const x_ = ddHorner(polyX, 1);
        const y_ = ddHorner(polyY, 1);
        cx = ddAddDd(cx, x_);
        cy = ddDiffDd(cy, y_);
    }
    return [cx, cy];
}
/**
 * Returns the 2nd moment of inertia of the given shape (Ixx and Iyy).
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
function get2ndMomentOfInertia(pss) {
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
        cy += -y_;
    }
    return [cx, cy];
}
/**
 * Returns the product moment of inertia (as a double-doulbe) `Ixy`
 * (note: `Iyx === Ixy` always) of the given shape.
 *
 * * intermediate calculations are done in double-double precision
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
function ddGetProdMomentOfInertia(pss) {
    let cXY = [0, 0];
    // let cYX = [0,0];
    for (const ps of pss) {
        const [x, y] = toPowerBasisDd(ps);
        const [dx, dy] = toPowerBasis_1stDerivativeDd(ps);
        const polyXY = ddIntegrate(ddMultiply(ddMultiply(ddMultiply(y, x), x), dy), [0, 0]);
        // const polyYX = ddIntegrate(ddMultiply(ddMultiply(ddMultiply(x, y), x), dy), [0,0]);
        const xy = ddHorner(polyXY, 1);
        // const yx = ddHorner(polyYX, 1);
        cXY = ddAddDd(cXY, xy);
        // cYX = ddAddDd(cYX, yx);
    }
    return [cXY[0] / 2, cXY[1] / 2];
}
/**
 * Returns the product moment of inertia `Ixy`
 * (note: `Iyx === Ixy` always) of the given shape.
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
function getProdMomentOfInertia(pss) {
    let cXY = 0;
    // let cYX = 0;
    for (const ps of pss) {
        const [x, y] = toPowerBasis(ps);
        const [dx, dy] = toPowerBasis_1stDerivative(ps);
        const polyXY = integrate(multiply(multiply(multiply(y, x), x), dy), 0);
        // const polyYX = integrate(multiply(multiply(multiply(x, y), x), dy), 0);
        const xy = Horner(polyXY, 1);
        // const yx = Horner(polyYX, 1);
        cXY += xy;
        // cYX += yx;
    }
    // return [cXY/2, cYX/2];
    return cXY / 2;
}
export { get2ndMomentOfInertia, getProdMomentOfInertia, ddGet2ndMomentOfInertia, ddGetProdMomentOfInertia };
//# sourceMappingURL=get-2nd-moment-of-inertia.js.map