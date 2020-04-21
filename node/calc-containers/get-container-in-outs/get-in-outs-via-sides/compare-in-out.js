"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_poly_1 = require("flo-poly");
const flo_numerical_1 = require("flo-numerical");
const abs = Math.abs;
// TODO - memoize (probably at some deeper level)
/**
 *
 * @param inOutA
 * @param inOutB
 */
function compareOrderedInOut(inOutA, inOutB) {
    // First compare side indexes - side indexes are the coursest ordering
    let res = inOutA.side - inOutB.side;
    if (res !== 0) {
        return res;
    }
    // Could not resolve by side indexes (they are the same)
    // Compare by side t values
    let xA = inOutA.sideX;
    let xB = inOutB.sideX;
    res = xA.ri.tS - xB.ri.tS;
    let errBound = 2 * 4 * Number.EPSILON; // is factor of 2 necessary
    if (abs(res) >= errBound) {
        return res;
    }
    // At this point we zoom in once more (compensated once) to add an 
    // additional 49 bits accuracy
    // TODO - first check if they are in the same k family - this will speed
    // up the algorithm in those cases.
    if (!xA.compensated) { // else the root is already compensated once
        xA.compensated = 1; // compensate once - in future we can compensate more times if necessary
        // there should be only 1 root in the 4u interval
        xA.riExp = flo_poly_1.refineK1(xA.ri.tS, xA.getPsExact)[0];
    }
    if (!xB.compensated) { // else the root is already compensated once
        xB.compensated = 1; // compensate once - in future we can compensate more times if necessary
        // there should be only 1 root in the 4u interval
        xB.riExp = flo_poly_1.refineK1(xB.ri.tS, xB.getPsExact)[0];
    }
    //console.log('compensated')
    //console.log('xA', expEst(xA.riExp.tS), ' - ', expEst(xA.riExp.tE));
    //console.log('xB', expEst(xB.riExp.tS), ' - ', expEst(xB.riExp.tE));
    res = flo_numerical_1.compare(xA.riExp.tS, xB.riExp.tS);
    if (res !== 0) {
        return res;
    }
    // At this stage it is either the same curve (mathematically if endpoints
    // and direction is ignored) or even the once compenensated roots cannot be
    // resolved. In future we can cascade compensations to ensure resolution
    // but we are already about a quadrillionth of a quadrillionth of a unit
    // accurate at this stage.
    res = inOutB.inOut.dir - inOutA.inOut.dir;
    if (res !== 0) {
        return res;
    }
    // At this stage they are both in or both out
    // We reverse sort the ins in comparison to the outs
    return inOutA.inOut.dir === 1
        ? inOutA.inOut.idx - inOutB.inOut.idx
        : inOutB.inOut.idx - inOutA.inOut.idx;
}
exports.compareOrderedInOut = compareOrderedInOut;
//# sourceMappingURL=compare-in-out.js.map