import { toP } from "../../../utils/to-p.js";
import type { InOut } from "../../in-out/in-out.js";
import { followToBoxEdge } from "./follow-to-box-edge.js";


function compareInOut2(
        inOutA: InOut,
        inOutB: InOut): number|undefined {

    const { side: sideA, sideX: xA, dir: dirA, idx: idxA } = inOutA;
    const { side: sideB, sideX: xB, dir: dirB, idx: idxB } = inOutB;

    const { _x_: _x_A, nextOrPrev: nextOrPrevA } = inOutA;
    const { _x_: _x_B, nextOrPrev: nextOrPrevB } = inOutB;

    const walkA = followToBoxEdge(inOutA);
    const walkB = followToBoxEdge(inOutB);

    // const pA = toP(walkA.curve.ps, walkA.t);
    // const pB = toP(walkB.curve.ps, walkB.t);
    const pA = walkA.p;
    const pB = walkB.p;

    const res = pA[1] - pB[1];
    // const res = pB[1] - pA[1];
    if (res !== 0) {
        return res;
    }

    // throw 'AAA';  // TODO
    return undefined;
}


export { compareInOut2 }
