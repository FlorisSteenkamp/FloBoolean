
/**
 * @param containers all containers
 * @param connectedContainers 
 */
function getIsolatedComponents<T>(
        containers: T[], 
        connectedContainers: T[][]) {
            
    const connectedContainers_: Set<T> = new Set();
    for (const cs of connectedContainers) {
        for (const c of cs) {
            connectedContainers_.add(c);
        }
    }

    const res: T[] = [];
    for (let i=0; i<containers.length; i++) {
        const container = containers[i];
        if (!connectedContainers_.has(container)) {
            res.push(container);
        }
    }

    return res;
}


export { getIsolatedComponents }
