import type { BezierPiece } from 'flo-bezier3';
import type { Out } from '../containers/in-out/in-out.js';
import type { Loop } from '../shape/loop.js';
/**
 * Completes a loop for a specific intersection point entry curve.
 *
 * @param expMax
 * @param takenOuts
 * @param origOut
 */
declare function completeLoop(takenOuts: Set<Out>, takenLoops: Set<Loop>, origOut: Out): {
    bezierPieces: BezierPiece[];
    additionalOutsToCheck: Out[];
};
export { completeLoop };
