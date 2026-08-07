import type { _X_ } from "../../../get-critical-points/-x-.js";
import type { Curve } from "../../../curve/curve.js";
import type { In, InOut, Out } from "../../../containers/in-out/in-out.js";
import type { Container } from "../../container.js";
import type { Mutable } from "../../../utils/mutable.js";
import { getTs } from './get-ts.js';
import { compareXs } from '../../compare-xs.js';


interface SideX extends _X_ { 
    isSide: boolean; 
    ps: number[][];
}


/**
 * @param container 
 * @param curve
 * @param xs_ all `_X_`s of the given curve and given container
 */
function getXInOuts(
        container: Container) {

    const [[minX,minY], [maxX,maxY]] = container.box;

    const sides = [
        [[maxX, minY], [minX, minY]],
        [[minX, minY], [minX, maxY]],
        [[minX, maxY], [maxX, maxY]],
        [[maxX, maxY], [maxX, minY]]
    ];

    return function (
            curve: Curve,
            xs_: _X_[]): { ins: In[], outs: Out[] } {

        // At this point all `xs` belong to the same curve and container.

        // For each of the four sides get the t values closest to the 
        // intersection t.

        const { ps } = curve;

        const xs: SideX[] = xs_.slice() as SideX[];
        for (let x of xs) {
            x.ps = ps;
        }


        for (let i=0; i<sides.length; i++) {
            const xs_ = getTs(ps, sides[i], [0,1], [0,1]);

            for (const { psX } of xs_) {
                xs.push({
                    ps,
                    x: psX,
                    isSide: true, 
                    curve: undefined!, // unused
                    next: undefined!,
                    prev: undefined!,
                    container,
                    order: Number.MAX_SAFE_INTEGER  // sort after real `_X_`s at an equal `tS`
                });
            }
        }


        //---- resolve in-outs

        
        // the sort below should always resolve if the container dimension is
        // 'large enough', where large enough is based on the maximum value that
        // the tangent magnitude of a curve can attain (no need to resort to 
        // compensated intervals)
        xs.sort((xA, xB) => {
            const res = xA.x.ri.tS - xB.x.ri.tS;
            if (res !== 0) { return res; }

            // Tie-break by the same `order` used in `compareXs` so this sort and
            // the loop-ordering sort in `setIntersectionNextAndPrevs` agree on
            // the relative order of coincident points.
            return xA.order - xB.order;
        });

        const ins: In[] = [];
        const outs: Out[] = [];
        let prevX: SideX | undefined = undefined;
        /** true if the prevX was a proper X, false if it was a SideX */
        let prevWasX: boolean | undefined = undefined;
        for (const x of xs) {
            if (x.isSide) {
                // it is a sideX
                if (prevWasX === true) {
                    outs.push(makeInOut(+1, prevX!, container));
                    (prevX as Mutable<SideX>).out = outs[outs.length-1];
                }
                prevWasX = false;
            } else {
                // it is a proper X
                if (prevWasX === false) {
                    ins.push(makeInOut(-1, x, container));
                    (x as Mutable<SideX>).in_ = ins[ins.length-1];
                }
                prevWasX = true;
            }
            prevX = x;
        }

        return { ins, outs };
    }
}


/**
 * Creates an `InOut` from the given differing fields, filling in the constant
 * `container` reference and the default empty/zero fields.
 */
function makeInOut<D extends 1 | -1>(
        dir: D,
        _x_: _X_,
        container: Container): D extends -1 ? In : Out {

    const inOut: InOut = {
        idx: undefined!,  // will be set later
        dir,
        _x_,
        container,
        children: new Set(),
        windingNum: 0,
        orientation: 0,
        nextOrPrev: undefined!,    // will be set later
        bezierPieces: undefined!,  // ...
        nextAround: undefined!,    // ...
        parent: undefined!,        // ...
        prevAround: undefined!     // ...
    };

    return inOut as unknown as D extends -1 ? In : Out
}


export { getXInOuts }
