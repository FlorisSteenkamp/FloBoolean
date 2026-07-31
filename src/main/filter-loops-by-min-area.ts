import { orderLoopAscendingByMinY } from "../calc-paths/order-loop-ascending-by-min-y.js";
import { getShapeArea } from "../shape/get-shape-area.js";
import type { Loop } from "../shape/loop.js";

const { abs } = Math;


function filterLoopsByMinAllowedArea(
        minLoopArea: number,
        loopss: Loop[][]) {

    const loopss_: Loop[][] = [];
    for (let i=0; i<loopss.length; i++) {
        const loops = loopss[i];

        const loops_ = loops.filter(
            loop => abs(getShapeArea(loop.beziers)) > minLoopArea
        );

        if (loops_.length) { 
            loops_.sort((loopA, loopB) => { 
                return orderLoopAscendingByMinY(loopA.beziers, loopB.beziers) 
            });
            loopss_.push(loops_); 
        }
    }

    return loopss_;
}


export { filterLoopsByMinAllowedArea }
