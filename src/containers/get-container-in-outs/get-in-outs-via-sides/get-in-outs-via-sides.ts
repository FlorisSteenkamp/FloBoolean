import type { _X_ } from "../../../get-critical-points/-x-.js";
import type { Curve } from "../../../curve/curve.js";
import type { InOut } from "../../../containers/in-out/in-out.js";
import type { Container } from "../../container.js";
import { getXInOuts } from "./get-x-in-outs.js";
import { timeFunctionCalls } from '../../../utils/time-function-call.js';


/**
 * Returns the incoming / outgoing curves (as `InOuts`) for the given container
 * using an extremely small rectangle around the intersections.
 * 
 * * **warning** `ioIdx` will be modified by this function
 * 
 * @param container 
 * @param ioIdx 
 */
const getInOutsOfContainer = timeFunctionCalls(function getInOutsOfContainer(  // TODO remove timing
        container: Container): InOut[] {

    // We check one `__X__` for each curve with an intersection within this container
    const xs_ = container.xs;

    // Get a map from each `Curve` to each `__X__` of this container
    const xMap: Map<Curve, _X_[]> = new Map();
    for (const x of xs_) {
        const { curve } = x;
        const xs = xMap.get(curve);
        if (!xs) { 
            xMap.set(curve, [x]);
        } else {
            xs.push(x);
        }
    }

    const getXInOuts_ = getXInOuts(container);

    const inOuts: InOut[] = [];
    for (const [curve, xs] of xMap) {
        const { ins, outs } = getXInOuts_(curve, xs);

        inOuts.push(...ins, ...outs);
    }

    return inOuts;
});


export { getInOutsOfContainer }
