// FUTURE - DON"T DELETE!

// import type { Mutable } from '../types/mutable.js';
// import type { Loop } from '../loop/loop.js';
// import type { InOut } from '../containers/in-out/in-out.js';
// import type { BooleanOptions } from './boolean-options.js';
// import { completePath } from '../calc-paths/complete-path.js';
// import { getTightestContainingLoop } from '../calc-paths/get-tightest-containing-loop.js';
// import { orderLoopAscendingByMinY } from '../calc-paths/order-loop-ascending-by-min-y.js';
// import { getContainers } from '../containers/get-containers.js';
// import { getOutermostInAndOut } from '../calc-paths/get-outermost-in-and-out.js';
// import { loopFromBeziers } from '../loop/loop-from-beziers.js';
// import { normalizeLoops } from '../loop/normalize/normalize-loop.js';
// import { getMaxCoordinate } from '../loop/normalize/get-max-coordinate.js';
// import { getShapeArea } from '../loop/get-loop-area.js';
// import { getAllLoopsFromTree } from '../main/get-all-loops-from-tree.js';
// import { reverseBezierPieces } from '../main/reverse-bezier-pieces.js';
// import { createRootInOut } from '../main/create-root-in-out.js';
// import { loopFromOut } from '../main/loop-from-out.js';
// import { MAX_BIT_LENGTH } from '../main/max-bitlength.js';
// import { simplifyAndFlattenLoopss } from './simplify-and-flatten-bezier-loopss.js';
// import { finalSimpify } from './final-simplify.js';
// import { bezierToBezierPiece } from '../calc-paths/bezier-to-bezier-piece.js';
// import { getWindingNumber } from '../loop/get-winding-number.js';
// import { reverseShapeOrientation } from '../loop/reverse-shape-orientation.js';


// /**
//  * Returns the resulting bezier loops after performing a boolean operation on
//  * the input loops.
//  * 
//  * * uses an algorithm similirar to that of Lavanya Subramaniam: PARTITION OF A
//  * NON-SIMPLE POLYGON INTO SIMPLE POLYGONS (see `simplifyPaths`); 
//  * 
//  * @param bezierLoopss_ an array of possibly intersecting loops
//  * @param booleanOperator defaults to `AND`; the boolean operator to
//  * use (AND, OR or XOR) or a custom function can be used
//  * @param options options
//  */
// function boolean(
//         bezierLoopss: number[][][][][],
//         booleanOperator: (bits: boolean[]) => boolean,
//         options: BooleanOptions = {}): Loop[][] {

//     // bezierLoopss = bezierLoopss.map(bezierLoops => bezierLoops.map(reverseShapeOrientation));  // For quick testing
//     const maxCoordinate = Math.max(...bezierLoopss.map(getMaxCoordinate));
//     /** The exponent, e, such that 2**e >= all bezier coordinate points. */
//     const expMax = Math.ceil(Math.log2(maxCoordinate));

//     const {
//         minLoopArea = (2**expMax * 2**(-12))**2,
//         keepOriginalOrientation = false,
//     } = options;

//     const gridSpacing = 2**expMax * 2**(-MAX_BIT_LENGTH);

//     /** 
//      * A size (based on the max value of the tangent) for the containers holding 
//      * critical points.
//      */
//     // const containerSizeMultiplier = 2**5;
//     const containerSizeMultiplier = 2**5;
//     const containerDim = gridSpacing * containerSizeMultiplier;

//     const bezierLoopss_ = bezierLoopss.map(bezierLoops => normalizeLoops(
//         bezierLoops, MAX_BIT_LENGTH, expMax,
//         false, true,
//     ));

//     const loopsCount = bezierLoopss_.length;
//     // bezierLoopss.map(ls => ls.map(getWindingNumber));//?

//     const bezierLoops = simplifyAndFlattenLoopss(maxCoordinate, minLoopArea, bezierLoopss);

//     bezierLoops.sort(orderLoopAscendingByMinY);

//     // @ts-ignore
//     const loops = bezierLoops.map(beziers => loopFromBeziers(beziers, beziers.loopsIdx));
//     const { extremes } = getContainers(loops, containerDim, expMax);

//     const root = createRootInOut();
//     // `takenLoops` is important in rare cases such as in the 'koldat52' vector
//     const takenLoops: Set<Loop> = new Set();
//     const takenInOuts: Set<InOut> = new Set();  // Taken intersections

//     for (let i=0; i<loops.length; i++) {
//         const loop = loops[i];

//         if (takenLoops.has(loop)) {
//             continue;
//         }

//         takenLoops.add(loop);

//         const parent = getTightestContainingLoop(root, loop);

//         const container = extremes.get(loop)![0].container!;
//         if (container.inOuts.length === 0) {
//             continue;
//         }

//         const initialOut = getOutermostInAndOut(container, parent, loop);

//         //---------------------------------------------------
//         // short-circuit `completePath` for Jordan curves
//         //---------------------------------------------------
//         if (container.inOuts.length === 2 &&
//             container.inOuts[0].nextOrPrev === container.inOuts[1]) {

//             (initialOut as Mutable<InOut>).bezierPieces = loop.beziers.map(bezierToBezierPiece);
//             (initialOut.parent! as Mutable<InOut>).children = initialOut.parent!.children! || new Set();
//             initialOut.parent!.children!.add(initialOut);
//             continue;
//         }

//         completePath(
//             initialOut,
//             takenLoops,
//             takenInOuts,
//             true,  // take the tightest loop around
//         );
//     }

//     const outSet = getAllLoopsFromTree(root);
//     // outSet.map(os => ({ dir: os.dir, idx: os.idx  }));//?
//     // outSet.map(inOut => [inOut.idx, inOut.loopsIdxs]);//?

//     const inOuts = outSet.map(inOut => {
//         const { loopsIdxs } = inOut;
//         if (loopsIdxs === undefined || loopsIdxs.size === 0) { return undefined; }

//         const bits = new Array(loopsCount).fill(0).map(
//             (_,idx) => loopsIdxs.has(idx)
//         );
//         const include = booleanOperator(bits);

//         const parent = inOut.parent!;

//         if (!include) {
//             if (inOut.orientation === 1 &&
//                 parent.orientation === 1) {

//                 const parentBits = new Array(loopsCount).fill(0).map(
//                     (_,idx) => parent.loopsIdxs!.has(idx)
//                 );
//                 const includeParent = booleanOperator(parentBits);//?

//                 if (includeParent) {
//                     return {
//                         ...inOut,
//                         orientation: -1,
//                         // must make a hole so reverse
//                         bezierPieces: reverseBezierPieces(inOut.bezierPieces!)
//                     };
//                 }
//             }
//             if (inOut.orientation === -1 &&
//                 parent.parent?.orientation === 1) {

//                 // `parent.parent` cannot be the root at this point
//                 const parentParentBits = new Array(loopsCount).fill(0).map(
//                     (_,idx) => parent.parent!.loopsIdxs!.has(idx)
//                 );
//                 const includeParentParent = booleanOperator(parentParentBits);

//                 if (includeParentParent) {
//                     return {
//                         ...inOut,
//                         orientation: +1,
//                         // must make a hole so reverse
//                         // bezierPieces: reverseShapeOrientation(inOut.bezierPieces!)
//                         bezierPieces: reverseBezierPieces(inOut.bezierPieces!)
//                     };
//                 }
//             }
//         }

//         return include ? inOut : undefined;
//     })
//     .filter(v => v !== undefined);

//     const loops_ = inOuts.map((out,idx) => {
//         // `outSet[0].orientation` === 1 always at this stage
//         return loopFromOut(out, outSet[0].orientation!, keepOriginalOrientation, idx);
//     });

//     /** loops after splitting all */
//     const loops__ = loops_.filter(
//         (loop: Loop) => Math.abs(getShapeArea(loop.beziers)) > minLoopArea
//     );

//     const loopss_ = finalSimpify(options, maxCoordinate, minLoopArea, loops__);

//     return loopss_;
// }


// export { boolean }
