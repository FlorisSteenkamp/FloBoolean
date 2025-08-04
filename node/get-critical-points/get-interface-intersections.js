import { makeSimpleX } from "./make-simple-x.js";
function getInterfaceIntersections(loops) {
    /** all one-sided Xs from */
    const xs = [];
    // Get interface points
    for (const loop of loops) {
        for (const curve of loop.curves) {
            xs.push([
                makeSimpleX(1, curve, 4), // interface
                makeSimpleX(0, curve.next, 4), // interface
            ]);
        }
    }
    return xs;
}
export { getInterfaceIntersections };
//# sourceMappingURL=get-interface-intersections.js.map