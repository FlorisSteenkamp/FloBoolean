import { bezierPieceToBezier } from "../calc-paths/bezier-piece-to-bezier.js";
import { loopFromBeziers } from '../loop/loop-from-beziers.js';
import { reverseShapeOrientation } from "../loop/reverse-shape-orientation.js";
/**
 *
 * @param out
 * @param outerLoopOrientation
 * @param loopIdx identifies the loop during debugging
 */
function loopFromOut(out, outerLoopOrientation, 
// keepOriginalOrientation: boolean,
loopIdx) {
    const _beziers = out.bezierPieces?.map(bezierPieceToBezier);
    if (_beziers === undefined) {
        return loopFromBeziers([], loopIdx);
    }
    const orientation = out.orientation;
    // const beziers = orientation >= 0 || keepOriginalOrientation
    // const beziers = outerLoopOrientation < 0
    //     ? _beziers
    //     : reverseShapeOrientation(_beziers);
    const beziers = loopIdx === 0 || (outerLoopOrientation * orientation < 0) // different orientations
        ? _beziers
        : reverseShapeOrientation(_beziers);
    const loop = loopFromBeziers(beziers, loopIdx);
    return loop;
}
export { loopFromOut };
//# sourceMappingURL=loop-from-out.js.map