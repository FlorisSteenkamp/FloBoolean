import { bezierPiecesFromOut$ } from './bezier-pieces-from-out.js';
import { reverseBezierPiece } from '../bezier/reverse-bezier-piece.js';
/**
 *
 * @param out
 * @param outerLoopOrientation
 * @param loopIdx identifies the loop during debugging
 * @param depth number of selected ancestor loops (nesting level); determines
 * the loop's orientation so that alternating levels (outer, hole, island, ...)
 * are cut in and out correctly by the non-zero winding fill rule
 */
function loopFromOut(out, outerLoopOrientation, depth) {
    const { orientation } = out;
    // Even nesting levels (outer, island, ...) share the outer orientation;
    // odd levels (holes, ...) get the opposite so nonzero fill carves them out.
    const desiredOrientation = (depth % 2 === 0 ? 1 : -1) * outerLoopOrientation;
    const bezierPieces = bezierPiecesFromOut$(out);
    return desiredOrientation * orientation > 0
        ? bezierPieces
        : bezierPieces.map(reverseBezierPiece).toReversed();
}
export { loopFromOut };
//# sourceMappingURL=loop-from-out.js.map