import { Container } from "../container.js";
/**
 * Returns the containers from the given containers by sending their boxes to a
 * grid with a smaller bitlength.
 *
 * @param containers
 * @param expMax
 * @param containerDim
 */
declare function sendContainersToGrid(containers: Container[], expMax: number, containerDim: number): {
    box: number[][];
    xs: import("../-x-.js").__X__[];
    inOuts: import("../in-out.js").InOut[];
}[];
export { sendContainersToGrid };
