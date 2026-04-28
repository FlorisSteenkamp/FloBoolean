import { enableDebugDrawFs } from 'flo-draw';
import { enableDebugForBooleanOp } from "../../../src/index.js";


/** 
 * Set global debug variable.
 */
function updDebugGlobal(debugOn: boolean) {
    (globalThis as any)._debug_ = {
        verbose: true
        // verbose: false
    };

    enableDebugDrawFs(debugOn);
    enableDebugForBooleanOp(debugOn);

    // console shortcut
    (globalThis as any).d = (globalThis as any)._debug_;
}


export { updDebugGlobal }
