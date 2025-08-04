import { Curve } from '../curve/curve';
interface IPointOnShape {
    /** The Curve on the shape boundary this points belong to. */
    curve: Curve;
    /** The bezier parameter value on the curve identifying the point coordinates. */
    t: number;
    p: number[];
}
/**
 * Represents a point on the shape boundary.
 */
declare class PointOnShape implements IPointOnShape {
    readonly curve: Curve;
    readonly t: number;
    /**
     * @param curve	The [[ICurve]] on the shape boundary this points belong to.
     * @param t The bezier parameter value on the curve to identify the point
     * coordinates.
     */
    constructor(curve: Curve, t: number);
    private p_;
    /**
     * The planar point coordinates of this [[PointOnShape]].
     */
    get p(): number[];
}
export { IPointOnShape, PointOnShape };
