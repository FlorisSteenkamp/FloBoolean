declare const _debug_: Debug; 
import type { Debug } from '../../../src/debug/debug.js';
import type { _X_ } from '../../../src/get-critical-points/-x-.js';
import { bezierPieceToBezier } from 'flo-bezier3';
import { distanceBetween } from 'flo-vector2d';
import { getBeziersToNextX } from '../../../src/containers/get-beziers-to-next-x.js';


function logNearestX(g: SVGGElement, pC: number[], showDelay = 1000) {
    let x: _X_;
    let bestD = Infinity;

    for (const container of _debug_.elems.container) {
        for (const _x_ of container.xs) {
            const { x: { p } } = _x_;

            const d = distanceBetween(p, pC);

            if (d < bestD) {
                x = _x_;
                bestD = d;
            }
        }
    }

    console.log(x!);


    for (const bezierPiece of getBeziersToNextX(x!, true)) {
        const ps = bezierPieceToBezier(bezierPiece);
        _debug_.fs.drawElem.bezier_(g, ps, 'thin10 red nofill', showDelay);
    }
    for (const bezierPiece of getBeziersToNextX(x!, false)) {
        const ps = bezierPieceToBezier(bezierPiece);
        _debug_.fs.drawElem.bezier_(g, ps, 'thin10 blue nofill', showDelay);
    }
}


export { logNearestX }
