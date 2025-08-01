import { Tolerance } from "./tolerance.js";
import { getMaxCoordinate } from "../../src/loop/normalize/get-max-coordinate.js";


/**
 * get tolerance values from the given linear tolerance power of 2.
 * @param power the power to which to raise, e.g. -14 -> 2**-14
 */
function makeTolerance(
        power: number, 
        shapes: number[][][][]): Tolerance {

    let tol = 2**power;

    let maxCoordinate = getMaxCoordinate(shapes);
    let expMax = Math.ceil(Math.log2(maxCoordinate));
    let max = 2**expMax;

    return {
        area: max**2 * tol,
        centroid: max * tol,
        bounds: max * tol
    }
}


export { makeTolerance }
