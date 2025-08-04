import { toGrid } from "../loop/normalize/to-grid";
/**
 * Returns the containers from the given containers by sending their boxes to a
 * grid with a smaller bitlength.
 *
 * @param containers
 * @param expMax
 * @param containerDim
 */
function sendContainersToGrid(containers, expMax, containerDim) {
    /**
     * The exponent difference between expMax and the distance of critical
     * points from the sides of the containers. This value cannot be higher
     * than ⌈sqrt(n)⌉ where n is the number of intersections in a container.
     * Assume n < 100 - this is a (mild) limitation of the algorithm
     */
    const expContainer = Math.log2(containerDim);
    const expContainerAdj = expContainer - 3; // 2**-3 === 1/8 of container
    const containers_ = containers.map(container => {
        const box = container.box.map(p => p.map(c => {
            return toGrid(c, expMax, expMax - expContainerAdj);
        }));
        return { ...container, box };
    });
    return containers_;
}
export { sendContainersToGrid };
//# sourceMappingURL=send-containers-to-grid.js.map