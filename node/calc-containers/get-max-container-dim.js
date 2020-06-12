"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxContainerDim = void 0;
function getMaxContainerDim(containers) {
    let maxDim = Number.NEGATIVE_INFINITY;
    for (let container of containers) {
        let dim = getContainerDim(container);
        if (maxDim < dim) {
            maxDim = dim;
        }
    }
    return maxDim;
}
exports.getMaxContainerDim = getMaxContainerDim;
function getContainerDim(container) {
    let [[left, top], [right, bottom]] = container.box;
    return Math.max(right - left, bottom - top);
}
//# sourceMappingURL=get-max-container-dim.js.map