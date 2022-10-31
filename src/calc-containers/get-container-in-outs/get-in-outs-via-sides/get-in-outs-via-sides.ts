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
    let xs_ = container.xs;

    let inOuts: InOut[] = [];

    // get a map from each Curve to each __X__ of this container
    let xMap: Map<Curve, __X__[]> = new Map();
    for (let x of xs_) {
        let curve = x.curve;
        let xs = xMap.get(curve);
        if (!xs) { 
            xMap.set(curve, [x]);
        } else {
            xs.push(x);
        }
    }

    let getXInOuts_ = getXInOuts(container);
    for (let entry of xMap) {
        let [curve, xs] = entry;

        let ins: InOut[];
        let outs: InOut[];
        ({ ins, outs, ioIdx } = getXInOuts_(curve, xs, ioIdx));

        inOuts.push(...ins);
        inOuts.push(...outs);
    }

    return { inOuts: inOuts, ioIdx };
}


export { getInOutsViaSides }
