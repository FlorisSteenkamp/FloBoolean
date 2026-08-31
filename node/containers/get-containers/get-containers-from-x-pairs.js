/**
 * Create the initial containers from the array of intersections
 */
function getContainersFromXPairs(xPairs, expContainer) {
    const containerDim = 2 ** expContainer;
    const containers = xPairs
        .map(xPair => {
        const { p } = xPair[0].x;
        return {
            xs: xPair,
            box: [
                [p[0] - containerDim, p[1] - containerDim],
                [p[0] + containerDim, p[1] + containerDim]
            ]
        };
    });
    return containers;
}
export { getContainersFromXPairs };
//# sourceMappingURL=get-containers-from-x-pairs.js.map