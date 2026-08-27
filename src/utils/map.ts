
/**
 * Functionalized `Array.map`
 * 
 * @param ts 
 * @param f 
 */
function map<T,U>(
        ts: T[],
        f: (t: T) => U): U[] {

    const ts_: U[] = [];
    for (let j=0; j<ts.length; j++) {
        ts_.push(f(ts[j]));
    }

    return ts_;
}


export { map }

