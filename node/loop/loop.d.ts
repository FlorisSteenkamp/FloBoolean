import { Curve } from '../curve/curve.js';
/**
 * Represents a two-way linked loop of [[ICurve]]s - mostly used internally to
 * conveniently represent shape boundaries.
 */
interface Loop {
    /** The curves that represent the shape boundary as an array. */
    curves: Curve[];
    /** A pre-ordered array of bezier curves to add initially.*/
    beziers: number[][][];
    /** A reference to the loop */
    idx?: number;
}
/**
 * @param beziers a pre-ordered array of bezier curves to add initially.
 * @param idx an optional index to assign to the loop - it can be anything
 */
declare function loopFromBeziers(beziers?: number[][][], idx?: number): Loop;
export { Loop, loopFromBeziers };
