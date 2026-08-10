declare const _debug_: Debug; 
import { Debug } from '../../../src/index.js';
import { StateControl } from '../state-control/state-control.js';
// import { getPathsFromStr, simplifyPaths, boolean, OR, AND, XOR, Loop } from '../../../src/index.js';
import { getPathsFromStr, simplifyPaths } from '../../../src/index.js';
import { updDebugGlobal } from "./upd-debug-global.js";
import { getViewBoxForShapes } from './viewbox.js';


const IS_DEBUG_ON = true;


// function aNOTb(bits: boolean[]) {
//     return bits[0] && !bits[1];
// }
// const strToBooleanOp = { AND, OR, XOR, aNOTb }


function loadDeducedProps(
        stateControl: StateControl,
        pathStrs: string[],
        // forBoolean: boolean) {
        ) {

    const bezierLoopss = pathStrs.map(getPathsFromStr);
    const viewbox = getViewBoxForShapes(bezierLoopss);
    let timingAll: number;
    const timeStart = performance.now();
    try {
        // Resets _debug_
        updDebugGlobal(IS_DEBUG_ON);
        const { booleanOp } = stateControl.state.appState.pageState;
        // const op = strToBooleanOp[booleanOp];
        // const loopss = forBoolean
        //     ? boolean(bezierLoopss, op)
        //     : simplifyPaths(bezierLoopss[0], undefined, { orientationPositive: true });
        const NUM_LOOPS = 1;  // for better benchmarking TODO
        for (let i=0; i<NUM_LOOPS; i++) {
            const loopss = simplifyPaths(
                bezierLoopss[0], {
                    // orientationPositive: true,
                    booleanOp 
                }
            );

            stateControl.transientState.bezierLoopss = loopss;
        }
    } catch (e) {
        console.log(e);
    } finally {
        timingAll = performance.now() - timeStart;
    }

    if (typeof _debug_ !== 'undefined') {
        const { l1, l2, l3 } = _debug_.callCounts;
        console.log(l1,l2,l3);
    }
    

    return { viewbox, timingAll };
}


export { loadDeducedProps }
