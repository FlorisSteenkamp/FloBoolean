/**
 * Returns the same bezier if its points are well-spaced, e.g. all points not
 * coincident, etc., else fix it, if possible, and return the fixed bezier,
 * else return undefined.
 *
 * @param ps a bezier
 * @param gridSpacing
 * @param sendToGrid
 */
declare function fixBezierByPointSpacing(ps: number[][] | undefined, gridSpacing: number, sendToGrid: (p: number[]) => number[]): number[][] | undefined;
export { fixBezierByPointSpacing };
