"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const complete_loop_1 = require("./complete-loop");
/**
 * Completes the path of a disjoint set of loops, i.e. this function is called
 * for each disjoint set of paths.
 * @param intersections
 * @param takenLoops
 * @param parent
 * @param loop
 */
function completePath(expMax, initialOut, takenLoops, takenOuts, parent) {
    // Each loop generated will give rise to one componentLoop. 
    initialOut.parent = parent;
    initialOut.windingNum = parent.windingNum + initialOut.orientation;
    initialOut.children = new Set();
    let outStack = [initialOut];
    while (outStack.length) {
        let out = outStack.pop();
        takenLoops.add(out._x_.curve.loop);
        if (takenOuts.has(out)) {
            continue;
        }
        out.children = new Set();
        let { beziers, additionalOutsToCheck } = complete_loop_1.completeLoop(expMax, takenOuts, out);
        out.beziers = beziers;
        out.parent.children = out.parent.children || new Set();
        out.parent.children.add(out);
        outStack.push(...additionalOutsToCheck);
    }
}
exports.completePath = completePath;
//# sourceMappingURL=complete-path.js.map