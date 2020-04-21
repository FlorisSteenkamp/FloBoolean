"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mergeContainers(ccs) {
    let containers = [];
    for (let cc of ccs) {
        let minLeft = Number.POSITIVE_INFINITY;
        let minTop = Number.POSITIVE_INFINITY;
        let maxRight = Number.NEGATIVE_INFINITY;
        let maxBottom = Number.NEGATIVE_INFINITY;
        let xs = [];
        for (let c of cc) {
            let [[left, top], [right, bottom]] = c.box;
            if (left < minLeft) {
                minLeft = left;
            }
            if (top < minTop) {
                minTop = top;
            }
            if (right > maxRight) {
                maxRight = right;
            }
            if (bottom > maxBottom) {
                maxBottom = bottom;
            }
            xs.push(...c.xs);
        }
        let container = {
            box: [[minLeft, minTop], [maxRight, maxBottom]],
            xs: xs,
            inOuts: undefined
        };
        containers.push(container);
    }
    return containers;
}
exports.mergeContainers = mergeContainers;
//# sourceMappingURL=merge-containers.js.map