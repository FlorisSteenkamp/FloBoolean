declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { Mutable } from '../../utils/mutable.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { In, Out } from '../../containers/in-out/in-out.js';
import type { Container } from '../../containers/container.js';
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

const { sign } = Math;

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

    for (const outSet of outSets) {   // an outer loop with holes
        // Orientation the outer loop already has; holes must alternate against it.
        const outerOrientation = sign(outSet[0].windingNum - outSet[0].parentWinding);

        const paths: Out[][] = [];  // TODO For debug only
        for (const { out, depth, windingNum, parentWinding } of outSet) {
            // A hole must wind opposite to its parent (islands opposite to holes,
            // ...); only reverse a loop whose current orientation doesn't already
            // match that depth alternation.
            const orientation = sign(windingNum - parentWinding);
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
        }
    }

    containers_.forEach(container_ => {
        if (container_.inOuts.length > 2 || containerHasMinY(container_)) {
            container_.inOuts.sort(compareInOut);
        }
    });

    console.log(minYContainers);

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
    const takenOuts: Set<Out> = new Set();  // Taken intersections
    // `takenContainers` is critical in cases such as in the 'koldat52' vector
    // where a `minY` container is part of multiple loops
    const takenContainers: Set<Container> = new Set();

    for (let i=0; i<minYContainers.length; i++) {
        const container = minYContainers[i];

        if (takenContainers.has(container)) { continue; }

        const { loop } = container.xs[0].x.curve;  // TODO - wrong
        const { beziers } = loop;
        const parent = getTightestContainingLoop(expMax, root, beziers);
        // const parent = root;

        const initialOut = getOutermostOut(container, parent);

        completePath(
            initialOut,
            takenOuts,
            takenContainers
        );
    }

    return root;
}


/**
 * Completes the path of a disjoint set of loops, i.e. this function is called 
 * for each disjoint set of paths.
 * 
 * @param initialOut
 * @param takenOuts
 * @param takenContainers
 */
function completePath(
        initialOut: Out,
        takenOuts: Set<Out>,
        takenContainers: Set<Container>): void {

    const outStack: Out[] = [initialOut];

    while (outStack.length) {
        const origOut = outStack.pop()!;

        if (takenOuts.has(origOut)) { continue; }

        (origOut as Mutable<Out>).children = new Set();
        const additionalOutsToCheck = completeLoop(
            takenOuts, takenContainers, origOut
        );

        (origOut.parent as Mutable<Out>).children = origOut.parent.children || new Set();
        origOut.parent.children.add(origOut);

        outStack.push(...additionalOutsToCheck);
    }
}


/** 
 * Completes a loop for a specific intersection point entry curve.
 * 
 * @param takenOuts
 * @param takenContainers
 * @param origOut
 */
function completeLoop(
        takenOuts: Set<Out>,
        takenContainers: Set<Container>,
        origOut: Out): Out[] {

    const additionalOutsToCheck: Out[] = [];
    const path: Out[] = [];

    // Move immediately to the outgoing start of the loop
    let outToUse: Out = origOut;

    const getNextExit_ = getNextExit(
        origOut, additionalOutsToCheck, takenOuts
    );

    do {
        takenOuts.add(outToUse);
        takenContainers.add(outToUse._x_.container);  // TODO - wrong

        path.push(outToUse);

        outToUse = getNextExit_(outToUse);

    } while (outToUse !== origOut);

    (origOut as Mutable<Out>).path = path;

    // console.log(pathToStr(Array.from(loopOuts)));

    return additionalOutsToCheck;
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

    return function(
            out: Out,
            orientation: number,
            origParent: Out) {

        if (takenOuts.has(out)) { return; }

        const out_: Mutable<Out> = out;

        if (out_.orientation !== undefined) {
            return;  // already assigned - see e.g. complex6.svg (would fail otherwise)
        }
        out_.orientation = orientation;
        out_.parent = origParent;
        out_.windingNum = origParent.windingNum + out_.orientation;

        additionalOutsToCheck.push(out_);
    }
}


export { rerun }
