import { test, expect } from '@jest/globals';
import { reverseShapeOrientation } from "../../src/shape/reverse-shape-orientation.js";


test('reverseShapeOrientation', function() {
    const shape = [
        [[0, 0], [10, 0]],
        [[10, 0], [10, 10]],
        [[10, 10], [0, 0]]
    ];

    const r = reverseShapeOrientation(shape);

    expect(r).toStrictEqual([
        [[0, 0], [10, 10]],
        [[10, 10], [10, 0]],
        [[10, 0], [0, 0]]
    ]);
});
