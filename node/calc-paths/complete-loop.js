"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_next_exit_1 = require("./get-next-exit");
const get_beziers_to_next_container_1 = require("./get-beziers-to-next-container");
const flo_bezier3_1 = require("flo-bezier3");
/**
 * Completes a loop for a specific intersection point entry curve.
 * @param takenOuts
 * @param out
 * @param g
 */
function completeLoop(expMax, takenOuts, out) {
    let additionalOutsToCheck = [];
    let beziers = [];
    // Move immediately to the outgoing start of the loop
    let out_ = out;
    let additionalBezier;
    do {
        takenOuts.add(out_); // Mark this intersection as taken
        let { beziers: additionalBeziers, in_, inBez } = get_beziers_to_next_container_1.getBeziersToNextContainer(expMax, out_);
        // TODO - it will probably better to remove additionalBeziers and just
        // connect the endpoints of adjacent beziers - even if we had near
        // exact coordinates (think quad or better precision) of intersections
        // they are still not returned as algebraic numbers so we can never have
        // a perfect algorithm anyway without returning algebraic numbers as 
        // intersection coordinates, hence we might as well remove 
        // additionalBeziers whose length is about a trillionth of the max
        // coordinate of loops
        beziers.push(...additionalBeziers);
        ({ out_, additionalBezier } = get_next_exit_1.getNextExit(expMax, in_, out, additionalOutsToCheck, takenOuts));
        if (additionalBezier) {
            let t = flo_bezier3_1.closestPointOnBezierPrecise(inBez, additionalBezier[0]).t;
            let inBez_ = flo_bezier3_1.fromTo(inBez)(0, t);
            beziers.push(inBez_);
            beziers.push(additionalBezier);
        }
        else {
            beziers.push(inBez);
        }
    } while (out_ !== out);
    return { beziers, additionalOutsToCheck };
}
exports.completeLoop = completeLoop;
//# sourceMappingURL=complete-loop.js.map