import { mid } from 'flo-poly';
import { closestPointOnBezierCertified } from "flo-bezier3";
import { containerIsBasic } from "../container.js";
function getBeziersToNextContainer(inOut, inOut_NextOrPrev) {
    const outX = inOut._x_;
    const inX = inOut_NextOrPrev._x_;
    //----------------------------
    const curveS = outX.curve;
    const tS = outX.x.ri.tS;
    const curveE = inX.curve;
    const tE = inX.x.ri.tS;
    let curCurve = curveS;
    let curT = tS;
    if (!containerIsBasic(inOut.container)) {
        // we must clip the outgoing curve
        curT = mid(closestPointOnBezierCertified(curveS.ps, inOut.p)[0].ri);
    }
    const bezierPieces = [];
    while (true) {
        if (curCurve === curveE &&
            (curT < tE || (curT === tE && bezierPieces.length !== 0))) {
            const ps = curCurve.ps;
            const ts = [curT, tE];
            bezierPieces.push({ ps, ts });
            return bezierPieces;
        }
        else {
            const ps = curCurve.ps;
            const ts = [curT, 1];
            bezierPieces.push({ ps, ts });
        }
        curT = 0;
        curCurve = curCurve.next;
    }
}
export { getBeziersToNextContainer };
//# sourceMappingURL=get-beziers-to-next-container.js.map