import { Loop } from '../loop/loop';


/**
 * Represents a bezier curve on the shape boundary / loop.
 */
interface Curve {
	/** 
	 * The closed loop of bezier curves representing the shape boundary that 
	 * this curve belongs to.
	 */
	loop: Loop;
	/** The bezier control points of the curve. */
	ps: number[][];
	/**
	 * The previous curve (when going in a negative direction around the shape 
	 * boundary, i.e. clockwise for the outer shape and anti-clockwise for the 
	 * holes (if any)).
	 */
	prev: Curve; 
	/**
	 * The next curve (when going in a positive direction around the shape 
	 * boundary, i.e. anti-clockwise for the outer shape and clockwise for the 
	 * holes (if any)).
	 */
	next: Curve;
	/**
	 * The curve's ordered index in the loop. This imposes a cyclic ordering of 
	 * the curves in the loop.
	 */
	idx: number;
}


export { Curve }
