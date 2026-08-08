import type { Container } from "../../container.js";
import type { Graph } from '../../../graph/get-connected-components.js';
import { sweepLine } from "../../../sweep-line/sweep-line.js";
import { areContainersIntersecting, enlargeBox, CONTAINER_MERGE_ENLARGE_FRAC } from "./are-containers-intersecting.js";
import { addEdge, getConnectedComponents } from "../../../graph/get-connected-components.js";
import { mergeContainers } from "./merge-containers.js";
import { timeFunctionCalls } from "../../../utils/time-function-call.js";


/**
 * Returns new `containers` by iterating, combining containers that overlap on
 * each iteration 
 *
 * @param containers 
 */
const combineOverlappingContainers = timeFunctionCalls(function combineOverlappingContainers(
        containers: Container[]) {

    // iterate, combining containers that overlap on each iteration 
    while (true) {
        /**
         * container intersections as an array of objects with the following properties:
         *   a: the first container in the pair
         *   b: the second container in the pair
         *   u: always `true` (the result of the predicate)
         */
        const rs = sweepLine(
            containers, 
            container => enlargeBox(container.box, CONTAINER_MERGE_ENLARGE_FRAC)[0][0], 
            container => enlargeBox(container.box, CONTAINER_MERGE_ENLARGE_FRAC)[1][0], 
            areContainersIntersecting
        );

        // if there are no more intersections between containers we're done
        if (!rs.length) { break; }

        // Create a graph of containers, where each container is a vertex and
        // each intersection is an edge
        const graph: Graph<Container> = new Map(containers.map(c => [c, []]));
        for (let i=0; i<rs.length; i++) {
            const r = rs[i];
            addEdge(graph, [r.a, r.b]);
        }

        containers = getConnectedComponents(graph).map(
            mergeContainers
        );
    }

    return containers;
});


export { combineOverlappingContainers }
