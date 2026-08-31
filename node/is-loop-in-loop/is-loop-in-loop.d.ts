import type { BezierPiece } from 'flo-bezier3';
/**
 * Returns `true` if the first loop is wholly contained within the second loop's
 * boundary.
 *
 * * precondition: the loop must either wholly contained inside the loop or be
 *   wholly outside.
 *
 * @param loop1
 * @param loop2
 */
declare const _isLoopInLoop: ((this: unknown, expMax: number, loop1: number[][][], bezierPieces: BezierPiece[]) => boolean) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
declare function isPointInLoop(expMax: number, p: number[], bezierPieces: BezierPiece[]): boolean | undefined;
/**
 * Returns the number of times an axis-aligned ray from `p` crosses the loop,
 * or `undefined` when the result is ambiguous - i.e. when a crossing falls
 * within `2*eps` of an inexact piece boundary (an intersection parameter that
 * is not exactly 0 or 1). The caller resolves this by retrying the ray from a
 * different point.
 *
 * Crossings are counted delta-free:
 * * roots are taken on the half-open parameter interval `[0,1)` so a vertex
 *   shared by two curves is owned by exactly one of them and counted once;
 * * each root contributes `multiplicity % 2`, so a transversal crossing (odd
 *   multiplicity) counts while a tangential touch (even multiplicity) does not.
 *
 * @param loop a loop of curves
 * @param p the point where the ray starts
 * @param dir the ray direction
 */
export declare const getAxisAlignedRayLoopIntersections: ((this: unknown, expMax: number, bezierPieces: BezierPiece[], p: number[]) => number | undefined) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
declare const bezierPiecesToBeziers$: ((bezierPieces: BezierPiece[]) => number[][][]) & {
    readonly weakMapS: WeakMap<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly mapS: Map<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly clearCache: () => void;
    readonly addToCache: (r: unknown, ...args: any) => void;
};
/**
 * Returns `true` if the first loop is wholly contained within the second loop's
 * boundary.
 *
 * * precondition: the loop must either wholly contained inside the loop or be
 *   wholly outside.
 *
 * * we use this intermediate function to ensure the second loop still has its
 *   original beziers so no floating point issues arise
 *
 * @param loop1
 * @param bezierPieces
 */
declare function isLoopInLoop(expMax: number, loop1: number[][][], loop2: number[][][]): boolean;
export { isLoopInLoop, _isLoopInLoop, isPointInLoop, bezierPiecesToBeziers$ };
