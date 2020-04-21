
import { simplifyPaths } from './calc-paths/simplify-paths';
import { getLoopArea } from './loop/get-loop-area';
import {
    Debug,
    GeneratedElems, 
    ITiming, 
    Generated, 
    IDebugFunctions,
    enableDebugForBooleanOp
} from './debug/debug';
import { IDebugElems } from './debug/debug-elem-types';
import { getPathsFromStr } from './svg/get-paths-from-str';
import { beziersToSvgPathStr } from './svg/beziers-to-svg-path-str';


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
    beziersToSvgPathStr
}
