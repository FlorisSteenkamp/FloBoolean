import type { __X__ } from "./-x-.js";
import type { Loop } from "../shape/loop.js";
import type { Mutable } from "../utils/mutable.js";


/**
 * Set each intersection on the given original loop's `next` and `prev` value.
 *
 * @param xPairs
 */
function setIntersectionNextValues(
        xPairs: __X__[][]) {

    const xsByLoop: Map<Loop, __X__[]> = new Map();
    for (const xPair of xPairs) {
        for (const x_ of xPair) {
            const loop = x_.curve.loop;
            const xs_ = xsByLoop.get(loop) || [];
            if (!xs_.length) { 
                xsByLoop.set(loop, xs_); 
            }
            xs_.push(x_);
        }
    }

    for (const item of xsByLoop) {
        const xs = item[1];
        if (!xs || !xs.length) { continue; }

        xs.sort((xA, xB) => {
            let r = xA.curve.idx - xB.curve.idx;
            if (r !== 0) { return r; }
            r = xA.x.ri.tS - xB.x.ri.tS;
            if (r !== 0) { return r; }
            return xA.in_ !== undefined ? -1 : +1;
        });

        const len = xs.length;
        for (let i=0; i<len; i++) {
            (xs[i] as Mutable<__X__>).next = xs[(i+1)%len];
            (xs[i] as Mutable<__X__>).prev = xs[(i-1+len)%len];
        }
    }
}


export { setIntersectionNextValues }
