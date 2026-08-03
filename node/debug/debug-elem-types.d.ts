import type { _X_ } from "../get-critical-points/-x-.js";
import type { Container } from "../containers/container.js";
import type { Loop } from "../shape/loop.js";
import { Curve } from "../curve/curve.js";
interface DebugElems {
    readonly minY: {
        curve: Curve;
        readonly t: number;
        readonly p: number[];
    };
    readonly loop: Loop;
    readonly loopPre: number[][][];
    readonly loops: Loop[];
    readonly loopsPre: number[][][][];
    readonly intersection: _X_;
    readonly container: Container;
    readonly bezier_: number[][];
    readonly looseBoundingBox_: number[][];
    readonly tightBoundingBox_: number[][];
    readonly boundingHull_: number[][];
}
export type { DebugElems };
