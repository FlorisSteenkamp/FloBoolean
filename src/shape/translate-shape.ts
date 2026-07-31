import { translate } from "flo-vector2d"
import { mapmap } from '../utils/map-map.js';


/**
 * Returns the result of translating the given shape by the given vector.
 * 
 * @param v 
 * @param shape the shape given as a closed loop of bezier curves
 */
function translateShape(
        v: number[],
        shape: (number[][])[]): (number[][])[] {

    return mapmap(shape, translate(v));
}


export { translateShape }
