declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { Container } from "../container.js";
import type { Mutable } from '../../utils/mutable.js';
import type { __X__ } from '../../get-critical-points/-x-.js';
import type { Loop } from "../../shape/loop.js";
import { getIntersections } from "../../get-critical-points/get-intersections.js";
import { setIntersectionNextValues } from "../../get-critical-points/set-intersection-next-values.js";
import { getSelfIntersections } from '../../get-critical-points/get-self-intersections.js';
import { getInterfaceIntersections } from '../../get-critical-points/get-interface-intersections.js';
import { getExcessiveCurvatures } from '../../get-critical-points/get-excessive-curvatures.js';
import { sendContainersToGrid } from './send-containers-to-grid.js';
import { filterContainers } from './filter-containers.js';
import { combineOverlappingContainers } from './combine-overlapping-containers/combine-overlapping-containers.js';
import { connectContainerInOuts } from './connect-container-in-outs.js';
import { getInOutsOfContainer } from '../get-container-in-outs/get-in-outs-via-sides/get-in-outs-via-sides.js';
import { numberInOuts } from './number-in-outs.js';
import { MAX_BIT_LENGTH } from '../../main/max-bitlength.js';
import { getBezierTurnarounds } from '../../bezier/get-bezier-turnarounds.js';
import { eps } from 'flo-poly';
import { orderInOuts } from '../order-in-outs.js';


const CONTAINER_SIZE_MULTIPLIER = 2**4;


/**
 * 
 * @param containerDim 
 * 
 * @internal
 */
function getContainers(
        loops: Loop[],
        minYXPairs: [__X__, __X__][],
        expMax: number) {

    const gridSpacing = 2**expMax * 2**(-MAX_BIT_LENGTH);
    const containerDim = gridSpacing * CONTAINER_SIZE_MULTIPLIER;

    let xPairs = getAllXPairs(loops, minYXPairs, expMax);
    
    let containers: Container[];
    containers = containersFromXPairs(xPairs, containerDim);
    containers = combineOverlappingContainers(containers);
    containers = filterContainers(containers);
    containers = sendContainersToGrid(containers, expMax, containerDim);

    if (typeof _debug_ !== 'undefined') { _debug_.elems.container.push(...containers); }

    // Assign a container to each `__X__`
    for (const container of containers) {
        for (const x of container.xs) {
            (x as Mutable<__X__>).container = container;
        }
    }

    for (const container of containers) {
        (container as Mutable<Container>).inOuts = getInOutsOfContainer(container);
    }

    numberInOuts(containers);

    // remove xs not belonging to a container (caused by filterContainers)
    xPairs = xPairs.filter(x => x[0].container !== undefined);
    setIntersectionNextValues(xPairs);

    connectContainerInOuts(containers);
    containers.forEach(orderInOuts);

    return containers;
}


/**
 * Returns intersections of all types on the given `loops`
 */
function getAllXPairs(
        loops: Loop[],
        minYXPairs: [__X__,__X__][],
        expMax: number) {

    const xs1 = loops.map((_,idx) => minYXPairs[idx]);
    // const xs12 = loops.map((_,idx) => extremes[idx]);
    const xs2 = getIntersections(loops, expMax);
    const xs3 = getSelfIntersections(loops);
    const xs4 = getInterfaceIntersections(loops);
    const xs5 = getExcessiveCurvatures(expMax, loops);
    const xs6 = getTurnarounds(loops);

    // let xPairs = [...xs1, ...xs2, ...xs3, ...xs4, ...xs5];
    let xPairs = [...xs1, ...xs2, ...xs3, ...xs4, ...xs5, ...xs6];

    if (typeof _debug_ !== 'undefined') { 
        const { intersection } = _debug_.elems;
        for (const xs of [xs2,xs3,xs4,xs1,xs5]) {
            for (const xPair of xs) { intersection.push(...xPair); }
        }
    }

    return xPairs;
}


function getTurnarounds(
        loops: Loop[]): [__X__,__X__][] {

    return loops.map(loop => {
        return loop.curves.map(curve => {
            const { ps } = curve;
            const { turnaroundXs, turnaroundYs } = getBezierTurnarounds(ps);

            return turnaroundXs.map((ta): [__X__,__X__] => {
                const { p, t } = ta;
                const __x__: __X__ = {
                    curve,
                    x: {
                        p,
                        ri: { t, tS: t - 4*eps, tE: t + 4*eps, multiplicity: 1 },
                        kind: 8
                    }
                };

                return [
                    __x__,
                    {...__x__}
                ]
            })
        });
    }).flat(2);
}


/**
 * Create the initial containers from the array of intersections
 */
function containersFromXPairs(
        xPairs: [__X__,__X__][],
        containerDim: number) {

    const containers: Container[] = xPairs.map(xPair => {
        const { p } = xPair[0].x;

        return {
            xs: xPair,
            box: [
                [p[0] - containerDim, p[1] - containerDim],
                [p[0] + containerDim, p[1] + containerDim]
            ],
            inOuts: undefined! // to be set later
        }
    });

    return containers;
}


export { getContainers }
