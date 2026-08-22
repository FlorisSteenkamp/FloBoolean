declare const _debug_: Debug; 
import type { Debug } from '../../../src/debug/debug.js';
import type { _X_ } from '../../../src/get-critical-points/-x-.js';
import type { Curve } from '../../../src/index.js';
import { bezierPieceToBezier } from 'flo-bezier3';
import { distanceBetween } from 'flo-vector2d';
import { iterBeziersToNextX } from '../../../src/containers/get-beziers-to-next-x.js';


function logNearestX(
        g: SVGGElement,
        pC: number[],
        showDelay = 1000) {

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
        const ps = bezierPieceToBezier({ ps: bezierPiece.curve.ps, ts: bezierPiece.ts });
        _debug_.fs.drawElem.bezier_(g, ps, 'thin10 red nofill', showDelay);
    }
    for (const bezierPiece of getBeziersToNextX(x!, false)) {
        const ps = bezierPieceToBezier({ ps: bezierPiece.curve.ps, ts: bezierPiece.ts });
        _debug_.fs.drawElem.bezier_(g, ps, 'thin10 blue nofill', showDelay);
    }
}


/**
 * Returns the `BezierPiece`s along the original loop from the given `_X_` up to
 * (and including the partial piece ending at) its adjacent `_X_` - the `next`
 * one if `nextElsePrev` is `true`, otherwise the `prev` one.
 *
 * This is the array-collecting wrapper around `iterBeziersToNextX`.
 *
 * @param x_ the starting intersection
 * @param nextElsePrev walk towards `x_.next` when `true`, else towards `x_.prev`
 */
function getBeziersToNextX(
        x_: _X_,
        nextElsePrev: boolean): { curve: Curve, ts: number[] }[] {

    return [...iterBeziersToNextX(x_, nextElsePrev)];
}


export { logNearestX }
