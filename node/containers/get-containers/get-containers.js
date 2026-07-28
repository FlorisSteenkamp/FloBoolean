import { getIntersections } from "../../get-critical-points/get-intersections.js";
import { setIntersectionNextValues } from "../../get-critical-points/set-intersection-next-values.js";
import { getSelfIntersections } from '../../get-critical-points/get-self-intersections.js';
import { getInterfaceIntersections } from '../../get-critical-points/get-interface-intersections.js';
import { getExcessiveCurvatures } from '../../get-critical-points/get-excessive-curvatures.js';
import { getExtremes } from '../../get-critical-points/get-extremes.js';
import { sendContainersToGrid } from './send-containers-to-grid.js';
import { filterContainers } from './filter-containers.js';
import { combineOverlappingContainers } from './combine-overlapping-containers/combine-overlapping-containers.js';
import { connectContainerInOuts } from './connect-container-in-outs.js';
import { getInOutsOfContainer } from '../get-container-in-outs/get-in-outs-via-sides/get-in-outs-via-sides.js';
import { numberInOuts } from './number-in-outs.js';
/**
 *
 * @param containerDim
 *
 * @internal
 */
function getContainers(loops, containerDim, expMax) {
    const xs1 = getIntersections(loops, expMax);
    const xs2 = getSelfIntersections(loops);
    const xs3 = getInterfaceIntersections(loops);
    const { extremes, xs: xs4 } = getExtremes(loops);
    const xs5 = getExcessiveCurvatures(expMax, loops);
    let xPairs = [...xs1, ...xs2, ...xs3, ...xs4, ...xs5];
    if (typeof _debug_ !== 'undefined') {
        const { intersection } = _debug_.elems;
        for (const xs of [xs1, xs2, xs3, xs4, xs5]) {
            for (const xPair of xs) {
                intersection.push(...xPair);
            }
        }
    }
    // initialize the containers with one of the one-sided intersections
    let containers = xPairs.map(xPair => {
        const { box } = xPair[0].x;
        const { p } = xPair[0].x;
        return {
            xs: xPair,
            box: [
                [box[0][0] - containerDim, box[0][1] - containerDim],
                [box[1][0] + containerDim, box[1][1] + containerDim]
                // [p[0] - containerDim, p[1] - containerDim],
                // [p[0] + containerDim, p[1] + containerDim]
            ],
            inOuts: undefined // to be set later
        };
    });
    containers = combineOverlappingContainers(containers);
    containers = filterContainers(containers);
    containers = sendContainersToGrid(containers, expMax, containerDim);
    if (typeof _debug_ !== 'undefined') {
        _debug_.elems.container.push(...containers);
    }
    // Add the other half of the intersections too - all intersections has 
    // exactly one opposite curve intersection (t values come in pairs)
    // Also, set inOuts on each container, and `idx`
    for (const container of containers) {
        for (const x of container.xs) {
            x.container = container;
        }
        const inOuts = getInOutsOfContainer(container);
        container.inOuts = inOuts;
    }
    numberInOuts(containers);
    // remove xs not belonging to a container (caused by filterContainers)
    xPairs = xPairs.filter(x => x[0].container !== undefined);
    setIntersectionNextValues(xPairs);
    connectContainerInOuts(containers);
    return { extremes, containers };
}
export { getContainers };
//# sourceMappingURL=get-containers.js.map