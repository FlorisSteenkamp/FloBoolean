import { __X__ } from "../-x-.js";
import { Loop } from "../loop/loop.js";


/**
 * Set each intersection on the given original loop's `next` and `prev` value.
 *
 * @param xPairs
 */
function setIntersectionNextValues(xPairs: __X__[][]) {

    let xsByLoop: Map<Loop, __X__[]> = new Map();
    for (let xPair of xPairs) {
        for (let x_ of xPair) {
            let loop = x_.curve.loop;
            let xs_ = xsByLoop.get(loop) || [];
            if (!xs_.length) { 
                xsByLoop.set(loop, xs_); 
            }
            xs_.push(x_);
        }
    }

    for (let item of xsByLoop) {
        let xs = item[1];
        if (!xs || !xs.length) { continue; }

        xs.sort((xA, xB) => {
            let res = xA.curve.idx - xB.curve.idx;
            if (res !== 0) { return res; }
            res = xA.x.ri.tS - xB.x.ri.tS;
            if (res !== 0) { return res; }
            return xA.in_ !== undefined ? -1 : +1;
        });

        const len = xs.length;
        for (let i=0; i<len; i++) {
            xs[i].next = xs[(i+1)%len];
        }
    }
}


export { setIntersectionNextValues }
