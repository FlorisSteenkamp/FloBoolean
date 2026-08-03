import type { IntersectionResult } from '../sweep-line/sweep-line.js';
/**
 * Representation of an undirectied graph as a map of adjacency lists, where
 * the map keys represent the Vertices (V) and the adjacency list the edges (E).
 */
type TGraph<T> = Map<T, T[]>;
declare function addEdges<T, U>(graph: TGraph<T>, edges: IntersectionResult<T, U>[]): void;
/**
 * Adds an edge to an undirected graph.
 */
declare function addEdge<T>(graph: TGraph<T>, vertices: [T, T]): void;
/**
 * Returns connected components for the given undirected graph, including
 * isolated vertices from the optional `items` collection.
 */
declare function getConnectedComponents<T>(graph: TGraph<T>, items?: Iterable<T>): T[][];
export { addEdge, getConnectedComponents, addEdges };
export type { TGraph };
