import { test, expect } from '@jest/globals';
import { ddGetShapeArea, getShapeArea } from "../src/shape/get-shape-area.js";


test('getShapeArea', function() {
    {
        const pss = [
            [[0, 0], [10, 0]],
            [[10, 0], [10, 10]],
            [[10, 10], [0, 10]],
            [[0, 10], [0, 0]]
        ];

        expect(getShapeArea(pss)).toStrictEqual(100);
        expect(ddGetShapeArea(pss)).toStrictEqual([0,100]);
    }
});
