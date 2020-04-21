
import { Loop } from "../../src/loop/loop";
import { Invariants } from "./invariants";
import { Tolerance } from "./tolerance";
import { getLoopCentroid } from "../../src/loop/get-loop-centroid";
import { getLoopArea } from "../../src/loop/get-loop-area";
import { simplifyBounds } from "../../src/loop/simplify-bounds";
import { getLoopBounds } from "../../src/loop/get-loop-bounds";
import { checkInvariants } from './check-invariants';


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
