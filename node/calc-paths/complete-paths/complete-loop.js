import { timeFunctionCalls } from '../../utils/time-function-call.js';
import { getNextExit } from './get-next-exit.js';
/**
 * Completes a loop for a specific intersection point entry curve.
 *
 * @param takenOuts
 * @param takenContainers
 * @param origOut
 */
const completeLoop = timeFunctionCalls(function completeLoop(takenOuts, takenContainers, origOut) {
    const additionalOutsToCheck = [];
    const path = [];
    // Move immediately to the outgoing start of the loop
    let outToUse = origOut;
    const getNextExit_ = getNextExit(origOut, additionalOutsToCheck, takenOuts);
    do {
        takenOuts.add(outToUse);
        takenContainers.add(outToUse.container);
        path.push(outToUse);
        outToUse = getNextExit_(outToUse);
    } while (outToUse !== origOut);
    origOut.path = path;
    return additionalOutsToCheck;
});
export { completeLoop };
//# sourceMappingURL=complete-loop.js.map