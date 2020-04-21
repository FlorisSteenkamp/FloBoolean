import { InOut } from '../in-out';
/**
 * Completes a loop for a specific intersection point entry curve.
 * @param takenOuts
 * @param out
 * @param g
 */
declare function completeLoop(expMax: number, takenOuts: Set<InOut>, out: InOut): {
    beziers: number[][][];
    additionalOutsToCheck: InOut[];
};
export { completeLoop };
