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
declare function toPowerBasisY0At0(ps: number[][]): number[];
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
declare function toPowerBasisY00At0(ps: number[][]): number[];
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
declare function toPowerBasisY000At0(ps: number[][]): number[];
declare function toPowerBasisY0At1(ps: number[][]): number[];
declare function toPowerBasisY00At1(ps: number[][]): number[];
declare function toPowerBasisY000At1(ps: number[][]): number[];
declare function toPowerBasisY0At0and1(ps: number[][]): number[];
/**
 * Returns the power basis (highest power to lowest) of the y coordinate of a
 * line, quadratic or cubic bezier curve with a *double* root at `t === 0` and a
 * single root at `t === 1` already deflated out.
 *
 * * only a cubic can carry these 3 roots and still be non-trivial (it reduces
 *   to a constant); lower orders give the zero polynomial.
 */
declare function toPowerBasisY00At0and0At1(ps: number[][]): number[];
/**
 * Returns the power basis (highest power to lowest) of the y coordinate of a
 * line, quadratic or cubic bezier curve with a single root at `t === 0` and a
 * *double* root at `t === 1` already deflated out.
 *
 * * only a cubic can carry these 3 roots and still be non-trivial (it reduces
 *   to a constant); lower orders give the zero polynomial.
 */
declare function toPowerBasisY0At0and00At1(ps: number[][]): number[];
/**
 * Returns the power basis (highest power to lowest) of the y coordinate of a
 * line, quadratic or cubic bezier curve with a *double* root at `t === 0` and a
 * *double* root at `t === 1` already deflated out.
 *
 * * 4 forced roots exceed the order of any line/quadratic/cubic, so the result
 *   is always the zero polynomial. Included only for completeness.
 */
declare function toPowerBasisY00At0and00At1(_ps: number[][]): number[];
/**
 * Returns the full power basis (highest power to lowest) of the y coordinate of
 * an order 1, 2 or 3 bezier curve.
 */
declare function toPowerBasisY(ps: number[][]): number[];
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
declare function toPowerBasisRootsAt(ps: number[][], numRoots0: number, numRoots1: number): number[];
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
declare function toPowerBasisRootsAtExact(ps: number[][], numRoots0: number, numRoots1: number): number[];
export { toPowerBasisY0At0, toPowerBasisY00At0, toPowerBasisY000At0, toPowerBasisY0At1, toPowerBasisY00At1, toPowerBasisY000At1, toPowerBasisY0At0and1, toPowerBasisY00At0and0At1, toPowerBasisY0At0and00At1, toPowerBasisY00At0and00At1 };
export { toPowerBasisY, toPowerBasisRootsAt, toPowerBasisRootsAtExact };
