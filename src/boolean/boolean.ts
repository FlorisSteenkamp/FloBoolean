import type { SimplifyOptions } from '../main/simplify-options.js';
import type { BooleanOptions } from './boolean-options.js';
import { simplifyPaths } from '../main/simplify-paths.js';


/**
 * Returns the resulting bezier loops after performing a "boolean" operation
 * on the input loops.
 * 
 * * uses an algorithm similirar to that of Lavanya Subramaniam: PARTITION OF A
 * NON-SIMPLE POLYGON INTO SIMPLE POLYGONS (see `simplifyPaths`); 
 * 
 * @param bezierLoops an array of possibly intersecting loops
 * @param booleanOp defaults to `"OR"`
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
 * @param options optional; options
 */
function boolean(
        booleanOp: 'AND' | 'OR' | 'XOR',
        bezierLoops: number[][][][],
        options: BooleanOptions = {}): (number[][])[][] {

    const { minLoopArea } = options;

    const simplifyOptions: SimplifyOptions = {
        booleanOp,
        minLoopArea
    };

    const loopss = simplifyPaths(bezierLoops, simplifyOptions);

    const bezierLoops_ = loopss.flat(1).map(l => l.beziers);

    return bezierLoops_;
}


export { boolean }
