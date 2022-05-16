import { Container } from "../../../container.js";
import { getXInOuts } from "./get-x-in-outs.js";
import { _X_ } from "../../../-x-.js";
import { Curve } from "../../../curve/curve.js";
import { compareOrderedInOut } from "./compare-in-out.js";
import { OrderedInOut } from "./ordered-in-out.js";


/**
 * Returns the incoming / outgoing curves (as InOuts) for the given container
 * using an extremely small rectangle around the intersections.
 * * **warning** ioIdx will be modified by this function
 * @param container 
 * @param ioIdx 
 */
function getInOutsViaSides(
        container: Container, 
        ioIdx: number) {

    // We check one _X_ for each curve with an intersection within this container
    let xs_ = container.xs;

    //console.log(container.xs);
    let inOuts: OrderedInOut[] = [];

    // get a map from each Curve to each _X_ of this container
    let xMap: Map<Curve, _X_[]> = new Map();
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

        let ins: OrderedInOut[];
        let outs: OrderedInOut[];
        ({ ins, outs, ioIdx } = getXInOuts_(curve, xs, ioIdx));

        inOuts.push(...ins);
        inOuts.push(...outs);
    }

    inOuts.sort(compareOrderedInOut);

    return { inOuts: inOuts.map(inOut => inOut.inOut), ioIdx };
}


export { getInOutsViaSides }
