import { getIntersections } from "../get-critical-points/get-intersections.js";
import { getSelfIntersections } from "../get-critical-points/get-self-intersections.js";
import { loopFromBeziers } from "./loop-from-beziers.js";


function shapeSelfIntersections(
        shape: (number[][])[]) {

    const loop = loopFromBeziers(shape, 0);

    const xs = getIntersections([loop]);
    const selfXs = getSelfIntersections([loop]);

    return { xs, selfXs };
}


export { shapeSelfIntersections }
