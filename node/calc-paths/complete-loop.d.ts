import { InOut } from '../in-out';
/**
 * Completes a loop for a specific intersection point entry curve.
 *
 * @param expMax
 * @param takenOuts
 * @param out
 */
declare function completeLoop(expMax: number, takenOuts: Set<InOut>, out: InOut): {
    beziers: number[][][];
    additionalOutsToCheck: InOut[];
};
export { completeLoop };
