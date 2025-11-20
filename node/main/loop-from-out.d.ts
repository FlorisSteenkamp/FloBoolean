import type { InOut } from "../containers/in-out/in-out.js";
/**
 *
 * @param out
 * @param orientation
 * @param loopIdx identifies the loop during debugging
 */
declare function loopFromOut(out: InOut, orientation: number, loopIdx: number): import("../index.js").Loop;
export { loopFromOut };
