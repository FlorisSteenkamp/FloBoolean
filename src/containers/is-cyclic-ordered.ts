
/**
 * Returns `true` if the array `ts` is in cyclic order according to the given
 * ternary cyclic-order predicate, `false` otherwise.
 * 
 * * O(n)
 * 
 * @param ts the array to test
 * @param compareABC a function that takes three elements a, b, c and returns
 * `true` if they are in the correct cyclic order, `false` otherwise
 */
function isCyclicOrdered<T>(
        ts: T[],
        compareABC: (a: T, b: T, c: T) => boolean): boolean {

    const n = ts.length;
    // Fewer than 3 elements are trivially in cyclic order (any arrangement).
    if (n < 3) { return true; }

    const pivot = ts[0];
    for (let i = 1; i < n - 1; i++) {
        if (!compareABC(pivot, ts[i], ts[i + 1])) { return false; }
    }

    return true;
}


export { isCyclicOrdered }
