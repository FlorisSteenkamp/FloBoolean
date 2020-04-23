
import { Curve } from '../curve/curve';
    

/**
 * Represents a two-way linked loop of [[ICurve]]s - mostly used internally to 
 * conveniently represent shape boundaries.
 */
interface Loop {
    /** The curves that represent the shape boundary as an array. */
    curves: Curve[];
    /** A pre-ordered array of bezier curves to add initially.*/
    beziers: number[][][];
    /** A reference to the loop */
    idx?: number;
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


/**
 * @param beziers A pre-ordered array of bezier curves to add initially.
 */
function loopFromBeziers(beziers: number[][][] = [], idx?: number) {
    let curves: Curve[] = [];

    let loop: Loop = { beziers, curves, idx };

    if (!beziers.length) { return loop; }

    let prev: Curve;
    
    let j = 0;
    for (let i=0; i<beziers.length; i++) {

        if (isPoint(beziers[i])) { continue; }

        let curve: Curve = {
            loop,
            ps: beziers[i],
            prev,
            next: undefined,
            idx: j
        };

        if (prev) { prev.next = curve; }
        prev = curve; 

        curves.push(curve);
        j++;
    }

    // close loop
    let lastCurve = curves[curves.length-1];
    curves[0].prev = lastCurve;
    lastCurve.next = curves[0];

    // TODO - remove this eventually
    lastCurve.ps[lastCurve.ps.length-1] = curves[0].ps[0];

    return loop;
}


export { Loop, loopFromBeziers }
