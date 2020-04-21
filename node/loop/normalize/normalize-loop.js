"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_numerical_1 = require("flo-numerical");
const fix_beziers_1 = require("./fix-beziers");
const to_grid_1 = require("./to-grid");
/**
 * Returns new loops from the given loops by aligning the 53-bit double
 * precision coordinates to 46-bit coordinates. This speeds up the algorithm
 * considerably.
 *
 * The following guarantees are put in place for the returned loops:
 * * All points are coerced onto a grid. In other words, such that the
 *   significand of all coordinates are reduced to a specified number of bits
 *   and the significant bits of all points 'overlap'.
 *
 * * No curves are disguised as higher order curves (this includes the case
 *   that no bezier is of zero length and the case where there are an infinite
 *   number of self-intersections). The curves are simply deflated exactly.
 *
 * * No cusps (this includes the case that all bezier end-points of each curve
 *   are seperated. (this prevents infinite curvature at the endpoints, etc).
 *   (this condition is not necessary for this algorithm but may help algorithms
 *    down the line that needs such guarantees)
 * @param loop
 * @param maxBitLength
 * @param expMax
 */
function normalizeLoops(bezierLoops, maxBitLength, expMax, doScramble = false, doSendToGrid = true) {
    let fixBeziers_ = fix_beziers_1.fixBeziers(expMax, maxBitLength, doSendToGrid);
    let loops = bezierLoops.slice();
    // just for testing purposes
    loops = doScramble ? scrambleLoops(loops, maxBitLength, expMax, 1) : loops;
    loops = loops.map(fixBeziers_);
    loops = loops.filter(loop => loop.length > 0);
    return loops;
}
exports.normalizeLoops = normalizeLoops;
/** Just for testing purposes - not used in the actual algorithm */
function scrambleLoops(loops, maxBitLength, expMax, mult = 0.02) {
    let loops_ = [];
    for (let loop of loops) {
        let loop_ = [];
        for (let bez of loop) {
            let bez_ = bez.map(v => v.map(c => {
                let c_ = 0;
                let ii = 0;
                let bl = 0;
                let mblc;
                let mbl = 0;
                while (true) {
                    if (++ii > 10) {
                        break;
                    }
                    c_ = (c + Math.random()) * (1 + ((Math.random() - 0.7) * mult));
                    c_ = to_grid_1.toGrid(c_, expMax, maxBitLength);
                    let bl = flo_numerical_1.bitLength(c_);
                    if (bl > mbl) {
                        mbl = bl;
                        mblc = c_;
                    }
                }
                return mblc;
            }));
            loop_.push(bez_);
        }
        loops_.push(loop_);
    }
    return loops_;
}
//# sourceMappingURL=normalize-loop.js.map