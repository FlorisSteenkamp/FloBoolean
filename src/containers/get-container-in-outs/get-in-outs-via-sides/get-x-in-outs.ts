import type { _X_ } from "../../../get-critical-points/-x-.js";
import type { In, InOut, Out } from "../../../containers/in-out/in-out.js";
import type { Container } from "../../container.js";
import type { Mutable } from "../../../utils/mutable.js";


/**
 * Returns the incoming / outgoing curves (as `In`s / `Out`s) for the given
 * `_X_`s of a single container.
 *
 * The in/out direction is derived directly from each `_X_`'s loop-ordering
 * properties (`next`/`prev`/`nextBefExit`/`prevBefExit`, set by
 * `setIntersectionNextAndPrevs`) - no container-side intersections are needed:
 *
 * * an `_X_` is an **entry** point (gets an `In`) when it is the first `_X_` of
 *   its container along the loop, i.e. its loop-backward neighbour is already in
 *   a different container (`prevBefExit === _x_`, with `prev !== _x_`).
 * * an `_X_` is an **exit** point (gets an `Out`) when it is the last `_X_` of
 *   its container along the loop, i.e. its loop-forward neighbour is already in
 *   a different container (`nextBefExit === _x_`, with `next !== _x_`).
 *
 * @param container
 */
function getXInOuts(
        container: Container) {

    const inOuts: (In | Out)[] = [];

    for (const x of container.xs) {
        if (x.prevBefExit === x || x.nextBefExit === x) {
        }
    }

    for (const x of container.xs) {
        // const dir = x.nextBefExit === x ? +1 : (x.prevBefExit === x ? -1 : 0);
        // if (dir === 0) { console.log('aaaa'); }
        // entry point -> `In`
        if (x.prevBefExit === x && x.prev !== x) {
            const in_ = makeInOut(-1, x, container);
            (x as Mutable<_X_>).in_ = in_;
            inOuts.push(in_);
        }
        // exit point -> `Out`
        if (x.nextBefExit === x && x.next !== x) {
            const out = makeInOut(+1, x, container);
            (x as Mutable<_X_>).out = out;
            inOuts.push(out);
        }
    }

    return inOuts;
}


/**
 * Creates an `InOut` from the given differing fields, filling in the constant
 * `container` reference and the default empty/zero fields.
 */
function makeInOut<D extends 1 | -1>(
        dir: D,
        _x_: _X_,
        container: Container): D extends -1 ? In : Out {

    const inOut: InOut = {
        idx: undefined!,  // will be set later
        dir,
        _x_,
        container,
        children: new Set(),
        windingNum: 0,
        orientation: 0,
        nextOrPrev: undefined!,    // will be set later
        bezierPieces: undefined!,  // ...
        nextAround: undefined!,    // ...
        parent: undefined!,        // ...
        prevAround: undefined!     // ...
    };

    return inOut as unknown as D extends -1 ? In : Out
}


export { getXInOuts }
