declare var _debug_: Debug; 

import { squaredDistanceBetween } from 'flo-vector2d';
import { Debug } from '../../../src/debug/debug.js';
import { getLoopArea, Loop, getLoopCentroid } from '../../../src/index.js';
import { drawFs } from 'flo-draw';


/**
 * Log the loop (post simplification) nearest the given point.
 * @param g 
 * @param p 
 * @param showDelay 
 */
function logNearestLoopPost(
        g: SVGGElement, 
        p: number[], showDelay = 1000) {

    let bestLoop: Loop;
    let bestDistance = Number.POSITIVE_INFINITY;

    let generated = _debug_.generated;
    let loops = generated.elems.loop;

    for (let loop of loops) {
        let p_ = getLoopCentroid(loop);
        let d = squaredDistanceBetween(p_, p);
        if (d < bestDistance) {
            bestLoop = loop;
            bestDistance = d;
        }
    }

    console.log('area', getLoopArea(bestLoop!));
    for (let curve of bestLoop!.curves) {
        drawFs.bezier(g, curve.ps, 'thin20 red nofill', showDelay);
    }
}


export { logNearestLoopPost };
