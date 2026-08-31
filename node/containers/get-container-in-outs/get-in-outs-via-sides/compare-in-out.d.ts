import type { In, Out } from "../../in-out/in-out.js";
/**
 * Returns the result of comparing two `InOut`s within the same container.
 *
 * Note the edge ordering around the container:
 *   * 0 -> MinY edge (top)
 *   * 1 -> MinX edge (left)
 *   * 2 -> MaxY edge (bottom)
 *   * 3 -> MaxX edge (right)
 *
 * @param inOutA
 * @param inOutB
 */
declare function compareInOut(inOutA: In | Out, inOutB: In | Out): number;
export { compareInOut };
