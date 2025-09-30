import type { Curve } from '../curve/curve.js';
/**
 * Represents a two-way linked loop of `Curve`s.
 */
interface Loop {
    /** The curves that represent the shape boundary as an array. */
    readonly curves: Curve[];
    /** A pre-ordered array of bezier curves to add initially.*/
    readonly beziers: number[][][];
    /** A reference to the loop */
    readonly idx?: number;
}
export { Loop };
