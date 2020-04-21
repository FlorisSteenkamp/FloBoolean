"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const get_in_outs_via_sides_1 = require("../get-in-outs-via-sides/get-in-outs-via-sides");
const flo_numerical_1 = require("flo-numerical");
/**
 * Returns the incoming / outgoing curves (as InOuts) for the given container.
 * @param container
 * @param ioIdx
 */
function getInOutsViaCrossing(container, ioIdx) {
    let xs = container.xs;
    let inOuts = [];
    let x1 = xs[0];
    let x2 = xs[1];
    let ps1 = x1.curve.ps;
    let ps2 = x2.curve.ps;
    let p = flo_bezier3_1.evalDeCasteljau(ps1, x1.x.ri.tS);
    let t1S = x1.x.ri.tS;
    let t1E = x1.x.ri.tE;
    let t2S = x2.x.ri.tS;
    let t2E = x2.x.ri.tE;
    let v1s;
    let v2s;
    if (ps1.length === 4 || ps1.length === 3) {
        // cubic => hodograph is a parabola
        // quadratic => hodograph is a line (we still get the box, but in future maybe we can do better)
        let h1 = flo_bezier3_1.getHodograph(ps1); // <= cubic: 50 bit-aligned => exact, quadratic: 52 bit-aligned => exact
        v1s = flo_bezier3_1.getIntervalBox(h1, [t1S, t1E]);
    }
    else if (ps1.length === 2) {
        // line => hodograph is a fixed point
        v1s = flo_bezier3_1.getHodograph(ps1); // <= 52 bit-aligned => exact
    }
    if (ps2.length === 4 || ps2.length === 3) {
        // cubic => hodograph is a parabola
        // quadratic => hodograph is a line (we still get the box, but in future maybe we can do better)
        let h2 = flo_bezier3_1.getHodograph(ps2); // <= cubic: 50 bit-aligned => exact, quadratic: 52 bit-aligned => exact
        v2s = flo_bezier3_1.getIntervalBox(h2, [t2S, t2E]);
    }
    else if (ps2.length === 2) {
        // line => hodograph is a fixed point
        v2s = flo_bezier3_1.getHodograph(ps2); // <= 52 bit-aligned => exact
    }
    // possible configurations: (up to cyclic permutation)
    // config1: i1 o2 o1 i2 ==== i2 i1 o2 o1 ==== etc.
    // config2: i1 i2 o1 o2 ==== o2 i1 i2 o1 ==== etc.
    let cSign;
    // TODO - investigate faster method by finding and using the 2 extreme points only
    for (let i = 0; i < v1s.length; i++) {
        for (let j = 0; j < v2s.length; j++) {
            // we use orient2d below since it is completely robust (cross is not)
            //let c = Math.sign(cross(v1s[i],v2s[j]));
            let c = Math.sign(flo_numerical_1.orient2d(v1s[i], v2s[j], [0, 0]));
            if (c === 0) {
                // too close to call 
                // use a more accurate but slower method
                return get_in_outs_via_sides_1.getInOutsViaSides(container, ioIdx);
            }
            if (cSign === undefined) {
                cSign = c;
                continue;
            }
            if (cSign !== c) {
                // conflicting results
                // use a more accurate but slower method
                return get_in_outs_via_sides_1.getInOutsViaSides(container, ioIdx);
            }
        }
    }
    let config1 = cSign > 0;
    if (config1) {
        // config1 (the 1st of the 2 possible configurations)
        inOuts.push({ dir: -1, p, _x_: x1, container });
        inOuts.push({ dir: +1, p, _x_: x2, container });
        inOuts.push({ dir: +1, p, _x_: x1, container });
        inOuts.push({ dir: -1, p, _x_: x2, container });
        x1.in_ = inOuts[0];
        x2.in_ = inOuts[3];
    }
    else {
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
exports.getInOutsViaCrossing = getInOutsViaCrossing;
//# sourceMappingURL=get-in-outs-via-crossing.js.map