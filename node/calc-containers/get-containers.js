import { areContainersIntersecting } from "./are-containers-intersecting";
import { addEdges, getConnectedComponents } from "../graph/get-connected-components";
import { getIsolatedComponents } from "./get-isolated-containers";
import { mergeContainers } from "./merge-containers";
import { getContainerInOuts } from "./get-container-in-outs/get-container-in-outs";
import { getIntersections } from "../get-critical-points/get-intersections";
import { setIntersectionNextValues } from "../get-critical-points/set-intersection-next-values";
import { sweepLine } from "../sweep-line/sweep-line";
import { getSelfIntersections } from '../get-critical-points/get-self-intersections';
import { getInterfaceIntersections } from '../get-critical-points/get-interface-intersections';
import { getExcessiveCurvatures } from '../get-critical-points/get-excessive-curvatures';
import { getExtremes } from '../get-critical-points/get-extremes';
import { sendContainersToGrid } from './send-containers-to-grid';
import { compareOrderedInOut } from './get-container-in-outs/get-in-outs-via-sides/compare-in-out';
import { filterContainers } from './filter-containers';
/**
 *
 * @param containerDim
 */
function getContainers(loops, containerDim, expMax) {
    const xs1 = getIntersections(loops, expMax);
    const xs2 = getSelfIntersections(loops);
    const xs3 = getInterfaceIntersections(loops);
    const { extremes, xs: xs4 } = getExtremes(loops);
    const xs5 = getExcessiveCurvatures(expMax, loops);
    let xPairs = [...xs1, ...xs2, ...xs3, ...xs4, ...xs5];
    // console.log('general  ', xs1);
    // console.log('self     ', xs2);
    // console.log('interface', xs3);
    // console.log('topmost  ', xs4);
    // console.log('excessive  ', xs5);
    if (typeof _debug_ !== 'undefined') {
        for (const xPair of xs1) {
            _debug_.generated.elems.intersection.push(...xPair);
        }
        for (const xPair of xs2) {
            _debug_.generated.elems.intersection.push(...xPair);
        }
        for (const xPair of xs3) {
            _debug_.generated.elems.intersection.push(...xPair);
        }
        for (const xPair of xs4) {
            _debug_.generated.elems.intersection.push(...xPair);
        }
        for (const xPair of xs5) {
            _debug_.generated.elems.intersection.push(...xPair);
        }
    }
    // initialize the containers with one of the one-sided intersections
    // console.log(xPairs)
    let containers = xPairs.map(xPair => ({
        xs: xPair,
        box: [
            // TODO xs[0].box -> combine xs[0] and xs[1] boxes
            [xPair[0].x.box[0][0] - containerDim, xPair[0].x.box[0][1] - containerDim],
            [xPair[0].x.box[1][0] + containerDim, xPair[0].x.box[1][1] + containerDim]
        ],
        inOuts: undefined // to be set later
    }));
    // iterate, combining containers that overlap on each iteration 
    while (true) {
        /** container intersections as an array of Container pairs */
        const is = sweepLine(containers, getLeftMost, getRightMost, areContainersIntersecting);
        // if there are no more intersections between containers we're done
        if (!is.length) {
            break;
        }
        const graph = new Map();
        addEdges(graph, is);
        const connectedContainers = getConnectedComponents(graph);
        const isolatedContainers = getIsolatedComponents(containers, connectedContainers);
        containers = [
            ...mergeContainers(connectedContainers),
            ...isolatedContainers
        ];
    }
    containers = filterContainers(containers);
    containers = sendContainersToGrid(containers, expMax, containerDim);
    // console.log(xPairs.map(xp => xp[0].x.kind).filter(k => k === 7).length);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.container = containers;
    }
    // Add the other half of the intersections too - all intersections has 
    // exactly one opposite curve intersection (t values come in pairs)
    // Also, set inOuts on each container, and `idx`
    let ioIdx = 0;
    for (const container of containers) {
        for (const x of container.xs) {
            x.container = container;
        }
        let inOuts;
        ({ inOuts, ioIdx } = getContainerInOuts(container, ioIdx));
        container.inOuts = inOuts;
    }
    // remove xs not belonging to a container (caused by filterContainers)
    xPairs = xPairs.filter(x => x[0].container !== undefined);
    setIntersectionNextValues(xPairs);
    // Connect container ins and outs
    for (const container of containers) {
        for (const out of container.inOuts) {
            if (out.dir === -1) {
                continue;
            }
            let _x_ = out._x_;
            // move to next 'in' __X__
            while (true) {
                _x_ = _x_.next;
                if (_x_.in_ !== undefined) {
                    break;
                }
            }
            out.next = _x_.in_;
            out.idx = out.next.idx;
        }
    }
    for (const container of containers) {
        container.inOuts.sort(compareOrderedInOut);
    }
    // set `next` and `prev` around container for each `inOut` for each `container`
    for (const container of containers) {
        const inOuts = container.inOuts;
        let prevInOut = inOuts[inOuts.length - 1];
        for (let i = 0; i < inOuts.length; i++) {
            const inOut = inOuts[i];
            inOut.prevAround = prevInOut;
            prevInOut.nextAround = inOut;
            prevInOut = inOut;
        }
    }
    return { extremes, containers };
}
function getLeftMost(container) {
    return container.box[0][0];
}
function getRightMost(container) {
    return container.box[1][0];
}
export { getContainers };
//# sourceMappingURL=get-containers.js.map