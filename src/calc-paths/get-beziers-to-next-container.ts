import type { BezierPiece } from "flo-bezier3";
import type { In, Out } from "../containers/in-out/in-out.js";


function getBeziersToNextContainer(
        out: Out,
        nextIn: In): BezierPiece[] {

    const outX = out._x_!;
    const inX = nextIn._x_!;

    //----------------------------
    const curveS = outX.curve;
    const tS = outX.x.ri.t;

    const curveE = inX.curve;
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
