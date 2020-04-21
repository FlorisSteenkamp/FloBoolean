"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const container_1 = require("../container");
function getBeziersToNextContainer(expMax, out) {
    let in_ = out.next;
    let endCurve = in_._x_.curve;
    let endT = in_._x_.x.ri.tS;
    let curCurve = out._x_.curve;
    let curT = out._x_.x.ri.tS;
    if (!container_1.containerIsBasic(expMax, out.container)) {
        // we must clip the outgoing curve
        curT = flo_bezier3_1.closestPointOnBezierPrecise(curCurve.ps, out.p).t;
    }
    let beziers = [];
    let inBez;
    while (true) {
        if (curCurve === endCurve &&
            (curT < endT || (curT === endT && beziers.length))) {
            inBez = flo_bezier3_1.fromTo(curCurve.ps)(curT, endT);
            return { beziers, in_, inBez };
        }
        else {
            let ps = flo_bezier3_1.fromTo(curCurve.ps)(curT, 1);
            beziers.push(ps);
        }
        curT = 0;
        curCurve = curCurve.next;
    }
}
exports.getBeziersToNextContainer = getBeziersToNextContainer;
//# sourceMappingURL=get-beziers-to-next-container.js.map