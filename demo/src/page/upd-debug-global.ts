import { enableDebugDrawFs } from 'flo-draw';
import { enableDebugForBooleanOp } from "../../../src/index";


/** 
 * Set global debug variable.
 */
function updDebugGlobal(debugOn: boolean) {
    (window as any)._debug_ = {};

    enableDebugDrawFs(debugOn);
    enableDebugForBooleanOp(debugOn);

    // console shortcut
    (window as any).d = (window as any)._debug_;
}


export { updDebugGlobal }
