import type { X } from "../get-critical-points/x.js";
import type { Container } from "../containers/container.js";
import type { Loop } from "../shape/loop.js";
interface DebugElems {
    readonly minY: X;
    readonly loop: Loop;
    readonly loopPre: number[][][];
    readonly loops: Loop[];
    readonly loopsPre: number[][][][];
    readonly intersection: X;
    readonly container: Container;
    readonly bezier_: number[][];
    readonly looseBoundingBox_: number[][];
    readonly tightBoundingBox_: number[][];
    readonly boundingHull_: number[][];
}
export type { DebugElems };
