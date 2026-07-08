import { bezierPieceToBezier } from "../calc-paths/bezier-piece-to-bezier.js";
import { loopFromBeziers } from '../loop/loop-from-beziers.js';
import { reverseShapeOrientation } from "../loop/reverse-shape-orientation.js";
/**
 *
 * @param out
 * @param outerLoopOrientation
 * @param loopIdx identifies the loop during debugging
 */
function loopFromOut(out, outerLoopOrientation, loopIdx, forceOrientationNegative) {
    const _beziers = out.bezierPieces?.map(bezierPieceToBezier);
    if (_beziers === undefined) {
        return loopFromBeziers([], loopIdx);
    }
    const { orientation } = out;
    const isOutermostLoop = loopIdx === 0;
    const desiredOuterOrientation = forceOrientationNegative
        ? -1
        : outerLoopOrientation;
    const desiredOrientation = isOutermostLoop
        ? desiredOuterOrientation
        : -desiredOuterOrientation;
    const hasDesiredOrientation = desiredOrientation * orientation > 0;
    const beziers = hasDesiredOrientation
        ? _beziers
        : reverseShapeOrientation(_beziers);
    const loop = loopFromBeziers(beziers, loopIdx);
    return loop;
}
export { loopFromOut };
//# sourceMappingURL=loop-from-out.js.map