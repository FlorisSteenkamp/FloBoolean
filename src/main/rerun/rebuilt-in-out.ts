import type { RootIntervalExp } from "flo-poly";
import type { SideCrossing } from "../../containers/get-container-in-outs/get-in-outs-via-sides/side-crossing.js";
import type { _X_ } from "../../get-critical-points/-x-.js";


/** the minimal in/out shape `rerun` rebuilds (with a writable `twin`) */
type RebuiltInOut = {
    _x_: _X_;
    dir: -1 | 1;
    idx: number;
    swapped?: boolean;
    twin?: RebuiltInOut;
    oSideIdxs?: number[];
    oFSC?: SideCrossing;
    oFSCE?: RootIntervalExp;
    oSideIdx?: number;
}


export { RebuiltInOut }
