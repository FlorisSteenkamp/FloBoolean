import type { InOut } from "../../../containers/in-out/in-out.js";
/**
 * Returns the result of comparing two `InOut`s within the same container.
 *
 * @param inOutA
 * @param inOutB
 */
declare function compareInOut(snugDir: number): (inOutA: InOut, inOutB: InOut) => number;
export { compareInOut };
