import { closestPointOnBezierCertified, fromTo } from 'flo-bezier3';
import { mid } from 'flo-poly';
import { InOut } from '../in-out.js';
import { getNextExit } from './get-next-exit.js';
import { getBeziersToNextContainer } from './get-beziers-to-next-container.js';


/** 
 * Completes a loop for a specific intersection point entry curve.
 * 
 * @param expMax
 * @param takenOuts
 * @param out
 */
function completeLoop(
        expMax: number,
        takenOuts: Set<InOut>,
        out: InOut): { beziers: number[][][], additionalOutsToCheck: InOut[] } {

    const additionalOutsToCheck: InOut[] = [];
    const beziers: number[][][] = [];

    // Move immediately to the outgoing start of the loop
    let out_: InOut | undefined = out;
    let additionalBezier: number[][] | undefined;

    // console.log(out_);

    do {
        takenOuts.add(out_!); // Mark this intersection as taken
        
        const { beziers: additionalBeziers, in_, inBez } = 
            getBeziersToNextContainer(expMax, out_!);
        // TODO - it will probably better to remove additionalBeziers and just
        // connect the endpoints of adjacent beziers - even if we had near
        // exact coordinates (think quad or better precision) of intersections
        // they are still not returned as algebraic numbers so we can never have
        // a perfect algorithm anyway without returning algebraic numbers as 
        // intersection coordinates, hence we might as well remove 
        // additionalBeziers whose length is about a trillionth of the max
        // coordinate of loops
        beziers.push(...additionalBeziers);

        ({ out_, additionalBezier } = getNextExit(
            expMax, in_!, out, additionalOutsToCheck, takenOuts
        ));
        if (additionalBezier) {
            const t = mid(closestPointOnBezierCertified(inBez, additionalBezier[0])[0].ri);
            const inBez_ = fromTo(inBez, 0, t);
            beziers.push(inBez_);
            beziers.push(additionalBezier);
        } else {
            beziers.push(inBez);
        }
    } while (out_ !== out/* && ii++ < 100*/);

    return { beziers, additionalOutsToCheck };
}


export { completeLoop }
