import * as fs from 'fs';
import { getPathFromFile } from '../helpers/get-path-from-file';
import { Invariants } from '../helpers/invariants';
import { makeTolerance } from '../helpers/make-tolerance';
import { checkShapes } from '../helpers/check-shapes';
import { simplifyPaths } from '../../src/main/simplify-paths';
import { enableDebugDrawFs } from 'flo-draw';
import { enableDebugForBooleanOp } from '../../src/debug/debug';


test('specific cases', function() {
    // updDebugGlobal(true);  // enable to check invariants

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

    // TODO - add complexish2 and 3 invariants
    // testIt('complexish2', 'somewhat complex shape -> should decompose correctly');
    // testIt('complexish3', 'somewhat complex shape -> should decompose correctly');

    function testIt(fileName: string, description: string) {
        const { bezierLoops, invariants } = getPathFromFile(fileName); 

        const loopss = simplifyPaths(bezierLoops);
        const tolerancePower = -20;
        const tolerance = makeTolerance(tolerancePower, bezierLoops);
        expect(
            checkShapes(loopss, invariants, tolerance),
        ).toBe(true);
    }
});


function updDebugGlobal(debugOn: boolean) {
    (globalThis as any)._debug_ = {};

    // enableDebugDrawFs(debugOn);
    enableDebugForBooleanOp(debugOn);

    // console shortcut
    (globalThis as any).d = (globalThis as any)._debug_;
}
