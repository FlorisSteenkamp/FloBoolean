declare const _debug_: Debug;
import type { Debug } from '../../../src/debug/debug.js';
import type { Curve } from '../../../src/curve/curve.js';
import { drawFs } from 'flo-draw';
import { distanceBetween } from 'flo-vector2d';


type MinYElem = { curve: Curve; t: number; p: number[] };


function logNearestMinY(g: SVGGElement, p: number[], showDelay = 1000) {
    // `_debug_.elems.minY` is populated as an array (one entry per loop),
    // even though its declared type is a single object.
    const minYs = _debug_.elems.minY as unknown as MinYElem[];

    let best: MinYElem | undefined;
    let bestD = Infinity;

    for (const minY of minYs) {
        const d = distanceBetween(minY.p, p);
        if (d < bestD) {
            best = minY;
            bestD = d;
        }
    }

    if (best === undefined) { return; }

    console.log('minY', best);

    // radius scaled to the local geometry (chord length of the min-y curve)
    const ps = best.curve.ps;
    const radius = (distanceBetween(ps[0], ps[ps.length - 1]) || 1) / 2;

    drawFs.circle(g, { center: best.p, radius }, 'red thin10 nofill', showDelay);
}


export { logNearestMinY }
