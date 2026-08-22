import { test, expect } from '@jest/globals';
import { eps } from 'flo-poly';
import { getPathFromFile } from '../helpers/get-path-from-file.js';
import { getShapeArea$ } from '../../src/shape/get-shape-area.js';
import { getMaxCoordinate } from '../../src/shape/normalize/get-max-coordinate.js';
import { ddGetShapeArea } from '../../src/shape/dd-get-shape-area.js';
import { getTurningNumber } from '../../src/shape/get-turning-number.js';
import { getJordanTurningNumber } from '../../src/shape/get-jordan-turning-number.js';

const { sign } = Math;

test('`getTurningNumber` specific cases', function() {
    testIt('three-squares', [ 1, 1, 1 ]);
    testIt('four-squares', [ 1, 1, 1, 1 ]);
    testIt('complexish', [ -4, -1 ]);
    testIt('confuse1', [ 1, 1 ]);
    testIt('two-squares', [ 1, 1 ]);
    testIt('snuggle-1', [ 1, 1 ]);
    testIt('multi-level-reversed-orientation', [ 1, 2 ]);
    testIt('few-xs-at-min-y', [ -1, -1, 1 ]);
    testIt('multiple-xs-at-min-y', [ -1, -1, -1, 1, 1, 1 ]);
    testIt('woodland2', [ 1, -1 ]);
    testIt('complex6', [ 2 ]);
    testIt('complex4', [ 2 ]);
    testIt('complex3', [ 0 ]);
    testIt('complex2', [ -1 ]);
    testIt('complex', [ 1 ]);
    testIt('koldat-again', [ 0, 1, 1 ]);
    testIt('square', [ 1 ]);
    testIt('B', [ 2, -1 ]);
    testIt('same-k-family-lines', [ 1, -1, -1 ]);
    testIt('holy-poly', [ 1, -1, -1, -1 ]);
    testIt('f', [ 2, 1 ]);
    testIt('split-shape-lines', [ -1, 1 ]);
    testIt('tiny-min-y-loop', [ -0 ]);
    testIt('new1', [ 2 ]);
    testIt('new2', [ 2 ]);
    testIt('bold-b', [ 1 ]);
    testIt('koldat52', [ -0, 1 ]);
    testIt('complexish2', [ 1 ]);
    testIt('complexish3', [ 1, -1 ]);

    function testIt(
            fileName: string,
            expectedTs: number[]) {

        const { bezierLoops } = getPathFromFile(fileName);

        // one exact signed area per loop (loops are not necessarily Jordan
        // curves - see the note in `getShapeArea`)
        const ts = bezierLoops.map(getTurningNumber);

        for (let i=0; i<ts.length; i++) {
            const t = ts[i];

            expect(t).toEqual(expectedTs[i]);
        }
    }
});