import { createRootExact } from 'flo-poly';
import { toP } from "../utils/to-p.js";
/**
 *
 * @param t
 * @param curve
 * @param kind
 */
function makeSimpleX(t, curve, kind) {
    const { ps } = curve;
    const ri = createRootExact(t);
    const p = toP(ps, t);
    return { ri, p, kind, curve };
}
export { makeSimpleX };
//# sourceMappingURL=make-simple-x.js.map