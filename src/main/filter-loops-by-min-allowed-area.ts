import { getShapeArea$ } from "../shape/get-shape-area.js";

const { abs } = Math;


function filterLoopsByMinAllowedArea(
        minLoopArea: number) {

    return function (loopss: ((number[][])[])[][]): ((number[][])[])[][] {
        const loopss_: ((number[][])[])[][] = [];
        for (let i=0; i<loopss.length; i++) {
            const loops = loopss[i];

            const loops_ = loops.filter(
                loop => abs(getShapeArea$(loop)) > minLoopArea
            );

            if (loops_.length) { 
                loopss_.push(loops_); 
            }
        }

        return loopss_;
    }
}


export { filterLoopsByMinAllowedArea }
