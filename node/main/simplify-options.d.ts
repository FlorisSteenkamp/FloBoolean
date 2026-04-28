import type { BooleanOptions } from '../boolean/boolean-options.js';
interface SimplifyOptions extends BooleanOptions {
    /**
     * generally set this to `false`; if `true` then the resulting paths
     * will be mathematically guaranteed not to intersect but it adds many
     * extremely short lines to the final curve
     */
    readonly inclMicroCorners?: boolean;
    /**
     * defaults to `false` (for historic reasons); if `true` then the returned
     * paths all have a positive (counter-clockwise) orientation for each single
     * outermost loop (with the set of returned loops) with the rest being negatively
     * oriented (the holes), else, if `false` the reverse is true.
     */
    /**
     * defaults to `false` (for historic reasons);
     */
    /**
     * defaults to `"OR"`
     *
     * **Not** really a boolean operation, rather a kind of "winding num"
     * operation, think e.g. of three overlapping circles (creating 7 distinct
     * regions (8 if outside is counted)); these regions can have winding numbers
     * ranging from 0 to 3 and a simple boolean operation is too simple to handle
     * all cases - there are actually a ton of cases being combinations of the
     * winding numbers, e.g you can have the result being the regions with
     * only winding number 2, or only 2 and three, etc. etc.
     *
     * What we will call a boolean operation here though means:
     * * `"AND"` (intersect) -> winding numbers >= 2
     * * `"OR"` (union) -> winding numbers >= 1
     * * `"XOR"` (exclude) -> winding numbers === 1
     */
    readonly booleanOp?: 'AND' | 'OR' | 'XOR';
    /** for debugging purposes; don't use */
    readonly containerSizeMultiplier?: number;
}
export type { SimplifyOptions };
