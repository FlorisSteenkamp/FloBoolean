declare const _debug_: Debug; 
import { drawFs } from 'flo-draw';
import { Debug } from '../../../src/debug/debug.js';
import { getShapeArea, Loop, loopFromBeziers, getTurningNumber } from '../../../src/index.js';
import { getMaxCoordinate } from '../../../src/shape/normalize/get-max-coordinate.js';
import { isPointInLoop } from '../../../src/is-loop-in-loop/is-loop-in-loop.js';




/**
 * Log the loop (pre simplification) containing the given point. When several
 * loops contain it, the one with the smallest area (the innermost) is logged.
 * @param g 
 * @param p 
 * @param showDelay 
 */
function logNearestLoopPre(
        g: SVGGElement, 
        p: number[], showDelay = 1000) {

    const elems = _debug_.elems;
    const loopsPre = elems.loopPre;

    if (loopsPre.length === 0) {
        console.log('No loops');
        return;
    }

    const loops = loopsPre.map(loopFromBeziers);
    const expMax = Math.ceil(Math.log2(getMaxCoordinate(loops.map(loop => loop.beziers))));

    let bestLoop: Loop = undefined!;
    let bestArea = Infinity;

    for (const loop of loops) {
        const bezierPieces = loop.beziers.map(ps => ({ ps, ts: [0, 1] as [number, number] }));
        if (isPointInLoop(expMax, p, bezierPieces) !== true) { continue; }

        const area = Math.abs(getShapeArea(loop.beziers));
        if (area < bestArea) {
            bestLoop = loop;
            bestArea = area;
        }
    }

    if (bestLoop === undefined) {
        console.log('No loop contains the given point');
        return;
    }

    console.log(`turning number: ${getTurningNumber(bestLoop.beziers)}, area: ${getShapeArea(bestLoop.beziers)}`);
    for (const curve of bestLoop.curves) {
        drawFs.bezier(g, curve.ps, 'thin20 red nofill', showDelay);
    }
}


export { logNearestLoopPre };
