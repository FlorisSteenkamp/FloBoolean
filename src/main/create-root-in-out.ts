import type { InOut } from "../containers/in-out/in-out.js";


function createRootInOut(): InOut {
    return {
        dir: undefined!,
        idx: 0,
        parent: undefined,
        children: new Set(),
        windingNum: 0,
        p: undefined!,
        _x_: undefined,
        container: undefined!,
        loopsIdxs: new Set(),
        orientation: -1
    };
}


export { createRootInOut }
