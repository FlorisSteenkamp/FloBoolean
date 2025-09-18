import { InOut } from "../in-out";


function createRootInOut(): InOut {
    return {
        dir: undefined!,
        idx: 0,
        parent: undefined,
        children: new Set(),
        windingNum: 0,
        p: undefined!,
        pBox: undefined!,
        _x_: undefined,
        container: undefined!
    };
}


export { createRootInOut }
