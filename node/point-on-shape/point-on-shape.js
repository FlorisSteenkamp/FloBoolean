import { evalDeCasteljau } from 'flo-bezier3';
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
            ? this.p_ = evalDeCasteljau(this.curve.ps, this.t)
            : this.p_;
    }
}
export { PointOnShape };
//# sourceMappingURL=point-on-shape.js.map