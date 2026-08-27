declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { Mutable } from '../../utils/mutable.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { In, Out } from '../../containers/in-out/in-out.js';
import type { Container } from '../../containers/container.js';
import type { Loop } from '../../shape/loop.js';
import type { BezierPiece } from 'flo-bezier3';
import { splitLoopTrees } from '../../calc-paths/split-loop-trees.js';
import { getLoopsFromTree } from '../../calc-paths/get-loops-from-tree.js';
import { loopFromOut } from '../loop-from-out.js';
import { createRootInOut } from '../create-root-in-out.js';
import { getOutermostOut } from '../../calc-paths/get-outermost-in-and-out.js';
import { getTightestContainingLoop } from '../../calc-paths/get-tightest-containing-loop.js';
import { containerHasMinY } from '../../containers/container-has-min-y.js';
import { setNextAndPrevAround } from '../../containers/set-next-and-prev-around.js';
import { map } from '../../utils/map.js';
import { compareInOut } from '../../containers/get-container-in-outs/get-in-outs-via-sides/compare-in-out.js';
import { pathToStr } from '../../debug/path-to-str.js';
import { getOrCreateRerunContainer } from './get-or-creatre-rerun-container.js';
import { rebuildInOut } from './rebuild-in-out.js';


function rerun(
        expMax: number,
        outSets: {
            out: Out;
            depth: number;
            windingNum: number;
            parentWinding: number;
        }[][],
        containers: Container[]) {

    if (typeof _debug_ !== 'undefined') { _debug_.elems.container.length = 0; }

    containers.forEach((container, idx) => (container as Mutable<Container>).idx = idx);

    const loopsss_: BezierPiece[][][][] = [];

    /** a sparse container array */ 
    const containers_: Container[] = [];
    const minYContainers: Container[] = [];

    for (const outSet of outSets) {  // an outer loop with holes
        // Orientation the outer loop already has; holes must alternate against it.
        const outerOrientation = Math.sign(outSet[0].windingNum - outSet[0].parentWinding);

        const paths: Out[][] = [];  // TODO For debug only
        for (const { out, depth, windingNum, parentWinding } of outSet) {
            // A hole must wind opposite to its parent (islands opposite to holes,
            // ...); only reverse a loop whose current orientation doesn't already
            // match that depth alternation.
            const orientation = Math.sign(windingNum - parentWinding);
            const desiredOrientation = depth % 2 === 0 ? outerOrientation : -outerOrientation;
            const isReversed = orientation !== desiredOrientation;
            const path = isReversed ? out.path.toReversed() : out.path;
            paths.push(path);  // TODO For debug only

            let isFirstContainer = true;
            for (const inOut of path) {
                const { twin } = inOut;
                const dir_ = inOut.dir * (isReversed ? -1 : 1) as -1|1;

                const inOut_ = rebuildInOut(inOut, dir_, isReversed);
                const twin_ = rebuildInOut(twin, -dir_ as -1|1, isReversed);
                inOut_.twin = twin_;
                twin_.twin = inOut_;

                const container1 = getOrCreateRerunContainer(containers_, inOut._x_.container);
                container1.inOuts.push(inOut_ as unknown as In|Out)
                const container2 = getOrCreateRerunContainer(containers_, twin._x_.container);
                container2.inOuts.push(twin_ as unknown as In|Out);

                if (isFirstContainer) {
                    minYContainers.push(container1);
                    isFirstContainer = false;
                }
            }

            // minYContainers.push(out._x_.container)
        }
    }

    containers_.forEach((container_, idx) => {
        if (container_.inOuts.length > 2 ||
            containerHasMinY(container_)
        ) {
            container_.inOuts.sort(compareInOut);
        }
    });

    // containers_.forEach((container_, idx) => {
    //     if (containerHasMinY(container_)) {
    //         minYContainers.push(container_);
    //     }
    // });
    

    console.log(minYContainers)

    containers_.forEach(container_ => setNextAndPrevAround(container_.inOuts));

    if (typeof _debug_ !== 'undefined') { _debug_.elems.container.push(...containers_.filter(c => c !== undefined)); }

    //--------------------------------------------------------------------------
    // Do the actual run on the new containers using OR
    //--------------------------------------------------------------------------
    const root = completePaths(expMax, minYContainers);

    const outs = splitLoopTrees(root);

    const outSets_ = outs
        .map(getLoopsFromTree('OR'))
        .filter(v => v.length !== 0);

    // the paths taken after the rerun
    map(outSets_, outSet => map(outSet, ({ out, depth }) => {
        console.log('POST: d=' + depth + ' ' + pathToStr(out.path))
    }));
    // console.log('POST shapes in this outSet group: ' + outSets_.length + ' (from ' + outSet.length + ' input loops)');

    //----------------------------------------
    // Create loops for all `outSets`
    //----------------------------------------
    const loopss_ = outSets_.map(outSet => {
        const outerLoopOrientation = outSet[0].out.orientation;

        return outSet.map(({ out, depth }) => {
            return loopFromOut(out, outerLoopOrientation, depth);
        });
    });

    loopsss_.push(loopss_);

    return loopsss_.flat();
}


function completePaths(
        expMax: number,
        minYContainers: Container[]) {

    const root = createRootInOut();
    // `takenLoops` is important in cases such as in the 'koldat52' vector
    const takenLoops: Set<Loop> = new Set();
    const takenOuts: Set<Out> = new Set();  // Taken intersections

    for (let i=0; i<minYContainers.length; i++) {
        const container = minYContainers[i];
        const { loop } = container.xs[0].x.curve;

        if (takenLoops.has(loop)) { continue; }
        takenLoops.add(loop);

        const parent = getTightestContainingLoop(expMax, root, loop);
        // const parent = root;

        const initialOut = getOutermostOut(container, parent);

        completePath(
            initialOut,
            takenLoops,
            takenOuts
        );
    }

    return root;
}


/**
 * Completes the path of a disjoint set of loops, i.e. this function is called 
 * for each disjoint set of paths.
 * 
 * @param intersections 
 * @param takenLoops 
 * @param parent 
 * @param loop 
 */
function completePath(
        initialOut: Out,
        takenLoops: Set<Loop>,
        takenOuts: Set<Out>): void {

    const outStack: Out[] = [initialOut];

    // A given Out (directed edge) belongs to exactly one output-boundary loop.
    // A merged (over-large) container can, however, cause the same region to be
    // traced twice: a short-circuited loop and a fuller loop that detours through
    // the merge, sharing the same Out objects. The first loop emitted for a set of
    // Outs is the one designated by the enclosing trace (with correct parent /
    // winding); any later loop that overlaps it is a redundant duplicate and is
    // dropped, leaving the winding tree untouched.
    const takenByLoop = new Set<Out>();

    while (outStack.length) {
        const origOut = outStack.pop()! as Mutable<Out>;
        takenLoops.add(origOut._x_.x.curve.loop);

        if (takenOuts.has(origOut)) { continue; }

        origOut.children = new Set();
        const { path, additionalOutsToCheck, loopOuts } = 
            completeLoop(takenOuts, takenLoops, origOut);

        // If this loop shares any `Out` with an already-emitted loop it is a
        // duplicate of that region - discard it (do not emit, do not spawn its
        // children).
        if (loopOuts.some(o => takenByLoop.has(o))) {
            continue;
        }
        for (const o of loopOuts) { takenByLoop.add(o); }

        origOut.path = path;

        (origOut.parent as Mutable<Out>).children = origOut.parent.children || new Set();
        origOut.parent.children.add(origOut);

        outStack.push(...additionalOutsToCheck);
    }
}


/** 
 * Completes a loop for a specific intersection point entry curve.
 * 
 * @param expMax
 * @param takenOuts
 * @param origOut
 */
function completeLoop(
        takenOuts: Set<Out>,
        takenLoops: Set<Loop>,
        origOut: Out): {
            path: Out[],
            additionalOutsToCheck: Out[],
            loopOuts: Out[]
        } {

    const additionalOutsToCheck: Out[] = [];
    const path: Out[] = [];
    const loopOuts: Out[] = [];

    // Move immediately to the outgoing start of the loop
    let outToUse: Out = origOut;

    const getNextExit_ = getNextExit(
        origOut, additionalOutsToCheck, takenOuts
    );

    do {
        takenOuts.add(outToUse);
        loopOuts.push(outToUse);

        // Every curve threaded through this loop belongs to this component, so
        // mark its loop as taken to prevent it being re-processed as a separate
        // outermost loop (which would reset already-built child nesting).
        takenLoops.add(outToUse._x_.x.curve.loop);

        path.push(outToUse);

        outToUse = getNextExit_(outToUse);

    } while (outToUse !== origOut);

    return { path, additionalOutsToCheck, loopOuts };
}


/**
 * 
 * @param in_ the in for which the next exit should be found
 * @param origOut
 * @param additionalOutsToCheck 
 * @param takenOuts
 */
function getNextExit(
        origOut: Out,
        additionalOutsToCheck: Out[],
        takenOuts: Set<Out>) {

    const markOutForChecking_ = markInOutForChecking(
        takenOuts,
        additionalOutsToCheck
    );

    return function(prevOut: Out): Out {
        let in_ = prevOut.twin;

        let toCount = 1;
        let next: In|Out = in_;
        let outToUse: Out | undefined;
        do {
            next = origOut.orientation === +1
                ? next.nextAround
                : next.prevAround

            if (next === in_) { break; }

            toCount = toCount - next.dir;

            if (next.dir === -1) { continue; }
            const out = next as Out;

            if (!outToUse) {
                // we are still rotating on the inside of the loop
                if (toCount === 0) {
                    outToUse = out;
                } else if (toCount === 1) {
                    // ...must have the same orientation (see complexish2.svg in tests)
                    markOutForChecking_(out, origOut.orientation, origOut);
                }
            } else {
                // else we are rotating on the outside of the loop
                if (toCount === 0) {
                    markOutForChecking_(out, origOut.orientation, origOut.parent);
                } else if (toCount === -1) {
                    markOutForChecking_(out, -origOut.orientation, origOut.parent);
                }
            }
        } while (true)

        return outToUse!;
    }
}


function markInOutForChecking(
        takenOuts: Set<Out>,
        additionalOutsToCheck: Out[]) {

    return (out: Out,
            orientation: number,
            origParent: Out) => {

        if (takenOuts.has(out)) { return; }

        const out_: Mutable<Out> = out;

        out_.orientation = orientation;
        out_.parent = origParent;
        out_.windingNum = origParent.windingNum + out.orientation;

        additionalOutsToCheck.push(out);
    }
}



export { rerun }


