declare const _debug_: Debug; 
import type { Debug } from '../../../src/debug/debug.js';
import { drawFs } from 'flo-draw';
import { getShapeArea, Loop } from '../../../src/index.js';
import { getMaxCoordinate } from '../../../src/shape/normalize/get-max-coordinate.js';
import { isPointInLoop } from '../../../src/is-loop-in-loop/is-loop-in-loop.js';


function logNearestLoopsPost(
        g: SVGGElement, 
        p: number[], 
        showDelay = 1000) {

    const elems = _debug_.elems;
    const loopss = elems.loops;

    if (loopss.length === 0) {
        console.log('No loops');
        return;
    }

    const expMax = Math.ceil(Math.log2(getMaxCoordinate(
        loopss.flatMap(loops => loops.map(loop => loop.beziers))
    )));

    let bestLoops: Loop[] | undefined = undefined;
    let bestArea = Infinity;

    for (const loops of loopss) {
        // The point is inside the shape when an odd number of its loops contain it.
        let insideCount = 0;
        for (const loop of loops) {
            const bezierPieces = loop.beziers.map(ps => ({ ps, ts: [0, 1] as [number, number] }));
            if (isPointInLoop(expMax, p, bezierPieces) === true) { insideCount++; }
        }
        if (insideCount % 2 === 0) { continue; }

        const area = Math.abs(loops.reduce((sum, loop) => sum + getShapeArea(loop.beziers), 0));
        if (area < bestArea) {
            bestArea = area;
            bestLoops = loops;
        }
    }

    if (bestLoops === undefined) {
        console.log('No shape contains the given point');
        return;
    }

    for (const loop of bestLoops) {
        for (const curve of loop.curves) {
            drawFs.bezier(g, curve.ps, undefined, showDelay);
        }
    }

    const bestLoops_ = bestLoops.map(loop => loop.beziers);
    console.log(bestLoops_);
}


export { logNearestLoopsPost }
