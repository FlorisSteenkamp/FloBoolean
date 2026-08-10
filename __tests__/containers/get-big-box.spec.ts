import { test, expect } from '@jest/globals';
import { getBigBox } from '../../src/containers/get-big-box.js';
import { isPointInsideRect } from '../../src/containers/is-point-inside-rect.js';


/** A small square of half-size `h` centered on `c`. */
function square(c: number[], h: number): number[][] {
    const [x,y] = c;
    return [[x - h, y - h], [x + h, y + h]];
}

/** `true` if the interiors of two axis-aligned rects overlap (touching is ok). */
function interiorsOverlap(a: number[][], b: number[][]): boolean {
    const [[aMinX,aMinY],[aMaxX,aMaxY]] = a;
    const [[bMinX,bMinY],[bMaxX,bMaxY]] = b;
    return aMinX < bMaxX && bMinX < aMaxX && aMinY < bMaxY && bMinY < aMaxY;
}

/** `p` must be strictly inside `r` and no rect may be strictly inside `r`. */
function expectValid(r: number[][], rects: number[][][], p: number[]) {
    expect(isPointInsideRect(false, r, p)).toBe(true);
    expect(rects.some(rect => interiorsOverlap(r, rect))).toBe(false);
}


test.skip('getBigBox', function() {
    // Squares centered on the corners of the unit square (plus one square
    // below): the box shrinks inward by the half-size `h` onto each near edge.
    {
        const h = 0.05;
        const centers = [
            [0,0], [1,0], [1,1], [0,1],
            [0.2,-1]
        ];
        const rects = centers.map(c => square(c, h));
        const p = [0.5,0.5];

        const r = getBigBox(10, rects, p);

        // Sides halved in distance toward `p`: [[0.05,0.05],[0.95,0.95]] -> below.
        expect(r).toEqual([[0.275,0.275],[0.725,0.725]]);
        expectValid(r, rects, p);
    }

    // Squares far along each axis: each blocks a single side.
    {
        const h = 0.05;
        const centers = [
            [-5,0.1], [4,-0.1], [0.1,10], [-0.1,-10]
        ];
        const rects = centers.map(c => square(c, h));
        const p = [0.5,0.5];

        const r = getBigBox(10, rects, p);

        // Sides halved in distance toward `p`: [[-4.95,-9.95],[3.95,9.95]] -> below.
        expect(r).toEqual([[-2.225,-4.725],[2.225,5.225]]);
        expectValid(r, rects, p);
    }

    // A tall thin rect to the right overlaps `p` in y, so it must block the
    // near (right) x-edge - the case a corner-points approach gets wrong.
    {
        const rects = [[[2,-10],[3,10]]];
        const p = [0.5,0.5];

        const r = getBigBox(10, rects, p);

        // Sides halved in distance toward `p`: [[-MAX,-MAX],[2,MAX]] -> below.
        const MAX = 2**(10 + 1);
        expect(r).toEqual([[(0.5 - MAX)/2, (0.5 - MAX)/2],[1.25, (0.5 + MAX)/2]]);
        expectValid(r, rects, p);
    }
});
