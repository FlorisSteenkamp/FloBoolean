declare const _debug_: Debug; 

import { squaredDistanceBetween } from 'flo-vector2d';
import { Debug } from '../../../src/debug/debug';
import { getLoopArea, Loop, getLoopCentroid } from '../../../src/index';
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

    const generated = _debug_.generated;
    const loops = generated.elems.loop;

    for (const loop of loops) {
        const p_ = getLoopCentroid(loop);
        const d = squaredDistanceBetween(p_, p);
        if (d < bestDistance) {
            bestLoop = loop;
            bestDistance = d;
        }
    }

    console.log('area', getLoopArea(bestLoop!));
    for (const curve of bestLoop!.curves) {
        drawFs.bezier(g, curve.ps, 'thin20 red nofill', showDelay);
    }
}


export { logNearestLoopPost };
