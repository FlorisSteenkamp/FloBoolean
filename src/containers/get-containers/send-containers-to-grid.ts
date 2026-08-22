import type { ContainerBasic } from "../container.js";
import { MAX_BIT_LENGTH } from "../../main/max-bitlength.js";

const { floor, ceil } = Math;


/**
 * Returns the containers from the given containers by sending their boxes to a
 * grid with a smaller bitlength.
 * 
 * The grid spacing equals half the container dimension (`1/2x`). To prevent a
 * container from collapsing to a point when it falls within a single grid cell,
 * the box's min corner is rounded down and its max corner is rounded up.
 * 
 * @param containers 
 * @param expMax 
 * @param containerDim 
 */
function sendContainersToGrid(
        containers: ContainerBasic[],
        expContainer: number): ContainerBasic[] {

    // Grid spacing = 1/2 the container dimension (a power of 2, so snapping via
    // divide/multiply is exact).
    const gridSpacing = 2**(expContainer - 1);

    const snapDown = (a: number): number => floor(a / gridSpacing) * gridSpacing;
    const snapUp   = (a: number): number => ceil(a / gridSpacing) * gridSpacing;

    const containers_ = containers.map((container): ContainerBasic => {
        const { xs, box } = container;

        const [minD, maxD] = box;
        const box_ = [minD.map(snapDown), maxD.map(snapUp)];

        return { xs, box: box_ };
    });

    return containers_;
}


export { sendContainersToGrid }
