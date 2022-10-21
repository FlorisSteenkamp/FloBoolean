import { Curve } from "../curve/curve.js";
import { __X__ } from "../-x-.js";
/**
 *
 * @param curveA
 * @param curveB
 * @param expMax
 * @param isANextB is curveB the next curve after curveA, i.e. is A's next B
 */
declare function getIntersection(curveA: Curve, curveB: Curve, expMax: number, isANextB: boolean): __X__[][];
export { getIntersection };
