import { PathState } from '../path-state.js';
/**
 * Q and q: (from www.w3.org)
 *
 * params: x1 y1 x y
 *
 * Draws a quadratic Bézier curve from the current point to (x,y) using (x1,y1)
 * as the control point. Q (uppercase) indicates that absolute coordinates will
 * follow; q (lowercase) indicates that relative coordinates will follow.
 * Multiple sets of coordinates may be specified to draw a polybézier. At the
 * end of the command, the new current point becomes the final (x,y) coordinate
 * pair used in the polybézier.
 *
 * @internal
 */
declare function q(s: PathState): number[][];
export { q };
