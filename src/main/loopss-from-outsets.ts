import type { OutSetInfo } from "./out-set.js";
import { loopFromOut } from "./loop-from-out.js";


function loopssFromOutsets(
        outSets: OutSetInfo[][]) {

    const loopss = outSets.map(outSet => {
        const outerLoopOrientation = outSet[0].out.orientation;

        return outSet.map(({ out, depth }) => {
            return loopFromOut(out, outerLoopOrientation, depth);
        });
    });

    return loopss;
}


export { loopssFromOutsets }
