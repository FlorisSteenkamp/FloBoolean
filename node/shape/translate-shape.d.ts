/**
 * Returns the result of translating the given shape by the given vector.
 *
 * @param v
 * @param shape the shape given as a closed loop of bezier curves
 */
declare function translateShape(v: number[], shape: (number[][])[]): (number[][])[];
export { translateShape };
