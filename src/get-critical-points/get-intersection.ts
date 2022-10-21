import { 
    getEndpointIntersections, 
    evalDeCasteljau,
    bezierBezierIntersectionBoundless
} from "flo-bezier3";
import { Curve } from "../curve/curve.js";
import { __X__ } from "../-x-.js";
import { getOtherTs } from './get-other-t.js';


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
        expMax: number,
        isANextB: boolean): __X__[][] {
            
    let ps1 = curveA.ps;
    let ps2 = curveB.ps;

    let xs: __X__[][] = [];

    let ris2 = bezierBezierIntersectionBoundless(ps1,ps2);
    if (ris2 === undefined) {
        // the curves have an infinte number of intersections

        // some reasonable error bound -> to be fine-tuned, but cannot
        // break the algorithm (unless its too small), only make it run slower.
        let errBound = 2**(expMax-47);
        let xPairs = getEndpointIntersections(ps1, ps2);
        for (let xPair of xPairs) {
            let p1 = evalDeCasteljau(ps1, xPair.ri1.tS);
            let box = [
                [p1[0]-errBound, p1[1]-errBound],
                [p1[0]+errBound, p1[1]+errBound],
            ];
            let ri1: __X__ = { x: { ri: xPair.ri1, kind: 5, box }, curve: curveA }; // exact overlap endpoint
            let ri2: __X__ = { x: { ri: xPair.ri2, kind: 5, box }, curve: curveB }; // exact overlap endpoint

            xs.push([ri1,ri2]);
        }

        return xs;
    } 
        
    if (isANextB) {
        // we are not interested in zero t values (they are interface points)
        ris2 = ris2.filter(t => t.tS > 0);
    }
    if (ris2.length === 0) { return []; }

    let xPairs = getOtherTs(ps1, ps2, ris2);
    if (xPairs === undefined || xPairs.length === 0) { return []; }
    for (let xPair of xPairs) {
        let x1: __X__ = { x: xPair[0], curve: curveA };
        let x2: __X__ = { x: xPair[1], curve: curveB };
        xs.push([x1, x2]);
    }

    return xs;
}


export { getIntersection }
