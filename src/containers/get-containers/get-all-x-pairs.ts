declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { Loop } from "../../shape/loop.js";
import type { _X_ } from "../../get-critical-points/-x-.js";
import { getIntersections } from "../../get-critical-points/get-intersections.js";
import { getSelfIntersections } from '../../get-critical-points/get-self-intersections.js';
import { getInterfaceIntersections } from '../../get-critical-points/get-interface-intersections.js';
import { getExcessiveCurvatures } from '../../get-critical-points/get-excessive-curvatures.js';
import { getTurnarounds } from './get-turnarounds.js';

/**
 * Returns intersections of all types on the given `loops`
 */
function getAllXPairs(
        loops: Loop[],
        minYXPairs: [_X_,_X_][],
        expMax: number) {

    const xs1 = loops.map((_,idx) => minYXPairs[idx]);
    const xs2 = getIntersections(loops, expMax);
    const xs3 = getSelfIntersections(loops);
    const xs4 = getInterfaceIntersections(loops);
    const xs5 = getExcessiveCurvatures(expMax, loops);
    const xs6 = getTurnarounds(loops);

    let xPairs = [xs1, xs2, xs3, xs4, xs5, xs6].flat(1);

    if (typeof _debug_ !== 'undefined') {  _debug_.elems.intersection.push(...xPairs.flat()); }

    return xPairs;
}


export { getAllXPairs }
