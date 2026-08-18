declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { Container, ContainerBasic } from "../container.js";
import type { Mutable } from '../../utils/mutable.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { Loop } from "../../shape/loop.js";
import { setIntersectionNextAndPrevs } from "../../get-critical-points/set-intersection-next-values.js";
import { sendContainersToGrid } from './send-containers-to-grid.js';
import { combineOverlappingContainers } from './combine-overlapping-containers/combine-overlapping-containers.js';
import { getContainersFromXPairs } from './get-containers-from-x-pairs.js';
import { connectContainerInOuts } from './connect-container-in-outs.js';
import { numberInOuts } from './number-in-outs.js';
import { MAX_BIT_LENGTH } from '../../main/max-bitlength.js';
import { orderInOuts } from '../order-in-outs.js';
import { getAllXPairs } from './get-all-x-pairs.js';
import { assignBigBoxesToContainers } from './assign-big-boxes-to-containers.js';
import { timeFunctionCalls } from '../../utils/time-function-call.js';
import { getXInOuts } from '../get-container-in-outs/get-in-outs-via-sides/get-x-in-outs.js';


/** 
 * A size multiplier (based on the max value of the tangent) for the containers
 * holding critical points.
 */
const CONTAINER_SIZE_MULTIPLIER_EXP = 4;
const CONTAINER_SIZE_MULTIPLIER_EXP_FOR_DEBUGGING = 40;


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

    //--------------------------------------------------------------------------
    const containerSizeMultiplierExp = typeof _debug_ === 'undefined'
        ? CONTAINER_SIZE_MULTIPLIER_EXP
        : CONTAINER_SIZE_MULTIPLIER_EXP_FOR_DEBUGGING;
    const expGrid = expMax - MAX_BIT_LENGTH;
    const containerDim = 2**(expGrid + containerSizeMultiplierExp);
    //--------------------------------------------------------------------------

    let xPairs = getAllXPairs(loops, minYXPairs, expMax);

    let containers = getContainersFromXPairs(xPairs, containerDim);
    containers = combineOverlappingContainers(containers);
    containers = sendContainersToGrid(containers, expMax, containerSizeMultiplierExp);

    assignContainersToXs(containers);

    setIntersectionNextAndPrevs(xPairs);

    for (const container of containers) {
        (container as Mutable<Container>).inOuts = getXInOuts(container);
    }

    const containers_ = assignBigBoxesToContainers(containers, expMax);

    numberInOuts(containers_);
    connectContainerInOuts(containers_);

    containers_.forEach(orderInOuts);

    if (typeof _debug_ !== 'undefined') { _debug_.elems.container.push(...containers_); }

    return containers;
});


/**
 * ssign a container to each `_X_` within all containers
 */
function assignContainersToXs(
        containers: ContainerBasic[]) {

    for (const container of containers) {
        for (const x of container.xs) {
            (x as Mutable<_X_>).container = container as Container;
        }
    }
}


export { getContainers }
