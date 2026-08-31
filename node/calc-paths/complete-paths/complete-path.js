import { completeLoop } from './complete-loop.js';
/**
 * Completes the path of a disjoint set of loops, i.e. this function is called
 * for each disjoint set of paths.
 *
 * @param initialOut
 * @param takenOuts
 * @param takenContainers
 */
function completePath(initialOut, takenOuts, takenContainers) {
    const outStack = [initialOut];
    while (outStack.length) {
        const origOut = outStack.pop();
        if (takenOuts.has(origOut)) {
            continue;
        }
        origOut.children = new Set();
        const additionalOutsToCheck = completeLoop(takenOuts, takenContainers, origOut);
        origOut.parent.children = origOut.parent.children || new Set();
        origOut.parent.children.add(origOut);
        outStack.push(...additionalOutsToCheck);
    }
}
export { completePath };
//# sourceMappingURL=complete-path.js.map