import { closestPointOnBezierCertified } from 'flo-bezier3';
import { mid } from 'flo-poly';
import { getNextExit } from './get-next-exit.js';
import { getBeziersToNextContainer } from './get-beziers-to-next-container.js';
import { bezierPieceToBezier } from './bezier-piece-to-bezier.js';
/**
 * Completes a loop for a specific intersection point entry curve.
 *
 * @param expMax
 * @param takenOuts
 * @param origOut
 */
function completeLoop(takenOuts, takenLoops, origOut) {
    const additionalOutsToCheck = [];
    const bezierPieces = [];
    // Move immediately to the outgoing start of the loop
    let outToUse = origOut;
    let additionalBezier;
    const outs = []; // For debugging only
    do {
        outs.push(outToUse); // for debugging only
        takenOuts.add(outToUse);
        // Every curve threaded through this loop belongs to this component, so
        // mark its loop as taken to prevent it being re-processed as a separate
        // outermost loop (which would reset already-built child nesting).
        takenLoops.add(outToUse._x_.curve.loop);
        const nextIn = outToUse.nextOrPrev;
        const beziersToNextContainer = getBeziersToNextContainer(outToUse, nextIn);
        bezierPieces.push(...beziersToNextContainer);
        const nextExit = getNextExit(nextIn, origOut, additionalOutsToCheck, takenOuts);
        ({ outToUse, additionalBezier } = nextExit);
        if (additionalBezier !== undefined) {
            const lastBezPiece = bezierPieces[bezierPieces.length - 1];
            const lastBez = bezierPieceToBezier(lastBezPiece);
            const t = mid(closestPointOnBezierCertified(lastBez, additionalBezier[0])[0].ri);
            const inBez_ = { ps: lastBez, ts: [0, t] };
            bezierPieces.pop();
            bezierPieces.push(inBez_);
            bezierPieces.push({ ps: additionalBezier, ts: [0, 1] });
        }
    } while (outToUse !== origOut);
    if (typeof _debug_ !== 'undefined' && !!_debug_.verbose) {
        logIos(outs);
    }
    return { bezierPieces, additionalOutsToCheck };
}
/** For debugging only */
function logIos(ios) {
    const strs = [];
    const params = [];
    for (let io of ios) {
        params.push(io.dir === 1 ? "color: blue;" : "color: red");
        strs.push(`%c${io.idx}`);
    }
    // console.log('Taken ios: ' + strs.join(' '), ...params);
}
export { completeLoop };
//# sourceMappingURL=complete-loop.js.map