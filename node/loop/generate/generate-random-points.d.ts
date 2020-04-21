/**
 * Returns a specified number of random integer-coordinate points within a given
 * range
 * @param n the number of points to generate
 * @param width the range of the x-y values -> [-width, +width]
 * @param SEED a random seed
 */
declare function generateRandomPoints(n: number, width: number, SEED: number): number[][];
export { generateRandomPoints };
