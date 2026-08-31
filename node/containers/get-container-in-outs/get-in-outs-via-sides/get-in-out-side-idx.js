import { iterBeziersToNextX } from '../../get-beziers-to-next-x.js';
import { toP } from "../../../utils/to-p.js";
const { min, max } = Math;
function getInOutSideIdx(inOut, _x_, sides, forward) {
    let pS = undefined;
    for (const { curve, ts } of iterBeziersToNextX(_x_, forward)) {
        const { ps } = curve;
        if (pS === undefined) {
            pS = toP(ps, ts[0]);
        }
        const pE = toP(ps, ts[1]);
        const [xS, yS] = pS;
        const [xE, yE] = pE;
        // Nearest crossing (smallest parameter along `a` -> `b`) among the sides.
        let sideIdxs = [];
        for (let i = 0; i < sides.length; i++) {
            const side = sides[i];
            const [[X, Y]] = side;
            if (!((i % 2 === 0 && min(yS, yE) <= Y && Y <= max(yS, yE)) || // top & bottom
                (i % 2 === 1 && min(xS, xE) <= X && X <= max(xS, xE)))) { // left & right
                continue;
            }
            sideIdxs.push(i);
        }
        if (sideIdxs.length > 0) {
            inOut.oSideIdxs = sideIdxs;
            return sideIdxs;
        }
        pS = pE;
    }
    return undefined; // shouldn't be possible
}
export { getInOutSideIdx };
//# sourceMappingURL=get-in-out-side-idx.js.map