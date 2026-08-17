import type { Loop } from './loop.js';
import type { X } from '../get-critical-points/x.js';
import type { Curve } from '../curve/curve.js';
import { getBezierMinY } from '../bezier/get-bezier-min-y.js';
import { getControlPointBox } from 'flo-bezier3';


/** 
 *
 */
function getLoopMinY(
        loop: Loop): { curve: Curve; y: X; } {

    const { curves } = loop;

    let bestY: X = undefined!;
    let bestCurve = curves[0];
    let bestMinY = Infinity;

    for (const curve of curves) {
        const { ps } = curve;

        // Lower bound on this curve's min y: the curve lies within its control
        // point box, so its true min y is >= the box's top (min y).
        const boxTop = getControlPointBox(ps)[0][1];

        // Branch-and-bound prune: this curve cannot beat (or tie) the best found
        // so far, so skip the (expensive) exact min-y computation.
        if (boxTop > bestMinY) { continue; }

        const minY = getBezierMinY(ps);
        const v = minY.p[1];

        if (bestY === undefined ||
            v < bestMinY ||
            (v === bestMinY && minY.ri.t > bestY.ri.t)) {

            bestY = minY;
            bestCurve = curve;
            bestMinY = v;
        }
    }

    return { curve: bestCurve, y: bestY }; 
}


export { getLoopMinY }
