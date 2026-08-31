import { arcToCubicCurves } from "../path-data-polyfill/arc-to-cubic-curves.js";
/**
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
 *
 * @internal
 */
function a(s) {
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;
    // SVG arc params: rx ry x-axis-rotation large-arc-flag sweep-flag x y
    const start = s.p;
    const end = [s.vals[5], s.vals[6]];
    const rx = Math.abs(s.vals[0]); // spec: radii are treated as absolute values
    const ry = Math.abs(s.vals[1]);
    // Spec (F.6.2): if the endpoint is identical to the current point the arc
    // segment is omitted entirely.
    if (start[0] === end[0] && start[1] === end[1]) {
        return [];
    }
    // Spec (F.6.2): if either radius is zero, treat the arc as a straight line
    // to the endpoint.
    if (rx === 0 || ry === 0) {
        s.p = end; // Update current point
        return [[start, end]];
    }
    const flatCurves = arcToCubicCurves(start[0], // start x
    start[1], // start y
    end[0], // end x
    end[1], // end y
    rx, // rx
    ry, // ry
    s.vals[2], // x-axis rotation (degrees)
    s.vals[3], // large-arc-flag
    s.vals[4]);
    // Each returned cubic is a flat [c1x,c1y,c2x,c2y,ex,ey] with an implicit
    // start point (the arc start, then the previous cubic's end). Expand into
    // explicit [start, ctrl1, ctrl2, end] 4-point cubics.
    const curves = [];
    let cur = start;
    for (const c of flatCurves) {
        const curve = [cur, [c[0], c[1]], [c[2], c[3]], [c[4], c[5]]];
        curves.push(curve);
        cur = curve[3];
    }
    const lastPs = curves[curves.length - 1];
    s.p = lastPs[lastPs.length - 1]; // Update current point
    return curves;
}
export { a };
//# sourceMappingURL=a.js.map