import type { RootIntervalExp } from "flo-poly";
import type { SideCrossing } from "./side-crossing.js";
import type { Curve } from "../../../curve/curve.js";
/**
 * Robustly get matching intersections of `ps` (a bezier) that matches those of
 * `side`.
 *
 * * **precondition** `RootInterval[]` contains no multiple roots
 *
 * @param ps
 * @param side
 * @param risSide_
 */
declare function getTs(curve: Curve, side: number[][], tsPs: number[], sideIdx: number): SideCrossing | undefined;
declare function getSideRiExp(ps: number[][], side: number[][], riPs: RootIntervalExp): RootIntervalExp;
export { getTs, getSideRiExp };
