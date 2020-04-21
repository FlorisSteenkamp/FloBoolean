
import { InOut } from "../../../in-out";
import { X } from "flo-bezier3";


interface OrderedInOut {
    inOut: InOut;
    /** 
     * the ordering around the container (anti-clockwise from bottom right) 
     * where the 'quadrant' (0 -> right edge, 1 -> top edge, 2 -> left edge, 
     * 3 -> bottom edge)
     */
    side: number;
    /** 
     * the t value (a quad) of the side such that when lexographically 
     * ordering the ordered pair [side, sideT] it forms a well-ordering of the 
     * InOut 
     */
    sideX: X;
}


export { OrderedInOut }
