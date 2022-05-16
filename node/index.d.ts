import { simplifyPaths } from './calc-paths/simplify-paths.js';
import { getLoopArea } from './loop/get-loop-area.js';
import { Debug, GeneratedElems, ITiming, Generated, IDebugFunctions, enableDebugForBooleanOp } from './debug/debug.js';
import { IDebugElems } from './debug/debug-elem-types.js';
import { getPathsFromStr } from './svg/get-paths-from-str.js';
import { beziersToSvgPathStr } from './svg/beziers-to-svg-path-str.js';
import { loopFromBeziers, Loop } from './loop/loop.js';
import { getLoopCentroid } from './loop/get-loop-centroid.js';
export { simplifyPaths, Debug, GeneratedElems, ITiming, Generated, IDebugFunctions, enableDebugForBooleanOp, IDebugElems, getLoopArea, getPathsFromStr, beziersToSvgPathStr, Loop, getLoopCentroid, loopFromBeziers };
