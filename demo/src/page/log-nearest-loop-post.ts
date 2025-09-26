declare const _debug_: Debug; 

import { squaredDistanceBetween } from 'flo-vector2d';
import { Debug } from '../../../src/debug/debug';
import { getShapeArea, Loop, getShapeCentroid, getWindingNumber } from '../../../src/index';
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

    let bestLoop: Loop = undefined!;
    let bestDistance = Number.POSITIVE_INFINITY;

    const generated = _debug_.generated;
    const loops = generated.elems.loop;

    if (loops.length === 0) {
        console.log('No loops');
        return;
    }

    for (const loop of loops) {
        const p_ = getShapeCentroid(loop.beziers);
        const d = squaredDistanceBetween(p_, p);
        if (d < bestDistance) {
            bestLoop = loop;
            bestDistance = d;
        }
    }

    console.log(`winding number: ${getWindingNumber(bestLoop.beziers)}, area: ${getShapeArea(bestLoop!.beziers)}`);
    // console.log(bestLoop);
    for (const curve of bestLoop!.curves) {
        drawFs.bezier(g, curve.ps, 'thin20 blue nofill', showDelay);
    }
}


export { logNearestLoopPost };
