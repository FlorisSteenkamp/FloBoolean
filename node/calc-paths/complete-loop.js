import { closestPointOnBezierCertified } from 'flo-bezier3';
import { mid } from 'flo-poly';
import { getNextExit } from './get-next-exit.js';
import { getBeziersToNextContainer } from './get-beziers-to-next-container.js';
import { getBeziersToPrevContainer } from './get-beziers-to-prev-container.js';
import { getTightNextExit } from './get-tight-next-exit.js';
import { bezierPieceToBezier } from './bezier-piece-to-bezier.js';
/**
 * Completes a loop for a specific intersection point entry curve.
 *
 * @param expMax
 * @param takenInOuts
 * @param origInOut
 */
function completeLoop(takenInOuts, origInOut, tight) {
    const additionalOutsToCheck = [];
    const bezierPieces = [];
    // Move immediately to the outgoing start of the loop
    let inOutToUse = origInOut;
    let additionalBezier;
    // if (typeof _debug_ !== 'undefined') {
    //     console.log('----');
    //     console.log([inOutToUse.idx, inOutToUse.dir]);
    // }
    do {
        takenInOuts.add(inOutToUse);
        const beziersToNextContainer = inOutToUse.dir === +1
            ? getBeziersToNextContainer(inOutToUse, takenInOuts)
            : getBeziersToPrevContainer(inOutToUse, takenInOuts);
        const { bezierPieces: additionalBeziers, inOut } = beziersToNextContainer;
        bezierPieces.push(...additionalBeziers);
        const getNextExit_ = tight ? getTightNextExit : getNextExit;
        const nextExit = getNextExit_(inOut, origInOut, additionalOutsToCheck, takenInOuts);
        ({ inOutToUse, additionalBezier } = nextExit);
        if (additionalBezier !== undefined) {
            const lastBezPiece = bezierPieces[bezierPieces.length - 1];
            const lastBez = bezierPieceToBezier(lastBezPiece);
            const t = mid(closestPointOnBezierCertified(lastBez, additionalBezier[0])[0].ri);
            const inBez_ = { ps: lastBez, ts: [0, t] };
            bezierPieces.pop();
            bezierPieces.push(inBez_);
            bezierPieces.push({ ps: additionalBezier, ts: [0, 1] });
        }
    } while (inOutToUse !== origInOut);
    return { bezierPieces, additionalOutsToCheck };
}
export { completeLoop };
//# sourceMappingURL=complete-loop.js.map