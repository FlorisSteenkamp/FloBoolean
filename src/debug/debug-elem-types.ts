import { __X__ } from "../-x-.js";
import { Container } from "../container.js";
import { IPointOnShape } from "../point-on-shape/point-on-shape.js";
import { Loop } from "../loop/loop.js";


interface IDebugElems {
    minY: IPointOnShape;
    loop: Loop;
    loopPre: number[][][];
    loops: Loop[],
    loopsPre: number[][][][];
    intersection: __X__;
    container: Container;
    // keep the underscore in the names below so not to clash with other debug 
    // elems in other libraries
    bezier_: number[][];
    looseBoundingBox_: number[][];
    tightBoundingBox_: number[][];
    boundingHull_: number[][];
}


export { IDebugElems }
