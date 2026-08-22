import type { ContainerBasic } from "../container.js";
import type { X, } from "../../get-critical-points/x.js";
import { _X_ } from "../../get-critical-points/-x-.js";


/**
 * Create the initial containers from the array of intersections
 */
function getContainersFromXPairs(
        xPairs: _X_[][],
        expContainer: number): ContainerBasic[] {

    const containerDim = 2**expContainer;

    const containers: ContainerBasic[] = xPairs
    .map(xPair => {
        const { p } = xPair[0].x;

        return {
            xs: xPair,
            box: [
                [p[0] - containerDim, p[1] - containerDim],
                [p[0] + containerDim, p[1] + containerDim]
            ]
        }
    });

    return containers;
}


export { getContainersFromXPairs }
