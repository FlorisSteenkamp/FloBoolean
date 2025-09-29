import { mid } from 'flo-poly';
import { closestPointOnBezierCertified, BezierPiece } from "flo-bezier3";
import { InOut } from "../containers/in-out/in-out.js";
import { containerIsBasic } from "../container.js";


function getBeziersToPrevContainer(
        in_: InOut,
        takenInOuts: Set<InOut>): {
            bezierPieces: BezierPiece[];
            inOut: InOut;
        } {

    const out = in_.nextOrPrev!;

    takenInOuts.add(out);

    const outX = out._x_!;
    const inX = in_._x_!;
    
    //----------------------------
    const curveS = inX.curve;
    const tS = inX.x.ri.tS;

    const curveE = outX.curve;
    const tE = outX.x.ri.tS;

    let curCurve = curveS;
    let curT = tS;

    if (!containerIsBasic(in_.container)) {
        // we must clip the outgoing curve
        curT = mid(closestPointOnBezierCertified(curCurve.ps, in_.p)[0].ri);
    }

    const bezierPieces: BezierPiece[] = [];
    while (true) {
        const ps = curCurve.ps;

        if (curCurve === curveE && 
            (curT > tE || (curT === tE && bezierPieces.length !== 0))) {

            const ts = [curT, tE];

            bezierPieces.push({ ps, ts });

            return { bezierPieces, inOut: out }
        } else {
            const ts = [curT, 0];

            bezierPieces.push({ ps, ts });
        }

        curT = 1;
        curCurve = curCurve.prev;
    }
}


export { getBeziersToPrevContainer }
