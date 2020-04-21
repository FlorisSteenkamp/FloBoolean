/**
 * Returns an SVG path string representation of the given bezier loops.
 * @param loops An array of loops having an array of bezier curves each given as
 * an array of control points.
 */
declare function loopsToSvgPathStr(loops: number[][][][]): string;
export { loopsToSvgPathStr };
