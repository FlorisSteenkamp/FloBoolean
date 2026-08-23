import type { _X_ } from "../../get-critical-points/-x-.js";


interface InOutBase {
    /**
     * identification index; two `InOuts` will have the same index (one with
     * `dir === -1` and one with `dir === +1`)
     */
    readonly idx: number;
    /** intersection; the actual one, not the "box side" intersection */
    readonly _x_: _X_;
}


interface InOut extends InOutBase {
    /** the prior `InOut` anti-clockwise around the container boundary */
    readonly prevAround: In|Out;
    /** the next `InOut` anti-clockwise around the container boundary */
    readonly nextAround: In|Out;

    //--------------------------------------------------------------------------
    // Not all inouts will have the below properties,
    // **only** those that represent a loop.
    //--------------------------------------------------------------------------

    /** +1 or -1 -> Clockwise or anti-clockwise */
    readonly orientation: number;
    readonly windingNum: number;
    readonly parent: Out;
    readonly children: Set<Out>;
    readonly path: (In|Out)[];

    // Order Info - could be moved to a seperate parallel object
    oSideIdxs?: number[];
}


interface Out extends InOut {
    /** direction at container interface, in (-1) or out (+1) */
    readonly dir: 1;
    /** the next in this Out */
    readonly next: In;
}


interface In extends InOut {
    /** direction at container interface, in (-1) or out (+1) */
    readonly dir: -1;
    /** the previous out from this In */
    readonly prev: Out;
}


export type { In, Out, InOutBase, InOut }
