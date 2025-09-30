import type { InOut } from "../containers/in-out/in-out.js";
/**
 *
 * @param in_ the in for which the next exit should be found
 * @param originalOut
 * @param additionalOutsToCheck
 * @param takenOuts
 */
declare function getNextExit(in_: InOut, originalOut: InOut, additionalOutsToCheck: InOut[], takenOuts: Set<InOut>): {
    inOutToUse: InOut;
    additionalBezier: number[][] | undefined;
};
export { getNextExit };
