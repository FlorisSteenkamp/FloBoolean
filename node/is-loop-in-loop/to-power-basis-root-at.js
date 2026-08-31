import { deflate } from 'flo-poly';
/**
 * Returns the power basis representation of the y coordinate of a line,
 * quadratic or cubic bezier curve.
 *
 * * the first control point is assumed to be at `y === 0`.
 *
 * * cubics return a quadratic polynomial, quadratics a linear, and lines just
 *   a constant
 * * intermediate calculations are done in double precision
 * * returns the resulting power basis coordinate polynomial from
 *   highest power to lowest
 *
 * @param cs an order 1,2 or 3 bezier curve given by an ordered array of its
 * control points
 */
function toPowerBasisY0At0(ps) {
    const y1 = ps[1][1];
    if (ps.length === 2) {
        return [y1];
    }
    const y2 = ps[2][1];
    if (ps.length === 3) {
        // y0 assumed zero
        return [
            y2 - 2 * y1,
            2 * y1
        ];
    }
    // ps.length === 4
    // y0 assumed zero
    const y3 = ps[3][1];
    return [
        y3 + 3 * (y1 - y2),
        3 * (y2 - 2 * y1),
        3 * y1,
    ];
}
/**
 * Returns the power basis representation of the y coordinate of a line,
 * quadratic or cubic bezier curve.
 *
 * * the first and 2nd control point is assumed to be at `y === 0`.
 *
 * * cubics return a linear polynomial, quadratics just a constant and lines
 *   the zero polynomial
 * * intermediate calculations are done in double precision
 * * returns the resulting power basis coordinate polynomial from
 *   highest power to lowest
 *
 * @param cs an order 1,2 or 3 bezier curve given by an ordered array of its
 * control points
 */
function toPowerBasisY00At0(ps) {
    if (ps.length === 2) {
        return [];
    }
    const y2 = ps[2][1];
    if (ps.length === 3) {
        // y0, y1 assumed zero
        return [y2];
    }
    // ps.length === 4
    // y0, y1 assumed zero
    const y3 = ps[3][1];
    return [
        y3 - 3 * y2,
        3 * y2
    ];
}
/**
 * Returns the power basis representation of the y coordinate of a line,
 * quadratic or cubic bezier curve.
 *
 * * the first, 2nd and 3rd control point is assumed to be at `y === 0`.
 *
 * * cubics return a just a constant and quadratics and lines the zero
 *   polynomial
 * * intermediate calculations are done in double precision
 * * returns the resulting power basis coordinate polynomial from
 *   highest power to lowest
 *
 * @param cs an order 1,2 or 3 bezier curve given by an ordered array of its
 * control points
 */
function toPowerBasisY000At0(ps) {
    if (ps.length <= 3) {
        // y0, y1, y2 assumed zero
        return [];
    }
    // ps.length === 4
    // y0, y1, y2 assumed zero
    const y3 = ps[3][1];
    return [y3];
}
function toPowerBasisY0At1(ps) {
    const y0 = ps[0][1];
    if (ps.length === 2) {
        // y1 assumed zero
        return [-y0];
    }
    const y1 = ps[1][1];
    if (ps.length === 3) {
        // y2 assumed zero
        return [
            -2 * y1 + y0,
            -y0
        ];
    }
    // ps.length === 4
    const y2 = ps[2][1];
    // y3 assumed zero
    return [
        3 * (y1 - y2) - y0,
        -3 * y1 + 2 * y0,
        -y0
    ];
}
function toPowerBasisY00At1(ps) {
    if (ps.length === 2) {
        // y1, y0 assumed zero
        return [];
    }
    const y0 = ps[0][1];
    if (ps.length === 3) {
        // y2, y1 assumed zero
        return [y0];
    }
    // ps.length === 4
    const y1 = ps[1][1];
    // y3, y2 assumed zero
    return [
        3 * y1 - y0,
        y0
    ];
}
function toPowerBasisY000At1(ps) {
    if (ps.length <= 3) {
        return [];
    }
    // ps.length === 4
    const y0 = ps[0][1];
    // y3, y2, y1 assumed zero
    return [-y0];
}
function toPowerBasisY0At0and1(ps) {
    if (ps.length === 2) {
        return []; // same case as `toPowerBasisY00At0`, ps.length === 2
    }
    const y1 = ps[1][1];
    if (ps.length === 3) {
        // y0 assumed zero
        // y2 assumed zero
        return [-2 * y1];
    }
    // ps.length === 4
    // y0 assumed zero
    // y3 assumed zero
    const y2 = ps[2][1];
    return [
        3 * (y1 - y2),
        -3 * y1
    ];
}
/**
 * Returns the power basis (highest power to lowest) of the y coordinate of a
 * line, quadratic or cubic bezier curve with a *double* root at `t === 0` and a
 * single root at `t === 1` already deflated out.
 *
 * * only a cubic can carry these 3 roots and still be non-trivial (it reduces
 *   to a constant); lower orders give the zero polynomial.
 */
function toPowerBasisY00At0and0At1(ps) {
    if (ps.length <= 3) {
        // 3 forced roots on an order <= 2 curve => the zero polynomial
        return [];
    }
    // ps.length === 4
    // y0, y1 assumed zero (double root at 0)
    // y3 assumed zero (root at 1)
    const y2 = ps[2][1];
    return [-3 * y2];
}
/**
 * Returns the power basis (highest power to lowest) of the y coordinate of a
 * line, quadratic or cubic bezier curve with a single root at `t === 0` and a
 * *double* root at `t === 1` already deflated out.
 *
 * * only a cubic can carry these 3 roots and still be non-trivial (it reduces
 *   to a constant); lower orders give the zero polynomial.
 */
function toPowerBasisY0At0and00At1(ps) {
    if (ps.length <= 3) {
        // 3 forced roots on an order <= 2 curve => the zero polynomial
        return [];
    }
    // ps.length === 4
    // y0 assumed zero (root at 0)
    // y2, y3 assumed zero (double root at 1)
    const y1 = ps[1][1];
    return [3 * y1];
}
/**
 * Returns the power basis (highest power to lowest) of the y coordinate of a
 * line, quadratic or cubic bezier curve with a *double* root at `t === 0` and a
 * *double* root at `t === 1` already deflated out.
 *
 * * 4 forced roots exceed the order of any line/quadratic/cubic, so the result
 *   is always the zero polynomial. Included only for completeness.
 */
function toPowerBasisY00At0and00At1(_ps) {
    return [];
}
function toPowerBasis3(ps) {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    return [
        (y3 - y0) + 3 * (y1 - y2),
        3 * ((y2 + y0) - 2 * y1),
        3 * (y1 - y0),
        y0
    ];
}
/** @internal */
function toPowerBasis2(ps) {
    const [[x0, y0], [x1, y1], [x2, y2]] = ps;
    return [
        (y2 + y0) - 2 * y1,
        2 * (y1 - y0),
        y0
    ];
}
/** @internal */
function toPowerBasis1(ps) {
    const [[x0, y0], [x1, y1]] = ps;
    return [
        y1 - y0,
        y0
    ];
}
/**
 * Returns the full power basis (highest power to lowest) of the y coordinate of
 * an order 1, 2 or 3 bezier curve.
 */
function toPowerBasisY(ps) {
    return ps.length === 4 ? toPowerBasis3(ps) :
        ps.length === 3 ? toPowerBasis2(ps) :
            toPowerBasis1(ps);
}
/**
 * Returns the power basis (highest power to lowest) of the y coordinate of an
 * order 1, 2 or 3 bezier curve, with `numRoots0` known roots at `t === 0` and
 * `numRoots1` known roots at `t === 1` deflated out.
 *
 * This subsumes every hand-specialised variant, e.g:
 * * `toPowerBasisY0At0`     -> `toPowerBasisRootsAt(ps, 1, 0)`
 * * `toPowerBasisY000At0`   -> `toPowerBasisRootsAt(ps, 3, 0)`
 * * `toPowerBasisY00At1`    -> `toPowerBasisRootsAt(ps, 0, 2)`
 * * `toPowerBasisY0At0and1` -> `toPowerBasisRootsAt(ps, 1, 1)`
 *
 * and the previously missing cases:
 * * double root at 0 + single at 1 -> `toPowerBasisRootsAt(ps, 2, 1)`
 * * single root at 0 + double at 1 -> `toPowerBasisRootsAt(ps, 1, 2)`
 * * double root at 0 + double at 1 -> `toPowerBasisRootsAt(ps, 2, 2)`
 */
function toPowerBasisRootsAt(ps, numRoots0, numRoots1) {
    let cs = toPowerBasisY(ps);
    // divide by t^numRoots0       -> drop the lowest coefficient each time
    for (let i = 0; i < numRoots0; i++) {
        cs = deflate(cs, 0);
    }
    // divide by (t - 1)^numRoots1 -> synthetic division by root 1 each time
    for (let i = 0; i < numRoots1; i++) {
        cs = deflate(cs, 1);
    }
    return cs;
}
/**
 * Exact-arithmetic alternative to `toPowerBasisRootsAt` with the same signature.
 *
 * Instead of forming the full power basis and deflating it (which enlarges the
 * intermediate coefficients), this dispatches straight to the hand-specialised
 * closed forms, keeping bit-length growth - and thus floating point headroom -
 * to a minimum.
 *
 * For pre-conditioned order 1-3 beziers (2 to 4 control points, no degenerate
 * quadratics/cubics) the only reachable `(numRoots0, numRoots1)` combinations
 * are those handled below; combinations that would require the curve to be
 * collinear with the ray (e.g. `(2,2)`, `(3,1)`, `(1,3)`) do not occur.
 */
function toPowerBasisRootsAtExact(ps, numRoots0, numRoots1) {
    if (numRoots1 === 0) {
        return numRoots0 === 0 ? toPowerBasisY(ps) :
            numRoots0 === 1 ? toPowerBasisY0At0(ps) :
                numRoots0 === 2 ? toPowerBasisY00At0(ps) :
                    toPowerBasisY000At0(ps); // (3,0)
    }
    if (numRoots0 === 0) {
        return numRoots1 === 1 ? toPowerBasisY0At1(ps) :
            numRoots1 === 2 ? toPowerBasisY00At1(ps) :
                toPowerBasisY000At1(ps); // (0,3)
    }
    // a root at each end
    return numRoots0 === 1 && numRoots1 === 1 ? toPowerBasisY0At0and1(ps) :
        numRoots0 === 2 && numRoots1 === 1 ? toPowerBasisY00At0and0At1(ps) :
            numRoots0 === 1 && numRoots1 === 2 ? toPowerBasisY0At0and00At1(ps) :
                toPowerBasisY00At0and00At1(ps); // (2,2) -> []
}
export { toPowerBasisY0At0, toPowerBasisY00At0, toPowerBasisY000At0, toPowerBasisY0At1, toPowerBasisY00At1, toPowerBasisY000At1, toPowerBasisY0At0and1, toPowerBasisY00At0and0At1, toPowerBasisY0At0and00At1, toPowerBasisY00At0and00At1 };
export { toPowerBasisY, toPowerBasisRootsAt, toPowerBasisRootsAtExact };
//# sourceMappingURL=to-power-basis-root-at.js.map