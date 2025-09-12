/**
 * Returns the two principal axes of the shape (and some other data).
 *
 * * the returned `eigenValues` are the moments of inertia and the
 * `eigenVectors` are the axes direction vectors (relative to the X and Y axis)
 *
 * * the first axis returned will be the one with lower moment of inertia
 * (when rotating about it)
 *
 * * it can be useful to first move the shape's centroid to the origin, e.g.
 * ```
 * const C = getShapeCentroid(pss);
 * const pss_ = pss.map(ps => ps.map(p => [p[0] - C[0], p[1] - C[1]]));
 * ```
 *
 * @param pss_
 */
declare function getPrincipalAxes(pss: number[][][]): {
    eigenValues: number[];
    eigenVectors: number[][];
};
/**
 * Returns the two principal axes of the shape (and some other data).
 *
 * * the returned `eigenValues` are the moments of inertia and the
 * `eigenVectors` are the axes direction vectors (relative to the X and Y axis)
 *
 * * the first axis returned will be the one with lower moment of inertia
 * (when rotating about it)
 *
 * * it can be useful to first move the shape's centroid to the origin, e.g.
 * ```
 * const C = getShapeCentroid(pss);
 * const pss_ = pss.map(ps => ps.map(p => [p[0] - C[0], p[1] - C[1]]));
 * ```
 *
 * @param pss_
 */
declare function ddGetPrincipalAxes(pss: number[][][]): {
    eigenValues: number[];
    eigenVectors: number[][];
};
export { getPrincipalAxes, ddGetPrincipalAxes };
