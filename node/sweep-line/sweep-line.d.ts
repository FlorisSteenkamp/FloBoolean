declare type IntersectionResult<T, U> = {
    /** the first item checked for possible intersection */
    a: T;
    /** the second item checked for possible intersection */
    b: T;
    /** the result of the predicate */
    u: U;
};
/**
 * Generalized sweepline algorithm.
 *
 * Typically used to turn O(n^2) algorithms into roughly O(n logn) algorithms.
 *
 * @param items An array of items that are to be compared. Items should
 * typically be geometric objects in 2d space with well-defined left and right
 * endpoints.
 * @param getLeftmostPoint A function that returns the leftmost point of the
 * geometric object of interest.
 * @param getRightmostPoint A function that returns the rightmost point of the
 * geometric object of interest.
 * @param predicate A predicate that takes two geometric objects and returns
 * truthy (of some specific type) if they are of interest or falsey otherwise.
 */
declare function sweepLine<T, U>(items: T[], getLeftmost: (item: T) => number, getRightmost: (item: T) => number, predicate: (item1: T, item2: T) => U): IntersectionResult<T, U>[];
export { sweepLine, IntersectionResult };
