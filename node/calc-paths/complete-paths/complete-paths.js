import { createRootInOut } from "../../main/create-root-in-out.js";
import { getTightestContainingLoop } from '../get-tightest-containing-loop.js';
import { timeFunctionCalls } from '../../utils/time-function-call.js';
import { completePath } from './complete-path.js';
const completePaths = timeFunctionCalls(function completePaths(expMax, minYContainers) {
    const root = createRootInOut();
    const takenOuts = new Set(); // Taken intersections
    // `takenContainers` is critical in cases such as in the 'koldat52' vector
    // where a `minY` container is part of multiple loops
    const takenContainers = new Set();
    for (let i = 0; i < minYContainers.length; i++) {
        const container = minYContainers[i];
        if (takenContainers.has(container) ||
            container.inOuts.length === 0) {
            // container already taken OR rare case in which containter engulfs loop completely
            continue;
        }
        const { inOuts } = container;
        const firstInOut = inOuts[0];
        const lastInOut = inOuts[inOuts.length - 1];
        const initialOut = firstInOut.dir === 1 ? firstInOut : lastInOut;
        const beziers = initialOut.loop;
        const parent = getTightestContainingLoop(expMax, root, beziers);
        initialOut.parent = parent;
        initialOut.orientation = lastInOut.dir;
        initialOut.windingNum = parent.windingNum + lastInOut.dir;
        // (initialOut as Mutable<Out>).orientation = lastInOut.dir * (parent.swapped ? -1 : 1);
        // (initialOut as Mutable<Out>).windingNum = parent.windingNum + (lastInOut.dir * (parent.swapped ? -1 : 1));
        initialOut.children = new Set();
        completePath(initialOut, takenOuts, takenContainers);
    }
    return root;
});
export { completePaths };
//# sourceMappingURL=complete-paths.js.map