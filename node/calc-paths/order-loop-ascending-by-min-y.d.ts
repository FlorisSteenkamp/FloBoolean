/**
 * Returns < 0 if loopA's topmost point is higher (i.e. smaller) than that of
 * loopB. Using this function in a sort will sort from highest topmost (smallest
 * y) point loops to lowest in a left-handed coordinate system.
 * @param loopA
 * @param loopB
 */
declare function orderLoopAscendingByMinY(loopA: number[][][], loopB: number[][][]): number;
export { orderLoopAscendingByMinY };
