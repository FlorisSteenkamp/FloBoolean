import { createRootExact } from 'flo-poly';
import { evalDeCasteljauWithErr } from "flo-bezier3";
const { EPSILON: eps } = Number;
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
        const box = [pS, pS];
        const ri = createRootExact(t);
        // return { x: { ri, box, kind }, curve };
        return { x: { ri, p: pS, box, kind }, curve };
    }
    else if (t === 1) {
        // we have the exact point
        const pE = ps[ps.length - 1];
        const box = [pE, pE];
        const ri = createRootExact(t);
        // return { x: { ri, box, kind }, curve };
        return { x: { ri, p: pE, box, kind }, curve };
    }
    // there will be some error in calculating the point
    // const p = evalDeCasteljauDd(ps, [0,t]).map(c => c[1]);
    const { p, pE } = evalDeCasteljauWithErr(ps, t);
    // TODO
    // const box = [
    //     [p[0] - pE[0], p[1] - pE[1]],
    //     [p[0] + pE[0], p[1] + pE[1]]
    // ]; 
    const box = [
        [p[0] - eps, p[1] - eps],
        [p[0] + eps, p[1] + eps]
    ];
    const ri = createRootExact(t);
    return { x: { ri, p, box, kind }, curve };
}
export { makeSimpleX };
//# sourceMappingURL=make-simple-x.js.map