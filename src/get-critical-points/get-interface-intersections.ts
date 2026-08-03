import type { Loop } from "../shape/loop.js";
import type { _X_ } from "./-x-.js";
import { makeSimpleX } from "./make-simple-x.js";


function getInterfaceIntersections(
        loops: Loop[]): [_X_,_X_][] {

    /** all one-sided Xs from */
    const xs: [_X_,_X_][] = [];

    // Get interface points
    for (const loop of loops) {
        for (const curve of loop.curves) {
            xs.push([
                makeSimpleX(1, curve, 4),       // interface
                makeSimpleX(0, curve.next, 4),  // interface
            ]);
        }
    } 

    return xs;
}


export { getInterfaceIntersections }
