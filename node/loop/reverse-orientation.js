"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseOrientation = void 0;
const flo_bezier3_1 = require("flo-bezier3");
const loop_1 = require("./loop");
/**
 * Returns a completely reversed loop of the given bezier loop.
 * @param loop
 */
function reverseOrientation(loop) {
    let beziers = [];
    let curves = loop.curves;
    for (let i = curves.length - 1; i >= 0; i--) {
        let curve = flo_bezier3_1.reverse(curves[i].ps);
        beziers.push(curve);
    }
    return loop_1.loopFromBeziers(beziers);
}
exports.reverseOrientation = reverseOrientation;
//# sourceMappingURL=reverse-orientation.js.map