import * as fs from 'fs';
import { getPathsFromFile } from '../helpers/get-paths-from-file';
import { makeTolerance } from '../helpers/make-tolerance';
import { checkShapes } from '../helpers/check-shapes';
import { boolean, XOR } from '../../src/main/boolean';
import { enableDebugForBooleanOp } from '../../src/debug/debug';


test('`boolean` specific cases', function() {
    // updDebugGlobal(true);  // enable to check invariants

    // testIt('squares', 'squares -> should split correctly');
    updDebugGlobal(true);

    // testIt('one-square-inside-b', '-> should boolean correctly');
    // testIt('koldat52-over-square', '-> should boolean correctly');
    testIt('three-squares', '-> should boolean correctly');

    function testIt(fileName: string, description: string) {
        const { bezierLoopss } = getPathsFromFile(fileName); 

        const loopss = boolean(bezierLoopss, XOR);
        loopss[0]?.length;//?
        // const tolerancePower = -20;
        // const tolerance = makeTolerance(tolerancePower, bezierLoops);
        // expect(
        //     checkShapes(loopss, invariants, tolerance),
        // ).toBe(true);
    }
});


function updDebugGlobal(debugOn: boolean) {
    (globalThis as any)._debug_ = {};

    // enableDebugDrawFs(debugOn);
    enableDebugForBooleanOp(debugOn);

    // console shortcut
    (globalThis as any).d = (globalThis as any)._debug_;
}
