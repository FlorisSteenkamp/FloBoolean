function createRootInOut() {
    return {
        dir: undefined,
        idx: 0,
        parent: undefined,
        children: new Set(),
        windingNum: 0,
        p: undefined,
        _x_: undefined,
        container: undefined,
        loopsIdxs: new Set(),
        orientation: -1
    };
}
export { createRootInOut };
//# sourceMappingURL=create-root-in-out.js.map