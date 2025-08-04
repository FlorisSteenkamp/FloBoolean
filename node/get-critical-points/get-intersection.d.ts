import type { Curve } from "../curve/curve";
import type { __X__ } from "../-x-";
/**
 *
 * @param curveA
 * @param curveB
 * @param expMax
 * @param isANextB is curveB the next curve after curveA, i.e. is A's next B
 */
declare function getIntersection(curveA: Curve, curveB: Curve, expMax: number, isANextB: boolean): __X__[][];
export { getIntersection };
