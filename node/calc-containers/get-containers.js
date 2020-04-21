"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const are_containers_intersecting_1 = require("./are-containers-intersecting");
const get_connected_components_1 = require("../graph/get-connected-components");
const get_isolated_containers_1 = require("./get-isolated-containers");
const merge_containers_1 = require("./merge-containers");
const get_container_in_outs_1 = require("./get-container-in-outs/get-container-in-outs");
const get_intersections_1 = require("../get-critical-points/get-intersections");
const set_intersection_next_values_1 = require("../get-critical-points/set-intersection-next-values");
const sweep_line_1 = require("../sweep-line/sweep-line");
const get_self_intersections_1 = require("../get-critical-points/get-self-intersections");
const get_interface_intersections_1 = require("../get-critical-points/get-interface-intersections");
const get_extremes_1 = require("../get-critical-points/get-extremes");
const send_containers_to_grid_1 = require("./send-containers-to-grid");
/**
 *
 * @param containerDim
 */
function getContainers(loops, containerDim, expMax) {
    //let t0 = performance.now();
    let xs1 = get_intersections_1.getIntersections(loops, expMax);
    //let t1 = performance.now();
    //console.log("intersections took " + ((t1 - t0)).toFixed(3) + " milliseconds.");
    let xs2 = get_self_intersections_1.getSelfIntersections(loops);
    let xs3 = get_interface_intersections_1.getInterfaceIntersections(loops);
    let { extremes, xs: xs4 } = get_extremes_1.getExtremes(loops);
    let xPairs = [...xs1, ...xs2, ...xs3, ...xs4];
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
    //console.log('general  ', xs1);
    //console.log('self     ', xs2);
    //console.log('interface', xs3);
    //console.log('topmost  ', xs4);
    // initialize the containers with one of the one-sided intersections
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
        let is = sweep_line_1.sweepLine(containers, getLeftMost, getRightMost, are_containers_intersecting_1.areContainersIntersecting);
        // if there are no more intersections between containers we're done
        if (!is.length) {
            break;
        }
        let graph = new Map();
        get_connected_components_1.addEdges(graph, is);
        let connectedContainers = get_connected_components_1.getConnectedComponents(graph);
        let isolatedContainers = get_isolated_containers_1.getIsolatedComponents(containers, connectedContainers);
        containers = [
            ...merge_containers_1.mergeContainers(connectedContainers),
            ...isolatedContainers
        ];
    }
    containers = filterContainers(containers);
    containers = send_containers_to_grid_1.sendContainersToGrid(containers, expMax, containerDim);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.container = containers;
    }
    // Add the other half of the intersections too - all intersections has 
    // exactly one opposite curve intersection (t values come in pairs)
    // Also, set inOuts on each container, and debugging idx
    let ioIdx = 0;
    //containers.reverse();  // TODO - REMOVE THIS LINE !!! <---
    for (let container of containers) {
        for (let x of container.xs) {
            x.container = container;
        }
        let inOuts;
        ({ inOuts, ioIdx } = get_container_in_outs_1.getContainerInOuts(container, ioIdx));
        container.inOuts = inOuts;
    }
    // remove xs not belonging to a container (caused by filterContainers)
    xPairs = xPairs.filter(x => x[0].container);
    set_intersection_next_values_1.setIntersectionNextValues(xPairs);
    // Connect container ins and outs
    for (let container of containers) {
        for (let out of container.inOuts) {
            if (out.dir === -1) {
                continue;
            }
            let x = out._x_;
            // move to next 'in' X
            while (true) {
                x = x.next;
                if (x.in_) {
                    break;
                }
            }
            out.next = x.in_;
            out.idx = out.next.idx;
        }
    }
    // set next and prev around container for each inout for each container
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
exports.getContainers = getContainers;
/**
 * Returns the containers that is the given containers filtered so that those
 * having only interface intersections or only a single (giben as a pair) even
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
                // include container if any X is not an interface
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
//# sourceMappingURL=get-containers.js.map