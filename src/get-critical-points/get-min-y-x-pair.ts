declare const _debug_: Debug;
import type { Debug } from '../debug/debug.js';
import type { Loop } from "../shape/loop.js";
import type { __X__ } from "./-x-.js";
import { clip } from '../utils/clip.js';
import { getLoopMinY } from "../shape/get-min-y.js";
import { makeSimpleX } from "./make-simple-x.js";


const { EPSILON: eps } = Number;


/**
 * Get a point with minimum y value of the given loop.
 * 
 * @param loop 
 */
function getMinYXpair(
        loop: Loop): [__X__,__X__] {

    const minY = getLoopMinY(loop);
    const { curve, y } = minY;

    if (typeof _debug_ !== 'undefined') {
        _debug_.elems.minY.push({ curve: minY.curve, p: y.p, t: y.t });
    }
    
    const t = clip(y.t, 0, 1);

    const p = y.p;
    const __x__: __X__ = {
        x: { 
            ri: { t, tS: t - 4*eps, tE: t + 4*eps, multiplicity: 1 },
            kind: 0,
            p,
        },
        curve
    }

    return [
        __x__,
        {...__x__}  // duplicate the object so that they are not the same object
    ];
}


export { getMinYXpair }
