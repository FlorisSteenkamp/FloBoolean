
import { _X_ } from "../x";
import { Container } from "../container";
import { IPointOnShape } from "../point-on-shape/point-on-shape";
import { Loop } from "../loop/loop";


interface IDebugElems {
    minY: IPointOnShape;
    loop: Loop;
    loops: Loop[],
    intersection: _X_;
    container: Container;
    // keep the underscore in the names below so not to clash with other debug 
    // elems in other libraries
    bezier_: number[][];
    looseBoundingBox_: number[][];
    tightBoundingBox_: number[][];
    boundingHull_: number[][]; 
}


export { IDebugElems }
