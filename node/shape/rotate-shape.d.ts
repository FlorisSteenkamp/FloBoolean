/**
 * Returns the result of rotating the given shape anti-clockwise about the
 * origin by the given angle.
 *
 * @param θ the angle of rotation in radians
 * @param shape the shape given as a closed loop of bezier curves
 */
declare function rotateShape(θ: number, shape: (number[][])[]): (number[][])[];
export { rotateShape };
