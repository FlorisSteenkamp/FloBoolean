import { test, expect } from '@jest/globals';
import { getShapeCentroid, ddGetShapeCentroid } from "../../src/shape/get-shape-centroid.js";


test('getShapeCentroid', function() {
    const pss = [
        [[0, -236.73825503355692], [16, 42.261744966443075]],
        [[16, 42.261744966443075], [16, 126.26174496644308]],
        [[16, 126.26174496644308], [-16, 126.26174496644308]],
        [[-16, 126.26174496644308], [-16, 42.261744966443075]],
        [[-16, 42.261744966443075], [0, -236.73825503355692]]
    ];

    // this symmetric shape has its centroid at the origin
    {
        const [cx, cy] = getShapeCentroid(pss);

        expect(cx).toBe(0);
        expect(cy).toBeCloseTo(0, 10);
    }

    {
        const [[cxHi], [cyHi]] = ddGetShapeCentroid(pss);

        expect(cxHi).toBe(0);
        expect(cyHi).toBeCloseTo(0, 10);
    }
});
