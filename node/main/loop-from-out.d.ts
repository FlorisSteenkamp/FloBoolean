import type { Out } from "../containers/in-out/in-out.js";
/**
 *
 * @param out
 * @param outerLoopOrientation
 * @param loopIdx identifies the loop during debugging
 * @param depth number of selected ancestor loops (nesting level); determines
 * the loop's orientation so that alternating levels (outer, hole, island, ...)
 * are cut in and out correctly by the non-zero winding fill rule
 */
declare function loopFromOut(out: Out, outerLoopOrientation: number, depth: number): import("flo-bezier3").BezierPiece[];
export { loopFromOut };
