import { Curve } from "../curve/curve.js";
import { _X_ } from "../-x-.js";
/**
 *
 * @param curveA
 * @param curveB
 * @param expMax
 * @param isANextB is curveB the next curve after curveA, i.e. is A's next B
 */
declare function getIntersection(curveA: Curve, curveB: Curve, expMax: number, isANextB: boolean): _X_[][];
export { getIntersection };
