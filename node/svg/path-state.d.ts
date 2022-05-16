/** @hidden */
declare class PathState {
    initialPoint: number[] | undefined;
    p: number[];
    vals: number[] | undefined;
    prev2ndCubicControlPoint: number[] | undefined;
    prev2ndQuadraticControlPoint: number[] | undefined;
    constructor();
}
export { PathState };
