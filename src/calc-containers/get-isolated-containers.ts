
/**
 * @param containers all containers
 * @param connectedContainers 
 */
function getIsolatedComponents<T>(
        containers: T[], 
        connectedContainers: T[][]) {
            
    let connectedContainers_: Set<T> = new Set();
    for (let cs of connectedContainers) {
        for (let c of cs) {
            connectedContainers_.add(c);
        }
    }

    let res: T[] = [];
    for (let i=0; i<containers.length; i++) {
        let container = containers[i];
        if (!connectedContainers_.has(container)) {
            res.push(container);
        }
    }

    return res;
}


export { getIsolatedComponents }
