import type { RootInterval } from "flo-poly";
import type { _X_ } from "../../../get-critical-points/-x-.js";
import type { X } from "../../../get-critical-points/x.js";
import { eps, roots } from "flo-poly";
import { memoize } from 'flo-memoize';
import { getCoeffsBezBez, getIntervalBox } from "flo-bezier3";
import { toP } from "../../../utils/to-p.js";

const { min, max, abs } = Math;


/**
 * Robustly get matching intersections of `ps` (a bezier) that matches those of 
 * `side`.
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
    const dx = B[0] - A[0];  // exact
    const dy = B[1] - A[1];  // exact
    const [[minX, minY], [maxX, maxY]] = box;

    // Project the box onto the side parameter along the non-degenerate axis
    // (x for horizontal sides, y for vertical). The sign of the delta `d`
    // already determines which box extent maps to the smaller `t`, so `min`/
    // `max` order them; widen slightly by `eps` for tolerance.
    const horizontal = dy === 0;
    const a  = horizontal ? A[0] : A[1];
    const d  = horizontal ? dx   : dy;
    const lo = horizontal ? minX : minY;
    const hi = horizontal ? maxX : maxY;

    const t1 = (lo - a) / d;
    const t2 = (hi - a) / d;
    let tS = min(t1, t2) * (1 - eps);
    let tE = max(t1, t2) * (1 + eps);

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
            getPExact: () => number[][];
        } | undefined {
            
    const r = getCoeffsBezBez(ps1, ps2);
    if (r === undefined) { return undefined; }
    const { coeffs: pDd, errBound: pDd_, getPExact } = r;
    
    const ris = roots(pDd, ts[0], ts[1], pDd_, getPExact);

    if (ris === undefined || ris.length === 0) { return undefined; }

    return { ris, getPExact };
}


export { getTs }
