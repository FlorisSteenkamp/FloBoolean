import type { InOut } from "../../in-out/in-out.js";
import type { Container } from "../../container.js";
import { getXInOuts } from "./get-x-in-outs.js";


/**
 * Returns the incoming / outgoing curves (as `InOut`s) for the given container.
 *
 * The in/out direction of each `_X_` is derived directly from its loop-ordering
 * properties (see `getXInOuts`) - no per-curve grouping or container-side
 * intersections are needed.
 *
 * @param container
 */
function getInOutsOfContainer(  // TODO remove timing
        container: Container): InOut[] {

    const { ins, outs } = getXInOuts(container);

    return [...ins, ...outs];
}


export { getInOutsOfContainer }
