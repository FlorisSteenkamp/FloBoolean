"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_min_y_1 = require("../loop/get-min-y");
const make_simple_x_1 = require("./make-simple-x");
/**
 * Get an extreme point (point with minimum y value) of the given loop.
 * @param loop
 */
function getExtreme(loop) {
    let { curve, y } = get_min_y_1.getMinY(loop);
    let ts = y.ts;
    if (ts[0] <= 0) {
        return [
            make_simple_x_1.makeSimpleX(0, curve, 0),
            make_simple_x_1.makeSimpleX(1, curve.prev, 0) // extreme
        ];
    }
    if (ts[1] >= 1) {
        return [
            make_simple_x_1.makeSimpleX(1, curve, 0),
            make_simple_x_1.makeSimpleX(0, curve.next, 0) // extreme
        ];
    }
    return [
        // TODO - should multiplicity be undefined in these cases?
        // TODO - do we need 2 intersections???
        { x: { ri: { tS: ts[0], tE: ts[1], multiplicity: 1 }, kind: 0, box: y.box }, curve },
        { x: { ri: { tS: ts[0], tE: ts[1], multiplicity: 1 }, kind: 0, box: y.box }, curve } // extreme
    ];
}
exports.getExtreme = getExtreme;
//# sourceMappingURL=get-extreme.js.map