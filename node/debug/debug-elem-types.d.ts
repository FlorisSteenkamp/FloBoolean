import { __X__ } from "../-x-.js";
import { Container } from "../container.js";
import { IPointOnShape } from "../point-on-shape/point-on-shape.js";
import { Loop } from "../loop/loop.js";
interface IDebugElems {
    readonly minY: IPointOnShape;
    readonly loop: Loop;
    readonly loopPre: number[][][];
    readonly loops: Loop[];
    readonly loopsPre: number[][][][];
    readonly intersection: __X__;
    container: Container;
    readonly bezier_: number[][];
    readonly looseBoundingBox_: number[][];
    readonly tightBoundingBox_: number[][];
    readonly boundingHull_: number[][];
}
export { IDebugElems };
