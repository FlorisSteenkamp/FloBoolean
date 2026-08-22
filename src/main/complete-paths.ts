import type { Loop } from '../shape/loop.js';
import type { Out } from '../containers/in-out/in-out.js';
import type { _X_ } from '../get-critical-points/-x-.js';
import type { Container } from '../containers/container.js';
import { createRootInOut } from "./create-root-in-out.js";
import { getTightestContainingLoop } from '../calc-paths/get-tightest-containing-loop.js';
import { getOutermostOut } from '../calc-paths/get-outermost-in-and-out.js';
import { completePath } from '../calc-paths/complete-path.js';
import { timeFunctionCalls } from '../utils/time-function-call.js';


const completePaths = timeFunctionCalls(function completePaths(
        expMax: number,
        minYContainers: Container[]) {

    const root = createRootInOut();
    // `takenLoops` is important in cases such as in the 'koldat52' vector
    const takenLoops: Set<Loop> = new Set();
    const takenOuts: Set<Out> = new Set();  // Taken intersections

    for (let i=0; i<minYContainers.length; i++) {
        const container = minYContainers[i];
        const loop = container.xs[0].x.curve.loop;

        if (takenLoops.has(loop)) { continue; }
        takenLoops.add(loop);

        const parent = getTightestContainingLoop(expMax, root, loop);

        const initialOut = getOutermostOut(container, parent);

        completePath(
            initialOut,
            takenLoops,
            takenOuts
        );
    }

    return root;
});


export { completePaths }
