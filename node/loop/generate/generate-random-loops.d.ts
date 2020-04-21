import { Loop } from "../loop";
/**
 * Returns an array of random loops.
 * @param psi
 * @param ps
 * @param SEED a random seed
 * @param blockSize
 * @param s
 * @param bezierCount
 */
declare function generateRandomLoops(blockSize: number, s: number, bezierCount: number, numPoints: number, SEED1?: number, SEED2?: number, SEED3?: number): Loop[];
export { generateRandomLoops };
