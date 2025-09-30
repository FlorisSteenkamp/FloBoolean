/**
 * @param containers all containers
 * @param connectedContainers
 */
function getIsolatedComponents(containers, connectedContainers) {
    const connectedContainers_ = new Set();
    for (const cs of connectedContainers) {
        for (const c of cs) {
            connectedContainers_.add(c);
        }
    }
    const res = [];
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        if (!connectedContainers_.has(container)) {
            res.push(container);
        }
    }
    return res;
}
export { getIsolatedComponents };
//# sourceMappingURL=get-isolated-containers.js.map