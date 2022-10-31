import { __X__ } from "./-x-.js";
import { Container } from "./container.js";
import { X } from "./x.js";
interface InOut {
    /** direction, in (-1) or out (+1) */
    dir: -1 | 1;
    idx?: number;
    /** intersection */
    _x_?: __X__;
    container: Container;
    /** intersection point with the container box */
    p: number[];
    /** the next in from this out */
    next?: InOut;
    /** the prior IInOut anti-clockwise around the container boundary */
    prevAround?: InOut;
    /** the next IInOut anti-clockwise around the container boundary */
    nextAround?: InOut;
    /** +1 or -1 -> Clockwise or anti-clockwise */
    orientation?: number;
    windingNum?: number;
    parent?: InOut;
    children?: Set<InOut>;
    beziers?: number[][][];
    /**
     * the ordering around the container (anti-clockwise from bottom right)
     * where the 'quadrant' (0 -> right edge, 1 -> top edge, 2 -> left edge,
     * 3 -> bottom edge)
     */
    side?: number | undefined;
    /**
     * The intersection with the side of the container.
     *
     * The root interval of the intersection (`ri`, a pair of double-doubles)
     * of the side such that when lexographically ordering the ordered pair
     * [side, sideT] it forms a well-ordering of the InOut.
     */
    sideX?: X | undefined;
}
export { InOut };
