import type { Out } from "../containers/in-out/in-out.js";
import { bezierPieceToBezier } from "flo-bezier3";
import { loopFromBeziers } from '../shape/loop-from-beziers.js';
import { reverseShapeOrientation } from "../shape/reverse-shape-orientation.js";


/**
 * 
 * @param out 
 * @param outerLoopOrientation 
 * @param loopIdx identifies the loop during debugging
 * @param depth number of selected ancestor loops (nesting level); determines
 * the loop's orientation so that alternating levels (outer, hole, island, ...)
 * are cut in and out correctly by the non-zero winding fill rule
 */
function loopFromOut(
        out: Out,
        outerLoopOrientation: number,
        loopIdx: number,
        depth: number,
        forceOrientationNegative: boolean) {

    const _beziers = out.bezierPieces?.map(bezierPieceToBezier);
    if (_beziers === undefined) { return loopFromBeziers([], loopIdx); }

    const { orientation } = out;

    const desiredOuterOrientation = forceOrientationNegative
        ? -1 : outerLoopOrientation;

    // Even nesting levels (outer, island, ...) share the outer orientation;
    // odd levels (holes, ...) get the opposite so nonzero fill carves them out.
    const desiredOrientation =
        (depth%2 === 0 ? 1 : -1)*desiredOuterOrientation;

    const beziers = desiredOrientation*orientation > 0
        ? _beziers
        : reverseShapeOrientation(_beziers);

    const loop = loopFromBeziers(beziers, loopIdx)

    return loop;
}


export { loopFromOut }
