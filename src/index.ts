import { simplifyPaths } from './calc-paths/simplify-paths.js';
import { getLoopArea } from './loop/get-loop-area.js';
import { 
    Debug, GeneratedElems, ITiming, Generated, IDebugFunctions,
    enableDebugForBooleanOp
} from './debug/debug.js';
import { IDebugElems } from './debug/debug-elem-types.js';
import { getPathsFromStr } from './svg/get-paths-from-str.js';
import { beziersToSvgPathStr } from './svg/beziers-to-svg-path-str.js';
import { loopFromBeziers, Loop } from './loop/loop.js';
import { getLoopCentroid } from './loop/get-loop-centroid.js';
import { Curve } from './curve/curve.js';
import { sweepLine, IntersectionResult } from './sweep-line/sweep-line.js';
import { doConvexPolygonsIntersect } from './geometry/do-convex-polygons-intersect.js';
import { X } from './x.js';
import { _X_ } from './-x-.js';
import { getIntersections } from './get-critical-points/get-intersections.js';
import { areBoxesIntersectingDd } from './sweep-line/are-boxes-intersecting.js';


export { 
    simplifyPaths,
    Debug,
    GeneratedElems, 
    ITiming, 
    Generated, 
    IDebugFunctions,
    enableDebugForBooleanOp,
    IDebugElems,
    getLoopArea,
    getPathsFromStr,
    beziersToSvgPathStr,
    Loop,
    getLoopCentroid,
    loopFromBeziers,
    Curve,
    sweepLine,
    IntersectionResult,
    doConvexPolygonsIntersect,
    X,
    _X_,
    getIntersections,
    areBoxesIntersectingDd
}
