import type { RootInterval, RootIntervalExp } from "flo-poly";
import type { _X_ } from "../../../get-critical-points/-x-.js";
import type { X } from "../../../get-critical-points/x.js";
import { eEstimate } from "big-float-ts";
import { roots, refineK1, rootIntervalToExp } from "flo-poly";
import { memoize } from 'flo-memoize';
import { evalDeCasteljauDd, getCoeffsBezBez, getIntervalBoxDd } from "flo-bezier3";
import { areBoxesIntersectingDd } from "../../../sweep-line/are-boxes-intersecting.js";
import { toP } from "../../../utils/to-p.js";


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
        tsPs: number[],
        tsSide: number[]) {

    const xsSide = getRootsAndCoeffs(ps, side, tsSide);
    if (xsSide === undefined) { return undefined; }

    let { ris, getPExact } = xsSide;
    const getPExactSide_ = memoize(getPExact);

    // There can only be one due to geometry
    const riSide = ris[0];
    const p = toP(ps, riSide.tS);
    // const p = evalDeCasteljauDd(ps, riSide.tS).map(c => c[0] + c[1]);

    return {
        compensated: 0,
        ri: riSide,
        riExp: undefined,
        getPExact,
        kind: 1,
        p
    };
}


/** 
 * Get zero times compensated roots and exact coefficents 
 */
function getRootsAndCoeffs(
        ps1: number[][], 
        ps2: number[][],
        ts: number[]): { 
            ris: RootInterval[]; 
            getPExact: () => number[][]; } | undefined {
            
    const r = getCoeffsBezBez(ps1, ps2);
    if (r === undefined) { return undefined; }
    const { coeffs: pDd, errBound: pDd_, getPExact } = r;
    
    const ris = roots(pDd, ts[0], ts[1], pDd_, getPExact);

    if (ris === undefined || ris.length === 0) { return undefined; }

    return { ris, getPExact };
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
