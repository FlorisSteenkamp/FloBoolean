import type { Curve } from "../curve/curve.js";
import type { Mutable } from "../utils/mutable.js";
import type { Loop } from "./loop.js";


/**
 * @param beziers a pre-ordered array of bezier curves to add initially.
 * @param idx an optional index to assign to the loop - it can be anything
 */
function loopFromBeziers(
        beziers: number[][][] = [], 
        idx: number): Loop {

    const curves: Curve[] = [];

    const loop: Loop = { beziers, curves, idx };

    if (beziers.length === 0) { return loop; }

    let prev: Curve | undefined = undefined;

    let j = 0;
    for (let i=0; i<beziers.length; i++) {

        if (isPoint(beziers[i])) { continue; }

        const curve: Curve = {
            loop,
            ps: beziers[i],
            prev: prev!,
            next: undefined!,
            idx: j
        };

        if (prev) { (prev as Mutable<Curve>).next = curve; }
        prev = curve; 

        curves.push(curve);
        j++;
    }

    // close loop
    const lastCurve = curves[curves.length-1];
    (curves[0] as Mutable<Curve>).prev = lastCurve;
    (lastCurve as Mutable<Curve>).next = curves[0];

    lastCurve.ps[lastCurve.ps.length-1] = curves[0].ps[0];

    return loop;
}


function isPoint(
        ps: number[][]): boolean {

    if (ps.length <= 1) { return true; }

    const p0 = ps[0];
    const p1 = ps[1];

    const p01Same = p0[0] === p1[0] && p0[1] === p1[1];

    if (ps.length === 2) { return p01Same; }

    const p2 = ps[2];
    const p12Same = p1[0] === p2[0] && p1[1] === p2[1];

    if (ps.length === 3) { return p01Same && p12Same; }

    const p3 = ps[3];
    const p23Same = p2[0] === p3[0] && p2[1] === p3[1];

    return p01Same && p12Same && p23Same;
}


export { loopFromBeziers }
