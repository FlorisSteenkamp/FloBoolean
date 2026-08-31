import type { X } from '../get-critical-points/x.js';
import type { Curve } from '../curve/curve.js';
/**
 * Returns the minimum y-coordinate (point and `t` value) of the given bezier
 * curve.
 *
 * @param ps an order 1, 2 or 3 bezier curve given as an array of control
 * points, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 *
 * @doc mdx
 */
declare function getBezierMinY(curve: Curve): X;
export { getBezierMinY };
