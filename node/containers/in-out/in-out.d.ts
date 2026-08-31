import type { RootIntervalExp } from "flo-poly";
import type { _X_ } from "../../get-critical-points/-x-.js";
import type { SideCrossing } from "../get-container-in-outs/get-in-outs-via-sides/side-crossing.js";
import { Container } from "../container.js";
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
    readonly prevAround: In | Out;
    /** the next `InOut` anti-clockwise around the container boundary */
    readonly nextAround: In | Out;
    /** +1 or -1 -> Clockwise or anti-clockwise */
    readonly orientation: number;
    readonly windingNum: number;
    readonly parent: Out;
    readonly children: Set<Out>;
    readonly path: Out[];
    readonly container: Container;
    /** cache used during `In`/`Out` comparisons */
    oSideIdxs?: number[];
    /** cache used during `In`/`Out` comparisons */
    oFSC?: SideCrossing;
    /** cache used during `In`/`Out` comparisons */
    oFSCE?: RootIntervalExp;
    /** cache used during `In`/`Out` comparisons */
    oSideIdx?: number;
    /**
     * set in `rerun` when the in/out's `dir` was flipped while the underlying
     * loop direction stayed the same; box-side crossing must then be found by
     * walking the loop the opposite way.
     */
    swapped?: boolean;
    /** The bezier loop belonging to the `_X_` of this `In`/`Out` */
    loop: number[][][];
}
interface Out extends InOut {
    /** direction at container interface, in (-1) or out (+1) */
    readonly dir: 1;
    /** the next in from this Out */
    readonly twin: In;
}
interface In extends InOut {
    /** direction at container interface, in (-1) or out (+1) */
    readonly dir: -1;
    /** the previous out from this In */
    readonly twin: Out;
}
export type { In, Out, InOutBase, InOut };
