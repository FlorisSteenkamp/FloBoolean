import type { BezierPiece } from "flo-bezier3";
import type { Out } from "../containers/in-out/in-out.js";


function getBeziersToNextContainer(
        out: Out): BezierPiece[] {

    const outX = out._x_!;
    const inX = out.next._x_;

    //----------------------------
    const curveS = outX.x.curve;
    const tS = outX.x.ri.t;

    const curveE = inX.x.curve;
    const tE = inX.x.ri.t;

    let curCurve = curveS;
    let curT = tS;

    const bezierPieces: BezierPiece[] = [];
    while (true) {
        if (curCurve === curveE && 
            (curT < tE || (curT === tE && bezierPieces.length !== 0))) {

            const ps = curCurve.ps;
            const ts = [curT, tE];

            bezierPieces.push({ ps, ts });

            return bezierPieces;
        } else {
            const ps = curCurve.ps;
            const ts = [curT, 1];
            bezierPieces.push({ ps, ts });
        }

        curT = 0;
        curCurve = curCurve.next;
    }
}


export { getBeziersToNextContainer }
