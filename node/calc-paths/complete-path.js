import { completeLoop } from './complete-loop.js';
/**
 * Completes the path of a disjoint set of loops, i.e. this function is called
 * for each disjoint set of paths.
 *
 * @param intersections
 * @param takenLoops
 * @param parent
 * @param loop
 */
function completePath(initialOut, takenLoops, takenInOuts, tight) {
    const inOutStack = [initialOut];
    while (inOutStack.length) {
        const origInOut = inOutStack.pop();
        takenLoops.add(origInOut._x_.curve.loop);
        if (takenInOuts.has(origInOut)) {
            continue;
        }
        origInOut.children = new Set();
        const { bezierPieces, additionalOutsToCheck } = completeLoop(takenInOuts, origInOut, tight);
        origInOut.bezierPieces = bezierPieces;
        origInOut.parent.children = origInOut.parent.children || new Set();
        origInOut.parent.children.add(origInOut);
        for (let i = 0; i < additionalOutsToCheck.length; i++) {
            inOutStack.push(additionalOutsToCheck[i]);
        }
    }
}
export { completePath };
//# sourceMappingURL=complete-path.js.map