import { evalDeCasteljau } from 'flo-bezier3';
import { Curve } from '../curve/curve.js';


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
class PointOnShape implements IPointOnShape {

    /** 
     * @param curve	The [[ICurve]] on the shape boundary this points belong to.
     * @param t The bezier parameter value on the curve to identify the point
     * coordinates.
     */	
    constructor(
            public readonly curve: Curve,
            public readonly t: number) {
    }	


    // Cache
    private p_ : number[] | undefined = undefined;
    /**
     * The planar point coordinates of this [[PointOnShape]].
     */
    get p() {
        return this.p_ === undefined
            ? this.p_ = evalDeCasteljau(this.curve.ps, this.t)
            : this.p_;
    }
}


export { 
    IPointOnShape,
    PointOnShape
}
