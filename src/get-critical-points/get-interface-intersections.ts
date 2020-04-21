
import { Loop } from "../loop/loop";
import { _X_ } from "../x";
import { makeSimpleX } from "./make-simple-x";


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
