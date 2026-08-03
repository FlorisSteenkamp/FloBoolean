/**
 * Returns the result of mapping the array to depth 2 and applying a filter
 * to the inner results which defaults to filtering out `undefined`.
 *
 * @param tss
 * @param f
 * @param filter
 */
declare function mapmap<T, U>(tss: T[][], f: (t: T) => U, filter?: (u: U) => boolean): U[][];
export { mapmap };
