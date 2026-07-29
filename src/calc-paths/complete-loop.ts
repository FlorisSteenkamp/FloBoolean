declare const _debug_: Debug;
import type { Debug } from '../debug/debug.js';
import type { BezierPiece } from 'flo-bezier3';
import type { Out } from '../containers/in-out/in-out.js';
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
function completeLoop(
        takenOuts: Set<Out>,
        origOut: Out): {
            bezierPieces: BezierPiece[],
            additionalOutsToCheck: Out[]
        } {

    const additionalOutsToCheck: Out[] = [];
    const bezierPieces: BezierPiece[] = [];

    // Move immediately to the outgoing start of the loop
    let outToUse: Out = origOut;
    let additionalBezier: number[][] | undefined;

    const outs: Out[] = [];  // For debugging only
    do {
        outs.push(outToUse);  // for debugging only

        takenOuts.add(outToUse);

        const inOut_Next = outToUse.nextOrPrev;
        if (inOut_Next.dir === 1) {
            console.log('aaaaaaaaaaaaaaa')
            takenOuts.add(inOut_Next as Out);
        }
        
        const beziersToNextContainer = 
            getBeziersToNextContainer(outToUse, inOut_Next);

        bezierPieces.push(...beziersToNextContainer);

        const nextExit = getNextExit(
            inOut_Next!, origOut,
            additionalOutsToCheck, takenOuts
        );

        ({ outToUse, additionalBezier } = nextExit);


        if (additionalBezier !== undefined) {
            const lastBezPiece = bezierPieces[bezierPieces.length - 1];
            const lastBez = bezierPieceToBezier(lastBezPiece);
            const t = mid(closestPointOnBezierCertified(lastBez, additionalBezier[0])[0].ri);
            const inBez_: BezierPiece = { ps: lastBez, ts: [0,t] };
            bezierPieces.pop();
            bezierPieces.push(inBez_);
            bezierPieces.push({ ps: additionalBezier, ts: [0,1] });
        }
    } while (outToUse !== origOut);

    if (typeof _debug_ !== 'undefined' && !!_debug_.verbose) { logIos(outs); }

    return { bezierPieces, additionalOutsToCheck };
}


/** For debugging only */
function logIos(ios: Out[]) {
    const strs: string[] = [];
    const params: string[] = [];
    for (let io of ios) {
        params.push(io.dir === 1 ? "color: blue;" : "color: red");
        strs.push(`%c${io.idx}`);
    }

    // console.log('Taken ios: ' + strs.join(' '), ...params);
}


export { completeLoop }
