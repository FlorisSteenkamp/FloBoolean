function addEdges(graph, edges) {
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        addEdge(graph, [edge.a, edge.b]);
    }
}
/**
 * Adds an edge to an undirected graph.
 */
function addEdge(graph, vertices) {
    const [src, dest] = vertices;
    let srcList = graph.get(src);
    if (!srcList) {
        srcList = [];
        graph.set(src, srcList);
    }
    let destList = graph.get(dest);
    if (!destList) {
        destList = [];
        graph.set(dest, destList);
    }
    srcList.push(dest);
    destList.push(src);
}
function DFSUtil(graph, v, visited, component) {
    // Mark the current node as visited and print it 
    visited.add(v);
    component.push(v);
    // Recur for all the vertices adjacent to this vertex 
    const list = graph.get(v);
    for (let i = 0; i < list.length; i++) {
        const x = list[i];
        if (!visited.has(x)) {
            DFSUtil(graph, x, visited, component);
        }
    }
}
/**
 * Returns connected components for the given undirected graph
 */
function getConnectedComponents(graph) {
    // Mark all the vertices as not visited 
    const components = [];
    const visited = new Set();
    for (const item of graph) {
        const node = item[0];
        if (!visited.has(node)) {
            // print all reachable vertices from v 
            components.push([]);
            DFSUtil(graph, node, visited, components[components.length - 1]);
        }
    }
    return components;
}
export { addEdge, getConnectedComponents, addEdges };
//# sourceMappingURL=get-connected-components.js.map