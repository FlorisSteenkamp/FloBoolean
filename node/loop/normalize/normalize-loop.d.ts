/**
 * Returns new loops from the given loops by aligning the 53-bit double
 * precision coordinates to 46-bit coordinates. This speeds up the algorithm
 * considerably.
 *
 * The following guarantees are put in place for the returned loops:
 * * All points are coerced onto a grid. In other words, such that the
 *   significand of all coordinates are reduced to a specified number of bits
 *   and the significant bits of all points 'overlap'.
 *
 * * No curves are disguised as higher order curves (this includes the case
 *   that no bezier is of zero length and the case where there are an infinite
 *   number of self-intersections). The curves are simply deflated exactly.
 *
 * * No cusps (this includes the case that all bezier end-points of each curve
 *   are seperated. (this prevents infinite curvature at the endpoints, etc).
 *   (this condition is not necessary for this algorithm but may help algorithms
 *    down the line that needs such guarantees)
 * @param loop
 * @param maxBitLength
 * @param expMax
 */
declare function normalizeLoops(bezierLoops: number[][][][], maxBitLength: number, expMax: number, doScramble?: boolean, doSendToGrid?: boolean): number[][][][];
export { normalizeLoops };
