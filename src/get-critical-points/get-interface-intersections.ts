import type { Loop } from "../shape/loop.js";
import type { X } from "./x.js";
import { makeSimpleX } from "./make-simple-x.js";


function getInterfaceIntersections(
        loops: Loop[]): [X,X][] {

    /** all one-sided Xs from */
    const xs: [X,X][] = [];

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
