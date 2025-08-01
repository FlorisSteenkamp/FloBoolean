import type { Loop } from "../loop/loop";
import type { __X__ } from "../-x-";
import { getExtreme } from "./get-extreme";


// TODO - include all interface points close to the extreme - they are the only
// important interface points - or are they??
/**
 * 
 * @param loops 
 */
function getExtremes(loops: Loop[]) {
    const extremes: Map<Loop, __X__[]> = new Map();
    const xs: __X__[][] = [];
    for (const loop of loops) {
        const xPair = getExtreme(loop);
        xs.push(xPair);
        extremes.set(loop, xPair);
    }

    return { extremes, xs };
}


export { getExtremes }
