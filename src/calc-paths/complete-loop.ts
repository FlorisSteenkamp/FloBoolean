
import { InOut } from '../in-out';
import { getNextExit } from './get-next-exit';
import { getBeziersToNextContainer } from './get-beziers-to-next-container';
import { closestPointOnBezierPrecise, fromTo } from 'flo-bezier3';


/** 
 * Completes a loop for a specific intersection point entry curve.
 * @param takenOuts
 * @param out
 * @param g
 */
function completeLoop(
        expMax: number,
        takenOuts: Set<InOut>,
        out: InOut): { beziers: number[][][], additionalOutsToCheck: InOut[] } {

    let additionalOutsToCheck: InOut[] = [];
    let beziers: number[][][] = [];

    // Move immediately to the outgoing start of the loop
    let out_ = out;
    let additionalBezier: number[][];

    do {
        takenOuts.add(out_); // Mark this intersection as taken
        
        let { beziers: additionalBeziers, in_, inBez } = 
            getBeziersToNextContainer(expMax, out_);
        // TODO - it will probably better to remove additionalBeziers and just
        // connect the endpoints of adjacent beziers - even if we had near
        // exact coordinates (think quad or better precision) of intersections
        // they are still not returned as algebraic numbers so we can never have
        // a perfect algorithm anyway without returning algebraic numbers as 
        // intersection coordinates, hence we might as well remove 
        // additionalBeziers whose length is about a trillionth of the max
        // coordinate of loops
        beziers.push(...additionalBeziers);

        ({out_, additionalBezier} = getNextExit(
            expMax, in_, out, additionalOutsToCheck, takenOuts
        ));
        if (additionalBezier) {
            let t = closestPointOnBezierPrecise(inBez, additionalBezier[0]).t;
            let inBez_ = fromTo(inBez)(0, t);
            beziers.push(inBez_);
            beziers.push(additionalBezier);
        } else {
            beziers.push(inBez);
        }
    } while (out_ !== out);

    return { beziers, additionalOutsToCheck };
}


export { completeLoop }
