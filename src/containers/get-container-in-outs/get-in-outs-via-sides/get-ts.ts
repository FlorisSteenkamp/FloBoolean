import type { RootInterval, RootIntervalExp } from "flo-poly";
import type { _X_ } from "../../../get-critical-points/-x-.js";
import type { X } from "../../../get-critical-points/x.js";
import { eEstimate } from "big-float-ts";
import { roots, refineK1, rootIntervalToExp } from "flo-poly";
import { memoize } from 'flo-memoize';
import { evalDeCasteljauDd, getCoeffsBezBez, getIntervalBox, getIntervalBoxDd } from "flo-bezier3";
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
        // tsPs: number[]): { psX: X, sideX: X }[] {
        tsPs: number[]): X | undefined {

    const xsPs = getRootsAndCoeffs(side, ps, tsPs);
    if (xsPs === undefined) { return undefined; }
    let { ris: risPs, getPExact: getPExactPs } = xsPs;
    const getPExactPs_ = memoize(getPExactPs);

    const riPs = risPs[0];
    const box = getIntervalBox(ps, [riPs.tS, riPs.tE]);

    // The `box` is guaranteed to enclose a piece of `side`. Since `side` is a
    // line, `P(t) = A + t*(B - A)` is monotonic in both x and y, so the box's
    // min/max extents map straight onto the `t` range along the side. Which box
    // corner corresponds to the smaller/larger `t` depends on the side's
    // direction, so we take the min/max of the two endpoint parameters. We
    // parameterize by the dominant axis to avoid dividing by a near-zero delta.
    const A = side[0];
    const B = side[side.length - 1];
    const dx = B[0] - A[0];
    const dy = B[1] - A[1];
    const [[minX, minY], [maxX, maxY]] = box;

    let tS: number;
    let tE: number;
    if (Math.abs(dx) >= Math.abs(dy)) {
        const t1 = (minX - A[0]) / dx;
        const t2 = (maxX - A[0]) / dx;
        tS = Math.min(t1, t2);
        tE = Math.max(t1, t2);
    } else {
        const t1 = (minY - A[1]) / dy;
        const t2 = (maxY - A[1]) / dy;
        tS = Math.min(t1, t2);
        tE = Math.max(t1, t2);
    }

    // Clamp to the side's parameter domain - the enclosed intersection is
    // guaranteed to lie within, even if the box extends slightly past an end.
    if (tS < 0) { tS = 0; }
    if (tE > 1) { tE = 1; }

    const riSide: RootInterval = {
        multiplicity: 1,
        t: (tS + tE)/2,
        tS,
        tE
    }

    const p = toP(ps, riSide.t);

    return {
        compensated: 0,
        ri: riSide,
        getPExact: getPExactPs,
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


export { getTs }
