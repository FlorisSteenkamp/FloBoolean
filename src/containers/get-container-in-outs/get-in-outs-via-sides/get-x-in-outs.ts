import type { _X_ } from "../../../get-critical-points/-x-.js";
import type { Curve } from "../../../curve/curve.js";
import type { In, InOut, Out } from "../../../containers/in-out/in-out.js";
import type { Container } from "../../container.js";
import type { X } from "../../../get-critical-points/x.js";
import type { Mutable } from "../../../utils/mutable.js";
import { getTs } from './get-ts.js';
import { toP } from "../../../utils/to-p.js";


type SideX = { 
    side: number; 
    sideX: X;
}
type WithRI = _X_ & Partial<SideX>;


/**
 * * **warning** modifies container.xs[i].in_
 * 
 * @param container 
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

        // @ts-ignore
        const xs: (WithRI & { ps: number[][] })[] = xs_.slice();//.map(v => ({ ...v, ps }));
        for (let x of xs) {
            x.ps = ps;
        }


        // console.log(xs.length);

        for (let i=0; i<sides.length; i++) {
            const xs_ = getTs(ps, sides[i]);

            for (const { psX, sideX } of xs_) {
                xs.push({
                    ps,
                    x: psX,
                    side: i, 
                    sideX,
                    curve: undefined!, // unused
                });
            }
        }


        //---- resolve in-outs

        
        // the sort below should always resolve if the container dimension is
        // 'large enough', where large enough is based on the maximum value that
        // the tangent magnitude of a curve can attain (no need to resort to 
        // compensated intervals)
        xs.sort((xA, xB) => xA.x.ri.tS - xB.x.ri.tS);

        const ins: In[] = [];
        const outs: Out[] = [];
        let prevX: (WithRI & { ps: number[][]; }) | undefined = undefined;
        /** true if the prevX was a proper X, false if it was a SideX */
        let prevWasX: boolean | undefined = undefined;
        for (const x of xs) {
            if (x.side !== undefined) {
                // it is a sideX
                if (prevWasX === true) {
                    const p = toP(x.ps, x.x.ri.t);
                    outs.push(makeInOut(
                        +1, p, prevX!, container, x.side, x.sideX!
                    ));
                    (prevX as Mutable<WithRI>).out = outs[outs.length-1];
                }
                prevWasX = false;
            } else {
                // it is a proper X
                if (prevWasX === false) {
                    const p = toP(prevX!.ps, prevX!.x.ri.t);
                    ins.push(makeInOut(
                        -1, p, x, container, prevX!.side!, prevX!.sideX!
                    ));
                    (x as Mutable<WithRI>).in_ = ins[ins.length-1];
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
        p: number[],
        _x_: _X_,
        container: Container,
        side: number,
        sideX: X): D extends -1 ? In : Out {

    const inOut: InOut = {
        idx: undefined!,  // will be set later
        dir,
        p,
        _x_,
        container,
        side,
        sideX,
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
