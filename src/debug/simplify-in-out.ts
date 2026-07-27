import type { InOut } from "../containers/in-out/in-out.js";
import { mapOverTree } from "../utils/map-over-tree.js";


/** for debugging only */
function simplifyInOut(inOut: InOut) {
    return mapOverTree(inOut, io => ({
        idx: io.idx, dir: io.dir, windingNum: io.windingNum,
        children: undefined
    }))
}


export { simplifyInOut }
