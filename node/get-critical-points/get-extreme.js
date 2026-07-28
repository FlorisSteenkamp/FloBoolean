import { getMinY } from "../loop/get-min-y.js";
import { makeSimpleX } from "./make-simple-x.js";
const { EPSILON: eps } = Number;
/**
 * Get an extreme point (point with minimum y value) of the given loop.
 *
 * @param loop
 */
function getExtreme(loop) {
    const minY = getMinY(loop);
    const { curve, y } = minY;
    if (typeof _debug_ !== 'undefined') {
        _debug_.elems.minY.push({ curve: minY.curve, p: y.p, t: y.t });
    }
    // const ts = y.ts;
    const t = y.t;
    // if (ts[0] <= 0) {
    if (t <= 0) {
        return [
            makeSimpleX(0, curve, 0), // extreme
            makeSimpleX(1, curve.prev, 0) // extreme
        ];
    }
    // if (ts[1] >= 1) {
    if (t >= 1) {
        return [
            makeSimpleX(1, curve, 0), // extreme
            makeSimpleX(0, curve.next, 0) // extreme
        ];
    }
    const p = y.p;
    const box = [
        [p[0] - 4 * eps, p[1] - 4 * eps],
        [p[0] + 4 * eps, p[1] + 4 * eps]
    ];
    // FUTURE - should multiplicity be undefined in these cases?
    const __x__ = {
        x: {
            // ri: { t: ts[0], tS: ts[0], tE: ts[1], multiplicity: 1 },
            ri: { t, tS: t - 4 * eps, tE: t + 4 * eps, multiplicity: 1 },
            kind: 0,
            p: y.p,
            box
            // box: y.box
        },
        curve
    };
    return [
        __x__,
        { ...__x__ } // duplicate the object so that they are not the same object
    ];
}
export { getExtreme };
//# sourceMappingURL=get-extreme.js.map