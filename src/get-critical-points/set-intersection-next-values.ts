import type { _X_ } from "./-x-.js";
import type { Loop } from "../shape/loop.js";
import type { Mutable } from "../utils/mutable.js";


/**
 * Set each intersection on the given original loop's `next` and `prev` value.
 *
 * @param xPairs
 */
function setIntersectionNextAndPrevs(
        xPairs: _X_[][]) {

    const xsByLoop: Map<Loop, _X_[]> = new Map();
    for (const xPair of xPairs) {
        for (const x_ of xPair) {
            const { loop } = x_.curve;
            xsByLoop.getOrInsert(loop, [])
                .push(x_)
        }
    }

    for (const xs of xsByLoop.values()) {
        if (xs === undefined || xs.length === 0) { continue; }

        xs.sort((xA, xB) => {
            let r = xA.curve.idx - xB.curve.idx;
            if (r !== 0) { return r; }

            r = xA.x.ri.tS - xB.x.ri.tS;
            if (r !== 0) { return r; }

            return xA.in_ !== undefined ? -1 : +1;
        });

        const len = xs.length;
        for (let i=0; i<len; i++) {
            const container = xs[i].container;

            // Skip over intersections that stay in the same container so that
            // `next`/`prev` always move to an intersection in a different
            // container (falls back to `xs[i]` itself if all share it).
            let ni = (i + 1)%len;
            while (ni !== i && xs[ni].container === container) {
                ni = (ni + 1)%len;
            }

            let pi = (i - 1 + len)%len;
            while (pi !== i && xs[pi].container === container) {
                pi = (pi - 1 + len)%len;
            }

            (xs[i] as Mutable<_X_>).next = xs[ni];
            (xs[i] as Mutable<_X_>).prev = xs[pi];
        }
    }
}


export { setIntersectionNextAndPrevs }
