/** @hidden */
class PathState {
    initialPoint = undefined;
    p;
    vals = undefined;
    // Used in conjunction with "S", "s"
    prev2ndCubicControlPoint = undefined;
    // Used in conjunction with "T", "t"
    prev2ndQuadraticControlPoint = undefined;
    constructor() {
        this.p = [0, 0];
    }
}
export { PathState };
//# sourceMappingURL=path-state.js.map