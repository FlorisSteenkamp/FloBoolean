import type { _X_ } from "./-x-.js";
import type { Loop } from "../shape/loop.js";
import type { Mutable } from "../utils/mutable.js";
import { compareXs } from "../containers/compare-xs.js";


/**
 * Set each intersection on the given original loop's `next`/`prev` (the next/
 * prev intersection in a *different* container) as well as `nextBefExit`/
 * `prevBefExit` (the last intersection still in the *same* container before the
 * jump to the next/prev container - possibly the `_X_` itself).
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

        xs.sort(compareXs);

        const len = xs.length;
        for (let i=0; i<len; i++) {
            const container = xs[i].container;

            // Skip over intersections that stay in the same container so that
            // `next`/`prev` always move to an intersection in a different
            // container (falls back to `xs[i]` itself if all share it).
            let i_ = (i + 1)%len;
            while (i_ !== i && xs[i_].container === container) {
                i_ = (i_ + 1)%len;
            }

            let _i = (i - 1 + len)%len;
            while (_i !== i && xs[_i].container === container) {
                _i = (_i - 1 + len)%len;
            }

            // The last intersection still in the same container right before the
            // container changes (the one just before `ni`/`pi`) - falls back to
            // `xs[i]` itself when its immediate neighbour already leaves (or when
            // every intersection shares this container).
            const nbi = i_ === i ? i : (i_ - 1 + len)%len;
            const pbi = _i === i ? i : (_i + 1)%len;

            (xs[i] as Mutable<_X_>).next = xs[i_];
            (xs[i] as Mutable<_X_>).prev = xs[_i];
            (xs[i] as Mutable<_X_>).nextBefExit = xs[nbi];
            (xs[i] as Mutable<_X_>).prevBefExit = xs[pbi];
        }
    }
}


export { setIntersectionNextAndPrevs }
