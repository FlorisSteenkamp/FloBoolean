import type { Out } from '../../containers/in-out/in-out.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { Container } from '../../containers/container.js';
import type { Mutable } from '../../utils/mutable.js';
import { timeFunctionCalls } from '../../utils/time-function-call.js';
import { getNextExit } from './get-next-exit.js';


/** 
 * Completes a loop for a specific intersection point entry curve.
 * 
 * @param takenOuts
 * @param takenContainers
 * @param origOut
 */
const completeLoop = timeFunctionCalls(function completeLoop(
        takenOuts: Set<Out>,
        takenContainers: Set<Container>,
        origOut: Out): Out[] {

    const additionalOutsToCheck: Out[] = [];
    const path: Out[] = [];

    // Move immediately to the outgoing start of the loop
    let outToUse: Out = origOut;

    const getNextExit_ = getNextExit(
        origOut, additionalOutsToCheck, takenOuts
    );

    do {
        takenOuts.add(outToUse);
        takenContainers.add(outToUse.container!);

        path.push(outToUse);

        outToUse = getNextExit_(outToUse);

    } while (outToUse !== origOut);

    (origOut as Mutable<Out>).path = path;

    return additionalOutsToCheck;
});


export { completeLoop }
