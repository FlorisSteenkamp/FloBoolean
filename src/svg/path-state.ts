
/** @hidden */
class PathState {
    initialPoint: number[] | undefined = undefined;    
    p: number[];
    vals: number[] | undefined = undefined;

    // Used in conjunction with "S", "s"
    prev2ndCubicControlPoint: number[] | undefined = undefined;
    // Used in conjunction with "T", "t"
    prev2ndQuadraticControlPoint: number[] | undefined = undefined;

    constructor() {
        this.p = [0,0];
    }
}


export { PathState };
