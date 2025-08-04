import { InOut } from "../in-out.js";
/**
 *
 * @param in_ the in for which the next exit should be found
 * @param additionalOutsToCheck
 */
declare function getNextExit(in_: InOut, originalOut: InOut, additionalOutsToCheck: InOut[], takenOuts: Set<InOut>): {
    out_: InOut | undefined;
    additionalBezier: number[][] | undefined;
};
export { getNextExit };
