import type { BezierPiece } from "flo-bezier3";
import type { _X_ } from "../../get-critical-points/-x-.js";
import type { Container } from "../container.js";


interface In extends InOut {
    /** direction at container interface, in (-1) or out (+1) */
    readonly dir: -1;
}


interface Out extends InOut {
    /** direction at container interface, in (-1) or out (+1) */
    readonly dir: 1;
}


interface InOut {
    /** direction, in (-1) or out (+1) */
    readonly dir: -1|1;
    /**
     * identification index; two `InOuts` will have the same index (one with
     * `dir === -1` and one with `dir === +1`)
     */
    readonly idx: number;
    /** intersection; the actual one, not the "box side" intersection */
    readonly _x_: _X_;
    /** the `Container` this `InOut` belongs to */
    readonly container: Container;

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

    // Order Info - could be moved to a seperate parallel object
    oSideIdxs?: number[];
}


export type { In, Out, InOut }
