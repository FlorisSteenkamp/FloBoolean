import { eEstimate } from "big-float-ts";
import { allRootsCertified, RootIntervalExp, refineK1, RootInterval, rootIntervalToExp } from "flo-poly";
import { getCoeffsBezBez, getIntervalBoxDd } from "flo-bezier3";
import { Container } from "../../../container";
import { X } from "../../../x";
import { __X__ } from "../../../-x-";
import { Curve } from "../../../curve/curve";
import { areBoxesIntersectingDd } from "../../../sweep-line/are-boxes-intersecting";
import { InOut } from "../../../in-out";



type SideX = { 
    side: number; 
    sideX: X;
}
type WithRI = __X__ & Partial<SideX>;


function midBox(_x_: __X__): number[] {
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
    const [[left,top], [right,bottom]] = container.box;

    const sides = [
        [[right,top   ], [left, top   ]],
        [[left, top   ], [left, bottom]],
        [[left, bottom], [right,bottom]],
        [[right,bottom], [right,top   ]]
    ];

    return (curve: Curve, xs_: __X__[], ioIdx: number) => {
        // At this point all xs belong to the same curve and container.

        // For each of the four sides get the t values closest to the 
        // intersection t.

        const ps = curve.ps;

        const xs: WithRI[] = xs_.slice();
        for (let i=0; i<sides.length; i++) {
            const xs_ = getTs(ps, sides[i]);

            for (const { psX, sideX } of xs_) {
                xs.push({ 
                    x: psX,
                    side: i, 
                    sideX,
                    curve: undefined!, // unused
                });
            }
        }


        //---- resolve in-outs

        
        // the sort below should always resolve if the container dimension is
        // 'large enough', where large enough is based on the maximum value that
        // the tangent magnitude of a curve can attain (no need to resort to 
        // compensated intervals)
        xs.sort((xA, xB) => xA.x.ri.tS - xB.x.ri.tS);

        const ins: InOut[] = [];
        const outs: InOut[] = [];
        let prevX: WithRI | undefined = undefined;
        /** true if the prevX was a proper X, false if it was a SideX */
        let prevWasX: boolean | undefined = undefined;
        for (const x of xs) {
            if (x.side !== undefined) {
                // it is a sideX
                if (prevWasX === true) {
                    outs.push({
                        dir: +1, 
                        p: midBox(x),
                        _x_: prevX!,
                        container,
                        idx: ++ioIdx,
                        side: x.side,
                        sideX: x.sideX!
                    });
                }
                prevWasX = false;
            } else {
                // it is a proper X
                if (prevWasX === false) {
                    ins.push({ 
                        dir: -1, 
                        p: midBox(prevX!),
                        _x_: x,
                        container,
                        idx: ++ioIdx,
                        side: prevX!.side!, 
                        sideX: prevX!.sideX!
                    });
                    x.in_ = ins[ins.length-1];
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
function getXs0(
        ps1: number[][], 
        ps2: number[][]): { 
            ris: RootIntervalExp[]; 
            getPExact: () => number[][]; } | undefined {
            
    // const _coeffs = getIntersectionCoeffs(ps1, ps2);
    const _coeffs = getCoeffsBezBez(ps1, ps2);
    if (_coeffs === undefined) { return undefined; }
    const { coeffs, errBound, getPExact } = _coeffs;
    const ris = allRootsCertified(coeffs, 0, 1, errBound, getPExact);
    if (ris.length === 0) { return undefined; }

    return { ris: ris.map(rootIntervalToExp), getPExact };
}


function rootIntervalToDouble(ri: RootIntervalExp): RootInterval {
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
function getTs(
        ps: number[][], 
        side: number[][]): { psX: X, sideX: X }[] {

    const xs0Side = getXs0(ps, side);
    if (xs0Side === undefined) { return []; }
    const { getPExact: getPExactSide } = xs0Side;
    let { ris: risSide } = xs0Side;
    //const exactSide = getPExactSide();
    let exactSide: number[][] | undefined = undefined;  // lazy loaded
    const getPExactSide_ = () => {
        exactSide = exactSide || getPExactSide();
        return exactSide;
    }

    const xs0Ps = getXs0(side, ps);
    if (xs0Ps === undefined) { return []; }
    let { ris: risPs } = xs0Ps;
    const { getPExact: getPExactPs } = xs0Ps;
    //const exactPs = getPExactPs();
    let exactPs: number[][] | undefined = undefined;  // lazy loaded
    const getPExactPs_ = () => {
        exactPs = exactPs || getPExactPs();
        return exactPs;
    }

    
    //---- Make sure no boxesPs overlap. 
    // If any two boxes do operlap we cannot match the t value of a ps box to 
    // that of a side box, else we can definitively match them.
    // Note: multiplicity > 1 intersections will result in an infinite loop. 
    // It is assumed (as a precondition) the code is such that a multiple 
    // intersection is node possible here

    let maxIter: number;

    // currently we only go up to once compensated (double-double precision roots)
    maxIter = 1;  
    /** number of compensations for ps */
    let cPs = 0;
    let boxesPs: number[][][][] | undefined = undefined;
    loop: while (true && cPs < maxIter) {
        // update boxes to new tighter versions
        boxesPs = risPs.map(ri => getIntervalBoxDd(ps, [ri.tS, ri.tE]));
        for (let i=0; i<risPs.length; i++) {
            const boxPsI = boxesPs[i];
            for (let j=i+1; j<risPs.length; j++) {
                const boxPsJ = boxesPs[j];

                if (areBoxesIntersectingDd(true)(boxPsI, boxPsJ)) {
                    const _risPs: RootIntervalExp[] = [];
                    for (const riPs of risPs) {
                        // TODO - below we're converting riPs (using getXs0) to RootIntervalExp and below back to 
                        // RootInterval again - not necessary - fix
                        _risPs.push(
                            ...refineK1(
                                { tS: riPs.tS[1], tE: riPs.tE[1], multiplicity: riPs.multiplicity }, 
                                getPExactPs_()
                            )
                        );
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
    let boxesSide: number[][][][] | undefined = undefined;
    loop: while (true && cSide < maxIter) {
        boxesSide = risSide.map(ri => getIntervalBoxDd(side, [ri.tS, ri.tE]));
        for (let i=0; i<risSide.length; i++) {
            const boxSideI = boxesSide[i];
            for (let j=i+1; j<risSide.length; j++) {
                const boxSideJ = boxesSide[j];
                if (areBoxesIntersectingDd(true)(boxSideI, boxSideJ)) {
                    const _risSide: RootIntervalExp[] = [];
                    for (const riSide of risSide) {
                        _risSide.push(
                            ...refineK1(
                                { tS: riSide.tS[1], tE: riSide.tE[1], multiplicity: riSide.multiplicity }, 
                                getPExactSide_()
                            )
                        );
                    }
                    risSide = _risSide;
                    cSide++;

                    continue loop;
                }
            }
        }
        break loop;
    }


    const xPairs: { psX: X, sideX: X }[] = [];
    for (let i=0; i<risPs.length; i++) {
        const boxPs = boxesPs![i];
        for (let j=0; j<risSide.length; j++) {
            const boxSide = boxesSide![j];
            // TODO - investigate if below commented code would improve algorithm
            //const box = intersectBoxes(boxPs,boxSide);
            //if (box !== undefined) {
            if (areBoxesIntersectingDd(true)(boxPs, boxSide)) {
                const psX: X = { 
                    compensated: cPs,
                    ri: rootIntervalToDouble(risPs[i]),
                    riExp: cPs ? risPs[i] : undefined,
                    getPExact: cPs ? undefined : getPExactPs,
                    kind: 1,
                    box: boxExpToBox(boxPs)
                };
                const sideX: X = {
                    compensated: cSide,
                    ri: rootIntervalToDouble(risSide[j]),
                    riExp: cSide ? risSide[j] : undefined,
                    getPExact: cSide ? undefined : getPExactSide,
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
    return boxExp.map(p => p.map(eEstimate));
}


export { getXInOuts }
