import { IntersectionResult } from '../sweep-line/sweep-line';
/**
 * Representation of an undirectied graph as a map of adjacency lists, where
 * the map keys represent the Vertices (V) and the adjacency list the edges (E).
 */
declare type TGraph<T> = Map<T, T[]>;
declare function addEdges<T, U>(graph: TGraph<T>, edges: IntersectionResult<T, U>[]): void;
/**
 * Adds an edge to an undirected graph.
 */
declare function addEdge<T>(graph: TGraph<T>, vertices: [T, T]): void;
/**
 * Returns connected components for the given undirected graph
 */
declare function getConnectedComponents<T>(graph: TGraph<T>): T[][];
export { addEdge, getConnectedComponents, TGraph, addEdges };
