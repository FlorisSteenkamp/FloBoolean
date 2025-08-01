import { Container } from "../container";


function getMaxContainerDim(containers: Container[]) {
    let maxDim = Number.NEGATIVE_INFINITY;
    for (const container of containers) {
        const dim = getContainerDim(container);
        if (maxDim < dim) { maxDim = dim; }
    }

    return maxDim;
}


function getContainerDim(container: Container) {
    const [[left,top], [right,bottom]] = container.box;
    
    return Math.max(right-left, bottom-top);
}


export { getMaxContainerDim }
