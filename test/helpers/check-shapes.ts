import { Loop } from "../../src/loop/loop.js";
import { Invariants } from "./invariants.js";
import { Tolerance } from "./tolerance.js";
import { getLoopCentroid } from "../../src/loop/get-loop-centroid.js";
import { getLoopArea } from "../../src/loop/get-loop-area.js";
import { simplifyBounds } from "../../src/loop/simplify-bounds.js";
import { getLoopBounds } from "../../src/loop/get-loop-bounds.js";
import { checkInvariants } from './check-invariants.js';


function checkShapes(
        shapes: Loop[][], 
        invariants: Invariants[][],
        tolerance: Tolerance) {

    /** get the shape invariants to be tested */ 
    let invariants_: Invariants[][] = shapes.map(loops => {
        return loops.map(loop => {
            let centroid = getLoopCentroid(loop);
            let area     = getLoopArea(loop);
            let bounds   = simplifyBounds(getLoopBounds(loop));

            return { centroid, area, bounds };
        });
    });

    return checkInvariants(invariants_, invariants, tolerance);
}


export { checkShapes }
