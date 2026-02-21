// FUTURE

// declare const _debug_: Debug;
// declare const _debug_temp: Debug;
// import type { Debug } from '../debug/debug.js';

// import { simplifyPaths } from "../main/simplify-paths.js";

// // the imports below is used in the test cases - see code below
// import { addDebugInfo1 } from '../main/add-debug-info-1.js';


// /**
//  * Returns an array of bezier loops from the given array of of array of bezier
//  * loops by:
//  * * simplifying (splitting) the loops so no curves overlap
//  * * flattening and numbering (indexing) the returned loops to be used for the
//  * boolean operation
//  * 
//  * Used as a first step in boolean operations
//  * 
//  * @param maxCoordinate 
//  * @param minLoopArea 
//  * @param bezierLoopss 
//  */
// function simplifyAndFlattenLoopss(
//         maxCoordinate: number,
//         minLoopArea: number,
//         bezierLoopss: (number[][])[][][]) {

//     // Temp switch off _debug_ global ///////////////
//     if (typeof _debug_ !== 'undefined') {
//         (globalThis as any)._debug_temp = _debug_;
//         (globalThis as any)._debug_ = undefined;
//     }
//     /////////////////////////////////////////////////

//     const bezierLoops: (number[][])[][] = [];
//     for (let i=0; i<bezierLoopss.length; i++) {
//         const __simpLoops = bezierLoopss[i];

//         /** Each `_simpLoops` represents an independent shape (possibly with holes) */
//         const _simpLoops = simplifyPaths(__simpLoops, maxCoordinate, {
//             minLoopArea,
//             inclMicroCorners: true,
//             orientationPositive: true
//         });

//         const simpLoops = _simpLoops.flat().map(v => v.beziers);
        
//         for (let j=0; j<simpLoops.length; j++) {
//             const simpLoop = simpLoops[j];
//             // @ts-ignore
//             simpLoop.loopsIdx = i;
//             bezierLoops.push(simpLoop);
//         }
//     }

//     // Switch _debug_ global back on ////////////////
//     if (typeof _debug_temp !== 'undefined') {
//         (globalThis as any)._debug_ = _debug_temp;
//         (globalThis as any)._debug_temp = undefined;
//     }
//     /////////////////////////////////////////////////

//     addDebugInfo1(bezierLoops);

//     return bezierLoops;

//     //////////////////////////////////////////////////////
//     // const bezierLoops = bezierLoopss.flat(1);
//     // for (let i=0; i<bezierLoops.length; i++) {
//     //     if (i === 1) {
//     //         bezierLoops[i] = reverseShapeOrientation(bezierLoops[i]);
//     //     }
//     //     // @ts-ignore
//     //     bezierLoops[i].loopsIdx = i;
//     // }
//     //////////////////////////////////////////////////////
// }


// export { simplifyAndFlattenLoopss }
