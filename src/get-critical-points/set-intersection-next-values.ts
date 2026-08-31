import type { _X_ } from "./-x-.js";
import type { Mutable } from "../utils/mutable.js";
import type { In, Out } from "../containers/in-out/in-out.js";
import { compareXs } from "../containers/compare-xs.js";


/**
 * Set each intersection on the given original loop's `next`/`prev` (the next/
 * prev intersection in a *different* container) and emit its `In`/`Out` when it
 * is an entry/exit of its container - i.e. when its immediate loop-neighbour is
 * already in a different container (consumed later by `getXInOuts`).
 *
 * @param xPairs
 */
function setIntersectionNextAndPrevs(
        xPairs: _X_[][]) {

    const xsByLoop: _X_[][] = [];
    for (const xPair of xPairs) {
        for (const _x_ of xPair) {
            const { idx } = _x_.x.curve.loop;
            (xsByLoop[idx] ??= []).push(_x_);
        }
    }

    for (const xs of xsByLoop) {
        if (xs === undefined || xs.length === 0) { continue; }

        xs.sort(compareXs);

        const len = xs.length;
        for (let i=0; i<len; i++) {
            const _x_ = xs[i];
            const { container } = _x_;

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

            //----------------
            // Mutate
            //----------------
            let _x__ = _x_ as Mutable<_X_>;
            _x__.next = xs[i_];
            _x__.prev = xs[_i];

            // An `_X_` is an entry (`In`) / exit (`Out`) of its container exactly
            // when its immediate loop-neighbour is already in a different one.
            if (xs[(i - 1 + len)%len].container !== container) {
                _x__.in_ = { dir: -1, _x_, loop: _x_.x.curve.loop.beziers } as In;
            }
            if (xs[(i + 1)%len].container !== container) {
                _x__.out = { dir: +1, _x_, loop: _x_.x.curve.loop.beziers } as Out;
            }
        }
    }
}


export { setIntersectionNextAndPrevs }
