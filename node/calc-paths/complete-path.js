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
function completePath(initialOut, takenLoops, takenOuts) {
    const outStack = [initialOut];
    while (outStack.length) {
        const origOut = outStack.pop();
        takenLoops.add(origOut._x_.curve.loop);
        if (takenOuts.has(origOut)) {
            continue;
        }
        origOut.children = new Set();
        const { bezierPieces, additionalOutsToCheck } = completeLoop(takenOuts, takenLoops, origOut);
        origOut.bezierPieces = bezierPieces;
        origOut.parent.children = origOut.parent.children || new Set();
        origOut.parent.children.add(origOut);
        for (let i = 0; i < additionalOutsToCheck.length; i++) {
            outStack.push(additionalOutsToCheck[i]);
        }
    }
}
export { completePath };
//# sourceMappingURL=complete-path.js.map