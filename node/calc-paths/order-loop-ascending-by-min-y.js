import { getBounds$ } from "../geometry/get-bounds-.js";
/**
 * Returns < 0 if loopA's topmost point is higher (i.e. smaller) than that of
 * loopB. Using this function in a sort will sort from highest topmost (smallest
 * y) point loops to lowest in a left-handed coordinate system.
 * @param loopA
 * @param loopB
 */
function compareLoopByMinY(loopA, loopB) {
    return getMinY(loopA) - getMinY(loopB);
}
function getMinY(pss) {
    let minY = Infinity;
    for (const ps of pss) {
        const y = getBounds$(ps).box[0][1];
        if (y < minY) {
            minY = y;
        }
    }
    return minY;
}
export { compareLoopByMinY };
//# sourceMappingURL=order-loop-ascending-by-min-y.js.map