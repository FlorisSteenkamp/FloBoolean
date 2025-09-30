import type { BezierPiece } from 'flo-bezier3';
import type { InOut } from '../containers/in-out/in-out.js';
/**
 * Completes a loop for a specific intersection point entry curve.
 *
 * @param expMax
 * @param takenInOuts
 * @param origInOut
 */
declare function completeLoop(takenInOuts: Set<InOut>, origInOut: InOut, tight: boolean): {
    bezierPieces: BezierPiece[];
    additionalOutsToCheck: InOut[];
};
export { completeLoop };
