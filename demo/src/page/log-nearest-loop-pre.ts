declare const _debug_: Debug; 

import { squaredDistanceBetween } from 'flo-vector2d';
import { drawFs } from 'flo-draw';
import { Debug } from '../../../src/debug/debug.js';
import { getShapeArea, Loop, loopFromBeziers, getShapeCentroid, getWindingNumber } from '../../../src/index.js';




/**
 * Log the loop (pre simplification) nearest the given point.
 * @param g 
 * @param p 
 * @param showDelay 
 */
function logNearestLoopPre(
        g: SVGGElement, 
        p: number[], showDelay = 1000) {

    let bestLoop: Loop = undefined!;
    let bestDistance = Number.POSITIVE_INFINITY;

    const generated = _debug_.generated;
    const loops = generated.elems.loopPre;

    if (loops.length === 0) {
        console.log('No loops');
        return;
    }

    for (const loop of loops.map(loopFromBeziers)) {
        const p_ = getShapeCentroid(loop.beziers);
        const d = squaredDistanceBetween(p_, p);
        if (d < bestDistance) {
            bestLoop = loop;
            bestDistance = d;
        }
    }

    console.log(`winding number: ${getWindingNumber(bestLoop.beziers)}, area: ${getShapeArea(bestLoop!.beziers)}`);
    for (const curve of bestLoop!.curves) {
        drawFs.bezier(g, curve.ps, 'thin20 red nofill', showDelay);
    }
}


export { logNearestLoopPre };
