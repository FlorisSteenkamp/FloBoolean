import { memoize } from "flo-memoize";


/**
 * Returns the maximum control point coordinate value (x or y) within any loop.
 * @param loops The array of loops
 */
const getMaxCoordinate = memoize((loops: number[][][][]): number => {
    let max = 0;

    for (const loop of loops) {
        for (const ps of loop) {
            for (const p of ps) {
                for (const c of p) {
                    const c_ = Math.abs(c);
                    if (c_ > max) { max = c_; }
                }
            }
        }
    }

    return max;
});


export { getMaxCoordinate }
