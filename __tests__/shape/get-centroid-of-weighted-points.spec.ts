import { test, expect } from '@jest/globals';
import { getCentroidOfWeightedPoints } from "../../src/shape/get-centroid-of-weighted-points.js";


test('getCentroidOfWeightedPoints', () => {
    const ps = [[1, 1], [2, 2], [3, 3]];
    const weights = [1, 1, 2];

    expect(getCentroidOfWeightedPoints(ps, weights)).toEqual([2.25, 2.25]);
});


test('getCentroidOfWeightedPoints - zero total weight returns the origin', () => {
    const ps = [[1, 1], [2, 2]];
    const weights = [0, 0];

    expect(getCentroidOfWeightedPoints(ps, weights)).toEqual([0, 0]);
});
