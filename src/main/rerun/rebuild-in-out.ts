import type { In, Out } from "../../containers/in-out/in-out.js";
import type { RebuiltInOut } from "./rebuilt-in-out.js";


/** builds a fresh `RebuiltInOut` copying the in/out's order-info caches */
function rebuildInOut(
        inOut: In|Out,
        dir: -1|1,
        swapped: boolean): RebuiltInOut {

    return {
        idx: inOut.idx,
        _x_: inOut._x_,
        dir,
        swapped,
        oSideIdxs: inOut.oSideIdxs,
        oFSC: inOut.oFSC,
        oFSCE: inOut.oFSCE,
        oSideIdx: inOut.oSideIdx,
    };
}


export { rebuildInOut }
