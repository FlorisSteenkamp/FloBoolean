import { test, expect } from '@jest/globals';
// FUTURE
test.skip('dummy test to silence error', () => {});

// import { getPathsFromFile } from '../helpers/get-paths-from-file';
// import { boolean } from '../../src/boolean/boolean';
// import { OR } from '../../src/boolean/ops';
// import { enableDebugForBooleanOp } from '../../src/debug/debug';


// test('`boolean` specific cases', function() {
//     // updDebugGlobal(true);  // enable to check invariants

//     // testIt('squares', 'squares -> should split correctly');
//     updDebugGlobal(true);

//     // testIt('one-square-inside-b', '-> should boolean correctly');
//     // testIt('koldat52-over-square', '-> should boolean correctly');
//     // testIt('three-squares', '-> should boolean correctly');
//     // testIt('two-simple', '-> should boolean correctly');
//     testIt('lamina', 'lamina -> should boolean correctly');

//     function testIt(fileName: string, description: string) {
//         const { bezierLoopss } = getPathsFromFile(fileName);
//         bezierLoopss;//?

//         const loopss = boolean(bezierLoopss, OR);
//         loopss;//?
//         loopss[0].length;//?
//         loopss[0][0].beziers;//?
//         loopss[0][0].beziers.map(ps => ps.map(p => p.map(c => Math.round(c))));//?

//         // FUTURE
//         // const tolerancePower = -20;
//         // const tolerance = makeTolerance(tolerancePower, bezierLoops);
//         // expect(
//         //     checkShapes(loopss, invariants, tolerance),
//         // ).toBe(true);
//     }
// });


// function updDebugGlobal(debugOn: boolean) {
//     (globalThis as any)._debug_ = {};

//     // enableDebugDrawFs(debugOn);
//     enableDebugForBooleanOp(debugOn);

//     // console shortcut
//     (globalThis as any).d = (globalThis as any)._debug_;
// }
