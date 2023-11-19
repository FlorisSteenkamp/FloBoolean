declare const _debug_: Debug; 

import { squaredDistanceBetween } from 'flo-vector2d';
import { closestPointOnBezier } from 'flo-bezier3';
import { drawFs } from 'flo-draw';
import { Debug } from '../../../src/debug/debug.js';


/**
 * Logs some info about the bezier (*after* loop simplification) nearest the 
 * given point.
 * 
 * @param g 
 * @param p 
 * @param showDelay 
 */
function logNearestBezierPost(
        g: SVGGElement, 
        p: number[], 
        showDelay = 1000) {

    let bestPs: number[][];
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const loops of _debug_.generated.elems.loops) {
        const bezierLoops = loops;
        const generated = _debug_.generated;

        for (const loop of bezierLoops) {
            const beziers = loop.beziers;
            for (const ps of beziers) {
                const bezierPoint = closestPointOnBezier(ps, p);
                const d = squaredDistanceBetween(bezierPoint.p, p);
                
                if (d < bestDistance) {
                    //g = generated.g;
                    bestPs = ps;
                    bestDistance = d;
                }
            }
        }
    }
    
    drawFs.bezier(g, bestPs!, 'blue thin20 nofill', showDelay, 'blue thin10', 0.1, 'blue thin5 nofill');
    console.log(bestPs!);
}


export { logNearestBezierPost }
