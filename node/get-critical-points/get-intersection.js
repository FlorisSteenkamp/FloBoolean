import { getEndpointIntersections, bezierBezierIntersectionBoundless } from "flo-bezier3";
import { getOtherTs } from './get-other-t.js';
import { toP } from "../utils/to-p.js";
import { timeFunctionCalls } from '../utils/time-function-call.js';
/**
 *
 * @param curveA
 * @param curveB
 * @param expMax
 * @param isANextB is curveB the next curve after curveA, i.e. is A's next B
 */
const getIntersection = timeFunctionCalls(function getIntersection(curveA, curveB, isANextB) {
    const ps1 = curveA.ps;
    const ps2 = curveB.ps;
    const xs = [];
    let ris2 = bezierBezierIntersectionBoundless(ps1, ps2);
    if (ris2 === undefined) {
        // the curves have an infinte number of intersections
        const xPairs = getEndpointIntersections(ps1, ps2);
        for (const xPair of xPairs) {
            const p = toP(ps1, xPair.ri1.t);
            const ri1 = { ri: xPair.ri1, kind: 5, p, curve: curveA }; // exact overlap endpoint
            const ri2 = { ri: xPair.ri2, kind: 5, p, curve: curveB }; // exact overlap endpoint
            xs.push([ri1, ri2]);
        }
        return xs;
    }
    if (isANextB) {
        // we are not interested in zero t values (they are interface points)
        ris2 = ris2.filter(t => t.tS > 0);
    }
    if (ris2.length === 0) {
        return [];
    }
    return getOtherTs(curveA, curveB, ris2) || [];
});
export { getIntersection };
//# sourceMappingURL=get-intersection.js.map