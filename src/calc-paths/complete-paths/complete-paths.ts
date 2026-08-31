import type { Out } from '../../containers/in-out/in-out.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { Container } from '../../containers/container.js';
import { createRootInOut } from "../../main/create-root-in-out.js";
import { getTightestContainingLoop } from '../get-tightest-containing-loop.js';
import { timeFunctionCalls } from '../../utils/time-function-call.js';
import { completePath } from './complete-path.js';
import { Mutable } from '../../utils/mutable.js';


const completePaths = timeFunctionCalls(function completePaths(
        expMax: number,
        minYContainers: Container[]) {

    const root = createRootInOut();
    const takenOuts: Set<Out> = new Set();  // Taken intersections
    // `takenContainers` is critical in cases such as in the 'koldat52' vector
    // where a `minY` container is part of multiple loops
    const takenContainers: Set<Container> = new Set();

    for (let i=0; i<minYContainers.length; i++) {
        const container = minYContainers[i];

        if (takenContainers.has(container) ||
            container.inOuts.length === 0) {
            
            // container already taken OR rare case in which containter engulfs loop completely
            continue;
        }

        const { inOuts } = container;
        const firstInOut = inOuts[0];
        const lastInOut = inOuts[inOuts.length - 1];

        const initialOut = firstInOut.dir === 1 ? firstInOut : lastInOut as Out;

        const beziers = initialOut.loop;

        const parent = getTightestContainingLoop(expMax, root, beziers);

        (initialOut as Mutable<Out>).parent = parent;
        (initialOut as Mutable<Out>).orientation = lastInOut.dir;
        (initialOut as Mutable<Out>).windingNum = parent.windingNum + lastInOut.dir;
        (initialOut as Mutable<Out>).children = new Set();

        completePath(
            initialOut,
            takenOuts,
            takenContainers
        );
    }

    return root;
});


export { completePaths }
