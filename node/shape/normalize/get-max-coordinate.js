const { max, abs } = Math;
/**
 * Returns the maximum control point coordinate value (x or y) within any loop.
 * @param loops The array of loops
 */
function getMaxCoordinate(loops) {
    let max_ = -Infinity;
    for (const loop of loops) {
        for (const ps of loop) {
            for (const p of ps) {
                for (const c of p) {
                    max_ = max(max_, abs(c));
                }
            }
        }
    }
    return max_;
}
export { getMaxCoordinate };
//# sourceMappingURL=get-max-coordinate.js.map