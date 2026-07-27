import type { Loop } from "../loop/loop.js";
import type { __X__ } from "./-x-.js";
import { getMinY } from "../loop/get-min-y.js";
import { makeSimpleX } from "./make-simple-x.js";


/**
 * Get an extreme point (point with minimum y value) of the given loop.
 * 
 * @param loop 
 */
function getExtreme(
        loop: Loop): [__X__,__X__] {

    const { curve, y } = getMinY(loop);
    
    const ts = y.ts;

    if (ts[0] <= 0) {
        return [
            makeSimpleX(0,curve,0),      // extreme
            makeSimpleX(1,curve.prev,0)  // extreme
        ];
    }

    if (ts[1] >= 1) {
        return [
            makeSimpleX(1,curve,0),      // extreme
            makeSimpleX(0,curve.next,0)  // extreme
        ];
    }

    // FUTURE - should multiplicity be undefined in these cases?
    const __x__: __X__ = {
        x: { 
            ri: { t: ts[0], tS: ts[0], tE: ts[1], multiplicity: 1 },
            kind: 0,
            box: y.box
        }, 
        curve
    }

    return [
        __x__,
        {...__x__}  // duplicate the object so that they are not the same object
    ];
}


export { getExtreme }
