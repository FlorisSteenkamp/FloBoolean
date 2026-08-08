declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { Container } from "../container.js";
import type { Mutable } from '../../utils/mutable.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { Loop } from "../../shape/loop.js";
import { setIntersectionNextAndPrevs } from "../../get-critical-points/set-intersection-next-values.js";
import { sendContainersToGrid } from './send-containers-to-grid.js';
import { filterContainers } from './filter-containers.js';
import { combineOverlappingContainers } from './combine-overlapping-containers/combine-overlapping-containers.js';
import { getContainersFromXPairs } from './get-containers-from-x-pairs.js';
import { connectContainerInOuts } from './connect-container-in-outs.js';
import { getInOutsOfContainer } from '../get-container-in-outs/get-in-outs-via-sides/get-in-outs-of-container.js';
import { numberInOuts } from './number-in-outs.js';
import { MAX_BIT_LENGTH } from '../../main/max-bitlength.js';
import { orderInOuts } from '../order-in-outs.js';
import { getAllXPairs } from './get-all-x-pairs.js';
import { getBigBox } from '../get-big-box.js';
import { timeFunctionCalls } from '../../utils/time-function-call.js';


/** 
 * A size multiplier (based on the max value of the tangent) for the containers
 * holding critical points.
 */
const CONTAINER_SIZE_MULTIPLIER = 2**4;
const CONTAINER_SIZE_MULTIPLIER_FOR_DEBUGGING = 2**32;


/**
 * 
 * @param containerDim 
 * 
 * @internal
 */
const getContainers = timeFunctionCalls(function getContainers(
        loops: Loop[],
        minYXPairs: _X_[],
        expMax: number) {

    const gridSpacing = 2**(expMax - MAX_BIT_LENGTH);
    const containerSizeMultiplier = typeof _debug_ === 'undefined'
        ? CONTAINER_SIZE_MULTIPLIER
        : CONTAINER_SIZE_MULTIPLIER_FOR_DEBUGGING
    const containerDim = gridSpacing * containerSizeMultiplier;

    let xPairs = getAllXPairs(loops, minYXPairs, expMax);

    let containers: Container[];
    containers = getContainersFromXPairs(xPairs, containerDim);
    containers = combineOverlappingContainers(containers);
    // containers = filterContainers(containers);  // TODO - put back eventually
    containers = sendContainersToGrid(containers, expMax, containerDim);

    assignContainersToXs(containers);

    // remove xs not belonging to a container (caused by `filterContainers`)
    xPairs = xPairs.filter(x => x[0].container !== undefined);
    setIntersectionNextAndPrevs(xPairs);

    for (const container of containers) {
        (container as Mutable<Container>).inOuts = getInOutsOfContainer(container);
    }

    assignBigBoxesToContainers(containers, expMax);  // TODO

    numberInOuts(containers);
    connectContainerInOuts(containers);
    containers.forEach(orderInOuts);

    // containers = filterContainers(containers);

    // console.log(containers.map(c => c.bigBox));

    if (typeof _debug_ !== 'undefined') { _debug_.elems.container.push(...containers); }

    return containers;
});


function assignBigBoxesToContainers(
        containers: Container[],
        expMax: number) {

    for (const container of containers) {
        const [[minX, minY], [maxX, maxY]] = container.box;
        const c = [(minX + maxX)/2, (minY + maxY)/2];
        
        const rects = [
            ...container.xs.map(x => x!.next!.container!.box),
            ...container.xs.map(x => x!.prev!.container!.box),
        ];
        
        const bigBox = getBigBox(expMax, rects, c);
        
        (container as Mutable<Container>).bigBox = bigBox;
    }
}


/**
 * ssign a container to each `_X_` within all containers
 */
function assignContainersToXs(
        containers: Container[]) {

    for (const container of containers) {
        for (const x of container.xs) {
            (x as Mutable<_X_>).container = container;
        }
    }
}


export { getContainers }
