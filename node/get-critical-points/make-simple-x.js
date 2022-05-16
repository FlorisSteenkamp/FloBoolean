import { evalDeCasteljauWithErr } from "flo-bezier3";
/**
 *
 * @param t
 * @param curve
 * @param kind
 */
function makeSimpleX(t, curve, kind) {
    let ps = curve.ps;
    if (t === 0) {
        // we have the exact point
        let pS = ps[0];
        let box = [ps[0], ps[0]];
        return { x: { ri: { tS: t, tE: t, multiplicity: 1 }, box, kind }, curve };
    }
    else if (t === 1) {
        // we have the exact point
        let pE = ps[ps.length - 1];
        let box = [pE, pE];
        return { x: { ri: { tS: t, tE: t, multiplicity: 1 }, box, kind }, curve };
    }
    // there will be some error in calculating the point
    let { p, pE } = evalDeCasteljauWithErr(ps, t);
    let box = [
        [p[0] - pE[0], p[1] - pE[1]],
        [p[0] + pE[0], p[1] + pE[1]]
    ];
    return { x: { ri: { tS: t, tE: t, multiplicity: 1 }, box, kind }, curve };
}
export { makeSimpleX };
//# sourceMappingURL=make-simple-x.js.map