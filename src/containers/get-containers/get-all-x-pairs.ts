declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { Loop } from "../../shape/loop.js";
import type { _X_ } from "../../get-critical-points/-x-.js";
import type { Mutable } from '../../utils/mutable.js';
import { getIntersections } from "../../get-critical-points/get-intersections.js";
import { getSelfIntersections } from '../../get-critical-points/get-self-intersections.js';
import { getInterfaceIntersections } from '../../get-critical-points/get-interface-intersections.js';
import { getExcessiveCurvatures } from '../../get-critical-points/get-excessive-curvatures.js';
import { getTurnarounds } from './get-turnarounds.js';
import { timeFunctionCalls } from '../../utils/time-function-call.js';


/**
 * Returns intersections of all types on the given `loops`
 */
const getAllXPairs = timeFunctionCalls(function getAllXPairs(
        loops: Loop[],
        minYXPairs: _X_[],
        expMax: number): _X_[][] {

    const xs1 = loops.map((_,idx) => [minYXPairs[idx], { ...minYXPairs[idx], order: 1 }] as [_X_,_X_]);
    // const xs1 = loops.map((_,idx) => [minYXPairs[idx]] as [_X_]);
    const xs2 = getIntersections(loops, expMax);
    const xs3 = getSelfIntersections(loops);
    const xs4 = getInterfaceIntersections(loops);
    const xs5 = getExcessiveCurvatures(expMax, loops);
    const xs6 = getTurnarounds(loops);

    let xPairs = [xs1, xs2, xs3, xs4, xs5, xs6].flat(1);
    // let xPairs = [xs1, xs2, xs3, xs5, xs6].flat(1);

    // Assign every `_X_` a globally-unique `order` (the first element of each
    // pair gets the lower value, keeping the in-side before the out-side). This
    // is the arbitrary distinguisher `compareXs` and the `getXInOuts` sort both
    // use to agree on the relative order of otherwise-coincident `_X_`s.
    let order = 0;
    for (const xPair of xPairs) {
        for (const x_ of xPair) {
            (x_ as Mutable<_X_>).order = order++;
        }
    }

    if (typeof _debug_ !== 'undefined') {  _debug_.elems.intersection.push(...xPairs.flat()); }

    return xPairs;
});


export { getAllXPairs }
