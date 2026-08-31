import { getShapeArea$ } from "../shape/get-shape-area.js";
const { abs } = Math;
function filterLoopsByMinAllowedArea(minLoopArea) {
    return function (loopss) {
        const loopss_ = [];
        for (let i = 0; i < loopss.length; i++) {
            const loops = loopss[i];
            const loops_ = loops.filter(loop => abs(getShapeArea$(loop)) > minLoopArea);
            if (loops_.length) {
                loopss_.push(loops_);
            }
        }
        return loopss_;
    };
}
export { filterLoopsByMinAllowedArea };
//# sourceMappingURL=filter-loops-by-min-allowed-area.js.map