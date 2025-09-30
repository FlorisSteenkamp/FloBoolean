import { completePath } from '../calc-paths/complete-path.js';
import { getTightestContainingLoop } from '../calc-paths/get-tightest-containing-loop.js';
import { orderLoopAscendingByMinY } from '../calc-paths/order-loop-ascending-by-min-y.js';
import { getContainers } from '../containers/get-containers.js';
import { getOutermostInAndOut } from '../calc-paths/get-outermost-in-and-out.js';
import { loopFromBeziers } from '../loop/loop-from-beziers.js';
import { normalizeLoops } from '../loop/normalize/normalize-loop.js';
import { getMaxCoordinate } from '../loop/normalize/get-max-coordinate.js';
import { getShapeArea } from '../loop/get-loop-area.js';
import { getAllLoopsFromTree } from './get-all-loops-from-tree.js';
import { reverseBezierPieces } from './reverse-bezier-pieces.js';
import { simplifyPaths } from './simplify-paths.js';
import { createRootInOut } from './create-root-in-out.js';
import { loopFromOut } from './loop-from-out.js';
import { addDebugInfo1 } from './add-debug-info-1.js';
import { addDebugInfo2 } from './add-debug-info-2.js';
import { bezierToBezierPiece } from '../calc-paths/bezier-to-bezier-piece.js';
function AND(bits) {
    return (bits.every(v => v));
}
function OR(bits) {
    return (bits.includes(true));
}
/**
 * * for multiple inputs, XOR is typically defined such that the output is `true`
 * if an odd number of inputs are `true`, and `false` if an even number of inputs are `true`.
 *
 * @param bits
 */
function XOR(bits) {
    return bits.filter(v => v).length % 2 === 1;
}
/**
 * Returns the resulting bezier loops after performing a boolean operation on
 * the input loops.
 *
 * * uses an algorithm similirar to that of Lavanya Subramaniam: PARTITION OF A
 * NON-SIMPLE POLYGON INTO SIMPLE POLYGONS (see `simplifyPaths`);
 *
 * @param bezierLoopss an array of possibly intersecting loops
 * @param booleanOperator defaults to `AND`; the boolean operator to
 * use (AND, OR or XOR) or a custom function can be used
 * @param options options
 */
function boolean(bezierLoopss, booleanOperator, options = {}) {
    if (typeof _debug_ !== 'undefined') {
        globalThis._debug_temp = _debug_;
        globalThis._debug_ = undefined;
    }
    // bezierLoopss = bezierLoopss.map(bezierLoops => bezierLoops.map(reverseShapeOrientation));  // For quick testing
    const maxCoordinate = Math.max(...bezierLoopss.map(getMaxCoordinate));
    /** The exponent, e, such that 2**e >= all bezier coordinate points. */
    const expMax = Math.ceil(Math.log2(maxCoordinate));
    const maxBitLength = 46;
    const { minLoopArea = (2 ** expMax * 2 ** (-12)) ** 2 } = options;
    const gridSpacing = 2 ** expMax * 2 ** (-maxBitLength);
    /**
     * A size (based on the max value of the tangent) for the containers holding
     * critical points.
     */
    const containerSizeMultiplier = 2 ** 5;
    // const containerSizeMultiplier = 2**41;
    const containerDim = gridSpacing * containerSizeMultiplier;
    bezierLoopss = bezierLoopss.map(bezierLoops => normalizeLoops(bezierLoops, maxBitLength, expMax, false, true));
    const bezierLoops = [];
    for (let i = 0; i < bezierLoopss.length; i++) {
        const __simpLoops = bezierLoopss[i];
        /** Each `_simpLoops` represents an independent shape (possibly with holes) */
        const _simpLoops = simplifyPaths(__simpLoops, maxCoordinate, {
            maxBitLength, minLoopArea, inclMicroCorners: true, orientationPositive: true
        });
        const simpLoops = _simpLoops.flat().map(v => v.beziers);
        for (let j = 0; j < simpLoops.length; j++) {
            const simpLoop = simpLoops[j];
            // @ts-ignore
            simpLoop.loopsIdx = i;
            bezierLoops.push(simpLoop);
        }
    }
    // console.log(bezierLoops);
    if (typeof _debug_temp !== 'undefined') {
        globalThis._debug_ = _debug_temp;
        globalThis._debug_temp = undefined;
    }
    addDebugInfo1(bezierLoops);
    bezierLoops.sort(orderLoopAscendingByMinY);
    // @ts-ignore
    const loops = bezierLoops.map(beziers => loopFromBeziers(beziers, beziers.loopsIdx));
    const { extremes } = getContainers(loops, containerDim, expMax);
    const root = createRootInOut();
    // `takenLoops` is important in rare cases such as in the 'koldat52' vector
    const takenLoops = new Set();
    const takenInOuts = new Set(); // Taken intersections
    for (let i = 0; i < loops.length; i++) {
        const loop = loops[i];
        if (takenLoops.has(loop)) {
            continue;
        }
        takenLoops.add(loop);
        const parent = getTightestContainingLoop(root, loop);
        const container = extremes.get(loop)[0].container;
        if (container.inOuts.length === 0) {
            continue;
        }
        const initialOut = getOutermostInAndOut(container, parent, loop);
        //---------------------------------------------------
        // short-circuit `completePath` for Jordan curves
        //---------------------------------------------------
        if (container.inOuts.length === 2 &&
            container.inOuts[0].nextOrPrev === container.inOuts[1]) {
            initialOut.bezierPieces = loop.beziers.map(bezierToBezierPiece);
            initialOut.parent.children = initialOut.parent.children || new Set();
            initialOut.parent.children.add(initialOut);
            continue;
        }
        completePath(initialOut, takenLoops, takenInOuts, true);
    }
    const outSet = getAllLoopsFromTree(root);
    const inOuts = outSet.map(inOut => {
        const { loopsIdxs } = inOut;
        if (loopsIdxs === undefined || loopsIdxs.size === 0) {
            return undefined;
        }
        const bits = new Array(bezierLoopss.length).fill(0).map((_, idx) => loopsIdxs.has(idx));
        const include = booleanOperator(bits);
        const parent = inOut.parent;
        if (!include) {
            if (inOut.orientation === 1 &&
                parent.orientation === 1) {
                const parentBits = new Array(bezierLoopss.length).fill(0).map((_, idx) => parent.loopsIdxs.has(idx));
                const includeParent = booleanOperator(parentBits); //?
                if (includeParent) {
                    return {
                        ...inOut,
                        orientation: -1,
                        // must make a hole so reverse
                        bezierPieces: reverseBezierPieces(inOut.bezierPieces)
                    };
                }
            }
            if (inOut.orientation === -1 &&
                parent.parent.orientation === 1) {
                // `parent.parent` cannot be the root at this point
                const parentParentBits = new Array(bezierLoopss.length).fill(0).map((_, idx) => parent.parent.loopsIdxs.has(idx));
                const includeParentParent = booleanOperator(parentParentBits);
                if (includeParentParent) {
                    return {
                        ...inOut,
                        orientation: +1,
                        // must make a hole so reverse
                        // bezierPieces: reverseShapeOrientation(inOut.bezierPieces!)
                        bezierPieces: reverseBezierPieces(inOut.bezierPieces)
                    };
                }
            }
        }
        return include ? inOut : undefined;
    })
        .filter(v => v !== undefined);
    const loops_ = inOuts.map((out, idx) => {
        // `outSet[0].orientation` === 1 always at this stage
        return loopFromOut(out, outSet[0].orientation, idx);
    });
    /** loops after splitting all */
    const loops__ = loops_.filter((loop) => Math.abs(getShapeArea(loop.beziers)) > minLoopArea);
    if (typeof _debug_ !== 'undefined') {
        globalThis._debug_temp = _debug_;
        globalThis._debug_ = undefined;
    }
    const paths = loops__.map(l => l.beziers);
    const loopss_ = simplifyPaths(paths, maxCoordinate, { inclMicroCorners: true, orientationPositive: true });
    if (typeof _debug_temp !== 'undefined') {
        globalThis._debug_ = _debug_temp;
        globalThis._debug_temp = undefined;
    }
    addDebugInfo2(loopss_);
    // console.log(loopss_.map(loops => loops.map(l => l.beziers)));
    return loopss_;
}
export { boolean, OR, AND, XOR };
//# sourceMappingURL=boolean.js.map