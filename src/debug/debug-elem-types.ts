import { __X__ } from "../-x-";
import { Container } from "../container";
import { IPointOnShape } from "../point-on-shape/point-on-shape";
import { Loop } from "../loop/loop";


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
