/**
 * Total order on `_X_`s: by curve index, then by parameter (`tS`), then by
 * `order` - a globally-unique arbitrary value (assigned in `getAllXPairs`) that
 * distinguishes otherwise-coincident `_X_`s. Using the same `order` here and in
 * the `getXInOuts` sort guarantees both sorts agree on coincident points.
 */
function compareXs(xA, xB) {
    let res = xA.x.curve.idx - xB.x.curve.idx;
    if (res !== 0) {
        return res;
    }
    res = xA.x.ri.tS - xB.x.ri.tS;
    // res = xA.x.ri.t - xB.x.ri.t;
    return res;
}
export { compareXs };
//# sourceMappingURL=compare-xs.js.map