import { isSelfOverlapping } from "flo-bezier3";
import { toGrid } from "./to-grid.js";
import { fixBezierByPointSpacing } from "./fix-bezier-by-point-spacing.js";
function sendToGrid(expMax, maxBitLength) {
    return (p) => [
        toGrid(p[0], expMax, maxBitLength),
        toGrid(p[1], expMax, maxBitLength)
    ];
}
function sendToGridNoop(p) { return p; }
/**
 * Returns the grid-aligned loop derived from the given input loop.
 *
 * Also ensures that:
 * * All points are coerced onto a grid.
 * * All bezier points of a single curve are seperated.
 * @param expMax The exponent, e, such that 2^e > all bezier coordinate points.
 * @param maxBitLength
 */
function fixBeziers(expMax, maxBitLength, doSendToGrid = true) {
    /** The actual control point grid spacing */
    let gridSpacing = 2 ** expMax * 2 ** (-maxBitLength);
    let sendToGrid_ = doSendToGrid
        ? sendToGrid(expMax, maxBitLength)
        : sendToGridNoop;
    return (loop) => {
        let newPss = [];
        for (let i = 0; i < loop.length; i++) {
            let ps = loop[i].slice();
            // Get endpoint of last good bezier or else the original start point
            let len = newPss.length;
            let prevGoodBezier = newPss[len - 1];
            let prevGoodBezierEndpoint = prevGoodBezier
                ? prevGoodBezier[prevGoodBezier.length - 1]
                : sendToGrid_(loop[0][0]); // Bit-align original start point
            // Set the start point to the previous good bezier's endpoint
            ps[0] = prevGoodBezierEndpoint;
            // Align to grid before doing any further checks
            ps = ps.map(p => sendToGrid_(p));
            // Check if ps degenerates into a self-overlapping line
            if (isSelfOverlapping(ps)) {
                // Change into a line with endponts that of the original bezier
                ps = [ps[0], ps[ps.length - 1]];
            }
            ps = fixBezierByPointSpacing(ps, gridSpacing, sendToGrid_);
            if (ps !== undefined) {
                newPss.push(ps);
            }
        }
        let len = newPss.length;
        if (!len) {
            return [];
        }
        // Connect the last bezier end-point to the first bezier start-point.
        let ps = newPss[len - 1];
        ps[ps.length - 1] = newPss[0][0];
        return newPss;
    };
}
export { fixBeziers };
//# sourceMappingURL=fix-beziers.js.map