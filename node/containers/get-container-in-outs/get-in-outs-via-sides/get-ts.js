import { ddDiffDouble, ddAddDouble, ddDivDouble, ddMin, ddMax } from 'double-double';
import { eps, roots, uu } from "flo-poly";
import { memoize } from 'flo-memoize';
import { getCoeffsBezBez, getIntervalBox, getIntervalBoxDd } from "flo-bezier3";
const qdd = ddDiffDouble;
const qad = ddAddDouble;
const { min, max } = Math;
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
function getTs(curve, side, tsPs, sideIdx) {
    const { ps } = curve;
    //--------------------------------------------------------------------------
    const r = getCoeffsBezBez(side, ps);
    if (r === undefined) {
        return undefined;
    }
    const { coeffs: pDd, errBound: pDd_, getPExact: getPExactPs } = r;
    const getPExactPs$ = memoize(getPExactPs);
    const risPs = roots(pDd, tsPs[0], tsPs[1], pDd_, getPExactPs$);
    if (risPs === undefined || risPs.length === 0) {
        return undefined;
    }
    //--------------------------------------------------------------------------
    const riPs = risPs[0]; // since ps is monotonic there can only be 1
    const riSide = getSideRi(ps, side, riPs);
    return {
        xPs: {
            compensated: undefined,
            ri: riPs,
            getPExact: getPExactPs$,
            kind: 1,
            p: undefined, // unused
            curve
        },
        riSide,
        sideIdx,
        ps
    };
}
function getSideRi(ps, side, riPs) {
    const box = getIntervalBox(ps, [riPs.tS, riPs.tE]);
    // The `box` is guaranteed to enclose a piece of `side`. Since `side` is a
    // line, `P(t) = A + t*(B - A)` is monotonic in both x and y, so the box's
    // min/max extents map straight onto the `t` range along the side. Which box
    // corner corresponds to the smaller/larger `t` depends on the side's
    // direction, so we take the min/max of the two endpoint parameters. We
    // parameterize by the dominant axis to avoid dividing by a near-zero delta.
    const A = side[0];
    const B = side[side.length - 1];
    const dx = B[0] - A[0]; // exact
    const dy = B[1] - A[1]; // exact
    const [[minX, minY], [maxX, maxY]] = box;
    // Project the box onto the side parameter along the non-degenerate axis
    // (x for horizontal sides, y for vertical). The sign of the delta `d`
    // already determines which box extent maps to the smaller `t`, so `min`/
    // `max` order them; widen slightly by `eps` for tolerance.
    const horizontal = dy === 0;
    const a = horizontal ? A[0] : A[1];
    const d = horizontal ? dx : dy;
    const lo = horizontal ? minX : minY;
    const hi = horizontal ? maxX : maxY;
    const t1 = (lo - a) / d;
    const t2 = (hi - a) / d;
    let tS = min(t1, t2) * (1 - eps);
    let tE = max(t1, t2) * (1 + eps);
    return {
        multiplicity: 1,
        t: (tS + tE) / 2,
        tS,
        tE
    };
}
function getSideRiExp(ps, side, riPs) {
    const box = getIntervalBoxDd(ps, [riPs.tS, riPs.tE]);
    // The `box` is guaranteed to enclose a piece of `side`. Since `side` is a
    // line, `P(t) = A + t*(B - A)` is monotonic in both x and y, so the box's
    // min/max extents map straight onto the `t` range along the side. Which box
    // corner corresponds to the smaller/larger `t` depends on the side's
    // direction, so we take the min/max of the two endpoint parameters. We
    // parameterize by the dominant axis to avoid dividing by a near-zero delta.
    const A = side[0];
    const B = side[side.length - 1];
    const dx = B[0] - A[0]; // exact
    const dy = B[1] - A[1]; // exact
    const [[minX, minY], [maxX, maxY]] = box;
    // Project the box onto the side parameter along the non-degenerate axis
    // (x for horizontal sides, y for vertical). The sign of the delta `d`
    // already determines which box extent maps to the smaller `t`, so `min`/
    // `max` order them; widen slightly by `eps` for tolerance.
    const horizontal = dy === 0;
    const a = horizontal ? A[0] : A[1];
    const d = horizontal ? dx : dy;
    const lo = horizontal ? minX : minY;
    const hi = horizontal ? maxX : maxY;
    const t1 = ddDivDouble(qdd(lo, a), d); // error ~ 6*u**2
    const t2 = ddDivDouble(qdd(hi, a), d); // ...
    let tS = qdd(ddMin(t1, t2), 6 * uu);
    let tE = qad(ddMax(t1, t2), 6 * uu);
    return {
        tS,
        tE,
        multiplicity: 1
    };
}
export { getTs, getSideRiExp };
//# sourceMappingURL=get-ts.js.map