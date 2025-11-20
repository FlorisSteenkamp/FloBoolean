import { Curve } from "../curve/curve.js";
import { Mutable } from "../types/mutable.js";
import { Loop } from "./loop.js";


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


function isPoint(ps: number[][]): boolean {
    if (ps.length === 2) {
        return (
            ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1]    // p[0] === p[1]
        );
    }

    if (ps.length === 3) {
        return (
            ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1] && // p[0] === p[1]
            ps[1][1] === ps[2][1] && ps[1][1] === ps[2][1]    // p[1] === p[2]
        );
    }

    return (
        ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1] && // p[0] === p[1]
        ps[1][1] === ps[2][1] && ps[1][1] === ps[2][1] && // p[1] === p[2]
        ps[2][1] === ps[3][1] && ps[2][1] === ps[3][1]    // p[2] === p[3]
    );
}


export { loopFromBeziers }
