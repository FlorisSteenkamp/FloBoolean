import type { __X__ } from '../-x-';
import type { Curve } from "../curve/curve";
/**
 * Returns the pairs of intersection `t` values between the curves. Interface
 * intersections may not be returned - they should already be caught.
 *
 * @param curveA
 * @param curveB
 */
declare function getCurvesIntersections(expMax: number): (curveA: Curve, curveB: Curve) => __X__[][] | undefined;
export { getCurvesIntersections };
