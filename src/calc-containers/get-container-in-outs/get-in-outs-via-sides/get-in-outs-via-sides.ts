import { Container } from "../../../container.js";
import { getXInOuts } from "./get-x-in-outs.js";
import { __X__ } from "../../../-x-.js";
import { Curve } from "../../../curve/curve.js";
import { InOut } from "../../../in-out.js";


/**
 * Returns the incoming / outgoing curves (as InOuts) for the given container
 * using an extremely small rectangle around the intersections.
 * * **warning** ioIdx will be modified by this function
 * @param container 
 * @param ioIdx 
 */
function getInOutsViaSides(
        container: Container, 
        ioIdx: number): {
            inOuts: InOut[];
            ioIdx: number;
        } {

    // We check one __X__ for each curve with an intersection within this container
    const xs_ = container.xs;

    const inOuts: InOut[] = [];

    // get a map from each Curve to each __X__ of this container
    const xMap: Map<Curve, __X__[]> = new Map();
    for (const x of xs_) {
        const curve = x.curve;
        const xs = xMap.get(curve);
        if (!xs) { 
            xMap.set(curve, [x]);
        } else {
            xs.push(x);
        }
    }

    const getXInOuts_ = getXInOuts(container);
    for (const entry of xMap) {
        const [curve, xs] = entry;

        let ins: InOut[];
        let outs: InOut[];
        ({ ins, outs, ioIdx } = getXInOuts_(curve, xs, ioIdx));

        inOuts.push(...ins);
        inOuts.push(...outs);
    }

    return { inOuts: inOuts, ioIdx };
}


export { getInOutsViaSides }
