import { eEstimate } from "big-float-ts";
import { allRootsCertified, refineK1, rootIntervalToExp } from "flo-poly";
import { getCoeffsBezBez, getIntervalBoxDd } from "flo-bezier3";
import { areBoxesIntersectingDd } from "../../../sweep-line/are-boxes-intersecting.js";
function midBox(_x_) {
    return [
        (_x_.x.box[0][0] + _x_.x.box[1][0]) / 2,
        (_x_.x.box[0][1] + _x_.x.box[1][1]) / 2
    ];
}
/**
 * * **warning** modifies container.xs[i].in_
 * @param container
 */
function getXInOuts(container) {
    let [[left, top], [right, bottom]] = container.box;
    let sides = [
        [[right, top], [left, top]],
        [[left, top], [left, bottom]],
        [[left, bottom], [right, bottom]],
        [[right, bottom], [right, top]]
    ];
    return (curve, xs_, ioIdx) => {
        // At this point all xs belong to the same curve and container.
        // For each of the four sides get the t values closest to the 
        // intersection t.
        let ps = curve.ps;
        let xs = xs_.slice();
        for (let i = 0; i < sides.length; i++) {
            let xs_ = getTs(ps, sides[i]);
            for (let { psX, sideX } of xs_) {
                xs.push({
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
        let ins = [];
        let outs = [];
        let prevX = undefined;
        /** true if the prevX was a proper X, false if it was a SideX */
        let prevWasX = undefined;
        for (let x of xs) {
            if (x.side !== undefined) {
                // it is a sideX
                if (prevWasX === true) {
                    outs.push({
                        dir: +1,
                        p: midBox(x),
                        _x_: prevX,
                        container,
                        idx: ++ioIdx,
                        side: x.side,
                        sideX: x.sideX
                    });
                }
                prevWasX = false;
            }
            else {
                // it is a proper X
                if (prevWasX === false) {
                    ins.push({
                        dir: -1,
                        p: midBox(prevX),
                        _x_: x,
                        container,
                        idx: ++ioIdx,
                        side: prevX.side,
                        sideX: prevX.sideX
                    });
                    x.in_ = ins[ins.length - 1];
                }
                prevWasX = true;
            }
            prevX = x;
        }
        return { ins, outs, ioIdx };
    };
}
/**
 * Get zero times compensated roots and exact coefficents
 */
function getXs0(ps1, ps2) {
    // let _coeffs = getIntersectionCoeffs(ps1, ps2);
    let _coeffs = getCoeffsBezBez(ps1, ps2);
    if (_coeffs === undefined) {
        return undefined;
    }
    let { coeffs, errBound, getPExact } = _coeffs;
    let ris = allRootsCertified(coeffs, 0, 1, errBound, getPExact);
    if (ris.length === 0) {
        return undefined;
    }
    return { ris: ris.map(rootIntervalToExp), getPExact };
}
function rootIntervalToDouble(ri) {
    return {
        tS: eEstimate(ri.tS),
        tE: eEstimate(ri.tE),
        multiplicity: ri.multiplicity
    };
}
/**
 * Robustly get matching intersections of ps (a bezier) that matches those of
 * side. ps and side can actually be any order 1, 2 or 3 bezier curve.
 * * **precondition** RootInterval[] contains no multiple roots
 * @param ps
 * @param side
 * @param risSide_
 */
function getTs(ps, side) {
    let xs0Side = getXs0(ps, side);
    if (xs0Side === undefined) {
        return [];
    }
    let { ris: risSide, getPExact: getPExactSide } = xs0Side;
    //let exactSide = getPExactSide();
    let exactSide = undefined; // lazy loaded
    let getPExactSide_ = () => {
        exactSide = exactSide || getPExactSide();
        return exactSide;
    };
    let xs0Ps = getXs0(side, ps);
    if (xs0Ps === undefined) {
        return [];
    }
    let { ris: risPs, getPExact: getPExactPs } = xs0Ps;
    //let exactPs = getPExactPs();
    let exactPs = undefined; // lazy loaded
    let getPExactPs_ = () => {
        exactPs = exactPs || getPExactPs();
        return exactPs;
    };
    //---- Make sure no boxesPs overlap. 
    // If any two boxes do operlap we cannot match the t value of a ps box to 
    // that of a side box, else we can definitively match them.
    // Note: multiplicity > 1 intersections will result in an infinite loop. 
    // It is assumed (as a precondition) the code is such that a multiple 
    // intersection is node possible here
    let maxIter;
    // currently we only go up to once compensated (double-double precision roots)
    maxIter = 1;
    /** number of compensations for ps */
    let cPs = 0;
    let boxesPs = undefined;
    loop: while (true && cPs < maxIter) {
        // update boxes to new tighter versions
        boxesPs = risPs.map(ri => getIntervalBoxDd(ps, [ri.tS, ri.tE]));
        for (let i = 0; i < risPs.length; i++) {
            let boxPsI = boxesPs[i];
            for (let j = i + 1; j < risPs.length; j++) {
                let boxPsJ = boxesPs[j];
                if (areBoxesIntersectingDd(true)(boxPsI, boxPsJ)) {
                    let _risPs = [];
                    for (let riPs of risPs) {
                        // TODO - below we're converting riPs (using getXs0) to RootIntervalExp and below back to 
                        // RootInterval again - not necessary - fix
                        _risPs.push(...refineK1({ tS: riPs.tS[1], tE: riPs.tE[1], multiplicity: riPs.multiplicity }, getPExactPs_()));
                    }
                    risPs = _risPs;
                    cPs++;
                    continue loop;
                }
            }
        }
        break loop;
    }
    //---- Make sure no boxesSides overlap - this should be rare as we are 
    // already roughly once compensated on that (due to small length of the sides).
    // currently we only go up to once compensated (quad precision roots)
    maxIter = 1;
    /** number of compensations for sides */
    let cSide = 0;
    let boxesSide = undefined;
    loop: while (true && cSide < maxIter) {
        boxesSide = risSide.map(ri => getIntervalBoxDd(side, [ri.tS, ri.tE]));
        for (let i = 0; i < risSide.length; i++) {
            let boxSideI = boxesSide[i];
            for (let j = i + 1; j < risSide.length; j++) {
                let boxSideJ = boxesSide[j];
                if (areBoxesIntersectingDd(true)(boxSideI, boxSideJ)) {
                    let _risSide = [];
                    for (let riSide of risSide) {
                        _risSide.push(...refineK1({ tS: riSide.tS[1], tE: riSide.tE[1], multiplicity: riSide.multiplicity }, getPExactSide_()));
                    }
                    risSide = _risSide;
                    cSide++;
                    continue loop;
                }
            }
        }
        break loop;
    }
    let xPairs = [];
    for (let i = 0; i < risPs.length; i++) {
        let boxPs = boxesPs[i];
        for (let j = 0; j < risSide.length; j++) {
            let boxSide = boxesSide[j];
            // TODO - investigate if below commented code would improve algorithm
            //let box = intersectBoxes(boxPs,boxSide);
            //if (box !== undefined) {
            if (areBoxesIntersectingDd(true)(boxPs, boxSide)) {
                let psX = {
                    compensated: cPs,
                    ri: rootIntervalToDouble(risPs[i]),
                    riExp: cPs ? risPs[i] : undefined,
                    getPExact: cPs ? undefined : getPExactPs,
                    kind: 1,
                    box: boxExpToBox(boxPs)
                };
                let sideX = {
                    compensated: cSide,
                    ri: rootIntervalToDouble(risSide[j]),
                    riExp: cSide ? risSide[j] : undefined,
                    getPExact: cSide ? undefined : getPExactSide,
                    kind: 1,
                    box: boxExpToBox(boxSide)
                };
                xPairs.push({ psX, sideX });
            }
        }
    }
    return xPairs;
}
/**
 * Converts a box with expansion coordinates into one with double coordinates.
 */
function boxExpToBox(boxExp) {
    return boxExp.map(p => p.map(eEstimate));
}
export { getXInOuts };
//# sourceMappingURL=get-x-in-outs.js.map