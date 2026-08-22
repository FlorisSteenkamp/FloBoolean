import { test, expect } from '@jest/globals';
import { getPathFromFile } from '../helpers/get-path-from-file.js';
import { getJordanTurningNumber } from '../../src/shape/get-jordan-turning-number.js';
import { getTurningNumber } from '../../src/shape/get-turning-number.js';
// import { shapeSelfIntersections } from '../../src/shape/shape-self-intersections.js';

const { sign } = Math;

test('`getJordanTurningNumber` specific cases', function() {
    testIt('three-squares', [1, 1, 1]);
    testIt('four-squares', [1, 1, 1, 1]);
    testIt('confuse1', [1, 1]);
    testIt('two-squares', [1, 1]);
    testIt('snuggle-1', [1, 1]);
    testIt('few-xs-at-min-y', [-1, -1, 1]);
    testIt('multiple-xs-at-min-y', [-1, -1, -1, 1, 1, 1]);
    testIt('woodland2', [1, -1]);
    testIt('square', [1]);
    testIt('holy-poly', [1, -1, -1, -1]);
    testIt('split-shape-lines', [-1, 1]);

    function testIt(
            fileName: string,
            expectedJTs: number[]) {

        const { bezierLoops } = getPathFromFile(fileName);

        // const hasXs = bezierLoops
        //     .map(shapeSelfIntersections)
        //     .map(xs => xs.xs.length === 0 && xs.selfXs.length === 0)
        //     .some(v => v === false);

        const ts = bezierLoops.map(getTurningNumber);
        const jts = bezierLoops.map(getJordanTurningNumber);

        for (let i=0; i<ts.length; i++) {
            const t = ts[i];
            const jt = jts[i];

            expect(jt).toEqual(t);  // must match for Jordan curves
            expect(jt).toEqual(expectedJTs[i]);
        }
    }
});