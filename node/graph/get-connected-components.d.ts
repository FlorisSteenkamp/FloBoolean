/**
 * Representation of an undirectied graph as a map of adjacency lists, where
 * the map keys represent the Vertices (V) and the adjacency list the edges (E).
 */
type Graph<T> = Map<T, T[]>;
/**
 * Adds an edge to an undirected graph.
 */
declare function addEdge<T>(graph: Graph<T>, vertices: [T, T]): void;
/**
 * Returns the connected components for the given undirected graph.
 *
 * An isolated vertex (a graph key with an empty adjacency list) is returned as
 * its own single-vertex component.
 */
declare function getConnectedComponents<T>(graph: Graph<T>): T[][];
export { addEdge, getConnectedComponents };
export type { Graph };
