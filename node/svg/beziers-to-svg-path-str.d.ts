/**
 * Returns an SVG path string representation of the given bezier loop.
 *
 * @param beziers an array of bezier curves each given as an array of
 * control points
 */
declare function beziersToSvgPathStr(beziers: number[][][]): string;
export { beziersToSvgPathStr };
