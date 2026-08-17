declare const _debug_: Debug;
import type { Debug } from '../debug/debug.js';
import type { Loop } from "../shape/loop.js";
import type { _X_ } from "./-x-.js";
import { getLoopMinY } from "../shape/get-min-y.js";


/**
 * Get a point with minimum y value of the given loop.
 * 
 * @param loop 
 */
function getMinYXpair(
        loop: Loop): _X_ {

    const { curve, y } = getLoopMinY(loop);

    const _x_: _X_ = {
        x: y,
        curve,
        next: undefined!,  // will be set later
        prev: undefined!,  // ...
        container: undefined!
    }

    if (typeof _debug_ !== 'undefined') { _debug_.elems.minY.push(_x_); }

    return _x_;
}


export { getMinYXpair }
