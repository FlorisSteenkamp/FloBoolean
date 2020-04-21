
import { X, getIntersectionCoeffs, getIntervalBoxQuad } from "flo-bezier3";
import { Container } from "../../../container";
import { _X_ } from "../../../x";
import { Curve } from "../../../curve/curve";
import { allRootsMultiWithErrBounds, refineK1, RootInterval, rootIntervalToExp } from "flo-poly";
import { RootIntervalExp } from "flo-poly";
import { OrderedInOut } from "./ordered-in-out";
import { areBoxesIntersectingQuad } from "../../../sweep-line/are-boxes-intersecting";
import { estimate } from "flo-numerical";


type SideX = { 
    side: number; 
    sideX: X;
}
type WithRI = _X_ & Partial<SideX>;


function midBox(_x_: _X_): number[] {
    return [
        (_x_.x.box[0][0] + _x_.x.box[1][0])/2,
        (_x_.x.box[0][1] + _x_.x.box[1][1])/2
    ];
}


/**
 * * **warning** modifies container.xs[i].in_
 * @param container 
 */
function getXInOuts(container: Container) {
    let [[left,top], [right,bottom]] = container.box;

    let sides = [
        [[right,top   ], [left, top   ]],
        [[left, top   ], [left, bottom]],
        [[left, bottom], [right,bottom]],
        [[right,bottom], [right,top   ]]
    ];

    return (curve: Curve, xs_: _X_[], ioIdx: number) => {
        // At this point all xs belong to the same curve and container.

        // For each of the four sides get the t values closest to the 
        // intersection t.

        let ps = curve.ps;

        let xs: WithRI[] = xs_.slice();
        for (let i=0; i<sides.length; i++) {
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

        let ins: OrderedInOut[] = [];
        let outs: OrderedInOut[] = [];
        let prevX: WithRI;
        /** true if the prevX was a proper X, false if it was a SideX */
        let prevWasX: boolean = undefined;
        for (let x of xs) {
            if (x.side !== undefined) {
                // it is a sideX
                if (prevWasX === true) {
                    //console.log(midBox(x))
                    outs.push({
                        inOut: { 
                            dir: +1, 
                            p: midBox(x),
                            _x_: prevX, 
                            container, 
                            idx: ++ioIdx 
                        },
                        side: x.side, 
                        sideX: x.sideX
                    });
                }
                prevWasX = false;
            } else {
                // it is a proper X
                if (prevWasX === false) {
                    ins.push({ 
                        inOut: {
                            dir: -1, 
                            p: midBox(prevX),
                            _x_: x, 
                            container, 
                            idx: ++ioIdx 
                        },
                        side: prevX.side, 
                        sideX: prevX.sideX
                    });
                    x.in_ = ins[ins.length-1].inOut;
                }
                prevWasX = true;
            }
            prevX = x;
        }

        return { ins, outs, ioIdx };
    }
}


/** 
 * Get zero times compensated roots and exact coefficents 
 */
function getXs0(ps1: number[][], ps2: number[][]) {
    let _coeffs = getIntersectionCoeffs(ps1, ps2);
    if (_coeffs === undefined) { return undefined; }
    let { coeffs, errBound, getPsExact } = _coeffs;
    let ris = allRootsMultiWithErrBounds(coeffs, errBound, getPsExact);
    if (ris.length === 0) { return undefined; }

    return { ris: ris.map(rootIntervalToExp), getPsExact };
}


function rootIntervalToDouble(ri: RootIntervalExp): RootInterval {
    return { 
        tS: estimate(ri.tS),
        tE: estimate(ri.tE), 
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
function getTs(
        ps: number[][], 
        side: number[][]): { psX: X, sideX: X }[] {

    let xs0Side = getXs0(ps, side);
    if (xs0Side === undefined) { return []; }
    let { ris: risSide, getPsExact: getPsExactSide } = xs0Side;

    let xs0Ps = getXs0(side, ps);
    if (xs0Ps === undefined) { return []; }
    let { ris: risPs, getPsExact: getPsExactPs } = xs0Ps;

    
    //---- Make sure no boxesPs overlap. 
    // If any two boxes do operlap we cannot match the t value of a ps box to 
    // that of a side box, else we can definitively match them.
    // Note: multiplicity > 1 intersections will result in an infinite loop. 
    // It is assumed (as a precondition) the code is such that a multiple 
    // intersection is node possible here

    let maxIter: number;

    // currently we only go up to once compensated (quad precision roots)
    maxIter = 1;  
    /** number of compensations for ps */
    let cPs = 0;
    let boxesPs: number[][][][];
    loop: while (true && cPs < maxIter) {
        // update boxes to new tighter versions
        boxesPs = risPs.map(ri => getIntervalBoxQuad(ps, [ri.tS, ri.tE]));
        for (let i=0; i<risPs.length; i++) {
            let boxPsI = boxesPs[i];
            for (let j=i+1; j<risPs.length; j++) {
                let boxPsJ = boxesPs[j];

                if (areBoxesIntersectingQuad(true)(boxPsI, boxPsJ)) {
                    let _risPs: RootIntervalExp[] = [];
                    for (let riPs of risPs) {
                        _risPs.push(...refineK1(riPs.tS[1], getPsExactPs));
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
    let boxesSide: number[][][][];
    loop: while (true && cSide < maxIter) {
        boxesSide = risSide.map(ri => getIntervalBoxQuad(side, [ri.tS, ri.tE]));
        for (let i=0; i<risSide.length; i++) {
            let boxSideI = boxesSide[i];
            for (let j=i+1; j<risSide.length; j++) {
                let boxSideJ = boxesSide[j];
                if (areBoxesIntersectingQuad(true)(boxSideI, boxSideJ)) {
                    let _risSide: RootIntervalExp[] = [];
                    for (let riSide of risSide) {
                        _risSide.push(...refineK1(riSide.tS[1], getPsExactSide));
                    }
                    risSide = _risSide;
                    cSide++;

                    continue loop;
                }
            }
        }
        break loop;
    }


    let xPairs: { psX: X, sideX: X }[] = [];
    for (let i=0; i<risPs.length; i++) {
        let boxPs = boxesPs[i];
        for (let j=0; j<risSide.length; j++) {
            let boxSide = boxesSide[j];
            // TODO - investigate if below commented code would improve algorithm
            //let box = intersectBoxes(boxPs,boxSide);
            //if (box !== undefined) {
            if (areBoxesIntersectingQuad(true)(boxPs, boxSide)) {
                let psX: X = { 
                    compensated: cPs,
                    ri: rootIntervalToDouble(risPs[i]),
                    riExp: cPs ? risPs[i] : undefined,
                    getPsExact: cPs ? undefined : getPsExactPs,
                    kind: 1,
                    box: boxExpToBox(boxPs)
                };
                let sideX: X = {
                    compensated: cSide,
                    ri: rootIntervalToDouble(risSide[j]),
                    riExp: cSide ? risSide[j] : undefined,
                    getPsExact: cSide ? undefined : getPsExactSide,
                    kind: 1,
                    box: boxExpToBox(boxSide)
                }
                xPairs.push({ psX, sideX });
            }
        }
    }

    return xPairs;
}


/**
 * Converts a box with expansion coordinates into one with double coordinates.
 */
function boxExpToBox(boxExp: number[][][]): number[][] {
    return boxExp.map(p => p.map(c => estimate(c)));
}


export { getXInOuts }
