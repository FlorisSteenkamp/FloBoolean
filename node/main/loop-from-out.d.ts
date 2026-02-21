import type { InOut } from "../containers/in-out/in-out.js";
/**
 *
 * @param out
 * @param outerLoopOrientation
 * @param loopIdx identifies the loop during debugging
 */
declare function loopFromOut(out: InOut, outerLoopOrientation: number, loopIdx: number): import("../index.js").Loop;
export { loopFromOut };
