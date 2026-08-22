declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { Loop } from "../../shape/loop.js";
import type { X } from "../../get-critical-points/x.js";
import { getIntersections } from "../../get-critical-points/get-intersections.js";
import { getSelfIntersections } from '../../get-critical-points/get-self-intersections.js';
import { getInterfaceIntersections } from '../../get-critical-points/get-interface-intersections.js';
import { getExcessiveCurvatures } from '../../get-critical-points/get-excessive-curvatures.js';
import { getTurnarounds } from './get-turnarounds.js';
import { timeFunctionCalls } from '../../utils/time-function-call.js';


const getIntersections_ = timeFunctionCalls(getIntersections);
const getSelfIntersections_ = timeFunctionCalls(getSelfIntersections);
const getInterfaceIntersections_ = timeFunctionCalls(getInterfaceIntersections);
const getExcessiveCurvatures_ = timeFunctionCalls(getExcessiveCurvatures);
const getTurnarounds_ = timeFunctionCalls(getTurnarounds);


/**
 * Returns intersections of all types on the given `loops`
 */
const getAllXPairs = timeFunctionCalls(function getAllXPairs(
        loops: Loop[],
        minYXPairs: X[],
        expMax: number): ([X, X] | [X])[] {

    // const xs1 = loops.map((_,idx) => [minYXPairs[idx], { ...minYXPairs[idx] }] as [_X_,_X_]);
    const xs1 = loops.map((_,idx) => [minYXPairs[idx]] as [X]);
    const xs2 = getIntersections_(loops);
    const xs3 = getSelfIntersections_(loops);
    
    const xs4 = getInterfaceIntersections_(loops);
    const xs5 = getExcessiveCurvatures_(expMax, loops);
    const xs6 = getTurnarounds_(loops);

    let xPairs = [xs1, xs2, xs3, xs4, xs5, xs6].flat(1);
    // let xPairs = [xs1, xs2, xs3, xs5, xs6].flat(1);

    if (typeof _debug_ !== 'undefined') {  _debug_.elems.intersection.push(...xPairs.flat()); }

    return xPairs;
});


export {
    getAllXPairs,
    getIntersections_,
    getSelfIntersections_,
    getInterfaceIntersections_,
    getExcessiveCurvatures_,
    getTurnarounds_,
}
