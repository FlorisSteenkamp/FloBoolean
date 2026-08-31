import type { ContainerBasic } from "../container.js";
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
declare function sendContainersToGrid(containers: ContainerBasic[], expContainer: number): ContainerBasic[];
export { sendContainersToGrid };
