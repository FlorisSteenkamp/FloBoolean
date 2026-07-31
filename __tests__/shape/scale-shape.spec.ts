import { test, expect } from '@jest/globals';
import { scaleShape } from "../../src/shape/scale-shape.js";


test('scaleShape', function() {
    const shape = [
        [[0, 0], [10, 0]],
        [[10, 0], [10, 10]],
        [[10, 10], [0, 0]]
    ];

    // scaling by 2 about the origin
    {
        const r = scaleShape(2, shape);

        expect(r).toStrictEqual([
            [[0, 0], [20, 0]],
            [[20, 0], [20, 20]],
            [[20, 20], [0, 0]]
        ]);
    }

    // scaling by 1 leaves the shape unchanged
    {
        const r = scaleShape(1, shape);

        expect(r).toStrictEqual(shape);
    }

    // scaling by a negative factor reflects through the origin
    {
        const r = scaleShape(-0.5, shape);

        expect(r).toStrictEqual([
            [[-0, -0], [-5, -0]],
            [[-5, -0], [-5, -5]],
            [[-5, -5], [-0, -0]]
        ]);
    }
});
