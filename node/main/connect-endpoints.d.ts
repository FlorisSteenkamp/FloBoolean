/**
 * Returns the result of connecting the endpoints of the given loop of bezier
 * curves, e.g. if the last control point coordinates of a bezier doesn't match
 * the next bezier's first control point then the last control point is changed
 * to match it. This also applies to the last and first bezier curves in the
 * loop.
 *
 * @param beziers
 */
declare function connectEndpoints(beziers: number[][][]): number[][][];
export { connectEndpoints };
