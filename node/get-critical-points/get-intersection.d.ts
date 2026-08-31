import type { Curve } from "../curve/curve.js";
import type { X } from "./x.js";
/**
 *
 * @param curveA
 * @param curveB
 * @param expMax
 * @param isANextB is curveB the next curve after curveA, i.e. is A's next B
 */
declare const getIntersection: ((this: unknown, curveA: Curve, curveB: Curve, isANextB: boolean) => [X, X][]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
export { getIntersection };
