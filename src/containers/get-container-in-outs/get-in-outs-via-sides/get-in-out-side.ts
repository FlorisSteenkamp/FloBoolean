declare const _debug_: Debug; 
import type { Debug } from '../../../debug/debug.js';
import type { In, Out } from "../../in-out/in-out.js";
import type { _X_ } from "../../../get-critical-points/-x-.js";
import { iterBeziersToNextX } from '../../get-beziers-to-next-x.js';
import { toP } from "../../../utils/to-p.js";

const { min, max } = Math;


function getInOutSide(
        inOut: In|Out,
        _x_: _X_,
        sides: number[][][],
        forward: boolean): number[] {

    let pS: number[] | undefined = undefined;

    for (const { curve, ts } of iterBeziersToNextX(_x_, forward)) {
        const { ps } = curve;

        if (pS === undefined) { pS = toP(ps, ts[0]); }
        const pE = toP(ps, ts[1]);

        const [xS, yS] = pS;
        const [xE, yE] = pE;

        // Nearest crossing (smallest parameter along `a` -> `b`) among the sides.
        let bestSideIdxs: number[] = [];
        for (let i=0; i<sides.length; i++) {
            const side = sides[i];
            const [[X, Y]] = side;
            if (!((i%2 === 0 && min(yS,yE) <= Y && Y <= max(yS,yE)) ||   // top & bottom
                  (i%2 === 1 && min(xS,xE) <= X && X <= max(xS,xE)))) {  // left & right

                continue;
            }

            bestSideIdxs.push(i);
        }

        if (bestSideIdxs.length > 0) {
            inOut.oSideIdxs = bestSideIdxs;
            return bestSideIdxs;
        }

        pS = pE;
    }

    return undefined!;  // shouldn't be possible
}


export { getInOutSide }
