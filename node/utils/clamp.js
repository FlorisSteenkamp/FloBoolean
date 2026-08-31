const { min, max } = Math;
function clamp(v, minV, maxV) {
    return min(maxV, max(minV, v));
}
export { clamp };
//# sourceMappingURL=clamp.js.map