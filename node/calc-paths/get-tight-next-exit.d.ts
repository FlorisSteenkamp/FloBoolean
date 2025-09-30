import { InOut } from "../containers/in-out/in-out.js";
/**
 *
 * @param inOut the in/out for which the next exit should be found
 * @param additionalOutsToCheck
 */
declare function getTightNextExit(inOut: InOut, origInOut: InOut, additionalOutsToCheck: InOut[], takenInOuts: Set<InOut>): {
    inOutToUse: InOut;
    additionalBezier: number[][] | undefined;
};
export { getTightNextExit };
