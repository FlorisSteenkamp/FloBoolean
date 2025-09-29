declare const _debug_: Debug;
import type { Debug } from '../debug/debug.js';

import { mid } from 'flo-poly';
import { closestPointOnBezierCertified, BezierPiece } from "flo-bezier3";
import { InOut } from "../containers/in-out/in-out.js";
import { containerIsBasic } from "../container.js";


function getBeziersToNextContainer(
        out: InOut,
        takenInOuts: Set<InOut>,
        noMicroCorners: boolean): {
            bezierPieces: BezierPiece[];
            inOut: InOut;
        } {

    const in_ = out.nextOrPrev!;

    takenInOuts.add(in_);

    const outX = out._x_!;
    const inX = in_._x_!;

    //----------------------------
    const curveS = outX.curve;
    const tS = outX.x.ri.tS;

    const curveE = inX.curve;
    const tE = inX.x.ri.tS;

    let curCurve = curveS;
    let curT = tS;

    if (!containerIsBasic(out.container)) {
        if (!noMicroCorners) {
            // we must clip the outgoing curve
            curT = mid(closestPointOnBezierCertified(curveS.ps, out.p)[0].ri);
        }
    }

    const bezierPieces: BezierPiece[] = [];
    while (true) {
        if (curCurve === curveE && 
            (curT < tE || (curT === tE && bezierPieces.length !== 0))) {

            const ps = curCurve.ps;
            const ts = [curT, tE];

            bezierPieces.push({ ps, ts });

            return { bezierPieces, inOut: in_ }
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
