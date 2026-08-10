import type { RootInterval, RootIntervalExp } from "flo-poly";
import type { _X_ } from "../../../get-critical-points/-x-.js";
import type { X } from "../../../get-critical-points/x.js";
import { eEstimate } from "big-float-ts";
import { roots, refineK1, rootIntervalToExp } from "flo-poly";
import { memoize } from 'flo-memoize';
import { evalDeCasteljauDd, getCoeffsBezBez, getIntervalBoxDd } from "flo-bezier3";
import { areBoxesIntersectingDd } from "../../../sweep-line/are-boxes-intersecting.js";


/**
 * Robustly get matching intersections of `ps` (a bezier) that matches those of 
 * `side`. `ps` and `side` can actually be any order 1, 2 or 3 bezier curve.
 * 
 * * **precondition** `RootInterval[]` contains no multiple roots
 * 
 * @param ps 
 * @param side 
 * @param risSide_ 
 */
function getTs(
        ps: number[][], 
        side: number[][],
        tsPs: number[]): { psX: X, sideX: X }[] {

    const xsSide = getRootsAndCoeffs(ps, side, [0,1]);
    if (xsSide === undefined) { return []; }
    let { ris: risSide, getPExact: getPExactSide } = xsSide;
    const getPExactSide_ = memoize(getPExactSide);

    const xsPs = getRootsAndCoeffs(side, ps, tsPs);
    if (xsPs === undefined) { return []; }
    let { ris: risPs, getPExact: getPExactPs } = xsPs;
    const getPExactPs_ = memoize(getPExactPs);

    
    //---- Make sure no boxesPs overlap. 
    // If any two boxes do operlap we cannot match the `t` value of a `ps` box
    // to that of a side box, else we can definitively match them.
    //
    // Note: multiplicity > 1 intersections will result in an infinite loop. 
    // It is assumed (as a precondition) the code is such that a multiple 
    // intersection is not possible here
    const resPs = deoverlapBoxes(ps, risPs, getPExactPs_);
    risPs = resPs.ris;
    const boxesPs = resPs.boxes;
    const cPs = resPs.compensated;

    //---- Make sure no boxesSides overlap - this should be rare as we are 
    // already roughly once compensated on that (due to small length of the sides).
    const resSide = deoverlapBoxes(side, risSide, getPExactSide_);
    risSide = resSide.ris;
    const boxesSide = resSide.boxes;
    const cSide = resSide.compensated;


    const xPairs: { psX: X, sideX: X }[] = [];
    for (let i=0; i<risPs.length; i++) {
        const boxPs = boxesPs[i];
        for (let j=0; j<risSide.length; j++) {
            const boxSide = boxesSide[j];
            if (areBoxesIntersectingDd(true)(boxPs, boxSide)) {
                const psX   = makeX(ps, cPs, risPs[i], getPExactPs);
                const sideX = makeX(side, cSide, risSide[j], getPExactSide);
                xPairs.push({ psX, sideX });
            }
        }
    }

    return xPairs;
}


/** 
 * Get zero times compensated roots and exact coefficents 
 */
function getRootsAndCoeffs(
        ps1: number[][], 
        ps2: number[][],
        ts: number[]): { 
            ris: RootIntervalExp[]; 
            getPExact: () => number[][]; } | undefined {
            
    const r = getCoeffsBezBez(ps1, ps2);
    if (r === undefined) { return undefined; }
    const { coeffs: pDd, errBound: pDd_, getPExact } = r;
    
    const ris = roots(pDd, ts[0], ts[1], pDd_, getPExact);

    if (ris === undefined || ris.length === 0) { return undefined; }

    return { ris: ris.map(rootIntervalToExp), getPExact };
}


/**
 * Refines the given root intervals of `curve` (at most once) so that none of
 * their bounding boxes overlap.
 *
 * Note: multiplicity > 1 intersections will result in an infinite loop. It is
 * assumed (as a precondition) the code is such that a multiple intersection is
 * not possible here.
 */
function deoverlapBoxes(
        ps: number[][],
        ris: RootIntervalExp[],
        getPExact: () => number[][]): { ris: RootIntervalExp[]; boxes: number[][][][]; compensated: number } {

    const boxes = ris.map(ri => getIntervalBoxDd(ps, [ri.tS, ri.tE]));

    let overlap = false;
    for (let i=0; i<ris.length && !overlap; i++) {
        for (let j=i+1; j<ris.length; j++) {
            if (areBoxesIntersectingDd(true)(boxes[i], boxes[j])) {
                overlap = true;
                break;
            }
        }
    }
    if (!overlap) {
        return { ris, boxes, compensated: 0 };
    }

    ris = ris.flatMap(ri => refineK1(
        { t: ri.tS[1], tS: ri.tS[1], tE: ri.tE[1], multiplicity: ri.multiplicity },
        getPExact()
    ));

    return { ris, boxes, compensated: 1 };
}


/**
 * Creates an `X` from the given root interval and bounding box, tracking whether
 * it was compensated (in which case the exact-poly getter is dropped).
 */
function makeX(
        ps: number[][],
        compensated: number,
        ri: RootIntervalExp,
        getPExact: () => number[][]): X {

    const p = evalDeCasteljauDd(ps, ri.tS).map(c => c[0] + c[1]);

    return {
        compensated,
        ri: rootIntervalToDouble(ri),
        riExp: compensated ? ri : undefined,
        getPExact: compensated ? undefined : getPExact,
        kind: 1,
        p
    };
}


function rootIntervalToDouble(
        ri: RootIntervalExp): RootInterval {

    const tS = eEstimate(ri.tS);
    const tE = eEstimate(ri.tE);

    return { 
        t: tS,
        tS, tE, 
        multiplicity: ri.multiplicity
    };
}


export { getTs }
