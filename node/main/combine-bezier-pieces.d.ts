import type { BezierPiece } from "flo-bezier3";
/**
 * Returns the result of combining the given loop of bezier pieces where
 * possible, e.g. two bezier pieces `{ ps: [[0,0],[1,1]], ts: [0,0.5] }` and
 * `{ ps: [[0,0],[1,1]], ts: [0.5,0.7] }` are combined to become
 * `{ ps: [[0,0],[1,1]], ts: [0,0.7] }`. The last and first are also checked
 * against each other (since it forms a loop).
 */
declare function combineBezierPieces(loop: BezierPiece[]): BezierPiece[];
export { combineBezierPieces };
