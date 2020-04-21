/**
 * Sends a onto a fixed-spacing grid with 2**significantFigures divisions. Each
 * division is 2**maxExp / 2**significantFigures wide.
 * @param a
 * @param expMax log2(max extent of grid in positive and negative directions)
 *
 * @param significantFigures
 */
declare function toGrid(a: number, expMax: number, significantFigures: number): number;
export { toGrid };
