import type { Loop } from "../shape/loop.js";
import type { __X__ } from "./-x-.js";
import { makeSimpleX } from "./make-simple-x.js";


function getInterfaceIntersections(
        loops: Loop[]): [__X__,__X__][] {

    /** all one-sided Xs from */
    const xs: [__X__,__X__][] = [];

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
