/**
 * * **precondition**: `shape` **must** be a Jordan curve (simple, closed)
 *
 * * similar to `getTurningNumber` but much faster due to the Jordan curve
 *   constraint / precondition
 */
declare function getJordanTurningNumber(shape: (number[][])[]): number;
export { getJordanTurningNumber };
