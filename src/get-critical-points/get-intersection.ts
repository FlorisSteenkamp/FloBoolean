import type { Curve } from "../curve/curve.js";
import type { _X_ } from "./-x-.js";
import { getEndpointIntersections, bezierBezierIntersectionBoundless } from "flo-bezier3";
import { getOtherTs } from './get-other-t.js';
import { toP } from "../utils/to-p.js";


/**
 * 
 * @param curveA 
 * @param curveB 
 * @param expMax 
 * @param isANextB is curveB the next curve after curveA, i.e. is A's next B
 */
function getIntersection(
        curveA: Curve, 
        curveB: Curve, 
        isANextB: boolean): [_X_,_X_][] {

    const ps1 = curveA.ps;
    const ps2 = curveB.ps;

    const xs: [_X_,_X_][] = [];

    let ris2 = bezierBezierIntersectionBoundless(ps1,ps2);

    if (ris2 === undefined) {
        // the curves have an infinte number of intersections

        const xPairs = getEndpointIntersections(ps1, ps2);
        for (const xPair of xPairs) {
            const p = toP(ps1, xPair.ri1.t);
            const ri1: _X_ = { x: { ri: xPair.ri1, kind: 5, p }, curve: curveA, next: undefined!, prev: undefined!, container: undefined! }; // exact overlap endpoint
            const ri2: _X_ = { x: { ri: xPair.ri2, kind: 5, p }, curve: curveB, next: undefined!, prev: undefined!, container: undefined! }; // exact overlap endpoint

            xs.push([ri1,ri2]);
        }

        return xs;
    } 
        
    if (isANextB) {
        // we are not interested in zero t values (they are interface points)
        ris2 = ris2.filter(t => t.tS > 0);
    }
    if (ris2.length === 0) { return []; }

    const xPairs = getOtherTs(ps1, ps2, ris2);
    if (xPairs === undefined || xPairs.length === 0) { return []; }
    for (const xPair of xPairs) {
        const x1: _X_ = { x: xPair[0], curve: curveA, next: undefined!, prev: undefined!, container: undefined! };
        const x2: _X_ = { x: xPair[1], curve: curveB, next: undefined!, prev: undefined!, container: undefined! };
        xs.push([x1, x2]);
    }

    return xs;
}


export { getIntersection }
