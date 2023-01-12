import { evalDeCasteljauWithErr } from "flo-bezier3";
/**
 *
 * @param t
 * @param curve
 * @param kind
 */
function makeSimpleX(t, curve, kind) {
    const ps = curve.ps;
    if (t === 0) {
        // we have the exact point
        const pS = ps[0];
        const box = [ps[0], ps[0]];
        return { x: { ri: { tS: t, tE: t, multiplicity: 1 }, box, kind }, curve };
    }
    else if (t === 1) {
        // we have the exact point
        const pE = ps[ps.length - 1];
        const box = [pE, pE];
        return { x: { ri: { tS: t, tE: t, multiplicity: 1 }, box, kind }, curve };
    }
    // there will be some error in calculating the point
    const { p, pE } = evalDeCasteljauWithErr(ps, t);
    const box = [
        [p[0] - pE[0], p[1] - pE[1]],
        [p[0] + pE[0], p[1] + pE[1]]
    ];
    return { x: { ri: { tS: t, tE: t, multiplicity: 1 }, box, kind }, curve };
}
export { makeSimpleX };
//# sourceMappingURL=make-simple-x.js.map