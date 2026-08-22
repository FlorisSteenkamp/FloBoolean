import type { X } from './x.js';
import type { Loop } from '../shape/loop.js';
import { bezierSelfIntersection } from 'flo-bezier3';
import { toP } from '../utils/to-p.js';
import { eps } from 'flo-poly';


/**
 * @param loops 
 */
function getSelfIntersections(
        loops: Loop[]): [X,X][] {

    const xs: [X,X][] = [];

    for (const loop of loops) {
        for (const curve of loop.curves) {
            const ps = curve.ps;
            const ts = bezierSelfIntersection(ps);

            if (ts.length === 0) { continue; }

            // if a cusp (or extremely close to it)
            const kind: 0|1|2|3|4|5|6 = ts[0] === ts[1] 
                ? 3/*cusp*/
                : 2/*self-intersection*/;
                
            const ts0 = ts[0];
            const ts1 = ts[1];

            const t0S = ts0 - 4*eps;
            const t0E = ts0 + 4*eps;
            const t1S = ts1 - 4*eps;
            const t1E = ts1 + 4*eps;

            const p = toP(ps, ts0);

            const ri0 = { t: t0S, tS: t0S, tE: t0E, multiplicity: 1 };
            const ri1 = { t: t1S, tS: t1S, tE: t1E, multiplicity: 1 };

            const x0 = { ri: ri0, p, kind, curve };
            const x1 = { ri: ri1, p, kind, curve };

            xs.push([x0, x1]);
        }
    }

    return xs;
}


export { getSelfIntersections }
