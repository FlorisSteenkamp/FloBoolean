"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.a = void 0;
const arc_to_cubic_curves_1 = require("../arc-to-cubic-curves");
/**
 * @hidden
 * A and a: (from www.w3.org)
 *
 * params: rx ry x-axis-rotation large-arc-flag sweep-flag x y
 *
 * Draws an elliptical arc from the current point to (x, y). The size and
 * orientation of the ellipse are defined by two radii (rx, ry) and an
 * x-axis-rotation, which indicates how the ellipse as a whole is rotated
 * relative to the current coordinate system. The center (cx, cy) of the ellipse
 * is calculated automatically to satisfy the constraints imposed by the other
 * parameters. large-arc-flag and sweep-flag contribute to the automatic
 * calculations and help determine how the arc is drawn.
 */
function a(s) {
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;
    let curves = arc_to_cubic_curves_1.arcToCubicCurves(s.p, s.vals[0], s.vals[1], s.vals[2], s.vals[3], s.vals[4], [s.vals[5], s.vals[6]]);
    let lastPs = curves[curves.length - 1];
    s.p = lastPs[lastPs.length - 1]; // Update current point
    return curves;
}
exports.a = a;
//# sourceMappingURL=a.js.map