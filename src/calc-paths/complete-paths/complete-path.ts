import type { Out } from '../../containers/in-out/in-out.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { Container } from '../../containers/container.js';
import type { Mutable } from '../../utils/mutable.js';
import { completeLoop } from './complete-loop.js';


/**
 * Completes the path of a disjoint set of loops, i.e. this function is called 
 * for each disjoint set of paths.
 * 
 * @param initialOut
 * @param takenOuts
 * @param takenContainers
 */
function completePath(
        initialOut: Out,
        takenOuts: Set<Out>,
        takenContainers: Set<Container>): void {

    const outStack: Out[] = [initialOut];

    while (outStack.length) {
        const origOut = outStack.pop()!;

        if (takenOuts.has(origOut)) { continue; }

        (origOut as Mutable<Out>).children = new Set();
        const additionalOutsToCheck = completeLoop(
            takenOuts, takenContainers, origOut
        );

        (origOut.parent as Mutable<Out>).children = origOut.parent.children || new Set();
        origOut.parent.children.add(origOut);

        outStack.push(...additionalOutsToCheck);
    }
}


export { completePath }
