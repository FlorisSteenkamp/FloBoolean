import { getEndpointIntersections, evalDeCasteljau, bezierBezierIntersectionBoundless } from "flo-bezier3";
import { getOtherTs } from './get-other-t';
/**
 *
 * @param curveA
 * @param curveB
 * @param expMax
 * @param isANextB is curveB the next curve after curveA, i.e. is A's next B
 */
function getIntersection(curveA, curveB, expMax, isANextB) {
    const ps1 = curveA.ps;
    const ps2 = curveB.ps;
    const xs = [];
    let ris2 = bezierBezierIntersectionBoundless(ps1, ps2);
    if (ris2 === undefined) {
        // the curves have an infinte number of intersections
        // some reasonable error bound -> to be fine-tuned, but cannot
        // break the algorithm (unless its too small), only make it run slower.
        const errBound = 2 ** (expMax - 47);
        const xPairs = getEndpointIntersections(ps1, ps2);
        for (const xPair of xPairs) {
            const p1 = evalDeCasteljau(ps1, xPair.ri1.tS);
            const box = [
                [p1[0] - errBound, p1[1] - errBound],
                [p1[0] + errBound, p1[1] + errBound],
            ];
            const ri1 = { x: { ri: xPair.ri1, kind: 5, box }, curve: curveA }; // exact overlap endpoint
            const ri2 = { x: { ri: xPair.ri2, kind: 5, box }, curve: curveB }; // exact overlap endpoint
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
    const xPairs = getOtherTs(ps1, ps2, ris2);
    if (xPairs === undefined || xPairs.length === 0) {
        return [];
    }
    for (const xPair of xPairs) {
        const x1 = { x: xPair[0], curve: curveA };
        const x2 = { x: xPair[1], curve: curveB };
        xs.push([x1, x2]);
    }
    return xs;
}
export { getIntersection };
//# sourceMappingURL=get-intersection.js.map