/**
 * Returns the result of connecting the endpoints of the given loop of bezier
 * curves, e.g. if the last control point coordinates of a bezier doesn't match
 * the next bezier's first control point then the last control point is changed
 * to match it. This also applies to the last and first bezier curves in the
 * loop.
 *
 * @param beziers
 */
function connectEndpoints(beziers) {
    const n = beziers.length;
    if (n === 0) {
        return beziers;
    }
    return beziers.map((bezier, i) => {
        const nextFirst = beziers[(i + 1) % n][0];
        const last = bezier.length - 1;
        return bezier.map((p, j) => j === last ? [...nextFirst] : p);
    });
}
export { connectEndpoints };
//# sourceMappingURL=connect-endpoints.js.map