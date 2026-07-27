import { mid } from 'flo-poly';
import { closestPointOnBezierCertified } from "flo-bezier3";
import { containerIsBasic } from "../containers/container.js";
function getBeziersToPrevContainer(inOut, inOut_NextOrPrev) {
    const outX = inOut_NextOrPrev._x_;
    const inX = inOut._x_;
    //----------------------------
    const curveS = inX.curve;
    const tS = inX.x.ri.tS;
    const curveE = outX.curve;
    const tE = outX.x.ri.tS;
    let curCurve = curveS;
    let curT = tS;
    if (!containerIsBasic(inOut.container)) {
        // we must clip the outgoing curve
        curT = mid(closestPointOnBezierCertified(curCurve.ps, inOut.p)[0].ri);
    }
    const bezierPieces = [];
    while (true) {
        const ps = curCurve.ps;
        if (curCurve === curveE &&
            (curT > tE || (curT === tE && bezierPieces.length !== 0))) {
            const ts = [curT, tE];
            bezierPieces.push({ ps, ts });
            return bezierPieces;
        }
        else {
            const ts = [curT, 0];
            bezierPieces.push({ ps, ts });
        }
        curT = 1;
        curCurve = curCurve.prev;
    }
}
export { getBeziersToPrevContainer };
//# sourceMappingURL=get-beziers-to-prev-container.js.map