import { StateControl } from '../state-control/state-control';
import { getPathsFromStr, simplifyPaths, boolean, OR, AND, XOR, Loop } from '../../../src/index.js';
import { updDebugGlobal } from "./upd-debug-global";
import { getViewBoxForShapes } from './viewbox';


const IS_DEBUG_ON = true;


function aNOTb(bits: boolean[]) {
    return bits[0] && !bits[1];
}
const strToBooleanOp = { AND, OR, XOR, aNOTb }


async function loadDeducedProps(
        stateControl: StateControl,
        pathStrs: string[],
        forBoolean: boolean) {

    const bezierLoopss = pathStrs.map(getPathsFromStr);
    const viewbox = getViewBoxForShapes(bezierLoopss);
    let timingAll: number;
    const timeStart = performance.now();
    try {
        // Resets _debug_
        updDebugGlobal(IS_DEBUG_ON);
        const { booleanOp } = stateControl.state.appState.pageState;
        const op = strToBooleanOp[booleanOp];
        const loopss = forBoolean
            ? boolean(bezierLoopss, op)
            : simplifyPaths(bezierLoopss[0], undefined, { orientationPositive: true, inclMicroCorners: true });
        
        stateControl.transientState.bezierLoopss = loopss;
    } catch (e) {
        console.log(e);
    } finally {
        timingAll = performance.now() - timeStart;
    }

    return { viewbox, timingAll };
}


export { loadDeducedProps }
