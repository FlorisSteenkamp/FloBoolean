
import { fromTo, closestPointOnBezierPrecise } from "flo-bezier3";
import { InOut } from "../in-out";
import { containerIsBasic } from "../container";


function getBeziersToNextContainer(expMax: number, out: InOut) {
    let in_ = out.next;
    let endCurve = in_._x_.curve;
    let endT = in_._x_.x.ri.tS;
    
    let curCurve = out._x_.curve;
    let curT = out._x_.x.ri.tS;
    if (!containerIsBasic(expMax, out.container)) {
        // we must clip the outgoing curve
        curT = closestPointOnBezierPrecise(curCurve.ps, out.p).t;
    }

    let beziers: number[][][] = [];
    let inBez: number[][];
    while (true) {
        if (curCurve === endCurve && 
            (curT < endT || (curT === endT && beziers.length))) {

            inBez = fromTo(curCurve.ps)(curT, endT);
            return { beziers, in_, inBez }
        } else {
            let ps = fromTo(curCurve.ps)(curT, 1);
            beziers.push(ps);
        }

        curT = 0;
        curCurve = curCurve.next;
    }
}


export { getBeziersToNextContainer }
