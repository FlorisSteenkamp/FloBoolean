import { makeSimpleX } from "./make-simple-x.js";
function getInterfaceIntersections(loops) {
    /** all one-sided Xs from */
    let xs = [];
    // Get interface points
    for (let loop of loops) {
        for (let curve of loop.curves) {
            xs.push([
                makeSimpleX(1, curve, 4),
                makeSimpleX(0, curve.next, 4), // interface
            ]);
        }
    }
    return xs;
}
export { getInterfaceIntersections };
//# sourceMappingURL=get-interface-intersections.js.map