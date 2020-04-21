"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addEdges(graph, edges) {
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        addEdge(graph, [edge.a, edge.b]);
    }
}
exports.addEdges = addEdges;
/**
 * Adds an edge to an undirected graph.
 */
function addEdge(graph, vertices) {
    let [src, dest] = vertices;
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
exports.addEdge = addEdge;
function DFSUtil(graph, v, visited, component) {
    // Mark the current node as visited and print it 
    visited.add(v);
    component.push(v);
    // Recur for all the vertices adjacent to this vertex 
    let list = graph.get(v);
    for (let i = 0; i < list.length; i++) {
        let x = list[i];
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
    let components = [];
    let visited = new Set();
    for (let item of graph) {
        let node = item[0];
        if (!visited.has(node)) {
            // print all reachable vertices from v 
            components.push([]);
            DFSUtil(graph, node, visited, components[components.length - 1]);
        }
    }
    return components;
}
exports.getConnectedComponents = getConnectedComponents;
//# sourceMappingURL=get-connected-components.js.map