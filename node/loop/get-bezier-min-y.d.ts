/**
 * Returns tight y-coordinate bounds of the given bezier curve.
 *
 * @param ps an order 1, 2 or 3 bezier curve given as an array of control
 * points, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 *
 * @doc mdx
 */
declare function getBezierMinY(ps: number[][]): {
    t: number;
    p: number[];
};
export { getBezierMinY };
