import { completeLoop } from '../calc-paths/complete-paths/complete-loop.js';
import { completePaths } from '../calc-paths/complete-paths/complete-paths.js';
import { assignBigBoxesToContainers } from '../containers/get-containers/assign-big-boxes-to-containers.js';
import { combineOverlappingContainers } from '../containers/get-containers/combine-overlapping-containers/combine-overlapping-containers.js';
import { getAllXPairs, getExcessiveCurvatures_, getInterfaceIntersections_, getIntersections_, getSelfIntersections_, getTurnarounds_ } from '../containers/get-containers/get-all-x-pairs.js';
import { getContainers } from '../containers/get-containers/get-containers.js';
import { orderInOuts } from '../containers/order-in-outs.js';
import { getIntersection } from '../get-critical-points/get-intersection.js';
import { _isLoopInLoop, getAxisAlignedRayLoopIntersections } from '../is-loop-in-loop/is-loop-in-loop.js';
import { normalizeLoops } from '../shape/normalize/normalize-loop.js';
function logTimings() {
    console.log(structuredClone(getContainers.getStats()));
    console.log(structuredClone(normalizeLoops.getStats()));
    console.log(structuredClone(completePaths.getStats()));
    // console.log(structuredClone(minAreaFilter.getStats()));
    getContainers.resetStats();
    normalizeLoops.resetStats();
    completePaths.resetStats();
    // minAreaFilter.resetStats();
    // normalizeLoops -> 1.3 ms
    // getContainers  -> 51.1 ms  (improve)
    // completePaths  -> 0.5 ms
    // minAreaFilter  -> 1.1 ms
    `getContainers`;
    console.log(structuredClone(getAllXPairs.getStats()));
    console.log(structuredClone(getIntersection.getStats()));
    console.log(structuredClone(getIntersections_.getStats()));
    console.log(structuredClone(getSelfIntersections_.getStats()));
    console.log(structuredClone(getInterfaceIntersections_.getStats()));
    console.log(structuredClone(getExcessiveCurvatures_.getStats()));
    console.log(structuredClone(getTurnarounds_.getStats()));
    console.log(structuredClone(combineOverlappingContainers.getStats()));
    console.log(structuredClone(assignBigBoxesToContainers.getStats()));
    console.log(structuredClone(orderInOuts.getStats()));
    console.log(structuredClone(completeLoop.getStats()));
    console.log(structuredClone(_isLoopInLoop.getStats()));
    console.log(getAxisAlignedRayLoopIntersections.getStats());
    getAllXPairs.resetStats();
    getIntersection.resetStats();
    getIntersections_.resetStats();
    getSelfIntersections_.resetStats();
    getInterfaceIntersections_.resetStats();
    getExcessiveCurvatures_.resetStats();
    getTurnarounds_.resetStats();
    combineOverlappingContainers.resetStats();
    assignBigBoxesToContainers.resetStats();
    orderInOuts.resetStats();
    completeLoop.resetStats();
    _isLoopInLoop.resetStats();
    getAxisAlignedRayLoopIntersections.resetStats();
    // getAllXPairs -> 11.9 ms  (improve)
    // combineOverlappingContainers -> 1.8 ms  (improve)
    // assignBigBoxesToContainers -> 0.4 ms
    // orderInOuts -> 36.2 -> 20.8 ms -> 6.7  (improve)
    // getIntersections -> 9.9 ms  (improve)
    // getSelfIntersections -> 0.1 ms
    // getInterfaceIntersections -> 0.1 ms
    // getExcessiveCurvatures -> 0.9 ms
    // getTurnarounds -> 0.5 ms
}
export { logTimings };
//# sourceMappingURL=log-timings.js.map