import type { Out } from "../containers/in-out/in-out.js";


function createRootInOut(): Out {
    return {
        dir: undefined!,
        idx: 0,
        parent: undefined!,
        children: new Set(),
        windingNum: 0,
        _x_: undefined!,
        // orientation: -1,
        orientation: 0,
        twin: undefined!,
        path: undefined!,
        nextAround: undefined!,
        prevAround: undefined!,
        loop: undefined!,
        container: undefined!
    };
}


export { createRootInOut }
