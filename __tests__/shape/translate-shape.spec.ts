import { test, expect } from '@jest/globals';
import { translateShape } from "../../src/shape/translate-shape.js";


test('translateShape', function() {
    const shape = [
        [[0, 0], [10, 0]],
        [[10, 0], [10, 10]],
        [[10, 10], [0, 0]]
    ];

    const r = translateShape([5, -3], shape);

    expect(r).toStrictEqual([
        [[5, -3], [15, -3]],
        [[15, -3], [15, 7]],
        [[15, 7], [5, -3]]
    ]);
});
