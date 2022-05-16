import { bezierSelfIntersection, getIntervalBox } from 'flo-bezier3';
import { _X_ } from '../-x-.js';
import { Loop } from '../loop/loop.js';


const eps = Number.EPSILON;


/**
 * @param loops 
 */
function getSelfIntersections(loops: Loop[]): _X_[][] {
    let xs: _X_[][] = [];

    for (let loop of loops) {
        for (let curve of loop.curves) {
            let ps = curve.ps;
            let ts = bezierSelfIntersection(ps);
            // if (ts === undefined) { continue; }  // there is no self-intersection
            if (ts.length === 0) { continue; }

            // if a cusp (or extremely close to it)
            let kind: 0|1|2|3|4|5|6 = ts[0] === ts[1] 
                ? 3/*cusp*/
                : 2/*self-intersection*/;
                
            // TODO - fix box - must combine 2 boxes and bezierSelfIntersection must return intervals
            let t0S = ts[0] - eps;
            let t0E = ts[0] + eps;
            let t1S = ts[1] - eps;
            let t1E = ts[1] + eps;

            let box0 = getIntervalBox(ps,[t0S,t0E]);  // ts are within 1 upls accurate
            let box1 = getIntervalBox(ps,[t1S,t1E]);  // ts are within 1 upls accurate

            xs.push([
                // TODO - multiplicity relevant??
                { x: { ri: { tS: t0S, tE: t0E, multiplicity: 1 }, box: box0, kind }, curve },
                { x: { ri: { tS: t1S, tE: t1E, multiplicity: 1 }, box: box1, kind }, curve }
            ]);
        }
    }

    return xs;
}


export { getSelfIntersections }
