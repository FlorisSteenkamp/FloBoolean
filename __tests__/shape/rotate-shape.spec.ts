import { test, expect } from '@jest/globals';
import { rotateShape } from "../../src/shape/rotate-shape.js";

const { PI: π } = Math;


test('rotateShape', function() {
    const shape = [
        [[1, 0], [0, 1]],
        [[0, 1], [-1, 0]],
        [[-1, 0], [1, 0]]
    ];

    // rotating by 0 leaves the shape (approximately) unchanged
    {
        const r = rotateShape(0, shape);

        expect(r).toStrictEqual(shape);
    }

    // rotating anti-clockwise by 90° maps (x, y) -> (-y, x)
    {
        const expected = [
            [[0, 1], [-1, 0]],
            [[-1, 0], [0, -1]],
            [[0, -1], [0, 1]]
        ];

        const r = rotateShape(π / 2, shape);

        for (let i = 0; i < r.length; i++) {
            for (let j = 0; j < r[i].length; j++) {
                expect(r[i][j][0]).toBeCloseTo(expected[i][j][0], 12);
                expect(r[i][j][1]).toBeCloseTo(expected[i][j][1], 12);
            }
        }
    }

    // rotating by 360° returns (approximately) to the original
    {
        const r = rotateShape(2 * π, shape);

        for (let i = 0; i < r.length; i++) {
            for (let j = 0; j < r[i].length; j++) {
                expect(r[i][j][0]).toBeCloseTo(shape[i][j][0], 12);
                expect(r[i][j][1]).toBeCloseTo(shape[i][j][1], 12);
            }
        }
    }
});
