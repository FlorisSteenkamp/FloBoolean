import { Loop } from "../loop/loop.js";
import { _X_ } from "../-x-.js";
import { makeSimpleX } from "./make-simple-x.js";


function getInterfaceIntersections(loops: Loop[]): _X_[][] {
    /** all one-sided Xs from */
    let xs: _X_[][] = [];

    // Get interface points
    for (let loop of loops) {
        for (let curve of loop.curves) {
            xs.push([
                makeSimpleX(1,curve,4),       // interface
                makeSimpleX(0,curve.next,4),  // interface
            ]);
        }
    } 

    return xs;
}


export { getInterfaceIntersections }
