import type { Out } from '../../containers/in-out/in-out.js';
/**
 * @param origOut
 * @param additionalOutsToCheck
 * @param takenOuts
 */
declare function getNextExit(origOut: Out, additionalOutsToCheck: Out[], takenOuts: Set<Out>): (prevOut: Out) => Out;
export { getNextExit };
