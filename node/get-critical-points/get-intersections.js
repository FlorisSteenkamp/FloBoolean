"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntersections = void 0;
const flo_bezier3_1 = require("flo-bezier3");
const sweep_line_1 = require("../sweep-line/sweep-line");
const get_curves_intersections_1 = require("./get-curves-intersections");
/**
 * Find and return all one-sided intersections on all given loops as a map from
 * each curve to an array of intersections on the curve, ordered by t value.
 * @param loops
 */
function getIntersections(loops, expMax) {
    let curves = [];
    for (let loop of loops) {
        for (let curve of loop.curves) {
            curves.push(curve);
        }
    }
    ;
    // Filter curves so that we eliminate those that can definitely not intersect
    let _xs = sweep_line_1.sweepLine(curves, curve => flo_bezier3_1.getBoundingBox(curve.ps)[0][0], curve => flo_bezier3_1.getBoundingBox(curve.ps)[1][0], get_curves_intersections_1.getCurvesIntersections(expMax));
    let xs = [];
    for (let _x of _xs) {
        for (let x of _x.u) {
            xs.push(x);
        }
    }
    return xs;
}
exports.getIntersections = getIntersections;
//# sourceMappingURL=get-intersections.js.map