"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterfaceIntersections = void 0;
const make_simple_x_1 = require("./make-simple-x");
function getInterfaceIntersections(loops) {
    /** all one-sided Xs from */
    let xs = [];
    // Get interface points
    for (let loop of loops) {
        for (let curve of loop.curves) {
            xs.push([
                make_simple_x_1.makeSimpleX(1, curve, 4),
                make_simple_x_1.makeSimpleX(0, curve.next, 4),
            ]);
        }
    }
    return xs;
}
exports.getInterfaceIntersections = getInterfaceIntersections;
//# sourceMappingURL=get-interface-intersections.js.map