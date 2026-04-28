import { test, expect } from '@jest/globals';
import { getPathFromFile } from '../helpers/get-path-from-file.js';
import { makeTolerance } from '../helpers/make-tolerance.js';
import { checkShapes } from '../helpers/check-shapes.js';
import { simplifyPaths } from '../../src/main/simplify-paths.js';
import { enableDebugForBooleanOp } from '../../src/debug/debug.js';
import { getPathsFromStr } from '../../src/svg/get-paths-from-str.js';
import { boolean } from '../../src/boolean/boolean.js';


test('`simplifyPaths` specific cases', function() {
    // updDebugGlobal(true);  // enable to check invariants

    // testIt('koldat56', 'should decompose correctly', true);

    testIt('three-squares', 'three-squares -> should boolean correctly');
    testIt('square', 'simple square -> should decompose correctly (no decompisition)');
    testIt('few-xs-at-min-y', 'multiple intersections at minimum y value -> should decompose correctly');
    testIt('multiple-xs-at-min-y', 'multiple intersections at minimum y value -> should decompose correctly');
    testIt('complexish', 'somewhat complex shape -> should decompose correctly');
    testIt('B', 'B shape with quad beziers -> should decompose correctly');
    testIt('same-k-family-lines', 'shape with overlapping beziers (lines) in same k family -> should decompose correctly');
    testIt('multi-level-reversed-orientation', 'shape with multiple levels of both way oriented loops -> should decompose correctly');
    testIt('holy-poly', 'polygon with 3 simple holes -> should decompose correctly');
    testIt('f', 'f shape with interface intersections -> should decompose correctly');
    testIt('split-shape-lines', 'split two shapes into two different shapes -> should decompose correctly');
    testIt('tiny-min-y-loop', 'tiny loop at minimum y -> should decompose correctly');
    testIt('complex', 'complex shape -> should decompose correctly');
    testIt('new1', 'edge case -> should decompose correctly');
    testIt('new2', 'edge case that caused same bug as bold-b -> should decompose correctly');
    testIt('bold-b', 'edge case that caused bug -> should decompose correctly');
    testIt('koldat51', 'koldat51 -> edge case test');
    testIt('koldat52', 'koldat52 -> edge case test where `takenLoops` is important to be kept');
    testIt('complexish2', 'complexish2 -> should decompose correctly');
    testIt('complexish3', 'complexish3 -> should decompose correctly');
    testIt('snuggle-1', 'snuggle-1 -> should decompose correctly (and snuggly)');

    function testIt(fileName: string, description: string, skipInvariantsCheck = false) {
        const { bezierLoops, invariants } = getPathFromFile(fileName, skipInvariantsCheck); 

        // for (const op of ['OR','AND','XOR']) {
        for (const op of ['OR']) {
            const op_ = op as 'OR' | 'AND' | 'XOR';
            const loopss = simplifyPaths(bezierLoops, undefined, {
                booleanOp: op_, inclMicroCorners: false
            });

            if (skipInvariantsCheck || op_ !== 'OR') {
                return;
            }

            const tolerancePower = -20;
            const tolerance = makeTolerance(tolerancePower, bezierLoops);
            expect(
                checkShapes(loopss, invariants, tolerance),
            ).toBe(true);
        }
    }
});


// test('test for readme - simplifyPaths', function() {
//     // import { getPathsFromStr, simplifyPaths, boolean, OR, AND, XOR, Loop } from 'flo-boolean';

//     const svgPathStr = `
//         M 0 0
//         C 100 50   200 60  300 2
//         C 200 -50  100 -70 0 0
//         Z

//         M 125 25
//         L 175 25
//         L 175 55
//         L 125 55
//         Z`;

//     const paths = getPathsFromStr(svgPathStr);
//     // `paths` now consists of two 'bezier loops', i.e.
//     // `paths === [
//     //   [
//     //     [ [ 0, 0 ], [ 100, 50 ], [ 200, 60 ], [ 300, 2 ] ],
//     //     [ [ 300, 2 ], [ 200, -50 ], [ 100, -70 ], [ 0, 0 ] ],
//     //     [ [ 0, 0 ], [ 0, 0 ] ]
//     //   ],
//     //   [
//     //     [ [ 125, 25 ], [ 175, 25 ] ],
//     //     [ [ 175, 25 ], [ 175, 55 ] ],
//     //     [ [ 175, 55 ], [ 125, 55 ] ],
//     //     [ [ 125, 55 ], [ 125, 25 ] ]
//     //   ]
//     // ]`

//     const r = simplifyPaths(paths, undefined, { inclMicroCorners: false });

//     // Now `r` consist of 2 sets of loops, each set containing a single loop (see fig. below)
//     r[0][0].beziers;  //=> `[ [[300, 2], [200, -50], ...`
//     r[1][0].beziers;  //=>  [ [[174.99999999999994, 41.108796296296305], ...`
// });


function updDebugGlobal(debugOn: boolean) {
    (globalThis as any)._debug_ = {};

    // enableDebugDrawFs(debugOn);
    enableDebugForBooleanOp(debugOn);

    // console shortcut
    (globalThis as any).d = (globalThis as any)._debug_;
}
