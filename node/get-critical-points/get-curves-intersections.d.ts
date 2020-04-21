import { Curve } from "../curve/curve";
import { _X_ } from '../x';
/**
 * Returns the pairs of intersection t values between the curves. Interface
 * intersections may not be returned - they should already be caught.
 * @param curveA
 * @param curveB
 */
declare function getCurvesIntersections(expMax: number): (curveA: Curve, curveB: Curve) => _X_[][];
export { getCurvesIntersections };
