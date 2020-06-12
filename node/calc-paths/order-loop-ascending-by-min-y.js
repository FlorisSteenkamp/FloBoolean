"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderLoopAscendingByMinY = void 0;
const flo_bezier3_1 = require("flo-bezier3");
/**
 * Returns < 0 if loopA's topmost point is higher (i.e. smaller) than that of
 * loopB. Using this function in a sort will sort from highest topmost (smallest
 * y) point loops to lowest in a left-handed coordinate system.
 * @param loopA
 * @param loopB
 */
function orderLoopAscendingByMinY(loopA, loopB) {
    return getMinY(loopA) - getMinY(loopB);
}
exports.orderLoopAscendingByMinY = orderLoopAscendingByMinY;
function getMinY(pss) {
    let minY = Number.POSITIVE_INFINITY;
    for (let ps of pss) {
        let y = flo_bezier3_1.getBounds(ps).box[0][1];
        if (y < minY) {
            minY = y;
        }
    }
    return minY;
}
//# sourceMappingURL=order-loop-ascending-by-min-y.js.map