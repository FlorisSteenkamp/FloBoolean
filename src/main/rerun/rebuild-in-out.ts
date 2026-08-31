import type { In, Out } from "../../containers/in-out/in-out.js";


/** builds a fresh `RebuiltInOut` copying the in/out's order-info caches */
function rebuildInOut(
        inOut: In|Out,
        dir: -1|1,
        swapped: boolean): In|Out {

    return {
        idx: inOut.idx,
        _x_: inOut._x_,
        dir,
        swapped,
        oSideIdxs: inOut.oSideIdxs,
        oFSC: inOut.oFSC,
        oFSCE: inOut.oFSCE,
        oSideIdx: inOut.oSideIdx,
        container: undefined!,
        orientation: undefined!,
        windingNum: undefined!,
        children: undefined!,
        nextAround: undefined!,
        parent: undefined!,
        path: undefined!,
        prevAround: undefined!,
        twin: undefined!,
        loop: undefined!
    };
}


export { rebuildInOut }
