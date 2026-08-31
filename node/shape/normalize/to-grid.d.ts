/**
 * Sends `a` onto a fixed-spacing grid with `2**significantBits` divisions.
 * Each division is `2**(maxExp - significantBits)` wide.
 *
 * @param a
 * @param expMax log2(max extent of grid in positive and negative directions)
 *
 * @param significantBits
 */
declare function toGrid(expMax: number, significantBits: number): (a: number) => number;
export { toGrid };
