import type { Out } from "../containers/in-out/in-out.js";


function createRootInOut(): Out {
    return {
        dir: undefined!,
        idx: 0,
        parent: undefined!,
        children: new Set(),
        windingNum: 0,
        _x_: undefined!,
        container: undefined!,
        orientation: -1,
        next: undefined!,
        path: undefined!,
        nextAround: undefined!,
        prevAround: undefined!
    };
}


export { createRootInOut }
