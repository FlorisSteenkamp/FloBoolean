import { mid } from 'flo-poly';
import { fromTo, closestPointOnBezierCertified } from "flo-bezier3";
import { InOut } from "../containers/in-out/in-out.js";
import { containerIsBasic } from "../container.js";


function getBeziersToPrevContainer(
        in_: InOut,
        takenInOuts: Set<InOut>) {

    // const out = in_.prev!;
    const out = in_.nextOrPrev!;

    takenInOuts.add(out);
    const endCurve = out._x_!.curve;
    const endT = out._x_!.x.ri.tS;
    
    const inX = in_._x_!;
    let curCurve = inX.curve;
    let curT = inX.x.ri.tS;
    if (!containerIsBasic(in_.container)) {
        // we must clip the outgoing curve
        curT = mid(closestPointOnBezierCertified(curCurve.ps, in_.p)[0].ri);
    }

    const beziers: number[][][] = [];
    let bez: number[][];
    let ii=0;
    while (true && ii++<100) {
        if (curCurve === endCurve && 
            (curT > endT || (curT === endT && beziers.length !== 0))) {

            bez = fromTo(curCurve.ps, endT, curT).toReversed();
            return { beziers, inOut: out, bez }
        } else {
            const ps = fromTo(curCurve.ps, 0, curT).toReversed();
            beziers.push(ps);
        }

        curT = 1;
        curCurve = curCurve.prev;
    }
}


export { getBeziersToPrevContainer }
