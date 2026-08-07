

/**
 * Performs an in-place cyclic sort of the array `ts`.
 * 
 * * note: there are n ways to sort a cyclic array, so the result is not unique.
 * * O(n log n)
 * 
 * @param ts the array of elements to be cyclically sorted
 * @param compareABC a function that takes three elements a, b, c and returns
 * `true` if they are in the correct cyclic order, `false` otherwise
 */
function cyclicOrder<T>(
        ts: T[],
        compareABC: (a: T, b: T, c: T) => boolean) {

    const n = ts.length;
    // Fewer than 3 elements are trivially in cyclic order (any arrangement).
    if (n < 3) { return ts; }

    const pivot = ts[0];

    ts.sort((b, c) =>
        b === pivot ? -1 :
        c === pivot ? 1 :
        compareABC(pivot, b, c) ? -1 : 1);
}


export { cyclicOrder }


// Quokka tests
// const ts = [3, 2, 1, 8, 0, 7, 6, 5, 4];
// function compareABC(a: number, b: number, c: number) {
//     return (a < b && b < c) || (b < c && c < a) || (c < a && a < b);
// }

// cyclicSort(ts, compareABC);//?
