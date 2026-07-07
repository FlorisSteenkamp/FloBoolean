declare const _debug_: Debug;
import type { Debug } from '../debug/debug.js';

import type { BezierPiece } from 'flo-bezier3';
import type { InOut } from '../containers/in-out/in-out.js';
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
function completeLoop(
        takenInOuts: Set<InOut>,
        origInOut: InOut,
        tight: boolean): {
            bezierPieces: BezierPiece[],
            additionalOutsToCheck: InOut[]
        } {

    const additionalOutsToCheck: InOut[] = [];
    const bezierPieces: BezierPiece[] = [];

    // Move immediately to the outgoing start of the loop
    let inOutToUse: InOut = origInOut;
    let additionalBezier: number[][] | undefined;

    const getNextExit_ = tight ? getTightNextExit : getNextExit;

    /** For debugging only */
    const ios: InOut[] = [];
    do {
        takenInOuts.add(inOutToUse);
        ios.push(inOutToUse);  // for debugging only

        const inOut_Next = inOutToUse.nextOrPrev!;
        takenInOuts.add(inOut_Next);
        
        const beziersToNextContainer = inOutToUse.dir === +1
            ? getBeziersToNextContainer(inOutToUse, inOut_Next)!
            : getBeziersToPrevContainer(inOutToUse, inOut_Next)!;

        bezierPieces.push(...beziersToNextContainer);

        const nextExit = getNextExit_(
            inOut_Next!, origInOut,
            additionalOutsToCheck, takenInOuts
        );

        ({ inOutToUse, additionalBezier } = nextExit);


        if (additionalBezier !== undefined) {
            const lastBezPiece = bezierPieces[bezierPieces.length - 1];
            const lastBez = bezierPieceToBezier(lastBezPiece);
            const t = mid(closestPointOnBezierCertified(lastBez, additionalBezier[0])[0].ri);
            const inBez_: BezierPiece = { ps: lastBez, ts: [0,t] };
            bezierPieces.pop();
            bezierPieces.push(inBez_);
            bezierPieces.push({ ps: additionalBezier, ts: [0,1] });
        }
    } while (inOutToUse !== origInOut);

    if (typeof _debug_ !== 'undefined' && !!_debug_.verbose) {
        logIos(ios);
    }

    return { bezierPieces, additionalOutsToCheck };
}


/** For debugging only */
function logIos(ios: InOut[]) {
    const strs: string[] = [];
    const params: string[] = [];
    for (let io of ios) {
        params.push(io.dir === 1 ? "color: blue;" : "color: red");
        strs.push(`%c${io.idx}`);
    }

    // console.log('Taken ios: ' + strs.join(' '), ...params);
}


export { completeLoop }
