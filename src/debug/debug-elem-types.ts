import type { __X__ } from "../get-critical-points/-x-.js";
import type { Container } from "../containers/container.js";
import type { PointOnShape } from "./point-on-shape.js";
import type { Loop } from "../loop/loop.js";


interface DebugElems {
    readonly minY: PointOnShape;
    readonly loop: Loop;
    readonly loopPre: number[][][];
    readonly loops: Loop[],
    readonly loopsPre: number[][][][];
    readonly intersection: __X__;
    readonly container: Container;
    // keep the underscore in the names below so not to clash with other debug 
    // elems in other libraries
    readonly bezier_: number[][];
    readonly looseBoundingBox_: number[][];
    readonly tightBoundingBox_: number[][];
    readonly boundingHull_: number[][];
}


export type { DebugElems }
