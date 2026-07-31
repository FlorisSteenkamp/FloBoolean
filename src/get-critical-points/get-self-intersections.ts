import type { __X__ } from './-x-.js';
import type { Loop } from '../shape/loop.js';
import { bezierSelfIntersection } from 'flo-bezier3';
import { toP } from '../utils/to-p.js';

const eps = Number.EPSILON;


/**
 * @param loops 
 */
function getSelfIntersections(
        loops: Loop[]): [__X__,__X__][] {

    const xs: [__X__,__X__][] = [];

    for (const loop of loops) {
        for (const curve of loop.curves) {
            const ps = curve.ps;
            const ts = bezierSelfIntersection(ps);
            // if (ts === undefined) { continue; }  // there is no self-intersection
            if (ts.length === 0) { continue; }

            // if a cusp (or extremely close to it)
            const kind: 0|1|2|3|4|5|6 = ts[0] === ts[1] 
                ? 3/*cusp*/
                : 2/*self-intersection*/;
                
            // FUTURE - fix box - must combine 2 boxes and bezierSelfIntersection must return intervals
            const ts0 = ts[0];
            const ts1 = ts[1];
            const t0S = ts0 - eps;
            const t0E = ts0 + eps;
            const t1S = ts1 - eps;
            const t1E = ts1 + eps;

            const p = toP(ps, ts0);

            xs.push([
                // FUTURE - multiplicity relevant??
                { x: { ri: { t: t0S, tS: t0S, tE: t0E, multiplicity: 1 }, p, kind }, curve },
                { x: { ri: { t: t1S, tS: t1S, tE: t1E, multiplicity: 1 }, p, kind }, curve }
            ]);
        }
    }

    return xs;
}


export { getSelfIntersections }
