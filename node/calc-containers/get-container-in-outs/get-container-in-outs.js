"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContainerInOuts = void 0;
const get_in_outs_via_sides_1 = require("./get-in-outs-via-sides/get-in-outs-via-sides");
const get_in_outs_via_crossing_1 = require("./get-in-outs-via-crossing/get-in-outs-via-crossing");
/**
 * * **warning** ioIdx will be modified by this function
 * @param container
 * @param ioIdx
 */
function getContainerInOuts(container, ioIdx) {
    // We check one X for each curve with an intersection within this container
    let xs = container.xs;
    // Check nature of Xs. If Xs is the very common case where two curves cross
    // we can use a faster check. Also in the bit less common case where all
    // curves are joining at an interface we can do a fast ccw (the ccw part
    // has not been implemented yet).
    if (xs.length === 2) {
        if (xs[0].x.kind === 1 && xs[1].x.kind === 1 &&
            xs[0].x.ri.multiplicity % 2 === 1 && xs[1].x.ri.multiplicity % 2 === 1) {
            return get_in_outs_via_crossing_1.getInOutsViaCrossing(container, ioIdx);
        }
    }
    return get_in_outs_via_sides_1.getInOutsViaSides(container, ioIdx);
}
exports.getContainerInOuts = getContainerInOuts;
//# sourceMappingURL=get-container-in-outs.js.map