declare const _debug_: Debug;

import type { Debug } from '../debug/debug.js';
import { closestPointOnBezierCertified, fromTo } from 'flo-bezier3';
import { mid } from 'flo-poly';
import { InOut } from '../containers/in-out/in-out.js';
import { getNextExit } from './get-next-exit.js';
import { getBeziersToNextContainer } from './get-beziers-to-next-container.js';
import { getBeziersToPrevContainer } from './get-beziers-to-prev-container.js';
import { getTightNextExit } from './get-tight-next-exit.js';
import { DualSet, dualSetAdd } from '../dual-set.js';


/** 
 * Completes a loop for a specific intersection point entry curve.
 * 
 * @param expMax
 * @param takenInOuts
 * @param origInOut
 */
function completeLoop(
        takenInOuts: DualSet<InOut, number>,
        origInOut: InOut,
        tight: boolean,
        noMicroCorners: boolean): { beziers: number[][][], additionalOutsToCheck: InOut[] } {

    const additionalOutsToCheck: InOut[] = [];
    const beziers: number[][][] = [];

    // Move immediately to the outgoing start of the loop
    let inOutToUse: InOut = origInOut;
    let additionalBezier: number[][] | undefined;

    // if (typeof _debug_ !== 'undefined') {
    //     console.log('----');
    //     console.log([inOutToUse.idx, inOutToUse.dir]);
    // }

    do {
        dualSetAdd(takenInOuts, inOutToUse, 1);
        
        const beziersToNextContainer = inOutToUse.dir === +1
            ? getBeziersToNextContainer(inOutToUse!, takenInOuts, noMicroCorners)
            : getBeziersToPrevContainer(inOutToUse!, takenInOuts);

        const { beziers: additionalBeziers, inOut, bez } = beziersToNextContainer;

        beziers.push(...additionalBeziers);

        const getNextExit_ = tight ? getTightNextExit : getNextExit;

        const nextExit = getNextExit_(inOut!, origInOut, additionalOutsToCheck, takenInOuts, noMicroCorners);

        ({ inOutToUse, additionalBezier } = nextExit);


        if (additionalBezier !== undefined) {
            const t = mid(closestPointOnBezierCertified(bez, additionalBezier[0])[0].ri);
            const inBez_ = fromTo(bez, 0, t);
            beziers.push(inBez_);
            beziers.push(additionalBezier);
        } else {
            beziers.push(bez);
        }
    } while (inOutToUse !== origInOut);

    if (tight) {
        // throw 'a';
    }

    return { beziers, additionalOutsToCheck };
}


export { completeLoop }
