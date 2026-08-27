import type { Container } from "../../containers/container.js";


/** rebuilt container for `container.idx`, created on first use */
function getOrCreateRerunContainer(
        containers_: Container[],
        container: Container): Container {

    const { idx } = container;
    let container_ = containers_[idx!];
    if (container_ === undefined) {
        container_ = {
            bigBox: container.bigBox,
            box: container.box,
            wellOrdered: container.wellOrdered,
            inOuts: [],
            xs: container.xs
        };
        containers_[idx!] = container_;
    }

    return container_;
}


export { getOrCreateRerunContainer } 
