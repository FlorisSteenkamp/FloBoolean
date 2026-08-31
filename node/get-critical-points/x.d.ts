import type { RootInterval } from 'flo-poly';
import type { RootIntervalExp } from 'flo-poly';
import type { Curve } from '../curve/curve.js';
/**
 * Represents an intersection point between two bezier curves as 'seen' by one
 * of the curves.
 *
 * A full description of an intersection is then represented by a pair of `X`s,
 * as from the point of view of each curve.
 */
interface X {
    /** The Curve on the shape boundary this point belong to. */
    readonly curve: Curve;
    /**
     * The root interval guaranteed to contain the correct `t` value in the
     * form `{ tS, tE, multiplicity }`, where `tS` and `tE` are the start and
     * end of the interval with `tE - tS` guaranteed to be less than or equal to
     * `4*Number.EPSILON`
     */
    readonly ri: RootInterval;
    /**
     * The kind of intersection (inherited from `flo-bezier3`):
     * * 1 => general curve-curve intersection (non-self-overlapping)
     * * 4 => interface intersection (i.e coinciding endpoints)
     * * 5 => an interval of *exact* curve overlap, i.e. an infinite number of
     * intersections; represented by this intersection (an endpoint of a curve
     * intersecting another curve) and an additional [[X]] (that will also
     * be of kind 5)
     * * 6 => a point (order 0 bezier) intersecting a bezier curve
     *
     * additional kinds added by this library (specific to boolean operations)
     * * 0 => min-y, e.g. topmost point
     * * 2 => self intersection, a.k.a. ordinary double point, a.k.a crunode
     * * 3 => cusp
     * * 7 => a point of excessive curvature
     * * 8 => a point of vertical or horizontal tangent
     */
    readonly kind: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    readonly p: number[];
    /** The number of times the root has been compensated (if undefined implies 0) */
    readonly compensated?: number;
    /** The root interval if compensated 1 or more times */
    readonly riExp?: RootIntervalExp;
    readonly getPExact?: () => number[][];
}
export type { X };
