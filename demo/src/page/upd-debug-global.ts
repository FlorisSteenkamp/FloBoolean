import { enableDebugDrawFs } from 'flo-draw';
import { enableDebugForBooleanOp } from "../../../src/index";


/** 
 * Set global debug variable.
 */
function updDebugGlobal(debugOn: boolean) {
    (globalThis as any)._debug_ = {};

    enableDebugDrawFs(debugOn);
    enableDebugForBooleanOp(debugOn);

    // console shortcut
    (globalThis as any).d = (globalThis as any)._debug_;
}


export { updDebugGlobal }
