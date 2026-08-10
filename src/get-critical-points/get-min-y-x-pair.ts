declare const _debug_: Debug;
import type { Debug } from '../debug/debug.js';
import type { Loop } from "../shape/loop.js";
import type { _X_ } from "./-x-.js";
import { eps } from 'flo-poly';
import { clip } from '../utils/clip.js';
import { getLoopMinY } from "../shape/get-min-y.js";


/**
 * Get a point with minimum y value of the given loop.
 * 
 * @param loop 
 */
function getMinYXpair(
        loop: Loop): _X_ {

    const minY = getLoopMinY(loop);
    const { curve, y } = minY;

    if (typeof _debug_ !== 'undefined') {
        _debug_.elems.minY.push({ curve, p: y.p, t: y.t });
    }
    
    const t = clip(y.t, 0, 1);

    const p = y.p;
    const _x_: _X_ = {
        x: { 
            ri: { t, tS: t - 4*eps, tE: t + 4*eps, multiplicity: 1 },
            kind: 0,
            p,
        },
        curve,
        next: undefined!, // will be set later
        prev: undefined!, // ...
        container: undefined!
    }

    // duplicate the object so that they are not the same object
    return _x_;
}


export { getMinYXpair }
