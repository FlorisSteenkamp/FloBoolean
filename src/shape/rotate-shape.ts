import { rotate } from "flo-vector2d"
import { mapmap } from '../utils/map-map.js';

const { sin, cos } = Math;


/**
 * Returns the result of rotating the given shape anti-clockwise about the
 * origin by the given angle.
 * 
 * @param θ the angle of rotation in radians
 * @param shape the shape given as a closed loop of bezier curves
 */
function rotateShape(
        θ: number,
        shape: (number[][])[]): (number[][])[] {

    return mapmap(shape, rotate(sin(θ), cos(θ)));
}


export { rotateShape }

