import { test, expect } from '@jest/globals';
import { getShapeControlPointBox } from "../../src/shape/get-shape-control-point-box.js";


test('getShapeControlPointBox', function() {
    {
        const shape = [
            [[0, 0], [10, 0]],
            [[10, 0], [10, 10]],
            [[10, 10], [0, 10]],
            [[0, 10], [0, 0]]
        ];

        const r = getShapeControlPointBox(shape);

        expect(r).toStrictEqual([[0, 0], [10, 10]]);
    }
    {
        // test with a shape that has a control point outside the bounding box of the end points
        const shape = [
            // cubic bezier from (0,0) to (10,0) with control points bulging below
            [[0, 0], [3, -5], [7, -5], [10, 0]],
            // cubic bezier from (10,0) to (10,10) with control points bulging right
            [[10, 0], [15, 3], [15, 7], [10, 10]],
            // cubic bezier from (10,10) to (0,10) with control points bulging above
            [[10, 10], [7, 15], [3, 15], [0, 10]],
            // cubic bezier from (0,10) to (0,0) with control points bulging left
            [[0, 10], [-5, 7], [-5, 3], [0, 0]]
        ];

        const r = getShapeControlPointBox(shape);

        expect(r).toStrictEqual([[-5, -5], [15, 15]]);
    }
});
