import { bezierPieceToBezier } from "../calc-paths/bezier-piece-to-bezier.js";
import { loopFromBeziers } from '../loop/loop-from-beziers.js';
import { reverseShapeOrientation } from "../loop/reverse-shape-orientation.js";
/**
 *
 * @param out
 * @param orientation
 * @param loopIdx identifies the loop during debugging
 */
function loopFromOut(out, orientation, keepOriginalOrientation, loopIdx) {
    const _beziers = out.bezierPieces?.map(bezierPieceToBezier);
    if (_beziers === undefined) {
        return loopFromBeziers([], loopIdx);
    }
    const beziers = orientation >= 0 || keepOriginalOrientation
        ? _beziers
        : reverseShapeOrientation(_beziers);
    const loop = loopFromBeziers(beziers, loopIdx);
    return loop;
}
export { loopFromOut };
//# sourceMappingURL=loop-from-out.js.map