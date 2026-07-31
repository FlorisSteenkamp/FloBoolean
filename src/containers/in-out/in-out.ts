import type { BezierPiece } from "flo-bezier3";
import type { __X__ } from "../../get-critical-points/-x-.js";
import type { Container } from "../container.js";
import type { X } from "../../get-critical-points/x.js";


interface In extends InOut {
    /** direction at container interface, in (-1) or out (+1) */
    readonly dir: -1;
}


interface Out extends InOut {
    /** direction at container interface, in (-1) or out (+1) */
    readonly dir: 1;
}


interface InOut {
    /** direction at container interface, in (-1) or out (+1) */
    readonly dir: -1|1;
    /**
     * identification index; two `InOuts` will have the same index (one with
     * `dir === -1` and one with `dir === +1`)
     */
    readonly idx: number;
    /** intersection; the actuale one, not the "box side" intersection */
    readonly _x_: __X__;
    /** the `Container` this `InOut` belongs to */
    readonly container: Container;
    /** intersection point used for creating beziers in center of `Container` */
    readonly p: number[];

    /** the next in or previous out from this InOut */
    readonly nextOrPrev: InOut;

    /** the prior `InOut` anti-clockwise around the container boundary */
    readonly prevAround: InOut;
    /** the next `InOut` anti-clockwise around the container boundary */
    readonly nextAround: InOut;

    //--------------------------------------------------------------------------
    // Not all inouts will have the below properties,
    // **only** those that represent a loop.
    //--------------------------------------------------------------------------

    /** +1 or -1 -> Clockwise or anti-clockwise */
    readonly orientation: number;
    readonly windingNum: number;
    readonly parent: Out;
    readonly children: Set<Out>;
    readonly bezierPieces: BezierPiece[]; 
    /** 
     * the edge ordering around the container
     *   * 0 -> MinY edge (top)
     *   * 1 -> MinX edge (left)
     *   * 2 -> MaxY edge (bottom)
     *   * 3 -> MaxX edge (right)
     */
    readonly side: number;
    /** 
     * The intersection with the side of the container.
     * 
     * The root interval of the intersection (`ri`, a pair of double-doubles)
     * of the side such that when lexographically ordering the ordered pair
     * [side, sideT] it forms a well-ordering of the InOut.
     */
    readonly sideX: X;
    /**
     * used in `boolean` only; Set of indexes indicating which loops belongs
     * to this `InOut` when seen as a loop
     */
    readonly loopsIdxs: Set<number>;
    
    /** used in `getLoopsFromTree` to see if the loop was reified */
    readonly used: boolean;
}


const MinY = 0;
const MinX = 1;
const MaxY = 2;
const MaxX = 3;


export type { In, Out, InOut }
export { MinY, MinX, MaxY, MaxX }

