import { mid } from 'flo-poly';
import { fromTo, closestPointOnBezierCertified } from "flo-bezier3";
import { containerIsBasic } from "../container";
function getBeziersToNextContainer(out) {
    const in_ = out.next;
    const endCurve = in_._x_.curve;
    const endT = in_._x_.x.ri.tS;
    let curCurve = out._x_.curve;
    let curT = out._x_.x.ri.tS;
    if (!containerIsBasic(out.container)) {
        // we must clip the outgoing curve
        curT = mid(closestPointOnBezierCertified(curCurve.ps, out.p)[0].ri);
    }
    const beziers = [];
    let inBez;
    while (true) {
        if (curCurve === endCurve &&
            (curT < endT || (curT === endT && beziers.length !== 0))) {
            inBez = fromTo(curCurve.ps, curT, endT);
            curT; //?
            endT; //?
            inBez; //?
            return { beziers, in_, inBez };
        }
        else {
            const ps = fromTo(curCurve.ps, curT, 1);
            beziers.push(ps);
        }
        curT = 0;
        curCurve = curCurve.next;
    }
}
export { getBeziersToNextContainer };
//# sourceMappingURL=get-beziers-to-next-container.js.map