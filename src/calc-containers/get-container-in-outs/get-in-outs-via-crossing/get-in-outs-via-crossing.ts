import { orient2d } from "big-float-ts";
import { getIntervalBox, getHodograph, evalDeCasteljau } from "flo-bezier3";
import { Container } from "../../../container.js";
import { InOut } from "../../../in-out.js";
import { getInOutsViaSides } from "../get-in-outs-via-sides/get-in-outs-via-sides.js";


/**
 * Returns the incoming / outgoing curves (as InOuts) for the given container.
 * @param container 
 * @param ioIdx 
 */
function getInOutsViaCrossing(
        container: Container, 
        ioIdx: number) {

    let xs = container.xs;

    let inOuts: InOut[] = [];

    let x1 = xs[0];
    let x2 = xs[1];

    let ps1 = x1.curve.ps;
    let ps2 = x2.curve.ps;

    let p = evalDeCasteljau(ps1, x1.x.ri.tS);

    let t1S =  x1.x.ri.tS;
    let t1E =  x1.x.ri.tE;
    let t2S =  x2.x.ri.tS;
    let t2E =  x2.x.ri.tE;

    let v1s: number[][];
    let v2s: number[][];

    if (ps1.length === 4 || ps1.length === 3) {
        // cubic => hodograph is a parabola
        // quadratic => hodograph is a line (we still get the box, but in future maybe we can do better)
        let h1 = getHodograph(ps1);  // <= cubic: 50 bit-aligned => exact, quadratic: 52 bit-aligned => exact
        v1s = getIntervalBox(h1,[t1S,t1E]);
    } else /*if (ps1.length === 2)*/ {
        // line => hodograph is a fixed point
        v1s = getHodograph(ps1)  // <= 52 bit-aligned => exact
    }

    if (ps2.length === 4 || ps2.length === 3) {
        // cubic => hodograph is a parabola
        // quadratic => hodograph is a line (we still get the box, but in future maybe we can do better)
        let h2 = getHodograph(ps2);  // <= cubic: 50 bit-aligned => exact, quadratic: 52 bit-aligned => exact
        v2s = getIntervalBox(h2,[t2S,t2E]);
    } else /*if (ps2.length === 2)*/ {
        // line => hodograph is a fixed point
        v2s = getHodograph(ps2)  // <= 52 bit-aligned => exact
    }
    
    // possible configurations: (up to cyclic permutation)
    // config1: i1 o2 o1 i2 ==== i2 i1 o2 o1 ==== etc.
    // config2: i1 i2 o1 o2 ==== o2 i1 i2 o1 ==== etc.
    let cSign: number | undefined = undefined;
    // TODO - investigate faster method by finding and using the 2 extreme points only
    for (let i=0; i<v1s.length; i++) {
        for (let j=0; j<v2s.length; j++) {
            // we use orient2d below since it is completely robust (cross is not)
            //let c = Math.sign(cross(v1s[i],v2s[j]));
            let c = Math.sign(orient2d(v1s[i],v2s[j],[0,0]));
            if (c === 0) {
                // too close to call 
                // use a more accurate but slower method
                return getInOutsViaSides(container, ioIdx);
            }
            if (cSign === undefined) {
                cSign = c; continue;
            }
            if (cSign !== c) {
                // conflicting results
                // use a more accurate but slower method
                return getInOutsViaSides(container, ioIdx);
            }
        }
    }

    let config1 = cSign! > 0;
    if (config1) {
        // config1 (the 1st of the 2 possible configurations)
        inOuts.push({ dir: -1, p, _x_: x1, container });
        inOuts.push({ dir: +1, p, _x_: x2, container });
        inOuts.push({ dir: +1, p, _x_: x1, container });
        inOuts.push({ dir: -1, p, _x_: x2, container });
        x1.in_ = inOuts[0];
        x2.in_ = inOuts[3];
    } else {
        // config2 (the 2nd of the 2 possible configurations)
        inOuts.push({ dir: -1, p, _x_: x1, container });
        inOuts.push({ dir: -1, p, _x_: x2, container });
        inOuts.push({ dir: +1, p, _x_: x1, container });
        inOuts.push({ dir: +1, p, _x_: x2, container });        
        x1.in_ = inOuts[0];
        x2.in_ = inOuts[1];
    }

    return { inOuts, ioIdx };
}


export { getInOutsViaCrossing }
