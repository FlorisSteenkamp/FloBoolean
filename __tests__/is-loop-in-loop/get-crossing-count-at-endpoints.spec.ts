import { test, expect } from '@jest/globals';
import { getCrossingCountAtEndpoints } from '../../src/is-loop-in-loop/get-crossing-count-at-endpoints.ts';


/**
 * `getCrossingUpCount(ps, t)` looks at a line / quadratic / cubic bezier `ps` that
 * has one endpoint on the ray (`y === 0` at parameter `t`, where `t` is `0` for
 * the first point or `1` for the last) and reports the direction the curve
 * departs from that endpoint:
 *
 *   * `+1`  the curve leaves the endpoint going up   (first non-zero y is > 0)
 *   * `-1`  the curve leaves the endpoint going down (first non-zero y is < 0)
 *   * ` 0`  degenerate - every interior control point lies on the ray
 *
 * The endpoints are the edge cases used when computing winding numbers, so the
 * `t === 0` and `t === 1` sides must behave symmetrically.
 */

//------------------------------------------------------------------------------
// t === 0 : the FIRST point lies on the ray
//------------------------------------------------------------------------------
test('`getCrossingUpCount` - t=0 - line up', () => {
    expect(getCrossingCountAtEndpoints([[0,0],[3,5]], 0)).toBe(1);
});

test('`getCrossingUpCount` - t=0 - line down', () => {
    expect(getCrossingCountAtEndpoints([[0,0],[3,-5]], 0)).toBe(-1);
});

test('`getCrossingUpCount` - t=0 - horizontal line is degenerate (0)', () => {
    expect(getCrossingCountAtEndpoints([[0,0],[3,0]], 0)).toBe(0);
});

test('`getCrossingUpCount` - t=0 - quadratic up (first control point decides)', () => {
    expect(getCrossingCountAtEndpoints([[0,0],[1,4],[2,0]], 0)).toBe(1);
});

test('`getCrossingUpCount` - t=0 - quadratic down', () => {
    expect(getCrossingCountAtEndpoints([[0,0],[1,-2],[2,0]], 0)).toBe(-1);
});

test('`getCrossingUpCount` - t=0 - quadratic, first cp on ray, second decides', () => {
    expect(getCrossingCountAtEndpoints([[0,0],[1,0],[2,3]], 0)).toBe(1);
});

test('`getCrossingUpCount` - t=0 - quadratic fully on ray is degenerate (0)', () => {
    expect(getCrossingCountAtEndpoints([[0,0],[1,0],[2,0]], 0)).toBe(0);
});

test('`getCrossingUpCount` - t=0 - cubic up (departure decides, not later shape)', () => {
    // leaves upward even though it later dips below the ray
    expect(getCrossingCountAtEndpoints([[0,0],[1,2],[2,-9],[3,-1]], 0)).toBe(1);
});

test('`getCrossingUpCount` - t=0 - cubic, first cp on ray, second decides (down)', () => {
    expect(getCrossingCountAtEndpoints([[0,0],[1,0],[2,-3],[3,5]], 0)).toBe(-1);
});

test('`getCrossingUpCount` - t=0 - cubic, first two cps on ray, last decides (down)', () => {
    expect(getCrossingCountAtEndpoints([[0,0],[1,0],[2,0],[3,-4]], 0)).toBe(-1);
});

test('`getCrossingUpCount` - t=0 - cubic fully on ray is degenerate (0)', () => {
    expect(getCrossingCountAtEndpoints([[0,0],[1,0],[2,0],[3,0]], 0)).toBe(0);
});

//------------------------------------------------------------------------------
// t === 1 : the LAST point lies on the ray (symmetric to t === 0)
//------------------------------------------------------------------------------
test('`getCrossingUpCount` - t=1 - line up', () => {
    expect(getCrossingCountAtEndpoints([[3,5],[0,0]], 1)).toBe(1);
});

test('`getCrossingUpCount` - t=1 - line down', () => {
    expect(getCrossingCountAtEndpoints([[3,-5],[0,0]], 1)).toBe(-1);
});

test('`getCrossingUpCount` - t=1 - horizontal line is degenerate (0)', () => {
    expect(getCrossingCountAtEndpoints([[3,0],[0,0]], 1)).toBe(0);
});

test('`getCrossingUpCount` - t=1 - quadratic up (nearest control point decides)', () => {
    expect(getCrossingCountAtEndpoints([[2,0],[1,4],[0,0]], 1)).toBe(1);
});

test('`getCrossingUpCount` - t=1 - quadratic down', () => {
    expect(getCrossingCountAtEndpoints([[2,0],[1,-2],[0,0]], 1)).toBe(-1);
});

test('`getCrossingUpCount` - t=1 - quadratic, nearest cp on ray, next decides', () => {
    expect(getCrossingCountAtEndpoints([[2,3],[1,0],[0,0]], 1)).toBe(1);
});

test('`getCrossingUpCount` - t=1 - quadratic fully on ray is degenerate (0)', () => {
    expect(getCrossingCountAtEndpoints([[2,0],[1,0],[0,0]], 1)).toBe(0);
});

test('`getCrossingUpCount` - t=1 - cubic up (nearest control point decides)', () => {
    // ps[2] = [2,3] is nearest the on-ray endpoint ps[3] and is above it
    expect(getCrossingCountAtEndpoints([[0,-5],[1,-5],[2,3],[3,0]], 1)).toBe(1);
});

test('`getCrossingUpCount` - t=1 - cubic, nearest cp on ray, next decides (down)', () => {
    expect(getCrossingCountAtEndpoints([[5,3],[2,-3],[1,0],[0,0]], 1)).toBe(-1);
});

test('`getCrossingUpCount` - t=1 - cubic, two nearest cps on ray, last decides (down)', () => {
    expect(getCrossingCountAtEndpoints([[3,-4],[2,0],[1,0],[0,0]], 1)).toBe(-1);
});

test('`getCrossingUpCount` - t=1 - cubic fully on ray is degenerate (0)', () => {
    expect(getCrossingCountAtEndpoints([[3,0],[2,0],[1,0],[0,0]], 1)).toBe(0);
});

//------------------------------------------------------------------------------
// symmetry: reversing a curve and flipping t must give the same direction
//------------------------------------------------------------------------------
test('`getCrossingUpCount` - reversed curve with flipped t agrees (cubic up)', () => {
    const ps  = [[0,0],[1,2],[2,-9],[3,-1]];
    const rev = [...ps].reverse();
    expect(getCrossingCountAtEndpoints(ps, 0)).toBe(getCrossingCountAtEndpoints(rev, 1));
});

test('`getCrossingUpCount` - reversed curve with flipped t agrees (quadratic down)', () => {
    const ps  = [[0,0],[1,-2],[2,0]];
    const rev = [...ps].reverse();
    expect(getCrossingCountAtEndpoints(ps, 0)).toBe(getCrossingCountAtEndpoints(rev, 1));
});
