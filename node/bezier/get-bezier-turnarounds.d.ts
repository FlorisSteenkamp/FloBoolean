declare function getBezierTurnarounds(ps: number[][]): {
    turnaroundXs: {
        t: number;
        p: number[];
    }[];
    turnaroundYs: {
        t: number;
        p: number[];
    }[];
};
export { getBezierTurnarounds };
