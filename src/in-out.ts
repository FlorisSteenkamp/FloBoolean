import { __X__ } from "./-x-.js";
import { Container } from "./container.js";
import { X } from "./x.js";


interface InOut {
    /** direction, in (-1) or out (+1) */
    readonly dir: -1|1; 
    readonly idx?: number;
    /** intersection */
    readonly _x_?: __X__;
    readonly container: Container;
    /** intersection point used for creating beziers in center of box */
    readonly p: number[];
    /** intersection point with the container box; used for debugging only */
    readonly pBox: number[];

    /** the next in from this out */
    readonly next?: InOut;
    /** the prev in from this out */
    readonly prev?: InOut;

    /** the prior IInOut anti-clockwise around the container boundary */
    readonly prevAround?: InOut;
    /** the next IInOut anti-clockwise around the container boundary */
    readonly nextAround?: InOut;

    // not all inouts will have the below properties, only those that represent 
    // a loop
    /** +1 or -1 -> Clockwise or anti-clockwise */
    readonly orientation?: number;
    readonly windingNum?: number;
    readonly parent?: InOut;
    readonly children?: Set<InOut>;
    readonly beziers?: number[][][]; 
    /** 
     * the ordering around the container (anti-clockwise from bottom right) 
     * where the 'quadrant' (0 -> right edge, 1 -> top edge, 2 -> left edge, 
     * 3 -> bottom edge)
     */
    readonly side?: number | undefined;
    /** 
     * The intersection with the side of the container.
     * 
     * The root interval of the intersection (`ri`, a pair of double-doubles)
     * of the side such that when lexographically ordering the ordered pair
     * [side, sideT] it forms a well-ordering of the InOut.
     */
    readonly sideX?: X | undefined;
}


export { InOut }
