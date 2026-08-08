import { Loop } from "../../src/shape/loop.js";
import { Invariants } from "./invariants.js";
import { Tolerance } from "./tolerance.js";
import { getShapeCentroid } from "../../src/shape/get-shape-centroid.js";
import { getShapeArea } from "../../src/shape/get-shape-area.js";
import { getShapeBounds } from "../../src/calc-paths/get-shape-bounds.js";
import { checkInvariants } from './check-invariants.js';

const { abs } = Math;


function checkShapes(
        fileName: string,
        shapes: Loop[][], 
        invariants: Invariants[][],
        tolerance: Tolerance) {

    /** get the shape invariants to be tested */ 
    let invariants_: Invariants[][] = shapes.map(loops => {
        return loops.map(loop => {
            // loop.beziers;//?
            let centroid = getShapeCentroid(loop.beziers);
            let area     = abs(getShapeArea(loop.beziers));
            let bounds   = getShapeBounds(loop.beziers);

            return { centroid, area, bounds };
        });
    });

    const r = checkInvariants(fileName, invariants_, invariants, tolerance);

    return r;
}


export { checkShapes }
