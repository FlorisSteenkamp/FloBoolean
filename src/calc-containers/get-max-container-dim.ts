import { Container } from "../container.js";


function getMaxContainerDim(containers: Container[]) {
    let maxDim = Number.NEGATIVE_INFINITY;
    for (let container of containers) {
        let dim = getContainerDim(container);
        if (maxDim < dim) { maxDim = dim; }
    }

    return maxDim;
}


function getContainerDim(container: Container) {
    let [[left,top], [right,bottom]] = container.box;
    
    return Math.max(right-left, bottom-top);
}


export { getMaxContainerDim }
