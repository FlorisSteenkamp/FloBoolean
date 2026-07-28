import type { Loop } from '../loop/loop.js';


/**
 * Represents a bezier curve on the shape boundary / loop.
 */
interface Curve {
    /**
     * The curve's ordered index in the loop. This imposes a cyclic ordering of 
     * the curves in the loop.
     */
    readonly idx: number;
    /** The bezier control points of the curve. */
    readonly ps: number[][];
    /** 
     * The closed loop of bezier curves representing the shape boundary that 
     * this curve belongs to.
     */
    readonly loop: Loop;
    /**
     * The previous curve (when going in a negative direction around the shape 
     * boundary, i.e. clockwise for the outer shape and anti-clockwise for the 
     * holes (if any)).
     */
    readonly prev: Curve; 
    /**
     * The next curve (when going in a positive direction around the shape 
     * boundary, i.e. anti-clockwise for the outer shape and clockwise for the 
     * holes (if any)).
     */
    readonly next: Curve;
}


export type { Curve }
