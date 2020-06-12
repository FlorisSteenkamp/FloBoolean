"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinY = void 0;
const flo_bezier3_1 = require("flo-bezier3");
const flo_memoize_1 = require("flo-memoize");
/**
 *
 */
let getMinY = flo_memoize_1.memoize(function getMinY(loop) {
    let curves = loop.curves;
    let bestY = flo_bezier3_1.getYBoundsTight(curves[0].ps).minY;
    let bestCurve = curves[0];
    for (let i = 1; i < curves.length; i++) {
        let ps = loop.curves[i].ps;
        let minY = flo_bezier3_1.getYBoundsTight(ps).minY;
        let v = minY.box[0][1];
        let x = bestY.box[0][1];
        if (v < x || (v === x && minY.ts[0] > bestY.ts[0])) {
            bestY = minY;
            bestCurve = loop.curves[i];
        }
    }
    return { curve: bestCurve, y: bestY };
});
exports.getMinY = getMinY;
//# sourceMappingURL=get-min-y.js.map