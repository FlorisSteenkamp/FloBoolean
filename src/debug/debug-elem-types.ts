import type { _X_ } from "../get-critical-points/-x-.js";
import type { Container } from "../containers/container.js";
import type { Loop } from "../shape/loop.js";


interface DebugElems {
    readonly minY: _X_;
    readonly loop: Loop;
    readonly loopPre: number[][][];
    readonly loops: Loop[],
    readonly loopsPre: number[][][][];
    readonly intersection: _X_;
    readonly container: Container;
    // keep the underscore in the names below so not to clash with other debug 
    // elems in other libraries
    readonly bezier_: number[][];
    readonly looseBoundingBox_: number[][];
    readonly tightBoundingBox_: number[][];
    readonly boundingHull_: number[][];
}


export type { DebugElems }
