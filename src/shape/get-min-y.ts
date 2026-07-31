import type { Loop } from './loop.js';
import { getBezierMinY } from '../bezier/get-bezier-min-y.js';
import { getControlPointBox } from 'flo-bezier3';

const { min } = Math;


/** 
 *
 */
function getLoopMinY(
        loop: Loop) {

    const { curves } = loop;

    let minYP = Infinity;
    for (const { ps } of curves) {
        minYP = min(minYP, getControlPointBox(ps)[0][1]);
    }

    let bestY: { t: number; p: number[]; } | undefined = undefined!;
    let bestCurve = curves[0];

    for (const curve of curves) {
        const { ps } = curve;

        if (!ps.some(p => p[1] <= minYP)) { continue; }

        const minY = getBezierMinY(ps);
        const v = minY.p[1];

        if (bestY === undefined ||
            v < bestY.p[1] ||
            (v === bestY.p[1] && minY.t > bestY.t)) {

            bestY = minY;
            bestCurve = curve;
            minYP = v;
        }
    }

    return { curve: bestCurve, y: bestY }; 
}


export { getLoopMinY }
