import { Loop } from "../loop/loop.js";
import { __X__ } from "../-x-.js";
import { getExtreme } from "./get-extreme.js";


// TODO - include all interface points close to the extreme - they are the only
// important interface points - or are they??
/**
 * 
 * @param loops 
 */
function getExtremes(loops: Loop[]) {
    let extremes: Map<Loop, __X__[]> = new Map();
    let xs: __X__[][] = [];
    for (let loop of loops) {
        let xPair = getExtreme(loop);
        xs.push(xPair);
        extremes.set(loop, xPair);
    }

    return { extremes, xs };
}


export { getExtremes }
