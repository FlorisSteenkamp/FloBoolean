/**
 * Returns the result of scaling the given shape about the origin by the given
 * factor.
 *
 * @param c the scale factor
 * @param shape the shape given as a closed loop of bezier curves
 */
declare function scaleShape(c: number, shape: (number[][])[]): (number[][])[];
export { scaleShape };
