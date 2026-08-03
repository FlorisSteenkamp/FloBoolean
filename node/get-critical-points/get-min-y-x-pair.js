import { clip } from '../utils/clip.js';
import { getLoopMinY } from "../shape/get-min-y.js";
const { EPSILON: eps } = Number;
/**
 * Get a point with minimum y value of the given loop.
 *
 * @param loop
 */
function getMinYXpair(loop) {
    const minY = getLoopMinY(loop);
    const { curve, y } = minY;
    if (typeof _debug_ !== 'undefined') {
        _debug_.elems.minY.push({ curve: minY.curve, p: y.p, t: y.t });
    }
    const t = clip(y.t, 0, 1);
    const p = y.p;
    const _x_ = {
        x: {
            ri: { t, tS: t - 4 * eps, tE: t + 4 * eps, multiplicity: 1 },
            kind: 0,
            p,
        },
        curve
    };
    // duplicate the object so that they are not the same object
    return [_x_, { ..._x_ }];
}
export { getMinYXpair };
//# sourceMappingURL=get-min-y-x-pair.js.map