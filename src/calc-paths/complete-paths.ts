import type { In, Out } from '../containers/in-out/in-out.js';
import type { _X_ } from '../get-critical-points/-x-.js';
import type { Container } from '../containers/container.js';
import type { Mutable } from '../utils/mutable.js';
import { createRootInOut } from "../main/create-root-in-out.js";
import { getTightestContainingLoop } from './get-tightest-containing-loop.js';
import { getOutermostOut } from './get-outermost-in-and-out.js';
import { timeFunctionCalls } from '../utils/time-function-call.js';
import { pathToStr } from '../debug/path-to-str.js';


const completePaths = timeFunctionCalls(function completePaths(
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

        const { loop } = container.xs[0].x.curve;
        const { beziers } = loop;
        const parent = getTightestContainingLoop(expMax, root, beziers);

        const initialOut = getOutermostOut(container, parent);

        completePath(
            initialOut,
            takenOuts,
            takenContainers
        );
    }

    return root;
});


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
const completeLoop = timeFunctionCalls(function completeLoop(
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
        takenContainers.add(outToUse._x_.container);

        path.push(outToUse);

        outToUse = getNextExit_(outToUse);

    } while (outToUse !== origOut);

    (origOut as Mutable<Out>).path = path;

    // console.log(pathToStr(Array.from(loopOuts)));

    return additionalOutsToCheck;
});


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


export { completePaths }
