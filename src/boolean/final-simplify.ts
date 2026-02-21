// FUTURE

// declare const _debug_: Debug;
// declare const _debug_temp: Debug;
// import type { Debug } from '../debug/debug.js';

// import type { Loop } from "../loop/loop";
// import type { BooleanOptions } from './boolean-options.js';
// import { simplifyPaths } from "../main/simplify-paths";

// // the imports below is used in the test cases - see code below
// import { addDebugInfo2 } from '../main/add-debug-info-2.js';


// /**
//  * Returns the result of doing a final simplifications after the boolean
//  * operation left possible "artefacts".
//  */
// function finalSimpify(
//         options: BooleanOptions = {},
//         maxCoordinate: number,
//         minLoopArea: number,
//         loops: Loop[]) {

//     // Temp switch off _debug_ global ///////////////
//     if (typeof _debug_ !== 'undefined') {
//         (globalThis as any)._debug_temp = _debug_;
//         (globalThis as any)._debug_ = undefined;
//     }
//     /////////////////////////////////////////////////

//     const {
//         orientationPositive = false,
//         keepOriginalOrientation = false,
//     } = options;

//     const paths = loops.map(l => l.beziers);
//     const loopss_ = simplifyPaths(
//         paths,
//         maxCoordinate,
//         {
//             minLoopArea,
//             inclMicroCorners: true,
//             orientationPositive,
//             keepOriginalOrientation,
//         }
//     );

//     // Switch _debug_ global back on ////////////////
//     if (typeof _debug_temp !== 'undefined') {
//         (globalThis as any)._debug_ = _debug_temp;
//         (globalThis as any)._debug_temp = undefined;
//     }
//     /////////////////////////////////////////////////

//     addDebugInfo2(loopss_);

//     return loopss_;

//     //////////////////////////////////////////////////////
//     // const loopss_ = [loops__];
//     //////////////////////////////////////////////////////
// }


// export { finalSimpify }
