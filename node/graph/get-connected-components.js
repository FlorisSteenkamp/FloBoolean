/**
 * Adds an edge to an undirected graph.
 */
function addEdge(graph, vertices) {
    const [src, dest] = vertices;
    graph.getOrInsert(src, []).push(dest);
    graph.getOrInsert(dest, []).push(src);
}
function DFSUtil(graph, v, visited, component) {
    // Mark the current node as visited and add it 
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
 * Returns the connected components for the given undirected graph.
 *
 * An isolated vertex (a graph key with an empty adjacency list) is returned as
 * its own single-vertex component.
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
export { addEdge, getConnectedComponents };
//# sourceMappingURL=get-connected-components.js.map