import type { BezierPiece } from "flo-bezier3";
import type { In } from "../containers/in-out/in-out.js";


function getBeziersToPrevContainer(
        in_: In): BezierPiece[] {

    const inX = in_._x_!;
    const outX = in_.twin._x_;

    //----------------------------
    const curveS = inX.x.curve;
    const tS = inX.x.ri.t;

    const curveE = outX.x.curve;
    const tE = outX.x.ri.t;

    let curCurve = curveS;
    let curT = tS;

    const bezierPieces: BezierPiece[] = [];
    while (true) {
        if (curCurve === curveE && 
            (curT > tE || (curT === tE && bezierPieces.length !== 0))) {

            const ps = curCurve.ps;
            const ts = [curT, tE];

            bezierPieces.push({ ps, ts });

            return bezierPieces;
        } else {
            const ps = curCurve.ps;
            const ts = [curT, 0];
            bezierPieces.push({ ps, ts });
        }

        curT = 1;
        curCurve = curCurve.prev;
    }
}


export { getBeziersToPrevContainer }
