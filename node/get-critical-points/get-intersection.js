"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
/**
 *
 * @param curveA
 * @param curveB
 * @param expMax
 * @param isANextB is curveB the next curve after curveA, i.e. is A's next B
 */
function getIntersection(curveA, curveB, expMax, isANextB) {
    let ps1 = curveA.ps;
    let ps2 = curveB.ps;
    let xs = [];
    let ts2 = flo_bezier3_1.bezierBezierIntersectionImplicit(ps1, ps2);
    if (ts2 === undefined) {
        // the curves are in the same k-family
        // some reasonable error bound -> to be fine-tuned, but cannot
        // break the algorithm (unless its too small), only make it run slower.
        let errBound = Math.pow(2, (expMax - 48));
        let riPairs = flo_bezier3_1.getEndpointIntersections(ps1, ps2, errBound);
        for (let riPair of riPairs) {
            //let p1 = evalDeCasteljau(ps1, mid(riPair[0]));
            let p1 = flo_bezier3_1.evalDeCasteljau(ps1, riPair[0].tS);
            let box = [
                [p1[0] - errBound, p1[1] - errBound],
                [p1[0] + errBound, p1[1] + errBound],
            ];
            let ri1 = { x: { ri: riPair[0], kind: 5, box }, curve: curveA }; // exact overlap endpoint
            let ri2 = { x: { ri: riPair[1], kind: 5, box }, curve: curveB }; // exact overlap endpoint
            xs.push([ri1, ri2]);
        }
    }
    else {
        if (isANextB) {
            // we are not interested in zero t values (they are interface points)
            ts2 = ts2.filter(t => t.tS > 0);
        }
        let xPairs = flo_bezier3_1.getOtherTs(ps1, ps2, ts2);
        for (let xPair of xPairs) {
            let x1 = { x: xPair[0], curve: curveA };
            let x2 = { x: xPair[1], curve: curveB };
            xs.push([x1, x2]);
        }
    }
    return xs;
}
exports.getIntersection = getIntersection;
//# sourceMappingURL=get-intersection.js.map