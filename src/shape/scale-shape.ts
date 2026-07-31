import { scale } from "flo-vector2d"
import { mapmap } from '../utils/map-map.js';


/**
 * Returns the result of scaling the given shape about the origin by the given
 * factor.
 * 
 * @param c the scale factor
 * @param shape the shape given as a closed loop of bezier curves
 */
function scaleShape(
        c: number,
        shape: (number[][])[]): (number[][])[] {

    return mapmap(shape, p => scale(p, c));
}


export { scaleShape }

