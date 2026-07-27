import type { X } from "../../../get-critical-points/x.js";
/**
 * Robustly get matching intersections of `ps` (a bezier) that matches those of
 * `side`. `ps` and `side` can actually be any order 1, 2 or 3 bezier curve.
 *
 * * **precondition** `RootInterval[]` contains no multiple roots
 *
 * @param ps
 * @param side
 * @param risSide_
 */
declare function getTs(ps: number[][], side: number[][]): {
    psX: X;
    sideX: X;
}[];
export { getTs };
