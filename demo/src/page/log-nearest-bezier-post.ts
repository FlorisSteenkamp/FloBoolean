declare var _debug_: Debug; 

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

    for (let loops of _debug_.generated.elems.loops) {
        let bezierLoops = loops;
        let generated = _debug_.generated;

        for (let loop of bezierLoops) {
            let beziers = loop.beziers;
            for (let ps of beziers) {
                let bezierPoint = closestPointOnBezier(ps, p);
                let d = squaredDistanceBetween(bezierPoint.p, p);
                
                if (d < bestDistance) {
                    //g = generated.g;
                    bestPs = ps;
                    bestDistance = d;
                }
            }
        }
    }
    
    drawFs.bezier(g, bestPs!, undefined, showDelay);
    console.log(bestPs!);
}


export { logNearestBezierPost }
