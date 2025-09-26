import { mid } from 'flo-poly';
import { fromTo, closestPointOnBezierCertified } from "flo-bezier3";
import { InOut } from "../containers/in-out/in-out.js";
import { containerIsBasic } from "../container.js";
import { DualSet, dualSetAdd } from '../dual-set.js';


function getBeziersToNextContainer(
        out: InOut,
        takenInOuts: DualSet<InOut, number>,
        noMicroCorners: boolean) {

    const in_ = out.next!;

    dualSetAdd(takenInOuts, in_, 1);
    const endCurve = in_._x_!.curve;
    const endT = in_._x_!.x.ri.tS;
    
    let curCurve = out._x_!.curve;
    let curT = out._x_!.x.ri.tS;
    if (!containerIsBasic(out.container) && !noMicroCorners) {
        // we must clip the outgoing curve
        curT = mid(closestPointOnBezierCertified(curCurve.ps, out.p)[0].ri);
    }

    const beziers: number[][][] = [];
    let bez: number[][];
    while (true) {
        if (curCurve === endCurve && 
            (curT < endT || (curT === endT && beziers.length !== 0))) {

            bez = fromTo(curCurve.ps, curT, endT);
            return { beziers, inOut: in_, bez }
        } else {
            const ps = fromTo(curCurve.ps, curT, 1);
            beziers.push(ps);
        }

        curT = 0;
        curCurve = curCurve.next;
    }
}


export { getBeziersToNextContainer }
