import type { BezierPiece } from "flo-bezier3";
import type { __X__ } from "../../-x-.js";
import type { Container } from "../../container.js";
import type { X } from "../../x.js";


interface InOut {
    /** direction at container interface, in (-1) or out (+1) */
    readonly dir: -1|1;
    /**
     * identification index; two `InOuts` will have the same index (one with
     * `dir === -1` and one with `dir === +1`)
     */
    readonly idx?: number;
    /** intersection; the actuale one, not the "box side" intersection */
    readonly _x_?: __X__;
    /** the `Container` this `InOut` belongs to */
    readonly container: Container;
    /** intersection point used for creating beziers in center of `Container` */
    readonly p: number[];

    /** the next in or previous out from this InOut */
    readonly nextOrPrev?: InOut;

    /** the prior IInOut anti-clockwise around the container boundary */
    readonly prevAround?: InOut;
    /** the next IInOut anti-clockwise around the container boundary */
    readonly nextAround?: InOut;

    //--------------------------------------------------------------------------
    // Not all inouts will have the below properties,
    // **only** those that represent a loop.
    //--------------------------------------------------------------------------

    /** +1 or -1 -> Clockwise or anti-clockwise */
    readonly orientation: number;
    readonly windingNum: number;
    readonly parent?: InOut;
    readonly children: Set<InOut>;
    readonly bezierPieces?: BezierPiece[]; 
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
    /**
     * used in `boolean` only; Set of indexes indicating which loops belongs
     * to this `InOut` when seen as a loop
     */
    readonly loopsIdxs?: Set<number>;
    /** used in `getLoopsFromTree` to see if the loop was reified */
    readonly used?: boolean;
}


export type { InOut }
