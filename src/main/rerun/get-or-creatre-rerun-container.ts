import type { Container } from "../../containers/container.js";
import { In, Out } from "../../containers/in-out/in-out.js";
import { _X_ } from "../../get-critical-points/-x-.js";
import { Mutable } from "../../utils/mutable.js";


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
            // inOuts: container.inOuts,
            inOuts: [],
            xs: container.xs
        };
        containers_[idx!] = container_;

        // for (let i=0; i<container.xs.length; i++) {
        //     const _x_ = container.xs[i];
        //     (_x_ as Mutable<_X_>).container = container_;
        // }

        // for (let i=0; i<container.inOuts.length; i++) {
        //     const inOut = container.inOuts[i];
        //     (inOut as Mutable<In|Out>)._x_;
        // }
    }

    return container_;
}


export { getOrCreateRerunContainer } 
