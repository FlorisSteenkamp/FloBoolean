import { InOut } from "../in-out";
/**
 *
 * @param in_ the in for which the next exit should be found
 * @param additionalOutsToCheck
 */
declare function getNextExit(expMax: number, in_: InOut, originalOut: InOut, additionalOutsToCheck: InOut[], takenOuts: Set<InOut>): {
    out_: InOut;
    additionalBezier: number[][];
};
export { getNextExit };
