import { Loop } from "../../src/loop/loop";
import { Invariants } from "./invariants";
import { Tolerance } from "./tolerance";
import { getShapeCentroid } from "../../src/loop/get-loop-centroid";
import { getShapeArea } from "../../src/loop/get-loop-area";
import { getShapeBounds } from "../../src/calc-paths/get-shape-bounds";
import { checkInvariants } from './check-invariants';


function checkShapes(
        shapes: Loop[][], 
        invariants: Invariants[][],
        tolerance: Tolerance) {

    /** get the shape invariants to be tested */ 
    let invariants_: Invariants[][] = shapes.map(loops => {
        return loops.map(loop => {
            // loop.beziers;//?
            let centroid = getShapeCentroid(loop.beziers);
            let area     = getShapeArea(loop.beziers);
            let bounds   = getShapeBounds(loop.beziers);

            return { centroid, area, bounds };
        });
    });

    const r = checkInvariants(invariants_, invariants, tolerance);

    return r;
}


export { checkShapes }
