declare const _debug_: Debug; 

import { squaredDistanceBetween, centroid } from 'flo-vector2d';
import { closestPointOnBezier } from 'flo-bezier3';
import { Debug } from '../../../src/debug/debug.js';


/**
 * Logs some info about the bezier (before loop simplification) nearest the 
 * given point.
 * 
 * @param g 
 * @param p 
 * @param showDelay 
 */
function logNearestBezierPre(g: SVGGElement, p: number[], showDelay = 1000) {
    let bestPs: number[][];
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const ps of _debug_.generated.elems.bezier_) {
        const bezierPoint = closestPointOnBezier(ps, p);
        const d = squaredDistanceBetween(bezierPoint.p, p);
        
        if (d < bestDistance) {
            //g = generated.g;
            bestPs = ps;
            bestDistance = d;
        }
    }
    
    _debug_.fs.drawElem.bezier_(g, bestPs!, undefined, showDelay);
    console.log(bestPs!);
} 


function logLooseBb_(g: SVGGElement, p: number[], showDelay = 1000) {
    const poly = getNearestPoly(p, _debug_.generated.elems.looseBoundingBox_)!;

    _debug_.fs.drawElem.looseBoundingBox_(g, poly, undefined, showDelay);
    console.log(poly);
} 

function logTightBb_(g: SVGGElement, p: number[], showDelay = 1000) {
    const poly = getNearestPoly(p, _debug_.generated.elems.tightBoundingBox_)!;

    _debug_.fs.drawElem.tightBoundingBox_(g, poly, undefined, showDelay);
    console.log(poly);
} 

function logBHull_(g: SVGGElement, p: number[], showDelay = 1000) {
    const poly = getNearestPoly(p, _debug_.generated.elems.boundingHull_)!;

    _debug_.fs.drawElem.boundingHull_(g, poly, undefined, showDelay);
    console.log(poly);
}


function getNearestPoly(p: number[], polys: number[][][]) {
    let bestPoly;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const poly of polys) {
        const c = centroid(poly);
        const d = squaredDistanceBetween(c, p);
            
        if (d < bestDistance) {
            bestPoly = poly;
            bestDistance = d;
        }
    }
    
    return bestPoly;
}


export { logNearestBezierPre, logLooseBb_, logTightBb_, logBHull_ }
