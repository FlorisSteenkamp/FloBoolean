"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
/**
 * Represents a point on the shape boundary.
 */
class PointOnShape {
    /**
     * @param curve	The [[ICurve]] on the shape boundary this points belong to.
     * @param t The bezier parameter value on the curve to identify the point
     * coordinates.
     */
    constructor(curve, t) {
        this.curve = curve;
        this.t = t;
        // Cache
        this.p_ = undefined;
    }
    /**
     * The planar point coordinates of this [[PointOnShape]].
     */
    get p() {
        return this.p_ === undefined
            ? this.p_ = flo_bezier3_1.evalDeCasteljau(this.curve.ps, this.t)
            : this.p_;
    }
}
exports.PointOnShape = PointOnShape;
//# sourceMappingURL=point-on-shape.js.map