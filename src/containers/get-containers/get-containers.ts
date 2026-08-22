declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { Container, ContainerBasic } from "../container.js";
import type { Mutable } from '../../utils/mutable.js';
import type { X } from '../../get-critical-points/x.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { Loop } from "../../shape/loop.js";
import type { In, Out } from '../in-out/in-out.js';
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


/**
 * 
 * @param containerDim 
 * 
 * @internal
 */
const getContainers = timeFunctionCalls(function getContainers(
        loops: Loop[],
        minYXPairs: X[],
        expMax: number,
        expContainer: number): Container[] {

    let xPairs = getAllXPairs(loops, minYXPairs, expMax);

    const _x_Pairs: _X_[][] = xPairs.map(
        xPair => xPair.map(x => {
            return {
                x,
                // connections to be added later
                container: undefined!,
                next: undefined!,
                prev: undefined!,
            }
    }));

    let containers = getContainersFromXPairs(_x_Pairs, expContainer);
    containers = combineOverlappingContainers(containers);
    containers = sendContainersToGrid(containers, expContainer);

    assignContainersToXs(containers);

    setIntersectionNextAndPrevs(_x_Pairs);

    for (const container of containers) {
        const inOuts: (In|Out)[] = [];

        for (const x of container.xs) {
            if (x.in_) { inOuts.push(x.in_); }
            if (x.out) { inOuts.push(x.out); }
        }

        (container as Mutable<Container>).inOuts = inOuts;
    }

    const containers_ = assignBigBoxesToContainers(containers, expMax);

    numberInOuts(containers_);
    connectContainerInOuts(containers_);

    containers_.forEach(orderInOuts);

    if (typeof _debug_ !== 'undefined') { _debug_.elems.container.push(...containers_); }

    return containers as Container[];
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
