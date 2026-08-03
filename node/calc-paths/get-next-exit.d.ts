import type { In, Out } from "../containers/in-out/in-out.js";
/**
 *
 * @param in_ the in for which the next exit should be found
 * @param origOut
 * @param additionalOutsToCheck
 * @param takenOuts
 */
declare function getNextExit(in_: In, origOut: Out, additionalOutsToCheck: Out[], takenOuts: Set<Out>): {
    outToUse: Out;
    additionalBezier: number[][] | undefined;
};
export { getNextExit };
