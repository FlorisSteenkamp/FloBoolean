import { getTs } from './get-ts.js';
import { evalDeCasteljauDd } from "flo-bezier3";
function midBox(box) {
    return [
        (box[0][0] + box[1][0]) / 2,
        (box[0][1] + box[1][1]) / 2
    ];
}
function midBoxX(_x_) {
    return midBox(_x_.x.box);
}
/**
 * * **warning** modifies container.xs[i].in_
 *
 * @param container
 */
function getXInOuts(container) {
    const [[left, top], [right, bottom]] = container.box;
    const sides = [
        [[right, top], [left, top]],
        [[left, top], [left, bottom]],
        [[left, bottom], [right, bottom]],
        [[right, bottom], [right, top]]
    ];
    return function (curve, xs_) {
        // At this point all `xs` belong to the same curve and container.
        // For each of the four sides get the t values closest to the 
        // intersection t.
        const { ps } = curve;
        // @ts-ignore
        const xs = xs_.slice(); //.map(v => ({ ...v, ps }));
        for (let x of xs) {
            x.ps = ps;
        }
        // console.log(xs.length);
        for (let i = 0; i < sides.length; i++) {
            const xs_ = getTs(ps, sides[i]);
            for (const { psX, sideX } of xs_) {
                xs.push({
                    ps,
                    x: psX,
                    side: i,
                    sideX,
                    curve: undefined, // unused
                });
            }
        }
        //---- resolve in-outs
        // the sort below should always resolve if the container dimension is
        // 'large enough', where large enough is based on the maximum value that
        // the tangent magnitude of a curve can attain (no need to resort to 
        // compensated intervals)
        xs.sort((xA, xB) => xA.x.ri.tS - xB.x.ri.tS);
        const ins = [];
        const outs = [];
        let prevX = undefined;
        /** true if the prevX was a proper X, false if it was a SideX */
        let prevWasX = undefined;
        for (const x of xs) {
            if (x.side !== undefined) {
                // it is a sideX
                if (prevWasX === true) {
                    const p = evalDeCasteljauDd(x.ps, [0, x.x.ri.t]).map(c => c[1]);
                    outs.push(makeInOut(
                    // +1, midBoxX(x), prevX!, container, x.side, x.sideX!
                    +1, p, prevX, container, x.side, x.sideX));
                    prevX.out = outs[outs.length - 1];
                }
                prevWasX = false;
            }
            else {
                // it is a proper X
                if (prevWasX === false) {
                    const p = evalDeCasteljauDd(x.ps, [0, x.x.ri.t]).map(c => c[1]);
                    ins.push(makeInOut(
                    // -1, midBoxX(prevX!), x, container, prevX!.side!, prevX!.sideX!
                    -1, p, x, container, prevX.side, prevX.sideX));
                    x.in_ = ins[ins.length - 1];
                }
                prevWasX = true;
            }
            prevX = x;
        }
        return { ins, outs };
    };
}
/**
 * Creates an `InOut` from the given differing fields, filling in the constant
 * `container` reference and the default empty/zero fields.
 */
function makeInOut(dir, p, _x_, container, side, sideX) {
    return {
        idx: undefined,
        dir,
        p,
        _x_,
        container,
        side,
        sideX,
        loopsIdxs: new Set(),
        children: new Set(),
        windingNum: 0,
        orientation: 0
    };
}
export { getXInOuts };
//# sourceMappingURL=get-x-in-outs.js.map