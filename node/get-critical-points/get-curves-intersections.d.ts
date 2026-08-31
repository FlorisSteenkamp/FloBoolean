import type { X } from './x.js';
import type { Curve } from "../curve/curve.js";
/**
 * Returns the pairs of intersection `t` values between the curves. Interface
 * intersections may not be returned - they should already be caught.
 *
 * @param curveA
 * @param curveB
 */
declare function getCurvesIntersections(curveA: Curve, curveB: Curve): [X, X][] | undefined;
export { getCurvesIntersections };
