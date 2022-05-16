declare var _debug_: Debug; 

import { squaredDistanceBetweenPointAndLineSegment } from 'flo-vector2d';
import { evalDeCasteljau, length } from 'flo-bezier3';
import { drawFs } from 'flo-draw';
import { Debug } from '../../../src/debug/debug.js';
import { Loop } from '../../../src/index.js';


function logNearestLoopsPost(
        g: SVGGElement, 
        p: number[], 
        showDelay = 1000) {

    let bestDistance = Number.POSITIVE_INFINITY;
    let bestLoops: Loop[] | undefined = undefined;

    let generated = _debug_.generated;
    let loopss = generated.elems.loops;

    for (let loops of loopss) {
        for (let loop of loops) {
            for (let curve of loop.curves) {
                let ps = curve.ps;
                let l = [evalDeCasteljau(ps,0), evalDeCasteljau(ps,1)];
                
                let d = squaredDistanceBetweenPointAndLineSegment(p, l);
                
                if (d < bestDistance) {
                    bestDistance = d;
                    bestLoops = loops;
                }
            }
        }
    }
    
    for (let loop of bestLoops!) {
        for (let curve of loop.curves) {
            drawFs.bezier(g, curve.ps, undefined, showDelay);
        }
    }

    console.log(bestLoops);
    //console.log(bestLoops.map(
    //    loop => loop.beziers.map(ps => length([0,1],ps))
    //))
}


export { logNearestLoopsPost }
