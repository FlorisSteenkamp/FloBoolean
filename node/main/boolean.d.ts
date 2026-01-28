import type { Loop } from '../loop/loop.js';
interface BooleanOptions {
    /**
     * * defaults to `(2**expMax * 2**(-12))**2`;
     * * minimum area of a bezer loop before it will be discarded
     */
    readonly minLoopArea?: number;
    /**
     * defaults to `false` (for historic reasons);
     */
    readonly keepOriginalOrientation?: boolean;
}
declare function AND(bits: boolean[]): boolean;
declare function OR(bits: boolean[]): boolean;
/**
 * * for multiple inputs, XOR is typically defined such that the output is `true`
 * if an odd number of inputs are `true`, and `false` if an even number of inputs are `true`.
 *
 * @param bits
 */
declare function XOR(bits: boolean[]): boolean;
/**
 * Returns the resulting bezier loops after performing a boolean operation on
 * the input loops.
 *
 * * uses an algorithm similirar to that of Lavanya Subramaniam: PARTITION OF A
 * NON-SIMPLE POLYGON INTO SIMPLE POLYGONS (see `simplifyPaths`);
 *
 * @param bezierLoopss an array of possibly intersecting loops
 * @param booleanOperator defaults to `AND`; the boolean operator to
 * use (AND, OR or XOR) or a custom function can be used
 * @param options options
 */
declare function boolean(bezierLoopss: number[][][][][], booleanOperator: (bits: boolean[]) => boolean, options?: BooleanOptions): Loop[][];
export type { BooleanOptions };
export { boolean, OR, AND, XOR };
