const { sign } = Math;
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
function getCrossingCountAtEndpoints(ps, t) {
    const ps_ = t === 0 ? ps : ps.toReversed();
    const ys = [ps_[0]?.[1], ps_[1]?.[1], ps_[2]?.[1], ps_[3]?.[1]];
    // Note: ys[0] is gauranteed to be 0 here.
    let y;
    let s;
    y = ys[1];
    // if (y === undefined) { return 0; }  // it's a point
    s = sign(y);
    if (s !== 0) {
        return s;
    }
    y = ys[2];
    if (y === undefined) {
        return 0;
    } // it's a line
    s = sign(y);
    if (s !== 0) {
        return s;
    }
    y = ys[3];
    if (y === undefined) {
        return 0;
    } // it's a quadratic bezier
    return sign(y);
}
export { getCrossingCountAtEndpoints };
//# sourceMappingURL=get-crossing-count-at-endpoints.js.map