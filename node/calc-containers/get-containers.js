import { areContainersIntersecting } from "./are-containers-intersecting.js";
import { addEdges, getConnectedComponents } from "../graph/get-connected-components.js";
import { getIsolatedComponents } from "./get-isolated-containers.js";
import { mergeContainers } from "./merge-containers.js";
import { getContainerInOuts } from "./get-container-in-outs/get-container-in-outs.js";
import { getIntersections } from "../get-critical-points/get-intersections.js";
import { setIntersectionNextValues } from "../get-critical-points/set-intersection-next-values.js";
import { sweepLine } from "../sweep-line/sweep-line.js";
import { getSelfIntersections } from '../get-critical-points/get-self-intersections.js';
import { getInterfaceIntersections } from '../get-critical-points/get-interface-intersections.js';
import { getExtremes } from '../get-critical-points/get-extremes.js';
import { sendContainersToGrid } from './send-containers-to-grid.js';
import { compareOrderedInOut } from './get-container-in-outs/get-in-outs-via-sides/compare-in-out.js';
/**
 *
 * @param containerDim
 */
function getContainers(loops, containerDim, expMax) {
    //let t0 = performance.now();
    let xs1 = getIntersections(loops, expMax);
    //let t1 = performance.now();
    //console.log("intersections took " + ((t1 - t0)).toFixed(3) + " milliseconds.");
    let xs2 = getSelfIntersections(loops);
    let xs3 = getInterfaceIntersections(loops);
    let { extremes, xs: xs4 } = getExtremes(loops);
    let xPairs = [...xs1, ...xs2, ...xs3, ...xs4];
    //console.log('general  ', xs1);
    //console.log('self     ', xs2);
    //console.log('interface', xs3);
    //console.log('topmost  ', xs4);
    if (typeof _debug_ !== 'undefined') {
        for (let xPair of xs1) {
            _debug_.generated.elems.intersection.push(...xPair);
        }
        for (let xPair of xs2) {
            _debug_.generated.elems.intersection.push(...xPair);
        }
        // TODO - are interface intersections really necessary?
        for (let xPair of xs3) {
            _debug_.generated.elems.intersection.push(...xPair);
        }
        for (let xPair of xs4) {
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
        let is = sweepLine(containers, getLeftMost, getRightMost, areContainersIntersecting);
        // if there are no more intersections between containers we're done
        if (!is.length) {
            break;
        }
        let graph = new Map();
        addEdges(graph, is);
        let connectedContainers = getConnectedComponents(graph);
        let isolatedContainers = getIsolatedComponents(containers, connectedContainers);
        containers = [
            ...mergeContainers(connectedContainers),
            ...isolatedContainers
        ];
    }
    containers = filterContainers(containers);
    containers = sendContainersToGrid(containers, expMax, containerDim);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.container = containers;
    }
    // Add the other half of the intersections too - all intersections has 
    // exactly one opposite curve intersection (t values come in pairs)
    // Also, set inOuts on each container, and `idx`
    let ioIdx = 0;
    for (let container of containers) {
        for (let x of container.xs) {
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
    for (let container of containers) {
        for (let out of container.inOuts) {
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
    for (let container of containers) {
        container.inOuts.sort(compareOrderedInOut);
    }
    // set `next` and `prev` around container for each `inOut` for each `container`
    for (let container of containers) {
        let inOuts = container.inOuts;
        let prevInOut = inOuts[inOuts.length - 1];
        for (let i = 0; i < inOuts.length; i++) {
            let inOut = inOuts[i];
            inOut.prevAround = prevInOut;
            prevInOut.nextAround = inOut;
            prevInOut = inOut;
        }
    }
    return { extremes, containers };
}
/**
 * Returns the containers that is the given containers filtered so that those
 * having only interface intersections or only a single (given as a pair) even
 * multiple intersection are not included.
 * @param containers
 */
function filterContainers(containers) {
    let containers_ = containers.filter(container => {
        let xs = container.xs;
        if (container.xs.length === 2) {
            let _x_ = xs[0];
            if (_x_.x.kind === 1 && _x_.x.ri.multiplicity % 2 === 0) {
                // multiple even intersection - exclude
                return false;
            }
        }
        for (let x of container.xs) {
            if (x.x.kind !== 4) {
                // include container if any __X__ is not an interface
                return true;
            }
        }
        return false; // exclude container
    });
    return containers_;
}
function getLeftMost(container) {
    return container.box[0][0];
}
function getRightMost(container) {
    return container.box[1][0];
}
export { getContainers };
//# sourceMappingURL=get-containers.js.map