import { isSelfOverlapping } from "flo-bezier3";
import { toGrid } from "./to-grid";
import { fixBezierByPointSpacing } from "./fix-bezier-by-point-spacing";
function sendToGrid(expMax, maxBitLength) {
    return (p) => {
        const x = toGrid(p[0], expMax, maxBitLength);
        const y = toGrid(p[1], expMax, maxBitLength);
        if (x === p[0] && y === p[1]) {
            return p; // keep point's identity
        }
        return [x, y];
    };
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
    const gridSpacing = 2 ** expMax * 2 ** (-maxBitLength);
    const sendToGrid_ = doSendToGrid
        ? sendToGrid(expMax, maxBitLength)
        : sendToGridNoop;
    return (loop) => {
        const newPss = [];
        for (let i = 0; i < loop.length; i++) {
            let ps = loop[i].slice();
            // Get endpoint of last good bezier or else the original start point
            const len = newPss.length;
            const prevGoodBezier = newPss[len - 1];
            const prevGoodBezierEndpoint = prevGoodBezier
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
        const len = newPss.length;
        if (!len) {
            return [];
        }
        // Connect the last bezier end-point to the first bezier start-point.
        const ps = newPss[len - 1];
        ps[ps.length - 1] = newPss[0][0];
        return newPss;
    };
}
export { fixBeziers };
//# sourceMappingURL=fix-beziers.js.map