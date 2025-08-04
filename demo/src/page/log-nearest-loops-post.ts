declare const _debug_: Debug; 

import { squaredDistanceBetweenPointAndLineSegment } from 'flo-vector2d';
import { evalDeCasteljau, length } from 'flo-bezier3';
import { drawFs } from 'flo-draw';
import { Debug } from '../../../src/debug/debug';
import { Loop } from '../../../src/index';


function logNearestLoopsPost(
        g: SVGGElement, 
        p: number[], 
        showDelay = 1000) {

    let bestDistance = Number.POSITIVE_INFINITY;
    let bestLoops: Loop[] | undefined = undefined;

    const generated = _debug_.generated;
    const loopss = generated.elems.loops;

    for (const loops of loopss) {
        for (const loop of loops) {
            for (const curve of loop.curves) {
                const ps = curve.ps;
                const l = [evalDeCasteljau(ps,0), evalDeCasteljau(ps,1)];
                
                const d = squaredDistanceBetweenPointAndLineSegment(p, l);
                
                if (d < bestDistance) {
                    bestDistance = d;
                    bestLoops = loops;
                }
            }
        }
    }
    
    for (const loop of bestLoops!) {
        for (const curve of loop.curves) {
            drawFs.bezier(g, curve.ps, undefined, showDelay);
        }
    }

    console.log(bestLoops);
    //console.log(bestLoops.map(
    //    loop => loop.beziers.map(ps => length([0,1],ps))
    //))
}


export { logNearestLoopsPost }
