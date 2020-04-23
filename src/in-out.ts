
import { _X_ } from "./x";
import { Container } from "./container";
import { Loop } from "./loop/loop";


interface InOut {
    /** direction, in (-1) or out (+1) */
    dir: -1|1; 
    /** 
     * the ordering around the container (anti-clockwise from bottom right) 
     * where the first number is the 'quadrant' (0 -> right edge, 1 -> top edge, 
     * 2 -> left edge, 3 -> bottom edge) and the second the t value of on the 
     * side
     */
    //order?: [number, number];
    idx?: number;
    /** intersection */
    _x_?: _X_;
    container: Container;
    /** intersection point with the container box */
    p: number[];

    /** the next in from this out */
    next?: InOut;

    /** the prior IInOut anti-clockwise around the container boundary */
    prevAround?: InOut;
    /** the next IInOut anti-clockwise around the container boundary */
    nextAround?: InOut;

    // not all inouts will have the below properties, only those that represent 
    // a loop
    /** +1 or -1 -> Clockwise or anti-clockwise */
    orientation?: number;
    windingNum?: number;
    //windingNum?: Map<Loop,number>;
    parent?: InOut;
    children?: Set<InOut>;
    beziers?: number[][][]; 
}


export { InOut }
