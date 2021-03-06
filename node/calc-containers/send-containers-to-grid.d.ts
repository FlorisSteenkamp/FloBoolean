import { Container } from "../container";
/**
 * Returns the containers from the given containers by sending their boxes to a
 * grid with a smaller bitlength.
 * @param containers
 * @param expMax
 * @param containerDim
 */
declare function sendContainersToGrid(containers: Container[], expMax: number, containerDim: number): {
    box: number[][];
    xs: import("../x")._X_[];
    inOuts: import("../in-out").InOut[];
}[];
export { sendContainersToGrid };
