import type { Container } from "../../container.js";
import type { TGraph } from '../../../graph/get-connected-components.js';
import { sweepLine } from "../../../sweep-line/sweep-line.js";
import { areContainersIntersecting } from "./are-containers-intersecting.js";
import { addEdges, getConnectedComponents } from "../../../graph/get-connected-components.js";
import { getIsolatedComponents } from "./get-isolated-containers.js";
import { mergeContainers } from "./merge-containers.js";


/**
 * Returns new `containers` by iterating, combining containers that overlap on
 * each iteration 
 *
 * @param containers 
 */
function combineOverlappingContainers(
        containers: Container[]) {

    // iterate, combining containers that overlap on each iteration 
    while (true) {
        /** container intersections as an array of Container pairs */
        const is = sweepLine(
            containers, 
            getLeftMost, 
            getRightMost, 
            areContainersIntersecting
        );

        // if there are no more intersections between containers we're done
        if (!is.length) { break; }

        const graph: TGraph<Container> = new Map();
        addEdges(graph, is);

        const connectedContainers = getConnectedComponents(graph);
        const isolatedContainers = getIsolatedComponents(
            containers, connectedContainers
        );

        containers = [
            ...mergeContainers(connectedContainers), 
            ...isolatedContainers
        ];
    }

    return containers;
}


function getLeftMost(container: Container) { 
    return container.box[0][0];
}


function getRightMost(container: Container) { 
    return container.box[1][0];
}


export { combineOverlappingContainers }
