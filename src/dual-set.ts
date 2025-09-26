
/**
 * A 'dual-set' in the sense that it needs two ordered keys.
 */
type DualSet<K,L> = Map<K,Set<L>>;


/**
 * Get a value from the dual-set.
 * @param set 
 * @param k 
 * @param l 
 */
function dualSetHas<K,L>(set: DualSet<K,L>, k: K, l: L): boolean {
    let lSet = set.get(k);
    if (lSet === undefined) { return false; }

    return lSet.has(l);
}


/**
 * Adds a value in the dual-set.
 * 
 * * destructively sets the value
 * 
 * @param set 
 * @param k 
 * @param l 
 * @param v 
 */
function dualSetAdd<K,L>(set: DualSet<K,L>, k: K, l: L): void {
    let lSet = set.get(k);
    if (lSet === undefined) {
        lSet = new Set();
        set.set(k, lSet);
    }
    lSet.add(l);
}


export { DualSet, dualSetHas, dualSetAdd }


// Quokka tests:
// const a: DualSet<number,number> = new Map();

// dualSetAdd(a, 1, 2);
// dualSetAdd(a, 1, 3);
// dualSetAdd(a, 2, 4);
// dualSetAdd(a, 2, 4);
// dualSetAdd(a, 1, 3);

// dualSetHas(a, 1, 2);
// dualSetHas(a, 1, 3);
// dualSetHas(a, 2, 4);
// dualSetHas(a, 1, 4);
