import { test, expect } from '@jest/globals';
import { isPointInLoop } from '../../src/is-loop-in-loop/is-loop-in-loop.ts';
import { rotate } from 'flo-vector2d';
import { BezierPiece } from 'flo-bezier3';

const { sin, cos } = Math;


test('`isPointInLoop`', function() {
    const rect1: number[][][] = [
        [[10,10],[20,10]],
        [[20,10],[20,20]],
        [[20,20],[10,20]],
        [[10,20],[10,10]]
    ];
    const θ = 0.00125*Math.PI;  // 0.225° = 0.00125π rad
    const sinθ = sin(θ);
    const cosθ = cos(θ);
    const rect1Rot = rect1.map(ps => ps.map(p => rotate(sinθ, cosθ)(p)));

    // Four cubic beziers approximating a unit circle centered at the origin.
    // k is the standard control-point offset: 4/3 * (sqrt(2) - 1).
    const k = 0.5522847498307936;
    const loop2: number[][][] = [
        [[ 1, 0],[ 1, k],[ k, 1],[ 0, 1]],
        [[ 0, 1],[-k, 1],[-1, k],[-1, 0]],
        [[-1, 0],[-1,-k],[-k,-1],[ 0,-1]],
        [[ 0,-1],[ k,-1],[ 1,-k],[ 1, 0]]
    ];


    const loop3 = [
        [[1,30],[30,30]],
        [[30,30],[30,0]],
        [[30,0],[1,0]],
        [[1,0],[1,30]]
    ];


    {
        // Basic test
        const p = loop2[0][0];  //=> [1,0]
        const r = isPointInLoop(5, p, rect1Rot.map(ps => ({ ps, ts: [0,1] })));
        expect(r).toBe(false);
    }
    {
        // Basic test
        const p = rect1Rot[0][0];  //=> [9.960653086576645, 10.039192701052766]
        const r = isPointInLoop(5, p, loop3.map(ps => ({ ps, ts: [0,1] })));
        expect(r).toBe(true);
    }


    {
        //--------------------------------------------------------------------------
        // Special test 1 - plain vertical left edge split by a vertex (E) that lies
        // exactly on the ray (shared endpoint root at t=1 of D-E and t=0 of E-A)
        //--------------------------------------------------------------------------
        //
        //  y=30       A●━━━━━━━━━━━━━━━━━━━━━━━●B   (1,30)→(30,30)
        //             ┃                        ┃
        //             ┃                        ┃
        //             ┃                        ┃
        //             ┃                        ┃
        //  y≈10       E●        ●p             ┃   (1,Y)
        //             ┃                        ┃
        //             ┃   ← left edge D→E→A    ┃
        //             ┃                        ┃
        //  y=0        D●━━━━━━━━━━━━━━━━━━━━━━━●C   (1,0)→(30,0)
        //             x=1                   x=30
        //   ●p ≈ (9.96, Y) - the ray-start point tested (rect1Rot[0][0]);
        //   it sits exactly on the E level since Y is p's y-coordinate.
        //   Unlike tests 2 & 3 the left edge is a plain vertical (no spike).
        //
        const Y = 10.039192701052766;  // `rect1Rot[0][0]` -> bottom left y coordinate of rotated rect
        const loop4: BezierPiece[] = [
            [[1,30],[30,30]],  // A-B
            [[30,30],[30,0]],  // B-C
            [[30,0],[1,0]],    // C-D
            [[1,0],[1,Y]],     // D-E
            [[1,Y],[1,30]]     // E-A
        ].map(ps => ({ ps, ts: [0,1] }));
        // the point that is actually used in the test by the algorithm
        const p = rect1Rot[0][0];  //=> [9.960653086576645, 10.039192701052766]
        const r = isPointInLoop(5, p, loop4);
        expect(r).toBe(true);
    }

    {
        //--------------------------------------------------------------------------
        // Special test 1b - ambiguous ray through an INEXACT interior boundary
        //--------------------------------------------------------------------------
        //
        //  Same shape as Special test 1, but the left edge D->E->A is represented
        //  as a SINGLE line D=(1,0) -> A=(1,30) split parametrically at the shared
        //  vertex E into two pieces sharing the same control points:
        //      D-E : ts = [0, t*]        E-A : ts = [t*, 1]
        //  where t* = Y/30 (~0.3346) is the parameter at which the line reaches
        //  y = Y. Because t* is neither 0 nor 1 it is an INEXACT (intersection-
        //  like) boundary, and the ray at y = Y crosses the curve exactly at t*,
        //  i.e. within 4*eps of that boundary. The crossing count is therefore
        //  ambiguous, so `isPointInLoop` bails and returns `undefined`
        //  (the `return undefined` in getAxisAlignedRayLoopIntersections).
        //  `_isLoopInLoop` would then retry the ray from a different point.
        //
        const Y = 10.039192701052766;  // `rect1Rot[0][0]` -> bottom left y coordinate of rotated rect
        const tSplit = Y/30;  // parameter on the line (1,0)->(1,30) where y === Y
        const leftEdge = [[1,0],[1,30]];  // D -> A (full line, shared control points)
        const loop4: BezierPiece[] = [
            { ps: [[1,30],[30,30]], ts: [0,1] },  // A-B
            { ps: [[30,30],[30,0]], ts: [0,1] },  // B-C
            { ps: [[30,0],[1,0]],   ts: [0,1] },  // C-D
            { ps: leftEdge,         ts: [0, tSplit] },  // D-E (lower part of left edge)
            { ps: leftEdge,         ts: [tSplit, 1] },  // E-A (upper part of left edge)
        ];
        const p = rect1Rot[0][0];  //=> [9.960653086576645, 10.039192701052766]
        const r = isPointInLoop(5, p, loop4);
        expect(r).toBe(undefined);
    }

    {
        //--------------------------------------------------------------------------
        // Special test 2 - horizontal spike edge (E-F) lying fully collinear with
        // the ray (the `roots === undefined` degenerate case)
        //--------------------------------------------------------------------------
        //
        //  y=30       A●━━━━━━━━━━━━━━━━━━━━━━━●B   (1,30)→(30,30)
        //            ╱                         ┃
        //           ╱   ← diagonal F→A         ┃
        //          ╱                           ┃
        //         ╱                            ┃
        //  y≈10 F●╌╌╌●E      ●p                ┃   (-1,Y)  (1,Y)
        //            ┃                         ┃
        //            ┃   ← vertical E→D        ┃
        //            ┃                         ┃
        //  y=0       D●━━━━━━━━━━━━━━━━━━━━━━━━●C   (1,0)→(30,0)
        //       x=-1 x=1                     x=30
        //   ●p ≈ (9.96, Y) - the ray-start point tested (rect1Rot[0][0]);
        //   it sits exactly on the E–F level since Y is p's y-coordinate.
        //
        const Y = 10.039192701052766;  // `rect1Rot[0][0]` -> bottom left y coordinate of rotated rect
        const loop5: BezierPiece[] = [
            [[1,30],[30,30]],  // A-B
            [[30,30],[30,0]],  // B-C
            [[30,0],[1,0]],    // C-D
            [[1,0],[1,Y]],     // D-E
            [[1,Y],[-1,Y]],    // E-F
            [[-1,Y],[1,30]]    // F-A
        ].map(ps => ({ ps, ts: [0,1] }));
        // the point that is actually used in the test by the algorithm
        const p = rect1Rot[0][0];  //=> [9.960653086576645, 10.039192701052766]
        const r = isPointInLoop(5, p, loop5);
        expect(r).toBe(true);
    }

    {
        const Y = 10.039192701052766;  // `rect1Rot[0][0]` -> bottom left y coordinate of rotated rect
        //--------------------------------------------------------------------------
        // Special test 3 - quadratic spike (E-F) with both endpoints on the ray,
        // bulging just above it (single endpoint root at t=0 and t=1)
        //--------------------------------------------------------------------------
        //
        //  y=30       A●━━━━━━━━━━━━━━━━━━━━━━━●B   (1,30)→(30,30)
        //            ╱                         ┃
        //           ╱   ← diagonal F→A         ┃
        //          ╱                           ┃
        //         ╱                            ┃
        //  y≈10 F●╌╌╌●E      ●p                ┃   (-1,Y)  (1,Y)
        //            ┃                         ┃
        //            ┃   ← vertical E→D        ┃
        //            ┃                         ┃
        //  y=0       D●━━━━━━━━━━━━━━━━━━━━━━━━●C   (1,0)→(30,0)
        //       x=-1 x=1                     x=30
        //   ●p ≈ (9.96, Y) - the ray-start point tested (rect1Rot[0][0]);
        //   it sits exactly on the E–F level since Y is p's y-coordinate.
        //
        const δ = 0.0009765625;  // some random small number
        const loop5: BezierPiece[] = [
            [[1,30],[30,30]],  // A-B
            [[30,30],[30,0]],  // B-C
            [[30,0],[1,0]],    // C-D
            [[1,0],[1,Y]],     // D-E
            [[1,Y],[0,Y + δ],[-1,Y]],    // E-F
            [[-1,Y],[1,30]]    // F-A
        ].map(ps => ({ ps, ts: [0,1] }));
        // the point that is actually used in the test by the algorithm
        const p = rect1Rot[0][0];  //=> [9.960653086576645, 10.039192701052766]
        const r = isPointInLoop(5, p, loop5);
        expect(r).toBe(true);
    }

    {
        //--------------------------------------------------------------------------
        // Special test 1 - p shifted outside (p1 = 15 left, p2 = 30 right)
        //--------------------------------------------------------------------------
        //
        //  y=30              A●━━━━━━━━━━━━━━━━━━━━━━━●B   (1,30)→(30,30)
        //                    ┃                        ┃
        //                    ┃                        ┃
        //  y≈10   ●p1        E●                       ┃        ●p2
        //                    ┃                        ┃
        //                    ┃   ← left edge D→E→A    ┃
        //  y=0               D●━━━━━━━━━━━━━━━━━━━━━━━●C   (1,0)→(30,0)
        //         x≈-5       x=1                    x=30      x≈40
        //   p1 = p - 15 ≈ (-5.04, Y) -> left  of the shape -> outside -> false
        //   p2 = p + 30 ≈ (39.96, Y) -> right of the shape -> outside -> false
        //
        const Y = 10.039192701052766;  // `rect1Rot[0][0]` -> bottom left y coordinate of rotated rect
        const loop4: BezierPiece[] = [
            [[1,30],[30,30]],  // A-B
            [[30,30],[30,0]],  // B-C
            [[30,0],[1,0]],    // C-D
            [[1,0],[1,Y]],     // D-E
            [[1,Y],[1,30]]     // E-A
        ].map(ps => ({ ps, ts: [0,1] }));
        const p = rect1Rot[0][0];        //=> [9.960653086576645, 10.039192701052766]
        const p1 = [p[0] - 15, p[1]];    //=> [-5.039346913423355, Y]  outside left
        const p2 = [p[0] + 30, p[1]];    //=> [39.960653086576645, Y]  outside right
        expect(isPointInLoop(5, p1, loop4)).toBe(false);
        expect(isPointInLoop(5, p2, loop4)).toBe(false);
    }

    {
        //--------------------------------------------------------------------------
        // Special test 2 - p shifted outside (p1 = 15 left, p2 = 30 right)
        //--------------------------------------------------------------------------
        //
        //  y=30              A●━━━━━━━━━━━━━━━━━━━━━━━●B   (1,30)→(30,30)
        //                   ╱                         ┃
        //                  ╱   ← diagonal F→A         ┃
        //                 ╱                           ┃
        //                ╱                            ┃
        //  y≈10  ●p1   F●╌╌╌●E                        ┃        ●p2   (-1,Y) (1,Y)
        //                ┃                            ┃
        //                ┃   ← vertical E→D           ┃
        //  y=0           D●━━━━━━━━━━━━━━━━━━━━━━━━━━━●C   (1,0)→(30,0)
        //        x≈-5  x=-1 x=1                     x=30      x≈40
        //   p1 = p - 15 ≈ (-5.04, Y) -> left  of the spike tip F -> outside -> false
        //   p2 = p + 30 ≈ (39.96, Y) -> right of the shape       -> outside -> false
        //
        const Y = 10.039192701052766;  // `rect1Rot[0][0]` -> bottom left y coordinate of rotated rect
        const loop5: BezierPiece[] = [
            [[1,30],[30,30]],  // A-B
            [[30,30],[30,0]],  // B-C
            [[30,0],[1,0]],    // C-D
            [[1,0],[1,Y]],     // D-E
            [[1,Y],[-1,Y]],    // E-F
            [[-1,Y],[1,30]]    // F-A
        ].map(ps => ({ ps, ts: [0,1] }));
        const p = rect1Rot[0][0];        //=> [9.960653086576645, 10.039192701052766]
        const p1 = [p[0] - 15, p[1]];    //=> [-5.039346913423355, Y]  outside left
        const p2 = [p[0] + 30, p[1]];    //=> [39.960653086576645, Y]  outside right
        expect(isPointInLoop(5, p1, loop5)).toBe(false);
        expect(isPointInLoop(5, p2, loop5)).toBe(false);
    }

    {
        //--------------------------------------------------------------------------
        // Special test 3 - p shifted outside (p1 = 15 left, p2 = 30 right)
        //--------------------------------------------------------------------------
        //
        //  y=30              A●━━━━━━━━━━━━━━━━━━━━━━━●B   (1,30)→(30,30)
        //                   ╱                         ┃
        //                  ╱   ← diagonal F→A         ┃
        //                 ╱                           ┃
        //                ╱                            ┃
        //  y≈10  ●p1   F●╌╌●E   (quadratic E→F bulges to y=Y+δ)  ┃   ●p2
        //                ┃                            ┃
        //                ┃   ← vertical E→D           ┃
        //  y=0           D●━━━━━━━━━━━━━━━━━━━━━━━━━━━●C   (1,0)→(30,0)
        //        x≈-5  x=-1 x=1                     x=30      x≈40
        //   p1 = p - 15 ≈ (-5.04, Y) -> left  of the spike tip F -> outside -> false
        //   p2 = p + 30 ≈ (39.96, Y) -> right of the shape       -> outside -> false
        //
        const Y = 10.039192701052766;  // `rect1Rot[0][0]` -> bottom left y coordinate of rotated rect
        const δ = 0.0009765625;  // some random small number
        const loop5: BezierPiece[] = [
            [[1,30],[30,30]],  // A-B
            [[30,30],[30,0]],  // B-C
            [[30,0],[1,0]],    // C-D
            [[1,0],[1,Y]],     // D-E
            [[1,Y],[0,Y + δ],[-1,Y]],    // E-F
            [[-1,Y],[1,30]]    // F-A
        ].map(ps => ({ ps, ts: [0,1] }));
        const p = rect1Rot[0][0];        //=> [9.960653086576645, 10.039192701052766]
        const p1 = [p[0] - 15, p[1]];    //=> [-5.039346913423355, Y]  outside left
        const p2 = [p[0] + 30, p[1]];    //=> [39.960653086576645, Y]  outside right
        expect(isPointInLoop(5, p1, loop5)).toBe(false);
        expect(isPointInLoop(5, p2, loop5)).toBe(false);
    }

    {
        const Y = 10.039192701052766;  // `rect1Rot[0][0]` -> bottom left y coordinate of rotated rect
        //--------------------------------------------------------------------------
        // Special test 4 - cubic spike (E-F) with control points on the ray at both
        // ends (double endpoint root at t=0, single at t=1)
        //--------------------------------------------------------------------------
        //
        //  y=30       A●━━━━━━━━━━━━━━━━━━━━━━━●B   (1,30)→(30,30)
        //            ╱                         ┃
        //           ╱   ← diagonal F→A         ┃
        //          ╱                           ┃
        //         ╱                            ┃
        //  y≈10 F●╌╌╌●E      ●p                ┃   (-1,Y)  (1,Y)
        //            ┃                         ┃
        //            ┃   ← vertical E→D        ┃
        //            ┃                         ┃
        //  y=0       D●━━━━━━━━━━━━━━━━━━━━━━━━●C   (1,0)→(30,0)
        //       x=-1 x=1                     x=30
        //   ●p ≈ (9.96, Y) - the ray-start point tested (rect1Rot[0][0]);
        //   it sits exactly on the E–F level since Y is p's y-coordinate.
        //
        const δ = 0.0009765625;  // some random small number
        const loop5: BezierPiece[] = [
            [[1,30],[30,30]],  // A-B
            [[30,30],[30,0]],  // B-C
            [[30,0],[1,0]],    // C-D
            [[1,0],[1,Y]],     // D-E
            [[1,Y],[0.5,Y],[0,Y + δ],[-1,Y]],    // E-F
            [[-1,Y],[1,30]]    // F-A
        ].map(ps => ({ ps, ts: [0,1] }));
        // the point that is actually used in the test by the algorithm
        const p = rect1Rot[0][0];  //=> [9.960653086576645, 10.039192701052766]
        const r = isPointInLoop(5, p, loop5);
        expect(r).toBe(true);
    }

    {
        const Y = 10.039192701052766;  // `rect1Rot[0][0]` -> bottom left y coordinate of rotated rect
        //--------------------------------------------------------------------------
        // Special test 5 - cubic spike (E-F) with three control points on the ray
        // (triple endpoint root at t=0; deflated poly is a non-zero constant)
        //--------------------------------------------------------------------------
        //
        //  y=30       A●━━━━━━━━━━━━━━━━━━━━━━━●B   (1,30)→(30,30)
        //            ╱                         ┃
        //           ╱   ← diagonal F→A         ┃
        //          ╱                           ┃
        //         ╱                            ┃
        //  y≈10 F●╌╌╌●E      ●p                ┃   (-1,Y)  (1,Y)
        //            ┃                         ┃
        //            ┃   ← vertical E→D        ┃
        //            ┃                         ┃
        //  y=0       D●━━━━━━━━━━━━━━━━━━━━━━━━●C   (1,0)→(30,0)
        //       x=-1 x=1                     x=30
        //   ●p ≈ (9.96, Y) - the ray-start point tested (rect1Rot[0][0]);
        //   it sits exactly on the E–F level since Y is p's y-coordinate.
        //
        const δ = 0.0009765625;  // some random small number
        const loop5: BezierPiece[] = [
            [[1,30],[30,30]],  // A-B
            [[30,30],[30,0]],  // B-C
            [[30,0],[1,0]],    // C-D
            [[1,0],[1,Y]],     // D-E
            [[1,Y],[0.5,Y],[0,Y],[-1,Y + δ]],    // E-F
            [[-1,Y + δ],[1,30]]    // F-A
        ].map(ps => ({ ps, ts: [0,1] }));
        // the point that is actually used in the test by the algorithm
        const p = rect1Rot[0][0];  //=> [9.960653086576645, 10.039192701052766]
        const r = isPointInLoop(5, p, loop5);
        expect(r).toBe(true);
    }

    {
        const Y = 10.039192701052766;  // `rect1Rot[0][0]` -> bottom left y coordinate of rotated rect
        //--------------------------------------------------------------------------
        // Special test 6 (multiplicity 2 root (p is slightly lower than shown))
        //--------------------------------------------------------------------------
        //
        //  y=30       A●━━━━━━━━━━━━━━━━━━━━━━━●B   (1,30)→(30,30)
        //            ╱                         ┃
        //           ╱   ← diagonal F→A         ┃
        //          ╱                           ┃
        //         ╱                            ┃
        //  y≈10 F●╌╌╌●E      ●p                ┃   (-1,Y)  (1,Y)
        //            ┃                         ┃
        //            ┃   ← vertical E→D        ┃
        //            ┃                         ┃
        //  y=0       D●━━━━━━━━━━━━━━━━━━━━━━━━●C   (1,0)→(30,0)
        //       x=-1 x=1                     x=30
        //   ●p ≈ (9.96, Y) - the ray-start point tested (rect1Rot[0][0]);
        //   it sits exactly on the E–F level since Y is p's y-coordinate.
        //
        const δ = 0.0009765625;  // some random small number
        const loop5: BezierPiece[] = [
            [[1,30],[30,30]],  // A-B
            [[30,30],[30,0]],  // B-C
            [[30,0],[1,0]],    // C-D
            [[1,0],[1,Y]],     // D-E
            [[1,Y],[0,Y + δ],[-1,Y]],    // E-F
            [[-1,Y],[1,30]]    // F-A
        ].map(ps => ({ ps, ts: [0,1] }));
        // the point that is actually used in the test by the algorithm
        const p = [9.960653086576645, 10.039192701052766 + δ/2];
        const r = isPointInLoop(5, p, loop5);
        expect(r).toBe(true);
    }
});