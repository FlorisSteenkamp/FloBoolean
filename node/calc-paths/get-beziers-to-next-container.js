import { mid } from 'flo-poly';
import { closestPointOnBezierCertified } from "flo-bezier3";
import { containerIsBasic } from "../containers/container.js";
function getBeziersToNextContainer(out, nextIn) {
    const outX = out._x_;
    const inX = nextIn._x_;
    //----------------------------
    const curveS = outX.curve;
    const tS = outX.x.ri.tS;
    const curveE = inX.curve;
    const tE = inX.x.ri.tS;
    let curCurve = curveS;
    let curT = tS;
    if (!containerIsBasic(out.container)) {
        // we must clip the outgoing curve
        curT = mid(closestPointOnBezierCertified(curveS.ps, out.p)[0].ri);
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