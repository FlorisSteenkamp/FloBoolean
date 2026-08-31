/**
 * `getIsCrossingUp(ps, t)` looks at a line / quadratic / cubic bezier `ps` that
 * has one endpoint on the ray (`y === 0` at parameter `t`, where `t` is `0` for
 * the first point or `1` for the last) and reports the direction the curve
 * departs from that endpoint:
 *
 *   * `+1`  the curve leaves the endpoint going up   (first non-zero y is > 0)
 *   * `-1`  the curve leaves the endpoint going down (first non-zero y is < 0)
 *   * ` 0`  degenerate - every interior control point lies on the ray
 *
 * The endpoints are the edge cases used when computing winding numbers, so the
 * `t === 0` and `t === 1` sides must behave symmetrically.
 */
declare function getCrossingCountAtEndpoints(ps: number[][], t: 0 | 1): number;
export { getCrossingCountAtEndpoints };
