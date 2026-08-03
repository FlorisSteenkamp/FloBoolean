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
        orientation: -1,
        side: undefined,
        nextOrPrev: undefined,
        bezierPieces: undefined,
        nextAround: undefined,
        prevAround: undefined,
        sideX: undefined,
    };
}
export { createRootInOut };
//# sourceMappingURL=create-root-in-out.js.map