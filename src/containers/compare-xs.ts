import type { _X_ } from "../get-critical-points/-x-.js";


/**
 * Total order on `_X_`s: by curve index, then by parameter (`tS`), then by
 * `order` - a globally-unique arbitrary value (assigned in `getAllXPairs`) that
 * distinguishes otherwise-coincident `_X_`s. Using the same `order` here and in
 * the `getXInOuts` sort guarantees both sorts agree on coincident points.
 */
function compareXs(
        xA: _X_,
        xB: _X_) {

    let res = xA.curve.idx - xB.curve.idx;
    if (res !== 0) { return res; }

    res = xA.x.ri.tS - xB.x.ri.tS;
    return res;
}


export { compareXs }
