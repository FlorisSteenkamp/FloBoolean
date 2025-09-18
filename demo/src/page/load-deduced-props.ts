import { StateControl } from '../state-control/state-control';
import { getPathsFromStr, simplifyPaths, splitAllPaths } from '../../../src/index'
import { updDebugGlobal } from "./upd-debug-global";
import { getViewBoxForShapes } from './viewbox';


const IS_DEBUG_ON = true;


async function loadDeducedProps(
        stateControl: StateControl,
        pathStrs: string[]) {
        
    const bezierLoopss = pathStrs.map(getPathsFromStr);
    const viewbox = getViewBoxForShapes(bezierLoopss);
    let timingAll: number;
    const timeStart = performance.now();
    try {
        // Resets _debug_
        updDebugGlobal(IS_DEBUG_ON);
        // const loopss = simplifyPaths(bezierLoopss[0]);
        const loopss = splitAllPaths(bezierLoopss);
        // console.log(loopss);
        // console.log(loopss.map(loops => loops.map(loop => loop.beziers)));
        stateControl.transientState.bezierLoopss = loopss;
    } catch (e) {
        console.log(e);
    } finally {
        timingAll = performance.now() - timeStart;
    }

    return { viewbox, timingAll };
}


export { loadDeducedProps }
