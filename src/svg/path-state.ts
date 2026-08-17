
/** @internal */
interface PathState {
    initialPoint: number[] | undefined;
    p: number[];
    vals: number[] | undefined;

    // Used in conjunction with "S", "s"
    prev2ndCubicControlPoint: number[] | undefined;
    // Used in conjunction with "T", "t"
    prev2ndQuadraticControlPoint: number[] | undefined;
}


export { PathState };
