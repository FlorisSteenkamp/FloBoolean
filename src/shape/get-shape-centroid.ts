import type { Loop } from "./loop.js";
import { toPowerBasis, toPowerBasis_1stDerivative, toPowerBasis_1stDerivativeDd, toPowerBasisDd } from "flo-bezier3";
import { Horner, multiply, integrate, ddIntegrate, ddMultiply, ddHorner, ddDivideByConst } from 'flo-poly';
import { ddGetShapeArea, getShapeArea } from "./get-shape-area.js";
import { ddAddDd, ddDivDd, ddMultBy2, ddMultDd, doubleDivDouble  } from "double-double";


/**
 * Returns the approximate centroid of the given shape.
 * 
 * * **precondition**: shape must be a jordan curve (i.e. closed and simple)
 * * intermediate calculations are done in double-double precision
 * 
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 */
function getShapeCentroid(
        shape: number[][][]) {

    const A = getShapeArea(shape);

    let cx = 0;
    let cy = 0;
    for (const ps of shape) {
        const [x,y] = toPowerBasis(ps);
        const [dx,dy] = toPowerBasis_1stDerivative(ps);

        const polyX = integrate(multiply(multiply(x, x), dy), 0);  // First moment of inertia
        const polyY = integrate(multiply(multiply(y, y), dx), 0);  // First moment of inertia

        const _x = Horner(polyX, 1);
        const _y = Horner(polyY, 1);

        cx += _x;
        cy += _y;
    }

    const a = 1/(2*A);

    return [a*cx, -a*cy];
}


/**
 * Returns the approximate centroid of the given shape.
 * 
 * * **precondition**: shape must be a jordan curve (i.e. closed and simple)
 * * intermediate calculations are done in double-double precision
 * 
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 * 
 * @param shape the shape given as a closed loop of bezier curves
 */
function ddGetShapeCentroid(
        shape: number[][][]) {

    let cx = [0,0];
    let cy = [0,0];
    for (const ps of shape) {
        const [x,y] = toPowerBasisDd(ps);
        const [dx,dy] = toPowerBasis_1stDerivativeDd(ps);

        const polyX = ddIntegrate(ddMultiply(ddMultiply(x, x), dy), [0,0]);  // First moment of inertia
        const polyY = ddIntegrate(ddMultiply(ddMultiply(y, y), dx), [0,0]);  // First moment of inertia

        const _x = ddHorner(polyX, 1);
        const _y = ddHorner(polyY, 1);

        cx = ddAddDd(cx, _x);
        cy = ddAddDd(cy, _y);
    }

    const A = ddGetShapeArea(shape);
    const A2 = ddMultBy2(A);

    const CX = ddDivDd([0,1],A2);
    const CY = ddDivDd([0,-1],A2);
    const X = ddMultDd(CX,cx);
    const Y = ddMultDd(CY,cy);

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
function getLoopCentroid(loop: Loop) {
    return getShapeCentroid(loop.beziers);
}


export { getLoopCentroid, getShapeCentroid, ddGetShapeCentroid }
