import type { Curve } from "../curve/curve.js";
import type { _X_ } from "./-x-.js";
import { createRootExact } from 'flo-poly';
import { toP } from "../utils/to-p.js";


/**
 * 
 * @param t 
 * @param curve 
 * @param kind 
 */
function makeSimpleX(
        t: number,
        curve: Curve,
        kind: 0|1|2|3|4|5|7): _X_ {

    const { ps } = curve;
    const ri = createRootExact(t);
    const p = toP(ps, t);

    return {
        x: { ri, p, kind },
        curve,
        next: undefined!,
        prev: undefined!,
        container: undefined!,
        order: 0
    };
}


export { makeSimpleX }
