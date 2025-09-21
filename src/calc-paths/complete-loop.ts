declare const _debug_: Debug;

import type { Debug } from '../debug/debug.js';
import { closestPointOnBezierCertified, fromTo } from 'flo-bezier3';
import { mid } from 'flo-poly';
import { InOut } from '../in-out.js';
import { getNextExit } from './get-next-exit.js';
import { getBeziersToNextContainer } from './get-beziers-to-next-container.js';
import { getBeziersToPrevContainer } from './get-beziers-to-prev-container.js';
import { getTightNextExit } from './get-tight-next-exit.js';


/** 
 * Completes a loop for a specific intersection point entry curve.
 * 
 * @param expMax
 * @param takenInOuts
 * @param out
 */
function completeLoop(
        takenInOuts: Set<InOut>,
        out: InOut,
        tight: boolean,
        noMicroCorners: boolean): { beziers: number[][][], additionalOutsToCheck: InOut[] } {

    const additionalOutsToCheck: InOut[] = [];
    const beziers: number[][][] = [];

    // Move immediately to the outgoing start of the loop
    let inOutToUse: InOut = out;
    let additionalBezier: number[][] | undefined;

    if (typeof _debug_ !== 'undefined') {
        console.log('----');
        console.log([inOutToUse.idx, inOutToUse.dir]);
    }
    do {
        takenInOuts.add(inOutToUse!); // Mark this intersection as taken
        
        const beziersToNextContainer = inOutToUse.dir === +1
            ? getBeziersToNextContainer(inOutToUse!, takenInOuts, noMicroCorners)
            : getBeziersToPrevContainer(inOutToUse!, takenInOuts)

        const { beziers: additionalBeziers, inOut, bez } = beziersToNextContainer;

        beziers.push(...additionalBeziers);

        // TODO - it will probably better to remove additionalBezier and just
        // connect the endpoints of adjacent beziers - even if we had near
        // exact coordinates (think quad or better precision) of intersections
        // they are still not returned as algebraic numbers so we can never have
        // a perfect algorithm anyway without returning algebraic numbers as 
        // intersection coordinates, hence we might as well remove 
        // additionalBeziers whose length is about a trillionth of the max
        // coordinate of loops
        const nextExit = !tight
            ? getNextExit(inOut!, out, additionalOutsToCheck, takenInOuts, noMicroCorners)
            : getTightNextExit(inOut!, out, additionalOutsToCheck, takenInOuts, noMicroCorners);

        ({ inOutToUse, additionalBezier } = nextExit);



        if (additionalBezier !== undefined) {
            const t = mid(closestPointOnBezierCertified(bez, additionalBezier[0])[0].ri);
            const inBez_ = fromTo(bez, 0, t);
            beziers.push(inBez_);
            beziers.push(additionalBezier);
        } else {
            beziers.push(bez);
        }
    } while (inOutToUse !== out);

    return { beziers, additionalOutsToCheck };
}


export { completeLoop }
