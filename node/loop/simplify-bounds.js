/** Used in tests only - not used in algorithm */
function simplifyBounds(bounds) {
    return {
        minX: bounds.minX.p[0],
        minY: bounds.minY.p[1],
        maxX: bounds.maxX.p[0],
        maxY: bounds.maxY.p[1],
    };
}
export { simplifyBounds };
//# sourceMappingURL=simplify-bounds.js.map